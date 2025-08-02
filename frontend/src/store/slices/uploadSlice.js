import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:5001/api/upload/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to upload file');
    }
  }
);

const initialState = {
  uploading: false,
  success: false,
  error: null,
  uploadResult: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearUploadState: (state) => {
      state.uploading = false;
      state.success = false;
      state.error = null;
      state.uploadResult = null;
    },
    resetUploadSuccess: (state) => {
      state.success = false;
      state.uploadResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true;
        state.success = false;
        state.error = null;
        state.uploadResult = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.success = true;
        state.uploadResult = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearUploadState, resetUploadSuccess } = uploadSlice.actions;
export default uploadSlice.reducer; 