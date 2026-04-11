const Strings = {
  // ─── App ──────────────────────────────────────────────────
  appName: 'JeevanIQ',
  tagline: 'Intelligent Patient Flow',

  // ─── Auth ─────────────────────────────────────────────────
  login: 'Login',
  logout: 'Logout',
  signIn: 'Sign In',
  signInWithGoogle: 'Continue with Google',
  enterPhone: 'Enter Mobile Number',
  enterOtp: 'Enter OTP',
  sendOtp: 'Send OTP',
  verifyOtp: 'Verify OTP',
  resendOtp: 'Resend OTP',
  resendIn: (seconds: number) => `Resend in ${seconds}s`,
  otpSent: 'OTP sent to your number',
  invalidOtp: 'Invalid OTP. Please try again.',
  phonePlaceholder: '+91 XXXXX XXXXX',
  enterCredentials: 'Enter your credentials to continue',

  // ─── Navigation Labels ────────────────────────────────────
  tabHome: 'Home',
  tabQueue: 'Queue',
  tabPatients: 'Patients',
  tabDoctors: 'Doctors',
  tabProfile: 'Profile',

  // ─── Home ─────────────────────────────────────────────────
  goodMorning: 'Good Morning',
  goodAfternoon: 'Good Afternoon',
  goodEvening: 'Good Evening',
  todayOverview: "Today's Overview",
  criticalAlerts: 'Critical Alerts',
  viewAll: 'View All',
  noAlerts: 'No critical alerts right now',

  // ─── Queue ────────────────────────────────────────────────
  liveQueue: 'Live Queue',
  estimatedWait: 'Est. Wait',
  queuePosition: 'Position',
  priority: 'Priority',
  assignDoctor: 'Assign Doctor',
  markServed: 'Mark as Served',
  noPatientsInQueue: 'Queue is empty',

  // ─── Patients ─────────────────────────────────────────────
  patients: 'Patients',
  addPatient: 'Add Patient',
  patientId: 'Patient ID',
  patientName: 'Full Name',
  age: 'Age',
  gender: 'Gender',
  bloodGroup: 'Blood Group',
  symptoms: 'Symptoms',
  severity: 'Severity',
  condition: 'Condition',
  triageRecord: 'Triage Record',
  waitTime: 'Wait Time',
  noPatients: 'No patients found',

  // ─── Doctors ──────────────────────────────────────────────
  doctors: 'Doctors',
  doctorName: 'Doctor Name',
  specialization: 'Specialization',
  department: 'Department',
  available: 'Available',
  unavailable: 'Unavailable',
  avgConsultTime: 'Avg. Consult Time',
  noDoctors: 'No doctors found',

  // ─── Severity Labels ──────────────────────────────────────
  severityCritical: 'Critical',
  severityHigh: 'High',
  severityMedium: 'Medium',
  severityLow: 'Low',

  // ─── Common Actions ───────────────────────────────────────
  save: 'Save',
  cancel: 'Cancel',
  confirm: 'Confirm',
  delete: 'Delete',
  edit: 'Edit',
  update: 'Update',
  search: 'Search',
  filter: 'Filter',
  sort: 'Sort',
  refresh: 'Refresh',
  retry: 'Retry',
  back: 'Back',
  next: 'Next',
  done: 'Done',
  close: 'Close',
  submit: 'Submit',

  // ─── Status ───────────────────────────────────────────────
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',

  // ─── Errors ───────────────────────────────────────────────
  errorGeneric: 'Something went wrong. Please try again.',
  errorNetwork: 'No internet connection.',
  errorUnauthorized: 'Session expired. Please login again.',
  errorNotFound: 'Resource not found.',

  // ─── Success ──────────────────────────────────────────────
  successSaved: 'Saved successfully.',
  successUpdated: 'Updated successfully.',
  successDeleted: 'Deleted successfully.',

  // ─── Location ─────────────────────────────────────────────
  locationPermissionTitle: 'Enable Location',
  locationPermissionDesc:
    'JeevanIQ uses your location to connect you with the nearest hospital facility.',
  allowLocation: 'Allow Location',
  skipForNow: 'Skip for now',
} as const;

export default Strings;