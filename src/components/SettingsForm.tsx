"use client";

import { SettingsFormInputs, SettingsFormProps } from "@/types";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { authClient } from "@/utils/auth-client";

export function SettingsForm(props: SettingsFormProps) {
  const {
    aboutText: defaultAboutText,
    languageLevels: defaultLanguageLevels
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

  const { fields: languageLevels, append, remove, update } = useFieldArray(
    {
      control,
      name: "languageLevels",
    }
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
    console.log("Form submitted with data:", data);
  }

  return (
    <div className="w-full px-4 flex flex-col gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
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
                    onClick={() => remove(languageLevelIndex)}
                    className="hidden group-hover:block bg-red-700 px-2 py-1 text-white text-xs cursor-pointer hover:brightness-110 active:brightness-90"
                  >
                    Remove
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
                            update(languageLevelIndex, {
                              ...languageLevel,
                              languages: languageLevel.languages.filter((_, i) => i !== languageIndex)
                            });
                          }}
                          className="hidden group-hover:block bg-red-700 px-2 py-1 text-white text-xs cursor-pointer hover:brightness-110 active:brightness-90"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    className="bg-[#ddd] w-fit mt-2 px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
                    onClick={() => {
                      update(languageLevelIndex, {
                        ...languageLevel,
                        languages: [
                          ...languageLevel.languages,
                          { name: "New Language" }
                        ]
                      });
                    }}
                  >
                    + Add Language
                  </button>
                </div>
              </div>
            )
          })}
          <button
            type="button"
            onClick={() => append({ name: "New Language Level", color: "#000000", languages: [] })}
            className="bg-[#ddd] w-fit px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
          >
            + Add Language Level
          </button>
        </div>

      </form>
      <hr className="border-dashed border-gray/50" />
      <h2>change password</h2>
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