import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DoctorState, Doctor } from '../../utils/types';
import apiClient from '../../services/apiClient';
import Endpoints from '../../utils/endpoints';

const initialState: DoctorState = {
  list: [],
  selected: null,
  isLoading: false,
  error: null,
};

export const fetchDoctorsAction = createAsyncThunk<
  Doctor[],
  void,
  { rejectValue: string }
>('doctor/fetchList', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(Endpoints.doctors.list);
    return res.data.data as Doctor[];
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message ?? 'Failed to fetch doctors');
  }
});

export const fetchDoctorDetailAction = createAsyncThunk<
  Doctor,
  string,
  { rejectValue: string }
>('doctor/fetchDetail', async (id, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(Endpoints.doctors.detail(id));
    return res.data.data as Doctor;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message ?? 'Failed to fetch doctor detail');
  }
});

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearSelectedDoctor: (state) => {
      state.selected = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDoctorsAction.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctorsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchDoctorsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Error';
      });

    builder
      .addCase(fetchDoctorDetailAction.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export const { clearSelectedDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
