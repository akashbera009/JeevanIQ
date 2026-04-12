import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PatientState, Patient, PatientFilters, PaginatedResponse } from '../../utils/types';
import { patientInitialState } from '../../modals';
import apiClient from '../../services/apiClient';
import Endpoints from '../../utils/endpoints';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchPatientsAction = createAsyncThunk<
  PaginatedResponse<Patient>,
  { page?: number; filters?: PatientFilters },
  { rejectValue: string }
>
('patients/fetchList', async ({ page = 1, filters = {} }, { rejectWithValue })=> {
  try { 
    // const params = { page, ...filters };
    // const res = await apiClient.get(Endpoints.patients.list, { params });
    const res = await apiClient.get(Endpoints.patients.list);
    console.log(res);
    
    return res.data as PaginatedResponse<Patient>;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message ?? 'Failed to fetch patients');
  }
});

// export const fetchPatientsAction = createAsyncThunk(
//   'patients/fetchList',
//   async () => {
//     try {
//       const res = await apiClient.get(Endpoints.patients.list);
//       console.log('Patients API response:', res);
//     } catch (e) {
//       console.error('Error fetching patients:', e);
//     }
//   }
// );

export const fetchPatientDetailAction = createAsyncThunk<Patient, string, { rejectValue: string }>(
  'patients/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(Endpoints.patients.detail(id));
      return res.data.data as Patient;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? 'Failed to fetch patient');
    }
  },
);

export const createPatientAction = createAsyncThunk<Patient, Partial<Patient>, { rejectValue: string }>(
  'patients/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(Endpoints.patients.create, payload);
      return res.data.data as Patient;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? 'Failed to create patient');
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const patientSlice = createSlice({
  name: 'patients',
  initialState: patientInitialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PatientFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: state => {
      state.filters = {};
    },
    clearSelected: state => {
      state.selected = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // fetch list
    builder
      .addCase(fetchPatientsAction.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log(action.payload);
        
        state.list = action.payload.results;
        // state.pagination = {
        //   count: action.payload.count,
        //   next: action.payload.next,
        //   previous: action.payload.previous,
        //   currentPage: state.pagination.currentPage,
        // };
      })
      .addCase(fetchPatientsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Error';
      });

    // fetch detail
    builder
      .addCase(fetchPatientDetailAction.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchPatientDetailAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchPatientDetailAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Error';
      });

    // create
    builder.addCase(createPatientAction.fulfilled, (state, action) => {
      state.list.unshift(action.payload);
    });
  },
});

export const { setFilters, clearFilters, clearSelected, clearError } = patientSlice.actions;
export default patientSlice.reducer;