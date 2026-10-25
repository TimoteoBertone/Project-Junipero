import * as Notifications from "expo-notifications";
import { Appointment, ReminderOffset } from "../types/models";
import { parseISO } from "./time";
import { addMinutes } from "date-fns";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function offsetMinutes(offset: ReminderOffset): number {
  switch (offset) {
    case "15m":
      return 15;
    case "1h":
      return 60;
    case "24h":
      return 24 * 60;
    case "custom":
      return 30;
  }
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export async function scheduleAppointmentReminder(
  appointment: Appointment,
  clientName: string
): Promise<string | null> {
  const granted = await ensureNotificationPermission();
  if (!granted) return null;

  const start = parseISO(appointment.startsAtUtc);
  const fireAt = addMinutes(start, -offsetMinutes(appointment.reminderOffset));
  if (fireAt.getTime() <= Date.now()) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Upcoming session",
      body: `${clientName} — reminder (${appointment.reminderOffset} before)`,
      data: { appointmentId: appointment.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: fireAt,
    },
  });
}
