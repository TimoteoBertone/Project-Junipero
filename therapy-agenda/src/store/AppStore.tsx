import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { assertNoArtOverlap } from "../lib/overlap";
import { scheduleAppointmentReminder } from "../lib/notifications";
import { countryStats } from "../lib/places";
import { setAppLanguage } from "../i18n";
import {
  Appointment,
  AuthSession,
  Client,
  TherapistProfile,
} from "../types/models";

const STORAGE_KEY = "therapy-agenda.v1";

interface PersistedState {
  session: AuthSession | null;
  clients: Client[];
  appointments: Appointment[];
}

interface AppStoreValue {
  ready: boolean;
  session: AuthSession | null;
  clients: Client[];
  appointments: Appointment[];
  signInDemo: (email: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<TherapistProfile>) => Promise<void>;
  upsertClient: (
    client: Omit<Client, "id" | "createdAt" | "updatedAt" | "therapistId"> & {
      id?: string;
    }
  ) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
  upsertAppointment: (
    input: Omit<
      Appointment,
      "id" | "createdAt" | "updatedAt" | "therapistId"
    > & {
      id?: string;
    },
    opts?: { scheduleReminder?: boolean }
  ) => Promise<Appointment>;
  cancelOccurrence: (id: string) => Promise<void>;
  geoStats: { countryCode: string; count: number }[];
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

const initialDemoClients = (therapistId: string): Client[] => {
  const now = new Date().toISOString();
  return [
    {
      id: uid("cli"),
      therapistId,
      firstName: "Lucía",
      lastName: "Fernández",
      phone: "+5493874000000",
      email: "lucia@example.com",
      notes: "Prefers morning sessions",
      countryCode: "AR",
      region: "Salta",
      city: "Salta",
      ianaTz: "America/Argentina/Salta",
      placeId: "ar-salta",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid("cli"),
      therapistId,
      firstName: "Mateo",
      lastName: "Silva",
      countryCode: "CL",
      region: "Región Metropolitana",
      city: "Santiago",
      ianaTz: "America/Santiago",
      placeId: "cl-scl",
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistedState;
          setSession(parsed.session);
          setClients(parsed.clients ?? []);
          setAppointments(parsed.appointments ?? []);
          if (parsed.session?.therapist.preferredLocale) {
            setAppLanguage(parsed.session.therapist.preferredLocale);
          }
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback(
    async (next: PersistedState) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    },
    []
  );

  const commit = useCallback(
    async (next: {
      session?: AuthSession | null;
      clients?: Client[];
      appointments?: Appointment[];
    }) => {
      const snapshot: PersistedState = {
        session: next.session === undefined ? session : next.session,
        clients: next.clients ?? clients,
        appointments: next.appointments ?? appointments,
      };
      setSession(snapshot.session);
      setClients(snapshot.clients);
      setAppointments(snapshot.appointments);
      await persist(snapshot);
    },
    [appointments, clients, persist, session]
  );

  const signInDemo = useCallback(
    async (email: string, displayName: string) => {
      const therapistId = uid("th");
      const therapist: TherapistProfile = {
        id: therapistId,
        email,
        displayName,
        preferredLocale: "system",
        defaultDurationMin: 50,
        defaultReminder: "1h",
      };
      await commit({
        session: { accessToken: `demo_${therapistId}`, therapist },
        clients: initialDemoClients(therapistId),
        appointments: [],
      });
    },
    [commit]
  );

  const signOut = useCallback(async () => {
    await commit({ session: null, clients: [], appointments: [] });
  }, [commit]);

  const updateProfile = useCallback(
    async (patch: Partial<TherapistProfile>) => {
      if (!session) return;
      const therapist = { ...session.therapist, ...patch };
      if (patch.preferredLocale) setAppLanguage(patch.preferredLocale);
      await commit({ session: { ...session, therapist } });
    },
    [commit, session]
  );

  const upsertClient = useCallback(
    async (
      input: Omit<Client, "id" | "createdAt" | "updatedAt" | "therapistId"> & {
        id?: string;
      }
    ) => {
      if (!session) throw new Error("Not signed in");
      const now = new Date().toISOString();
      const existing = input.id
        ? clients.find((c) => c.id === input.id)
        : undefined;
      const next: Client = {
        id: existing?.id ?? uid("cli"),
        therapistId: session.therapist.id,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        email: input.email,
        notes: input.notes,
        countryCode: input.countryCode,
        region: input.region,
        city: input.city,
        streetAddress: input.streetAddress,
        ianaTz: input.ianaTz,
        placeId: input.placeId,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      const list = existing
        ? clients.map((c) => (c.id === next.id ? next : c))
        : [...clients, next];
      await commit({ clients: list });
      return next;
    },
    [clients, commit, session]
  );

  const deleteClient = useCallback(
    async (id: string) => {
      await commit({
        clients: clients.filter((c) => c.id !== id),
        appointments: appointments.filter((a) => a.clientId !== id),
      });
    },
    [appointments, clients, commit]
  );

  const upsertAppointment = useCallback(
    async (
      input: Omit<
        Appointment,
        "id" | "createdAt" | "updatedAt" | "therapistId"
      > & {
        id?: string;
      },
      opts?: { scheduleReminder?: boolean }
    ) => {
      if (!session) throw new Error("Not signed in");
      const now = new Date().toISOString();
      const existing = input.id
        ? appointments.find((a) => a.id === input.id)
        : undefined;

      const next: Appointment = {
        id: existing?.id ?? uid("apt"),
        therapistId: session.therapist.id,
        clientId: input.clientId,
        startsAtUtc: input.startsAtUtc,
        durationMin: input.durationMin,
        clientIanaTz: input.clientIanaTz,
        status: input.status,
        reminderOffset: input.reminderOffset,
        recurrenceMode: input.recurrenceMode,
        recurrenceIntervalDays: input.recurrenceIntervalDays,
        seriesId:
          input.seriesId ??
          (input.recurrenceMode !== "once"
            ? existing?.seriesId ?? uid("series")
            : undefined),
        exceptionOf: input.exceptionOf,
        originalStartsAtUtc: input.originalStartsAtUtc,
        notes: input.notes,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };

      assertNoArtOverlap(next, appointments);

      const list = existing
        ? appointments.map((a) => (a.id === next.id ? next : a))
        : [...appointments, next];
      await commit({ appointments: list });

      if (opts?.scheduleReminder !== false && next.status === "scheduled") {
        const client = clients.find((c) => c.id === next.clientId);
        const name = client
          ? `${client.firstName} ${client.lastName}`
          : "Client";
        try {
          await scheduleAppointmentReminder(next, name);
        } catch {
          // Permissions / simulator — ignore
        }
      }

      return next;
    },
    [appointments, clients, commit, session]
  );

  const cancelOccurrence = useCallback(
    async (id: string) => {
      const target = appointments.find((a) => a.id === id);
      if (!target) return;
      // Per-occurrence cancel: keep series intact
      const cancelled: Appointment = {
        ...target,
        status: "cancelled",
        exceptionOf: target.seriesId ?? target.id,
        originalStartsAtUtc: target.originalStartsAtUtc ?? target.startsAtUtc,
        updatedAt: new Date().toISOString(),
      };
      await commit({
        appointments: appointments.map((a) => (a.id === id ? cancelled : a)),
      });
    },
    [appointments, commit]
  );

  const geoStats = useMemo(
    () => countryStats(clients.map((c) => c.countryCode)),
    [clients]
  );

  const value = useMemo<AppStoreValue>(
    () => ({
      ready,
      session,
      clients,
      appointments,
      signInDemo,
      signOut,
      updateProfile,
      upsertClient,
      deleteClient,
      upsertAppointment,
      cancelOccurrence,
      geoStats,
    }),
    [
      appointments,
      cancelOccurrence,
      clients,
      deleteClient,
      geoStats,
      ready,
      session,
      signInDemo,
      signOut,
      updateProfile,
      upsertAppointment,
      upsertClient,
    ]
  );

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
}
