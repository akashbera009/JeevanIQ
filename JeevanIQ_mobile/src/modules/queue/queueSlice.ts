import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { QueueState, QueueEntry } from '../../utils/types';
import apiClient from '../../services/apiClient';
import Endpoints from '../../utils/endpoints';

const initialState: QueueState = {
  entries: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const fetchQueueAction = createAsyncThunk<
  QueueEntry[],
  void,
  { rejectValue: string }
>('queue/fetchQueue', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get(Endpoints.queue.list);
    return res.data.data as QueueEntry[];
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message ?? 'Failed to fetch queue');
  }
});

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    clearQueue: (state) => {
      state.entries = [];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchQueueAction.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQueueAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchQueueAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Error';
      });
  },
});

export const { clearQueue } = queueSlice.actions;
export default queueSlice.reducer;
