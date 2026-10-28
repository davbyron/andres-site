/**
 * Serializes settings into a stable string for detecting unsaved changes.
 * File inputs are tracked separately, so empty FileLists do not count as edits.
 * Sorting object keys prevents key order from affecting comparisons, while
 * preserving array order so additions, removals, and reordering count as changes.
 */
export function getSettingsSnapshot(data: object) {
  return JSON.stringify(data, (key, value) => {
    if (["file", "cvFile", "vowelBibliographyFile"].includes(key))
      return undefined;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.fromEntries(
        Object.keys(value)
          .sort()
          .map((key) => [key, value[key]]),
      );
    }
    return value;
  });
}
