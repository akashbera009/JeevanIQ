/**
 * JeevanIQ — Modals (Redux Types & Initial States)
 * Central place for all slice types and their initial states
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthState,
  PatientState,
  QueueState,
  DoctorState,
  DashboardState,
  UIState,
  ToastConfig,
} from '../utils/types';

// ─── Initial States ───────────────────────────────────────────────────────────

export const authInitialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpSent: false,
  phone: '',
};

export const patientInitialState: PatientState = {
  list: [],
  selected: null,
  isLoading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  },
  filters: {},
};

export const queueInitialState: QueueState = {
  entries: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const doctorInitialState: DoctorState = {
  list: [],
  selected: null,
  isLoading: false,
  error: null,
};

export const dashboardInitialState: DashboardState = {
  metrics: null,
  criticalCases: [],
  isLoading: false,
  error: null,
};

export const uiInitialState: UIState = {
  toast: null,
  isNetworkAvailable: true,
  theme: 'dark',
};

// ─── UI Slice (Toast + Network + Theme) ──────────────────────────────────────

const uiSlice = createSlice({
  name: 'ui',
  initialState: uiInitialState,
  reducers: {
    setToast: (state, action: PayloadAction<ToastConfig>) => {
      state.toast = action.payload;
    },
    clearToast: state => {
      state.toast = null;
    },
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isNetworkAvailable = action.payload;
    },
  },
});

export const { setToast, clearToast, setNetworkStatus } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

export default uiSlice;