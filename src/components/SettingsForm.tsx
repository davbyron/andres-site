"use client";

import { SettingsFormInputs, SettingsFormProps } from "@/types";
import { useRouter } from "next/navigation";
import { Controller, useForm, useFieldArray } from "react-hook-form";
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

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, }
  } = useForm<SettingsFormInputs>({
    defaultValues: {
      aboutText: defaultAboutText,
      vowelCharts: defaultVowelCharts.map((chart) => ({
        id: chart.id,
        name: chart.name,
        filename: chart.filename,
      })),
      research: defaultResearch.map((researchItem) => ({
        id: researchItem.id,
        year: researchItem.year,
        authors: [...researchItem.authors],
        title: researchItem.title,
        publication: researchItem.publication,
        pageNumbers: researchItem.pageNumbers ?? "",
        filename: researchItem.filename ?? "",
      })),
      unpublished: defaultUnpublished.map((item) => ({
        id: item.id,
        year: item.year,
        authors: [...item.authors],
        title: item.title,
        filename: item.filename ?? "",
      })),
      languageLevels: defaultLanguageLevels.map((languageLevel) => ({
        id: languageLevel.id,
        name: languageLevel.name,
        color: languageLevel.color,
        languages: languageLevel.languages.map((language) => ({
          id: language.id,
          name: language.name,
        })),
      })),
    }
  });

  const {
    fields: languageLevels,
    append: appendLanguageLevel,
    remove: removeLanguageLevel,
    update: updateLanguageLevel
  } = useFieldArray({ control, name: "languageLevels" });

  const {
    fields: research,
    append: appendResearch,
    remove: removeResearch,
  } = useFieldArray({ control, name: "research" });

  const {
    fields: unpublished,
    append: appendUnpublished,
    remove: removeUnpublished,
  } = useFieldArray({ control, name: "unpublished" });

  const {
    fields: vowelCharts,
    append: appendVowelChart,
    remove: removeVowelChart,
  } = useFieldArray({ control, name: "vowelCharts", keyName: "fieldId" });

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
    console.log("Form submitted with data:", data);
  }

  return (
    <div className="w-full px-4 flex flex-col gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-10"
      >
        {/* about */}
        <div className="flex flex-col gap-2">
          <h2>about</h2>
          <label>
            home page text
            <textarea
              {...register("aboutText")}
              className="field-sizing-content px-2 py-1 border w-full"
            />
          </label>
        </div>

        <hr className="border-dashed border-gray/50" />

        {/* files */}
        <div className="flex flex-col gap-2">
          <h2>files</h2>
          <div className="flex flex-col gap-5">
            <div className="p-3 flex flex-col gap-2 border">
              <label htmlFor="cv-file" className="flex flex-col gap-1">
                cv
                <input
                  id="cv-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="w-full file:bg-[#ddd] file:border-0 file:mr-2 file:px-2 file:py-1 file:cursor-pointer file:hover:brightness-110 file:active:brightness-90"
                />
              </label>
            </div>
            <div className="p-3 flex flex-col gap-2 border">
              <label htmlFor="vowel-bib-file" className="flex flex-col gap-1">
                vowelchArt bibliography
                <input
                  id="vowel-bib-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="w-full file:bg-[#ddd] file:border-0 file:mr-2 file:px-2 file:py-1 file:cursor-pointer file:hover:brightness-110 file:active:brightness-90"
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
              <div key={`language-level-${languageLevel.id}-${languageLevelIndex}`} className="pb-4">
                {/* Language level */}
                <div className="group px-2 py-1 flex items-center justify-between gap-10 border hover:bg-gray-100">
                  <div className="w-full flex items-center gap-2">
                    <label htmlFor={`languageLevels.${languageLevelIndex}.color`} className="flex flex-col">
                      <span className="sr-only">Color</span>
                      <input
                        {...register(`languageLevels.${languageLevelIndex}.color`)}
                        type="color"
                        className="size-10"
                        id={`languageLevels.${languageLevelIndex}.color`}
                        defaultValue={languageLevel.color}
                      />
                    </label>

                    <label htmlFor={`languageLevels.${languageLevelIndex}.name`} className="w-full">
                      <span className="sr-only">Name</span>
                      <input
                        {...register(`languageLevels.${languageLevelIndex}.name`)}
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
                <div className="pl-14 flex flex-col">
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
                            {...register(`languageLevels.${languageLevelIndex}.languages.${languageIndex}.name`)}
                            type="text"
                            className="px-2 py-1 w-full"
                            id={`languageLevels.${languageLevelIndex}.languages.${languageIndex}.name`}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            updateLanguageLevel(languageLevelIndex, {
                              ...languageLevel,
                              languages: languageLevel.languages.filter((_, i) => i !== languageIndex)
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
                        ...languageLevel,
                        languages: [
                          ...languageLevel.languages,
                          { name: "New Language" }
                        ]
                      });
                    }}
                  >
                    + add language
                  </button>
                </div>
              </div>
            )
          })}
          <button
            type="button"
            onClick={() => appendLanguageLevel({ name: "New Language Level", color: "#000000", languages: [] })}
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
              <div key={`researchItem-${researchItem.id}-${researchItemIndex}`} className="group p-3 flex flex-col gap-2 border">
                <button
                  type="button"
                  onClick={() => removeResearch(researchItemIndex)}
                  className="self-end bg-red-700 px-2 py-1 w-fit text-white text-xs cursor-pointer hover:brightness-110 active:brightness-90"
                >
                  remove
                </button>
                <div className="flex items-center justify-between gap-10">
                  <label htmlFor={`research.${researchItemIndex}.title`} className="w-full flex flex-col">
                    title
                    <input
                      {...register(`research.${researchItemIndex}.title`)}
                      id={`research.${researchItemIndex}.title`}
                      type="text"
                      className="px-2 py-1 border w-full"
                    />
                  </label>
                </div>
                <label htmlFor={`research.${researchItemIndex}.year`} className="flex flex-col">
                  year
                  <input
                    {...register(`research.${researchItemIndex}.year`, { valueAsNumber: true })}
                    id={`research.${researchItemIndex}.year`}
                    type="number"
                    step="1"
                    className="px-2 py-1 border w-full"
                  />
                </label>
                <label htmlFor={`research.${researchItemIndex}.authors`} className="flex flex-col">
                  authors (one per line, in order)
                  <Controller
                    control={control}
                    name={`research.${researchItemIndex}.authors`}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        id={`research.${researchItemIndex}.authors`}
                        value={field.value.join("\n")}
                        onChange={(event) => field.onChange(event.target.value.split("\n"))}
                        className="field-sizing-content px-2 py-1 border w-full"
                      />
                    )}
                  />
                </label>
                <label htmlFor={`research.${researchItemIndex}.publication`} className="flex flex-col">
                  publication
                  <input
                    {...register(`research.${researchItemIndex}.publication`)}
                    id={`research.${researchItemIndex}.publication`}
                    type="text"
                    className="px-2 py-1 border w-full"
                  />
                </label>
                <label htmlFor={`research.${researchItemIndex}.pageNumbers`} className="flex flex-col">
                  page numbers (optional)
                  <input
                    {...register(`research.${researchItemIndex}.pageNumbers`)}
                    id={`research.${researchItemIndex}.pageNumbers`}
                    type="text"
                    className="px-2 py-1 border w-full"
                  />
                </label>
                <label htmlFor={`research.${researchItemIndex}.file`} className="flex flex-col">
                  file (optional)
                  <input
                    {...register(`research.${researchItemIndex}.file`)}
                    id={`research.${researchItemIndex}.file`}
                    type="file"
                    className="w-full file:bg-[#ddd] file:border-0 file:mr-2 file:px-2 file:py-1 file:cursor-pointer file:hover:brightness-110 file:active:brightness-90"
                  />
                  {researchItem.filename && (
                    <span className="text-xs opacity-75">existing file: {researchItem.filename}</span>
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
            onClick={() => appendResearch({
              year: new Date().getFullYear(),
              authors: [],
              title: "",
              publication: "",
              pageNumbers: "",
              filename: "",
            })}
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
              <div key={`unpublishedItem-${unpublishedItem.id}-${unpublishedItemIndex}`} className="group p-3 flex flex-col gap-2 border">
                <button
                  type="button"
                  onClick={() => removeUnpublished(unpublishedItemIndex)}
                  className="self-end bg-red-700 px-2 py-1 w-fit text-white text-xs cursor-pointer hover:brightness-110 active:brightness-90"
                >
                  remove
                </button>
                <div className="flex items-center justify-between gap-10">
                  <label htmlFor={`unpublished.${unpublishedItemIndex}.title`} className="w-full flex flex-col">
                    title
                    <input
                      {...register(`unpublished.${unpublishedItemIndex}.title`)}
                      id={`unpublished.${unpublishedItemIndex}.title`}
                      type="text"
                      className="px-2 py-1 border w-full"
                    />
                  </label>
                </div>
                <label htmlFor={`unpublished.${unpublishedItemIndex}.year`} className="flex flex-col">
                  year
                  <input
                    {...register(`unpublished.${unpublishedItemIndex}.year`, { valueAsNumber: true })}
                    id={`unpublished.${unpublishedItemIndex}.year`}
                    type="number"
                    step="1"
                    className="px-2 py-1 border w-full"
                  />
                </label>
                <label htmlFor={`unpublished.${unpublishedItemIndex}.authors`} className="flex flex-col">
                  authors (one per line, in order)
                  <Controller
                    control={control}
                    name={`unpublished.${unpublishedItemIndex}.authors`}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        id={`unpublished.${unpublishedItemIndex}.authors`}
                        value={field.value.join("\n")}
                        onChange={(event) => field.onChange(event.target.value.split("\n"))}
                        className="field-sizing-content px-2 py-1 border w-full"
                      />
                    )}
                  />
                </label>
                <label htmlFor={`unpublished.${unpublishedItemIndex}.file`} className="flex flex-col">
                  file (optional)
                  <input
                    {...register(`unpublished.${unpublishedItemIndex}.file`)}
                    id={`unpublished.${unpublishedItemIndex}.file`}
                    type="file"
                    className="w-full file:bg-[#ddd] file:border-0 file:mr-2 file:px-2 file:py-1 file:cursor-pointer file:hover:brightness-110 file:active:brightness-90"
                  />
                  {unpublishedItem.filename && (
                    <span className="text-xs opacity-75">existing file: {unpublishedItem.filename}</span>
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
            onClick={() => appendUnpublished({
              year: new Date().getFullYear(),
              authors: [],
              title: "",
              filename: "",
            })}
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
              <div key={chart.fieldId} className="group p-3 flex flex-col gap-2 border">
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
                      src={defaultVowelCharts.find((item) => item.id === chart.id)?.src}
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col gap-2">
                    <label htmlFor={`vowelCharts.${index}.name`} className="flex flex-col">
                      name
                      <input
                        {...register(`vowelCharts.${index}.name`)}
                        id={`vowelCharts.${index}.name`}
                        type="text"
                        className="px-2 py-1 border w-full"
                      />
                    </label>
                    <label htmlFor={`vowelCharts.${index}.file`} className="flex flex-col">
                      file
                      <input
                        {...register(`vowelCharts.${index}.file`)}
                        id={`vowelCharts.${index}.file`}
                        type="file"
                        accept="image/*"
                        className="w-full file:bg-[#ddd] file:border-0 file:mr-2 file:px-2 file:py-1 file:cursor-pointer file:hover:brightness-110 file:active:brightness-90"
                      />
                      {chart.filename && (
                        <span className="text-xs opacity-75 break-all">existing file: {chart.filename}</span>
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

      <hr className="border-dashed border-gray/50" />

      <button
        type="button"
        onClick={signOut}
        className="bg-[#ddd] w-fit px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
      >
        Sign Out
      </button>
    </div>
  )
}
