// ─── Severity & Priority ──────────────────────────────────────────────────────
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type PriorityLevel = 1 | 2 | 3 | 4 | 5;
export type GenderType = 'male' | 'female' | 'other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type QueueStatus = 'waiting' | 'in_progress' | 'served' | 'skipped';

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  token?: string;
  createdAt: string;
}

// ─── Patient ──────────────────────────────────────────────────────────────────
export interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: GenderType;
  bloodGroup?: BloodGroup;
  phone: string;
  address?: string;
  symptoms: string[];
  severity: SeverityLevel;
  priorityScore: number;
  isCritical: boolean;
  isFlagged: boolean;
  waitingTime: number; // minutes
  estimatedWaitTime: number; // minutes
  queuePosition?: number;
  assignedDoctor?: Doctor;
  department?: Department;
  createdAt: string;
  updatedAt: string;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: Department;
  isAvailable: boolean;
  avgConsultTime: number; // minutes
  currentPatientCount: number;
  avatar?: string;
  phone?: string;
  email?: string;
}

// ─── Department ───────────────────────────────────────────────────────────────
export interface Department {
  id: string;
  name: string;
  code: string;
  floor?: string;
}

// ─── Queue Entry ──────────────────────────────────────────────────────────────
export interface QueueEntry {
  id: string;
  patient: Patient;
  doctor?: Doctor;
  status: QueueStatus;
  position: number;
  priorityScore: number;
  estimatedWaitTime: number;
  checkInTime: string;
  servedAt?: string;
  notes?: string;
}

// ─── Appointment ──────────────────────────────────────────────────────────────
export interface Appointment {
  id: string;
  patient: Patient;
  doctor: Doctor;
  scheduledAt: string;
  status: AppointmentStatus;
  notes?: string;
  department: Department;
}

// ─── Triage Record ────────────────────────────────────────────────────────────
export interface TriageRecord {
  id: string;
  patient: Patient;
  severity: SeverityLevel;
  symptoms: string[];
  vitals?: Vitals;
  notes: string;
  triageBy: string;
  createdAt: string;
}

// ─── Vitals ───────────────────────────────────────────────────────────────────
export interface Vitals {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
}

// ─── Dashboard Metrics ────────────────────────────────────────────────────────
export interface DashboardMetrics {
  totalPatients: number;
  criticalCases: number;
  avgWaitTime: number;
  availableDoctors: number;
  pendingAppointments: number;
  servedToday: number;
  queueSize: number;
  busiestDepartment?: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthCredentials {
  phone?: string;
  email?: string;
  password?: string;
}

export interface OtpPayload {
  phone: string;
  otp: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

// ─── Navigation Param Lists ───────────────────────────────────────────────────
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  LocationPermission: undefined;
  VerificationModal: { phone: string };
};

export type RootStackParamList = {
  AuthNavigator: undefined;
  BottomTabNavigator: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  QueueTab: undefined;
  PatientsTab: undefined;
  DoctorsTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Notifications: undefined;
};

export type QueueStackParamList = {
  QueueList: undefined;
  QueueDetail: { queueId: string };
};

export type PatientStackParamList = {
  PatientList: undefined;
  PatientDetail: { patientId: string };
  PatientAdd: undefined;
  TriageRecord: { patientId: string };
};

export type DoctorStackParamList = {
  DoctorList: undefined;
  DoctorDetail: { doctorId: string };
  AppointmentList: { doctorId?: string };
  AppointmentDetail: { appointmentId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  ChangePassword: undefined;
};

// ─── Redux State ──────────────────────────────────────────────────────────────
export interface RootState {
  auth: AuthState;
  patients: PatientState;
  queue: QueueState;
  doctors: DoctorState;
  dashboard: DashboardState;
  ui: UIState;
}

export interface AuthState {
  user: User | null;
  token: TokenPair | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  phone: string;
}

export interface PatientState {
  list: Patient[];
  selected: Patient | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  filters: PatientFilters;
}

export interface QueueState {
  entries: QueueEntry[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface DoctorState {
  list: Doctor[];
  selected: Doctor | null;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardState {
  metrics: DashboardMetrics | null;
  criticalCases: Patient[];
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  toast: ToastConfig | null;
  isNetworkAvailable: boolean;
  theme: 'dark';
}

// ─── Misc ─────────────────────────────────────────────────────────────────────
export interface PaginationMeta {
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
}

export interface PatientFilters {
  severity?: SeverityLevel;
  search?: string;
  ordering?: string;
  department?: string;
  isCritical?: boolean;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  type: ToastType;
  message: string;
  duration?: number;
}