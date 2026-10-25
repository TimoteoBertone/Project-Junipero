import { addDays, addMonths, addWeeks } from "date-fns";
import { Appointment, RecurrenceMode } from "../types/models";
import { parseISO } from "./time";

export function recurrenceLabel(mode: RecurrenceMode, intervalDays?: number): string {
  switch (mode) {
    case "once":
      return "One-time";
    case "every_x_days":
      return `Every ${intervalDays ?? 1} day(s)`;
    case "weekly":
      return "Weekly";
    case "biweekly":
      return "Biweekly";
    case "monthly":
      return "Monthly";
  }
}

export function nextOccurrenceUtc(
  startsAtUtc: string,
  mode: RecurrenceMode,
  intervalDays = 1
): string | null {
  if (mode === "once") return null;
  const start = parseISO(startsAtUtc);
  switch (mode) {
    case "every_x_days":
      return addDays(start, intervalDays).toISOString();
    case "weekly":
      return addWeeks(start, 1).toISOString();
    case "biweekly":
      return addWeeks(start, 2).toISOString();
    case "monthly":
      return addMonths(start, 1).toISOString();
  }
}

/**
 * Expanding a series for display: generate materialised occurrences.
 * Edits/cancellations of a single occurrence set exceptionOf / status on that row only.
 */
export function expandSeries(
  anchor: Appointment,
  untilUtc: Date,
  exceptions: Appointment[]
): Appointment[] {
  if (anchor.recurrenceMode === "once") return [anchor];

  const results: Appointment[] = [];
  let cursor = anchor.startsAtUtc;
  let guard = 0;

  while (parseISO(cursor) <= untilUtc && guard < 120) {
    const exception = exceptions.find(
      (e) =>
        e.exceptionOf === anchor.seriesId &&
        e.originalStartsAtUtc === cursor
    );

    if (exception) {
      results.push(exception);
    } else {
      results.push({
        ...anchor,
        id: `${anchor.seriesId ?? anchor.id}:${cursor}`,
        startsAtUtc: cursor,
        seriesId: anchor.seriesId ?? anchor.id,
      });
    }

    const next = nextOccurrenceUtc(
      cursor,
      anchor.recurrenceMode,
      anchor.recurrenceIntervalDays
    );
    if (!next) break;
    cursor = next;
    guard += 1;
  }

  return results;
}
