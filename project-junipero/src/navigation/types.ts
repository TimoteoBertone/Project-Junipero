export type RootTabParamList = {
  HomeTab: undefined;
  ClientsTab: undefined;
  AppointmentsTab: undefined;
  SettingsTab: undefined;
};

export type ClientsStackParamList = {
  ClientsList: undefined;
  ClientForm: { clientId?: string };
};

export type AppointmentsStackParamList = {
  AppointmentsList: undefined;
  AppointmentForm: { appointmentId?: string };
};
