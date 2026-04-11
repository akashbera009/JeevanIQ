import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../modules/auth';
import { uiReducer } from '../modals';
import patientReducer from '../modules/patient/patientSlice';
import queueReducer from '../modules/queue/queueSlice';
import doctorReducer from '../modules/doctor/doctorSlice';
import dashboardReducer from '../modules/dashboard/dashboardSlice';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    patients: patientReducer,
    queue: queueReducer,
    doctors: doctorReducer,
    dashboard: dashboardReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in serializability check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;