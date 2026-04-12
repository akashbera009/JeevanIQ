export const APP_NAME = 'JeevanIQ';
export const APP_VERSION = '1.0.0';

// ─── API ──────────────────────────────────────────────────────────────────────
export const API_TIMEOUT = 30000; // 30 seconds
export const API_BASE_URL = __DEV__
?'http://localhost:8000/home' :
   'http://127.0.0.1:8000/home'

// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@jeevaniq/access_token',
  REFRESH_TOKEN: '@jeevaniq/refresh_token',
  USER: '@jeevaniq/user',
  THEME: '@jeevaniq/theme',
  ONBOARDED: '@jeevaniq/onboarded',
  LAST_LOCATION: '@jeevaniq/last_location',
} as const;

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PAGE_SIZE = 20;
export const INITIAL_PAGE = 1;

// ─── Queue Refresh Interval ───────────────────────────────────────────────────
export const QUEUE_REFRESH_INTERVAL = 30000; // 30 seconds
export const DASHBOARD_REFRESH_INTERVAL = 60000; // 1 minute

// ─── OTP ──────────────────────────────────────────────────────────────────────
export const OTP_LENGTH = 6;
export const OTP_RESEND_TIMEOUT = 60; // seconds

// ─── Priority Weights ─────────────────────────────────────────────────────────
export const PRIORITY_WEIGHTS = {
  SEVERITY: {
    critical: 100,
    high: 70,
    medium: 40,
    low: 10,
  },
  WAIT_TIME_PER_MINUTE: 0.5,
  DOCTOR_UNAVAILABLE_PENALTY: 20,
} as const;

// ─── Severity Config ──────────────────────────────────────────────────────────
export const SEVERITY_LABELS = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
} as const;

// ─── Gender Options ───────────────────────────────────────────────────────────
export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
] as const;

// ─── Blood Groups ─────────────────────────────────────────────────────────────
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

// ─── Common Symptoms ──────────────────────────────────────────────────────────
export const COMMON_SYMPTOMS = [
  'Fever',
  'Chest Pain',
  'Breathlessness',
  'Headache',
  'Nausea',
  'Vomiting',
  'Abdominal Pain',
  'Dizziness',
  'Fatigue',
  'Cough',
  'Sore Throat',
  'Body Ache',
  'Back Pain',
  'Rash',
  'Swelling',
] as const;

// ─── Critical Symptom Combos ──────────────────────────────────────────────────
export const CRITICAL_SYMPTOM_COMBOS = [
  ['Chest Pain', 'Breathlessness'],
  ['Chest Pain', 'Dizziness'],
  ['Breathlessness', 'Fatigue'],
] as const;

// ─── Toast Duration ───────────────────────────────────────────────────────────
export const TOAST_DURATION = {
  short: 2000,
  medium: 3500,
  long: 5000,
} as const;

// ─── Animation Durations ──────────────────────────────────────────────────────
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 400,
  verySlow: 600,
} as const;

// ─── Google Sign-In ───────────────────────────────────────────────────────────
export const GOOGLE_WEB_CLIENT_ID =
  'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com';