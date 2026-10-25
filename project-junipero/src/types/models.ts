export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export type ReminderOffset = "15m" | "1h" | "24h" | "custom";

export type RecurrenceMode =
  | "once"
  | "every_x_days"
  | "weekly"
  | "biweekly"
  | "monthly";

export interface TherapistProfile {
  id: string;
  email: string;
  displayName: string;
  preferredLocale: "system" | "en" | "es" | "pt";
  defaultDurationMin: number;
  defaultReminder: ReminderOffset;
}

export interface Client {
  id: string;
  therapistId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  notes?: string;
  countryCode: string;
  region: string;
  city: string;
  streetAddress?: string;
  ianaTz: string;
  placeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  therapistId: string;
  clientId: string;
  startsAtUtc: string;
  durationMin: number;
  clientIanaTz: string;
  status: AppointmentStatus;
  reminderOffset: ReminderOffset;
  recurrenceMode: RecurrenceMode;
  recurrenceIntervalDays?: number;
  seriesId?: string;
  exceptionOf?: string;
  originalStartsAtUtc?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  accessToken: string;
  therapist: TherapistProfile;
}
