import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardState, DashboardMetrics, Patient } from '../../utils/types';
import { dashboardInitialState } from '../../modals';
import apiClient from '../../services/apiClient';
import Endpoints from '../../utils/endpoints';

export const fetchDashboardMetricsAction = createAsyncThunk<
  DashboardMetrics,
  void,
  { rejectValue: string }
>('dashboard/fetchMetrics', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(Endpoints.dashboard.metrics);
    return res.data.data as DashboardMetrics;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message ?? 'Failed to fetch metrics');
  }
});

export const fetchCriticalCasesAction = createAsyncThunk<
  Patient[],
  void,
  { rejectValue: string }
>('dashboard/fetchCritical', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(Endpoints.dashboard.criticalCases);
    return res.data.data as Patient[];
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message ?? 'Failed to fetch critical cases');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: dashboardInitialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardMetricsAction.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetricsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchDashboardMetricsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Error';
      });

    builder.addCase(fetchCriticalCasesAction.fulfilled, (state, action) => {
      state.criticalCases = action.payload;
    });
  },
});

export default dashboardSlice.reducer;