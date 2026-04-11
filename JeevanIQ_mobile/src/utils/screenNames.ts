export const ScreenNames = {
  // ─── Auth Stack ────────────────────────────────────────────
  SPLASH: 'Splash',
  LOGIN: 'Login',
  LOCATION_PERMISSION: 'LocationPermission',
  VERIFICATION_MODAL: 'VerificationModal',

  // ─── Root ─────────────────────────────────────────────────
  AUTH_NAVIGATOR: 'AuthNavigator',
  BOTTOM_TAB_NAVIGATOR: 'BottomTabNavigator',

  // ─── Bottom Tabs ──────────────────────────────────────────
  HOME_TAB: 'HomeTab',
  QUEUE_TAB: 'QueueTab',
  PATIENTS_TAB: 'PatientsTab',
  DOCTORS_TAB: 'DoctorsTab',
  PROFILE_TAB: 'ProfileTab',

  // ─── Home Stack ───────────────────────────────────────────
  HOME: 'Home',
  DASHBOARD: 'Dashboard',
  NOTIFICATIONS: 'Notifications',

  // ─── Queue Stack ──────────────────────────────────────────
  QUEUE_LIST: 'QueueList',
  QUEUE_DETAIL: 'QueueDetail',

  // ─── Patients Stack ───────────────────────────────────────
  PATIENT_LIST: 'PatientList',
  PATIENT_DETAIL: 'PatientDetail',
  PATIENT_ADD: 'PatientAdd',
  TRIAGE_RECORD: 'TriageRecord',

  // ─── Doctors Stack ────────────────────────────────────────
  DOCTOR_LIST: 'DoctorList',
  DOCTOR_DETAIL: 'DoctorDetail',
  APPOINTMENT_LIST: 'AppointmentList',
  APPOINTMENT_DETAIL: 'AppointmentDetail',

  // ─── Profile Stack ────────────────────────────────────────
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  CHANGE_PASSWORD: 'ChangePassword',

  // ─── Modals ───────────────────────────────────────────────
  CRITICAL_ALERT_MODAL: 'CriticalAlertModal',
  FILTER_MODAL: 'FilterModal',
} as const;

export type ScreenName = (typeof ScreenNames)[keyof typeof ScreenNames];