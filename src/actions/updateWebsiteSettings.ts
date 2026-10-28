"use server";

import type { SettingsFormInputs, SettingsUploadReceipt } from "@/types";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/prisma/db";
import { auth } from "@/utils/auth";
import { isSessionValid } from "@/utils/isSessionValid";
import {
  deleteSettingsFiles,
  readSettingsUpload,
  createUniqueFilename,
  verifySettingsUpload,
  copySettingsUpload,
  settingsUploadDestination,
  resolveSettingsFilename,
  rememberObsoleteSettingsFile,
} from "@/utils/settings/settings-file-upload-helpers";
import {
  SettingsValidationError,
  requireValue,
  parseSettings,
  checkIds,
} from "@/utils/settings/settings-validation-helpers";

/**
 * Validates submitted settings and staged uploads, then commits database changes
 * together. Bucket cleanup and fixed-URL replacements happen after that commit.
 */
export async function updateWebsiteSettings(form: FormData) {
  // Authorize this action request independently of access to the settings page.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!(await isSessionValid(session))) {
    return {
      success: false as const,
      error: "Please sign in with an authorized account to save settings.",
    };
  }

  let saved: SettingsFormInputs;

  // Keep new copies, superseded files, and temporary uploads separate: a failed
  // transaction removes only new objects, while a successful save cleans old ones.
  const uploadedKeys: string[] = [];
  const obsoleteKeys: string[] = [];
  const stagingKeys: string[] = [];
  const fixedFiles: {
    ticket: ReturnType<typeof readSettingsUpload>;
    key: string;
    etag: string;
  }[] = [];

  try {
    // Validate ordinary form data before using any client-supplied upload receipts.
    const data = parseSettings(form);
    const receipts: SettingsUploadReceipt[] = JSON.parse(
      String(form.get("uploads") ?? "[]"),
    );
    requireValue(Array.isArray(receipts));
    const filenames = new Map<string, string>();
    const fields = new Set<string>();
    // Each signed receipt must belong to this user and exactly one current field.
    // Array-backed uploads must still have a corresponding record in the form.
    const uploads = receipts.map((receipt) => {
      requireValue(
        !!receipt &&
          typeof receipt.field === "string" &&
          typeof receipt.token === "string",
      );
      const ticket = readSettingsUpload(receipt.token, session.user.id);
      requireValue(ticket.field === receipt.field && !fields.has(ticket.field));
      fields.add(ticket.field);
      if (!["cvFile", "vowelBibliographyFile"].includes(ticket.field)) {
        const [collection, index] = ticket.field.split(".");
        requireValue(
          !!data[collection]?.[Number(index)],
          "An uploaded file no longer matches the form.",
        );
      }
      return ticket;
    });
    stagingKeys.push(...uploads.map((ticket) => ticket.key));
    // Verify the staged object's metadata, then copy attachments to unique keys.
    // Leave fixed-URL documents staged until the database transaction commits.
    for (const ticket of uploads) {
      const etag = await verifySettingsUpload(ticket);
      const destination = settingsUploadDestination(ticket.field);
      if (["cvFile", "vowelBibliographyFile"].includes(ticket.field)) {
        fixedFiles.push({ ticket, key: destination, etag });
      } else {
        const filename = createUniqueFilename(ticket.name);
        const key = destination + filename;
        uploadedKeys.push(key);
        await copySettingsUpload(ticket, key, etag);
        filenames.set(ticket.field, filename);
      }
    }

    // All row changes succeed or roll back together, including record deletions.
    saved = await db.transaction(async (tx) => {
      const levels = await tx.orm.public.LanguageLevel.all();
      const languages = await tx.orm.public.Language.all();
      const research = await tx.orm.public.Research.all();
      const unpublished = await tx.orm.public.Unpublished.all();
      const charts = await tx.orm.public.VowelChart.all();

      // Check submitted IDs against current rows before creating or updating any.
      // Restrict nested language IDs to their own level's existing children.
      checkIds(data.languageLevels, levels);
      checkIds(data.research, research);
      checkIds(data.unpublished, unpublished);
      checkIds(data.vowelCharts, charts);
      for (const level of data.languageLevels) {
        checkIds(
          level.languages,
          languages.filter((language) => language.levelId === level.id),
        );
      }

      // Update the existing about text, or initialize it if no row exists yet.
      const about = await tx.orm.public.PageText.where({
        key: "About Page",
      }).first();
      if (about)
        await tx.orm.public.PageText.where({ key: "About Page" }).updateAll({
          value: data.aboutText,
        });
      else
        await tx.orm.public.PageText.create({
          key: "About Page",
          value: data.aboutText,
        });

      // Save parents first so new languages can reference their generated level IDs.
      const savedLevels: SettingsFormInputs["languageLevels"] = [];
      for (const level of data.languageLevels) {
        const languageLevelValues = { name: level.name, color: level.color };
        const row =
          level.id === undefined
            ? await tx.orm.public.LanguageLevel.create(languageLevelValues)
            : await tx.orm.public.LanguageLevel.where({ id: level.id }).update(
                languageLevelValues,
              );
        const savedLanguages: SettingsFormInputs["languageLevels"][number]["languages"] =
          [];
        for (const language of level.languages) {
          const languageValues = { name: language.name, levelId: row.id };
          const savedLanguage =
            language.id === undefined
              ? await tx.orm.public.Language.create(languageValues)
              : await tx.orm.public.Language.where({ id: language.id }).update(
                  languageValues,
                );
          savedLanguages.push({
            id: savedLanguage.id,
            name: savedLanguage.name,
          });
        }
        savedLevels.push({
          id: row.id,
          ...languageLevelValues,
          languages: savedLanguages,
        });
      }

      const retainedLanguages = new Set(
        savedLevels.flatMap((level) =>
          level.languages.map((language) => language.id),
        ),
      );

      // Delete removed children before parents to respect the language foreign key.
      for (const language of languages) {
        if (!retainedLanguages.has(language.id))
          await tx.orm.public.Language.where({ id: language.id }).delete();
      }
      for (const level of levels) {
        if (!savedLevels.some((row) => row.id === level.id))
          await tx.orm.public.LanguageLevel.where({ id: level.id }).delete();
      }

      // Save publication metadata, retaining existing attachments unless replaced.
      // Queue replaced/deleted objects for later cleanup; do not delete them here.
      const savedResearch: SettingsFormInputs["research"] = [];
      for (const [researchItemIndex, researchItem] of data.research.entries()) {
        const old = research.find((row) => row.id === researchItem.id);
        const filename = resolveSettingsFilename(
          filenames,
          `research.${researchItemIndex}.file`,
          old,
        );
        const values = {
          year: researchItem.year,
          authors: researchItem.authors,
          title: researchItem.title,
          publication: researchItem.publication,
          pageNumbers: researchItem.pageNumbers || null,
          filename: filename || null,
        };
        const row =
          researchItem.id === undefined
            ? await tx.orm.public.Research.create(values)
            : await tx.orm.public.Research.where({
                id: researchItem.id,
              }).update(values);
        rememberObsoleteSettingsFile(
          obsoleteKeys,
          "research/",
          old?.filename,
          filename,
        );
        savedResearch.push({
          id: row.id,
          ...values,
          pageNumbers: researchItem.pageNumbers,
          filename,
        });
      }
      for (const item of research) {
        if (savedResearch.some((row) => row.id === item.id)) continue;
        await tx.orm.public.Research.where({ id: item.id }).delete();
        rememberObsoleteSettingsFile(obsoleteKeys, "research/", item.filename);
      }

      // Synchronize unpublished items using the same attachment retention rules.
      const savedUnpublished: SettingsFormInputs["unpublished"] = [];
      for (const [index, item] of data.unpublished.entries()) {
        const old = unpublished.find((row) => row.id === item.id);
        const filename = resolveSettingsFilename(
          filenames,
          `unpublished.${index}.file`,
          old,
        );
        const values = {
          year: item.year,
          authors: item.authors,
          title: item.title,
          filename: filename || null,
        };
        const row =
          item.id === undefined
            ? await tx.orm.public.Unpublished.create(values)
            : await tx.orm.public.Unpublished.where({ id: item.id }).update(
                values,
              );
        rememberObsoleteSettingsFile(
          obsoleteKeys,
          "unpublished/",
          old?.filename,
          filename,
        );
        savedUnpublished.push({ id: row.id, ...values, filename });
      }
      for (const item of unpublished) {
        if (savedUnpublished.some((row) => row.id === item.id)) continue;
        await tx.orm.public.Unpublished.where({ id: item.id }).delete();
        rememberObsoleteSettingsFile(
          obsoleteKeys,
          "unpublished/",
          item.filename,
        );
      }

      // Every chart needs an image: existing charts may keep theirs, but new
      // charts must supply a verified upload before the transaction can commit.
      const savedCharts: SettingsFormInputs["vowelCharts"] = [];
      for (const [index, item] of data.vowelCharts.entries()) {
        const old = charts.find((row) => row.id === item.id);
        const filename = resolveSettingsFilename(
          filenames,
          `vowelCharts.${index}.file`,
          old,
        );
        requireValue(
          !!filename,
          "Please choose an image for each new vowel chart.",
        );
        const values = { name: item.name, filename };
        const row =
          item.id === undefined
            ? await tx.orm.public.VowelChart.create(values)
            : await tx.orm.public.VowelChart.where({ id: item.id }).update(
                values,
              );
        rememberObsoleteSettingsFile(
          obsoleteKeys,
          "images/vowel-charts/",
          old?.filename,
          filename,
        );
        savedCharts.push({ id: row.id, ...values });
      }
      for (const chart of charts) {
        if (savedCharts.some((row) => row.id === chart.id)) continue;
        await tx.orm.public.VowelChart.where({ id: chart.id }).delete();
        rememberObsoleteSettingsFile(
          obsoleteKeys,
          "images/vowel-charts/",
          chart.filename,
        );
      }
      // Legacy rows may share a filename. Only delete objects no saved row uses.
      const retainedKeys = new Set([
        ...savedResearch
          .filter((row) => row.filename)
          .map((row) => `research/${row.filename}`),
        ...savedUnpublished
          .filter((row) => row.filename)
          .map((row) => `unpublished/${row.filename}`),
        ...savedCharts.map((row) => `images/vowel-charts/${row.filename}`),
      ]);
      obsoleteKeys.splice(
        0,
        obsoleteKeys.length,
        ...obsoleteKeys.filter((key) => !retainedKeys.has(key)),
      );
      return {
        aboutText: data.aboutText,
        languageLevels: savedLevels,
        research: savedResearch,
        unpublished: savedUnpublished,
        vowelCharts: savedCharts,
      };
    });
  } catch (error) {
    // The database did not commit, so its original files must remain available.
    await deleteSettingsFiles([...uploadedKeys, ...stagingKeys]);
    console.error("Unable to save website settings:", error);
    return {
      success: false as const,
      error:
        error instanceof SettingsValidationError
          ? error.message
          : "Unable to save settings. Your changes have been kept; please try again.",
    };
  }

  // These public URLs have fixed keys. Upload after the transaction so a failed
  // database save never overwrites them; report failures separately for retry.
  const failedFiles: string[] = [];
  for (const { key, ticket, etag } of fixedFiles) {
    try {
      await copySettingsUpload(ticket, key, etag);
    } catch (error) {
      console.error(`Unable to upload ${key}:`, error);
      failedFiles.push(key);
    }
  }
  // The committed rows now reference the saved attachments; remove unused objects.
  await deleteSettingsFiles([...obsoleteKeys, ...stagingKeys]);
  // Refresh public pages and the settings page without misreporting a saved update.
  try {
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Unable to refresh settings pages:", error);
  }
  return { success: true as const, data: saved, failedFiles };
}
