import { addMinutes, format, parseISO } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

/** Therapist schedule timezone — Argentina (no hard-coded −3 offset). */
export const ART_TZ = "America/Argentina/Buenos_Aires";

export function toUtcIso(localIsoOrDate: string | Date, ianaTz: string): string {
  const date =
    typeof localIsoOrDate === "string" ? parseISO(localIsoOrDate) : localIsoOrDate;
  return fromZonedTime(date, ianaTz).toISOString();
}

export function formatInTz(
  utcIso: string,
  ianaTz: string,
  pattern = "yyyy-MM-dd HH:mm"
): string {
  return formatInTimeZone(parseISO(utcIso), ianaTz, pattern);
}

export function formatArt(utcIso: string, pattern = "HH:mm"): string {
  return formatInTz(utcIso, ART_TZ, pattern);
}

export function formatClientLocal(utcIso: string, clientIanaTz: string): string {
  return formatInTz(utcIso, clientIanaTz, "HH:mm");
}

export function artDayBoundsUtc(day: Date = new Date()): {
  startUtc: Date;
  endUtc: Date;
} {
  const zoned = toZonedTime(day, ART_TZ);
  const y = zoned.getFullYear();
  const m = zoned.getMonth();
  const d = zoned.getDate();
  const startLocal = new Date(y, m, d, 0, 0, 0, 0);
  const endLocal = new Date(y, m, d, 23, 59, 59, 999);
  return {
    startUtc: fromZonedTime(startLocal, ART_TZ),
    endUtc: fromZonedTime(endLocal, ART_TZ),
  };
}

export function appointmentIntervalUtc(
  startsAtUtc: string,
  durationMin: number
): { start: Date; end: Date } {
  const start = parseISO(startsAtUtc);
  return { start, end: addMinutes(start, durationMin) };
}

export function displayArtDate(
  utcIso: string,
  locale = "en",
  includeYear = false
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: ART_TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(includeYear ? { year: "numeric" as const } : {}),
  }).format(parseISO(utcIso));
}

export function nowLabelArt(): string {
  return formatInTimeZone(new Date(), ART_TZ, "yyyy-MM-dd HH:mm");
}

export function localInputToUtc(localValue: string, ianaTz: string): string {
  // Treat datetime-local style as wall time in ianaTz
  const [datePart, timePart] = localValue.split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const [h, mi] = (timePart ?? "00:00").split(":").map(Number);
  const asLocal = new Date(y, mo - 1, d, h, mi, 0, 0);
  return fromZonedTime(asLocal, ianaTz).toISOString();
}

/** Convert a native picker wall-clock value into the backend's UTC timestamp. */
export function wallClockToUtc(wallClock: Date, ianaTz: string): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const localValue = `${wallClock.getFullYear()}-${pad(
    wallClock.getMonth() + 1
  )}-${pad(wallClock.getDate())}T${pad(wallClock.getHours())}:${pad(
    wallClock.getMinutes()
  )}`;
  return localInputToUtc(localValue, ianaTz);
}

export function formatFriendly(date: Date, ianaTz = ART_TZ): string {
  return formatInTimeZone(date, ianaTz, "PPP p");
}

export { format, parseISO };
