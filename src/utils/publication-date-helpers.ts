/** Extract the date-only value from a database instant or its serialized value. */
export function getPublicationDate(value: string | { toString(): string }) {
  // Prisma's Instant values serialize in UTC. Avoid local timezone conversion.
  return value.toString().slice(0, 10);
}

/** Accept real calendar dates in the YYYY-MM-DD format used by date inputs. */
export function isPublicationDate(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value.startsWith("0000")
  )
    return false;
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().slice(0, 10) === value
  );
}

/** Show only the year, leaving the preview blank while a date is cleared. */
export function getPublicationYear(date: string) {
  return isPublicationDate(date) ? date.slice(0, 4) : "";
}

/** Default new records to the current calendar day in the editor's timezone. */
export function getTodayPublicationDate() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}
