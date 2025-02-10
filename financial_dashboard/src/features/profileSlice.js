import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulate updating profile data
export const updateProfile = createAsyncThunk('profile/update', async (profileData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(profileData); 
    }, 1000);
  });
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    name: 'Shivam sharma',
    email: 'sshivam@cdac.in', 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default profileSlice.reducer;