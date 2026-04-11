const Endpoints = {
  // ─── Auth ──────────────────────────────────────────────────
  auth: {
    login: '/auth/login/',
    refresh: '/auth/token/refresh/',
    logout: '/auth/logout/',
    me: '/auth/me/',
  },

  // ─── Patients ─────────────────────────────────────────────
  patients: {
    list: '/patients/',
    create: '/patients/',
    detail: (id: string) => `/patients/${id}/`,
    update: (id: string) => `/patients/${id}/`,
    delete: (id: string) => `/patients/${id}/`,
    estimatedWait: (id: string) => `/patients/${id}/estimated-wait-time/`,
    triage: (id: string) => `/patients/${id}/triage/`,
    flag: (id: string) => `/patients/${id}/flag/`,
  },

  // ─── Queue ────────────────────────────────────────────────
  queue: {
    list: '/queue/',
    create: '/queue/',
    detail: (id: string) => `/queue/${id}/`,
    assignDoctor: (id: string) => `/queue/${id}/assign-doctor/`,
    markServed: (id: string) => `/queue/${id}/mark-served/`,
    reorder: '/queue/reorder/',
  },

  // ─── Doctors ──────────────────────────────────────────────
  doctors: {
    list: '/doctors/',
    detail: (id: string) => `/doctors/${id}/`,
    availability: (id: string) => `/doctors/${id}/availability/`,
    appointments: (id: string) => `/doctors/${id}/appointments/`,
  },

  // ─── Appointments ─────────────────────────────────────────
  appointments: {
    list: '/appointments/',
    create: '/appointments/',
    detail: (id: string) => `/appointments/${id}/`,
    update: (id: string) => `/appointments/${id}/`,
    cancel: (id: string) => `/appointments/${id}/cancel/`,
  },

  // ─── Departments ──────────────────────────────────────────
  departments: {
    list: '/departments/',
    detail: (id: string) => `/departments/${id}/`,
  },

  // ─── Dashboard ────────────────────────────────────────────
  dashboard: {
    metrics: '/dashboard/metrics/',
    criticalCases: '/dashboard/critical-cases/',
    auditLogs: '/dashboard/audit-logs/',
    analytics: '/dashboard/analytics/',
  },

  // ─── Notifications ────────────────────────────────────────
  notifications: {
    list: '/notifications/',
    markRead: (id: string) => `/notifications/${id}/read/`,
    markAllRead: '/notifications/read-all/',
  },
} as const;

export default Endpoints;