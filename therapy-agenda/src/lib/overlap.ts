import { Appointment } from "../types/models";
import { ART_TZ, appointmentIntervalUtc } from "./time";
import { toZonedTime } from "date-fns-tz";

function intervalsOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Overlap is validated exclusively in Argentina time (ART).
 * Uses IANA America/Argentina/Buenos_Aires — never a hard-coded −3 offset.
 */
export function hasArtOverlap(
  candidate: Pick<Appointment, "startsAtUtc" | "durationMin" | "id" | "status">,
  existing: Appointment[]
): Appointment | null {
  if (candidate.status === "cancelled") return null;

  const cand = appointmentIntervalUtc(
    candidate.startsAtUtc,
    candidate.durationMin
  );
  // Convert bounds to ART wall clock for DST-safe comparison identity
  const candArtStart = toZonedTime(cand.start, ART_TZ);
  const candArtEnd = toZonedTime(cand.end, ART_TZ);

  for (const other of existing) {
    if (other.id === candidate.id) continue;
    if (other.status === "cancelled") continue;

    const o = appointmentIntervalUtc(other.startsAtUtc, other.durationMin);
    const oArtStart = toZonedTime(o.start, ART_TZ);
    const oArtEnd = toZonedTime(o.end, ART_TZ);

    if (intervalsOverlap(candArtStart, candArtEnd, oArtStart, oArtEnd)) {
      return other;
    }
  }
  return null;
}

export function assertNoArtOverlap(
  candidate: Pick<Appointment, "startsAtUtc" | "durationMin" | "id" | "status">,
  existing: Appointment[]
): void {
  const conflict = hasArtOverlap(candidate, existing);
  if (conflict) {
    throw new Error(
      `ART schedule overlap with appointment ${conflict.id} (validated in ${ART_TZ})`
    );
  }
}
