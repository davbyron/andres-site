"use client";

import { SettingsFormInputs, SettingsFormProps } from "@/types";
import {
  getPublicationDate,
  getTodayPublicationDate,
} from "@/utils/publication-date-helpers";
import { getNextLanguageLevelOrder } from "@/utils/settings/language-level-order-helpers";
import { useRef, useState } from "react";
import { updateWebsiteSettings } from "@/actions";
import { uploadSettingsFiles } from "@/utils/settings/uploadSettingsFiles";
import { getSettingsSnapshot } from "@/utils/settings/getSettingsSnapshot";
import { useRouter } from "next/navigation";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import { authClient } from "@/utils/auth-client";
import {
  ResearchItemPreview,
  ResetPasswordForm,
  UnpublishedItemPreview,
  VowelChartPreview,
} from "@/components";

export function SettingsForm(props: SettingsFormProps) {
  const {
    email,
    aboutText: defaultAboutText,
    languageLevels: defaultLanguageLevels,
    research: defaultResearch,
    unpublished: defaultUnpublished,
    vowelCharts: defaultVowelCharts,
  } = props;

  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { isSubmitting },
  } = useForm<SettingsFormInputs>({
    defaultValues: {
      aboutText: defaultAboutText,
      userImageFile: undefined,
      cvFile: undefined,
      vowelBibliographyFile: undefined,
      vowelCharts: defaultVowelCharts.map((chart) => ({
        id: chart.id,
        name: chart.name,
        filename: chart.filename,
      })),
      research: defaultResearch.map((researchItem) => ({
        id: researchItem.id,
        date: getPublicationDate(researchItem.date),
        authors: [...researchItem.authors],
        title: researchItem.title,
        publication: researchItem.publication,
        pageNumbers: researchItem.pageNumbers ?? "",
        filename: researchItem.filename ?? "",
      })),
      unpublished: defaultUnpublished.map((item) => ({
        id: item.id,
        date: getPublicationDate(item.date),
        authors: [...item.authors],
        title: item.title,
        filename: item.filename ?? "",
      })),
      languageLevels: defaultLanguageLevels.map((languageLevel) => ({
        id: languageLevel.id,
        name: languageLevel.name,
        color: languageLevel.color,
        order: languageLevel.order,
        languages: languageLevel.languages.map((language) => ({
          id: language.id,
          name: language.name,
        })),
      })),
    },
  });

  const {
    fields: languageLevels,
    append: appendLanguageLevel,
    remove: removeLanguageLevel,
    update: updateLanguageLevel,
  } = useFieldArray({ control, name: "languageLevels", keyName: "fieldId" });

  const {
    fields: research,
    append: appendResearch,
    remove: removeResearch,
  } = useFieldArray({ control, name: "research", keyName: "fieldId" });

  const {
    fields: unpublished,
    append: appendUnpublished,
    remove: removeUnpublished,
  } = useFieldArray({ control, name: "unpublished", keyName: "fieldId" });

  const {
    fields: vowelCharts,
    append: appendVowelChart,
    remove: removeVowelChart,
  } = useFieldArray({ control, name: "vowelCharts", keyName: "fieldId" });

  // File inputs need separate change tracking: an empty browser FileList can
  // differ from its undefined default and make react-hook-form's isDirty true
  // before the user edits anything. Compare non-file values with the last saved
  // snapshot and check for selected files separately, so Save only enables for
  // unsaved field changes or pending uploads.
  const savedSnapshot = useRef(getSettingsSnapshot(getValues()));
  const currentInputs = useWatch({ control });
  const hasEditedValues = getSettingsSnapshot(currentInputs) !== savedSnapshot.current;
  const hasSelectedFiles = Boolean(
    currentInputs.userImageFile?.length ||
    currentInputs.cvFile?.length ||
    currentInputs.vowelBibliographyFile?.length ||
    [
      ...(currentInputs.research ?? []),
      ...(currentInputs.unpublished ?? []),
      ...(currentInputs.vowelCharts ?? []),
    ].some((item) => item.file?.length),
  );

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  }

  async function onSubmit(data: SettingsFormInputs) {
    setSaveMessage("");
    setSaveError("");

    const {
      userImageFile,
      cvFile,
      vowelBibliographyFile,
      ...formDataWithoutFiles
    } = data;

    // Only metadata goes through the server action; file bytes go to the bucket.
    const form = new FormData();
    form.set(
      "settings",
      JSON.stringify({
        ...formDataWithoutFiles,
        research: formDataWithoutFiles.research.map(({ file: _file, ...item }) => item),
        unpublished: formDataWithoutFiles.unpublished.map(({ file: _file, ...item }) => item),
        vowelCharts: formDataWithoutFiles.vowelCharts.map(({ file: _file, ...item }) => item),
      }),
    );

    try {
      const uploads = await uploadSettingsFiles(data, (completed, total) => {
        setSaveMessage(`Uploading files (${completed}/${total})…`);
      });

      form.set("uploads", JSON.stringify(uploads));
      setSaveMessage("Saving settings…");

      const updateWebsiteSettingsRes = await updateWebsiteSettings(form);
      if (updateWebsiteSettingsRes.success === false) {
        setSaveMessage("");
        setSaveError(updateWebsiteSettingsRes.error);
        return;
      }

      formRef.current?.reset();
      savedSnapshot.current = getSettingsSnapshot(updateWebsiteSettingsRes.data);
      reset(updateWebsiteSettingsRes.data);

      if (updateWebsiteSettingsRes.failedFiles.length) {
        setSaveMessage("");
        setSaveError(
          `Settings saved, but these files could not be uploaded: ${updateWebsiteSettingsRes.failedFiles.join(", ")}. Please select them again and save to retry.`,
        );
      } else {
        setSaveMessage("Settings saved.");
      }

      router.refresh();
    } catch (error) {
      setSaveMessage("");
      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save settings. Your changes have been kept; please try again.",
      );
    }
  }

  return (
    <div className="w-full px-4 flex flex-col gap-5">
      <form
        id="website-settings"
        ref={formRef}
        onChange={() => {
          setSaveMessage("");
          setSaveError("");
        }}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-10"
      >
        <fieldset disabled={isSubmitting} className="contents">
          {/* about */}
          <div className="flex flex-col gap-2">
            <h2>about</h2>
            <label>
              home page text
              <textarea
                {...register("aboutText")}
                className="field-sizing-content min-h-40 px-2 py-1 border w-full"
              />
            </label>
          </div>

          <hr className="border-dashed border-gray/50" />

          {/* files */}
          <div className="flex flex-col gap-2">
            <h2>files</h2>
            <div className="flex flex-col gap-5">
              <div className="p-3 flex flex-col gap-2 border">
                <label
                  htmlFor="user-image-file"
                  className="flex flex-col gap-1"
                >
                  user image
                  <input
                    {...register("userImageFile")}
                    id="user-image-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  />
                </label>
              </div>
              <div className="p-3 flex flex-col gap-2 border">
                <label htmlFor="cv-file" className="flex flex-col gap-1">
                  cv
                  <input
                    {...register("cvFile")}
                    id="cv-file"
                    type="file"
                    accept=".pdf,application/pdf"
                  />
                </label>
              </div>
              <div className="p-3 flex flex-col gap-2 border">
                <label htmlFor="vowel-bib-file" className="flex flex-col gap-1">
                  vowelchArt bibliography
                  <input
                    {...register("vowelBibliographyFile")}
                    id="vowel-bib-file"
                    type="file"
                    accept=".pdf,application/pdf"
                  />
                </label>
              </div>
            </div>
          </div>

          <hr className="border-dashed border-gray/50" />

          {/* languages */}
          <div className="flex flex-col gap-2">
            <h2>languages</h2>
            {languageLevels.map((languageLevel, languageLevelIndex) => {
              return (
                <div key={languageLevel.fieldId} className="pb-4">
                  {/* Language level */}
                  <div className="group px-2 py-1 flex items-center justify-between gap-10 border hover:bg-gray-100">
                    <div className="w-full flex items-center gap-2">
                      <label
                        htmlFor={`languageLevels.${languageLevelIndex}.order`}
                        className="flex shrink-0 flex-col"
                      >
                        <span className="sr-only">Order</span>
                        <input
                          {...register(
                            `languageLevels.${languageLevelIndex}.order`,
                            { valueAsNumber: true },
                          )}
                          id={`languageLevels.${languageLevelIndex}.order`}
                          type="number"
                          min="1"
                          max="20"
                          step="1"
                          required
                          title="Order (1 = highest proficiency)"
                          className="w-fit p-1"
                        />
                      </label>
                      <label
                        htmlFor={`languageLevels.${languageLevelIndex}.color`}
                        className="flex flex-col"
                      >
                        <span className="sr-only">Color</span>
                        <input
                          {...register(
                            `languageLevels.${languageLevelIndex}.color`,
                          )}
                          type="color"
                          className="size-10"
                          id={`languageLevels.${languageLevelIndex}.color`}
                          defaultValue={languageLevel.color}
                        />
                      </label>

                      <label
                        htmlFor={`languageLevels.${languageLevelIndex}.name`}
                        className="w-full"
                      >
                        <span className="sr-only">Name</span>
                        <input
                          {...register(
                            `languageLevels.${languageLevelIndex}.name`,
                          )}
                          type="text"
                          id={`languageLevels.${languageLevelIndex}.name`}
                          className="w-full"
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLanguageLevel(languageLevelIndex)}
                      className="hidden group-hover:block bg-red-700 px-2 py-1 text-white text-xs cursor-pointer hover:brightness-110 active:brightness-90"
                    >
                      remove
                    </button>
                  </div>

                  {/* Languages in language level */}
                  <div className="pl-27 flex flex-col">
                    {languageLevel.languages.map((language, languageIndex) => {
                      return (
                        <div
                          key={`language-${language.id}-${languageIndex}`}
                          className="group py-1 px-2 flex items-center justify-between gap-10 border border-t-0 w-full hover:bg-gray-100"
                        >
                          <label
                            htmlFor={`languageLevels.${languageLevelIndex}.languages.${languageIndex}.name`}
                            className="w-full"
                          >
                            <span className="sr-only">Language Name</span>
                            <input
                              {...register(
                                `languageLevels.${languageLevelIndex}.languages.${languageIndex}.name`,
                              )}
                              type="text"
                              className="px-2 py-1 w-full"
                              id={`languageLevels.${languageLevelIndex}.languages.${languageIndex}.name`}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              updateLanguageLevel(languageLevelIndex, {
                                ...getValues(
                                  `languageLevels.${languageLevelIndex}`,
                                ),
                                languages: getValues(
                                  `languageLevels.${languageLevelIndex}.languages`,
                                ).filter((_, i) => i !== languageIndex),
                              });
                            }}
                            className="hidden group-hover:block bg-red-700 px-2 py-1 text-white text-xs cursor-pointer hover:brightness-110 active:brightness-90"
                          >
                            remove
                          </button>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      className="bg-[#ddd] w-fit mt-2 px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
                      onClick={() => {
                        updateLanguageLevel(languageLevelIndex, {
                          ...getValues(`languageLevels.${languageLevelIndex}`),
                          languages: [
                            ...getValues(
                              `languageLevels.${languageLevelIndex}.languages`,
                            ),
                            { name: "New Language" },
                          ],
                        });
                      }}
                    >
                      + add language
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() =>
                appendLanguageLevel({
                  name: "New Language Level",
                  order: getNextLanguageLevelOrder(getValues("languageLevels")),
                  color: "#000000",
                  languages: [],
                })
              }
              className="bg-[#ddd] w-fit px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
            >
              + Add Language Level
            </button>
          </div>

          <hr className="border-dashed border-gray/50" />

          {/* research */}
          <div className="flex flex-col gap-2">
            <h2>research</h2>
            <div className="flex flex-col gap-10">
              {research.map((researchItem, researchItemIndex) => (
                <div
                  key={researchItem.fieldId}
                  className="group p-3 flex flex-col gap-2 border"
                >
                  <button
                    type="button"
                    onClick={() => removeResearch(researchItemIndex)}
                    className="self-end bg-red-700 px-2 py-1 w-fit text-white text-xs cursor-pointer hover:brightness-110 active:brightness-90"
                  >
                    remove
                  </button>
                  <div className="flex items-center justify-between gap-10">
                    <label
                      htmlFor={`research.${researchItemIndex}.title`}
                      className="w-full flex flex-col"
                    >
                      title
                      <input
                        {...register(`research.${researchItemIndex}.title`)}
                        id={`research.${researchItemIndex}.title`}
                        type="text"
                        className="px-2 py-1 border w-full"
                      />
                    </label>
                  </div>
                  <label
                    htmlFor={`research.${researchItemIndex}.date`}
                    className="flex flex-col"
                  >
                    date
                    <input
                      {...register(`research.${researchItemIndex}.date`, {
                        required: true,
                      })}
                      id={`research.${researchItemIndex}.date`}
                      type="date"
                      required
                      min="0001-01-01"
                      max="9999-12-31"
                      className="px-2 py-1 border w-full"
                    />
                  </label>
                  <label
                    htmlFor={`research.${researchItemIndex}.authors`}
                    className="flex flex-col"
                  >
                    authors (one per line, in order)
                    <Controller
                      control={control}
                      name={`research.${researchItemIndex}.authors`}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          id={`research.${researchItemIndex}.authors`}
                          value={field.value.join("\n")}
                          onChange={(event) =>
                            field.onChange(event.target.value.split("\n"))
                          }
                          className="field-sizing-content px-2 py-1 border w-full"
                        />
                      )}
                    />
                  </label>
                  <label
                    htmlFor={`research.${researchItemIndex}.publication`}
                    className="flex flex-col"
                  >
                    publication
                    <input
                      {...register(`research.${researchItemIndex}.publication`)}
                      id={`research.${researchItemIndex}.publication`}
                      type="text"
                      className="px-2 py-1 border w-full"
                    />
                  </label>
                  <label
                    htmlFor={`research.${researchItemIndex}.pageNumbers`}
                    className="flex flex-col"
                  >
                    page numbers (optional)
                    <input
                      {...register(`research.${researchItemIndex}.pageNumbers`)}
                      id={`research.${researchItemIndex}.pageNumbers`}
                      type="text"
                      className="px-2 py-1 border w-full"
                    />
                  </label>
                  <label
                    htmlFor={`research.${researchItemIndex}.file`}
                    className="flex flex-col"
                  >
                    file (optional)
                    <input
                      {...register(`research.${researchItemIndex}.file`)}
                      id={`research.${researchItemIndex}.file`}
                      type="file"
                    />
                    {researchItem.filename && (
                      <span className="text-xs opacity-75">
                        existing file: {researchItem.filename}
                      </span>
                    )}
                  </label>
                  <hr className="my-5" />
                  <ResearchItemPreview
                    control={control}
                    index={researchItemIndex}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                appendResearch({
                  date: getTodayPublicationDate(),
                  authors: [],
                  title: "",
                  publication: "",
                  pageNumbers: "",
                  filename: "",
                })
              }
              className="bg-[#ddd] w-fit px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
            >
              + add research
            </button>
          </div>

          <hr className="border-dashed border-gray/50" />

          {/* unpublished */}
          <div className="flex flex-col gap-2">
            <h2>unpublished</h2>
            <div className="flex flex-col gap-10">
              {unpublished.map((unpublishedItem, unpublishedItemIndex) => (
                <div
                  key={unpublishedItem.fieldId}
                  className="group p-3 flex flex-col gap-2 border"
                >
                  <button
                    type="button"
                    onClick={() => removeUnpublished(unpublishedItemIndex)}
                    className="self-end bg-red-700 px-2 py-1 w-fit text-white text-xs cursor-pointer hover:brightness-110 active:brightness-90"
                  >
                    remove
                  </button>
                  <div className="flex items-center justify-between gap-10">
                    <label
                      htmlFor={`unpublished.${unpublishedItemIndex}.title`}
                      className="w-full flex flex-col"
                    >
                      title
                      <input
                        {...register(
                          `unpublished.${unpublishedItemIndex}.title`,
                        )}
                        id={`unpublished.${unpublishedItemIndex}.title`}
                        type="text"
                        className="px-2 py-1 border w-full"
                      />
                    </label>
                  </div>
                  <label
                    htmlFor={`unpublished.${unpublishedItemIndex}.date`}
                    className="flex flex-col"
                  >
                    date
                    <input
                      {...register(`unpublished.${unpublishedItemIndex}.date`, {
                        required: true,
                      })}
                      id={`unpublished.${unpublishedItemIndex}.date`}
                      type="date"
                      required
                      min="0001-01-01"
                      max="9999-12-31"
                      className="px-2 py-1 border w-full"
                    />
                  </label>
                  <label
                    htmlFor={`unpublished.${unpublishedItemIndex}.authors`}
                    className="flex flex-col"
                  >
                    authors (one per line, in order)
                    <Controller
                      control={control}
                      name={`unpublished.${unpublishedItemIndex}.authors`}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          id={`unpublished.${unpublishedItemIndex}.authors`}
                          value={field.value.join("\n")}
                          onChange={(event) =>
                            field.onChange(event.target.value.split("\n"))
                          }
                          className="field-sizing-content px-2 py-1 border w-full"
                        />
                      )}
                    />
                  </label>
                  <label
                    htmlFor={`unpublished.${unpublishedItemIndex}.file`}
                    className="flex flex-col"
                  >
                    file (optional)
                    <input
                      {...register(`unpublished.${unpublishedItemIndex}.file`)}
                      id={`unpublished.${unpublishedItemIndex}.file`}
                      type="file"
                    />
                    {unpublishedItem.filename && (
                      <span className="text-xs opacity-75">
                        existing file: {unpublishedItem.filename}
                      </span>
                    )}
                  </label>
                  <hr className="my-5" />
                  <UnpublishedItemPreview
                    control={control}
                    index={unpublishedItemIndex}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                appendUnpublished({
                  date: getTodayPublicationDate(),
                  authors: [],
                  title: "",
                  filename: "",
                })
              }
              className="bg-[#ddd] w-fit px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
            >
              + add unpublished
            </button>
          </div>

          <hr className="border-dashed border-gray/50" />

          {/* vowelchArt */}
          <div className="flex flex-col gap-2">
            <h2>vowelchArt</h2>
            <div className="flex flex-col gap-5">
              {vowelCharts.map((chart, index) => (
                <div
                  key={chart.fieldId}
                  className="group p-3 flex flex-col gap-2 border"
                >
                  <button
                    type="button"
                    onClick={() => removeVowelChart(index)}
                    className="self-end bg-red-700 px-2 py-1 w-fit text-white text-xs cursor-pointer hover:brightness-110 active:brightness-90"
                  >
                    remove
                  </button>
                  <div className="flex items-start gap-4">
                    <div className="w-24 sm:w-36 shrink-0">
                      <VowelChartPreview
                        control={control}
                        index={index}
                        src={
                          defaultVowelCharts.find(
                            (item) => item.id === chart.id,
                          )?.src
                        }
                      />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col gap-2">
                      <label
                        htmlFor={`vowelCharts.${index}.name`}
                        className="flex flex-col"
                      >
                        name
                        <input
                          {...register(`vowelCharts.${index}.name`)}
                          id={`vowelCharts.${index}.name`}
                          type="text"
                          className="px-2 py-1 border w-full"
                        />
                      </label>
                      <label
                        htmlFor={`vowelCharts.${index}.file`}
                        className="flex flex-col"
                      >
                        file
                        <input
                          {...register(`vowelCharts.${index}.file`)}
                          id={`vowelCharts.${index}.file`}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                        />
                        {chart.filename && (
                          <span className="text-xs opacity-75 break-all">
                            existing file: {chart.filename}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => appendVowelChart({ name: "", filename: "" })}
              className="bg-[#ddd] w-fit mt-3 px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
            >
              + add vowel chart
            </button>
          </div>
        </fieldset>
      </form>

      <hr className="border-dashed border-gray/50" />

      {/* change password */}
      <div className="flex flex-col gap-2">
        <h2>change password</h2>
        {email ? (
          <ResetPasswordForm
            email={email}
            submitLabel="Update Password"
            className="flex flex-col items-start gap-4"
          />
        ) : (
          <p>Sign in to update your password.</p>
        )}
      </div>

      <div className="sticky bottom-0 z-10 items-end flex flex-col gap-5 bg-white pt-5 pb-[max(3rem,env(safe-area-inset-bottom))]">
        <div className="self-stretch flex flex-col gap-0.5">
          <hr className="border border-gray/50" />
          <hr className="border border-gray/50" />
        </div>

        <div aria-live="polite">
          {saveError && (
            <p role="alert" className="text-red-700">
              {saveError}
            </p>
          )}
          {saveMessage && <p>{saveMessage}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            form="website-settings"
            disabled={isSubmitting || (!hasEditedValues && !hasSelectedFiles)}
            className="bg-[#ddd] w-fit px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={signOut}
            className="bg-[#ddd] w-fit px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
