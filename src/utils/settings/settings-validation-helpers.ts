import "server-only";

import type { SettingsFormInputs } from "@/types";
import { isPublicationDate } from "@/utils/publication-date-helpers";

export class SettingsValidationError extends Error {}

/** Reject invalid submitted values with an error the form can display. */
export function requireValue(
  valid: boolean,
  message = "Invalid settings data.",
): asserts valid {
  if (!valid) throw new SettingsValidationError(message);
}

/**
 * Parses the submitted JSON and validates every settings collection at runtime.
 * Client-side TypeScript types do not validate action arguments. Existing IDs
 * must be positive and unique; new records may omit them.
 */
export function parseSettings(form: FormData): SettingsFormInputs {
  const raw = form.get("settings");
  requireValue(typeof raw === "string");
  let data: SettingsFormInputs;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new SettingsValidationError("Invalid settings data.");
  }
  requireValue(
    !!data && typeof data === "object" && typeof data.aboutText === "string",
  );
  // Validate collection shapes and IDs before accessing their individual fields.
  for (const rows of [
    data.research,
    data.unpublished,
    data.vowelCharts,
    data.languageLevels,
  ]) {
    requireValue(Array.isArray(rows));
    const ids = new Set<number>();
    for (const row of rows) {
      requireValue(!!row && typeof row === "object");
      if (row.id !== undefined) {
        requireValue(
          Number.isSafeInteger(row.id) && row.id > 0 && !ids.has(row.id),
        );
        ids.add(row.id);
      }
    }
  }
  // Both publication collections share titles, calendar dates, and ordered author lists.
  for (const row of [...data.research, ...data.unpublished]) {
    requireValue(isString(row.title));
    requireValue(
      isPublicationDate(row.date),
      "Each research and unpublished item must have a valid date.",
    );
    requireValue(Array.isArray(row.authors) && row.authors.every(isString));
  }
  for (const row of data.research)
    requireValue(isString(row.publication) && isString(row.pageNumbers));
  for (const row of data.vowelCharts) requireValue(isString(row.name));
  // Language IDs must be unique across all levels, not just within each level.
  const languageIds = new Set<number>();
  for (const level of data.languageLevels) {
    requireValue(
      isString(level.name) &&
        isString(level.color) &&
        /^#[\da-f]{6}$/i.test(level.color),
    );
    requireValue(Array.isArray(level.languages));
    for (const language of level.languages) {
      requireValue(!!language && isString(language.name));
      if (language.id !== undefined) {
        requireValue(
          Number.isSafeInteger(language.id) &&
            language.id > 0 &&
            !languageIds.has(language.id),
        );
        languageIds.add(language.id);
      }
    }
  }
  return data;
}

/** Check scalar text values without coercing invalid input into strings. */
function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Reject submitted IDs that no longer exist in the current database snapshot.
 * Passing only a level's languages also prevents editing another level's child.
 */
export function checkIds(
  incoming: { id?: number }[],
  existing: { id: number }[],
) {
  const ids = new Set(existing.map((row) => row.id));
  requireValue(
    incoming.every((row) => row.id === undefined || ids.has(row.id)),
    "Some settings have changed. Reload the page and try again.",
  );
}
