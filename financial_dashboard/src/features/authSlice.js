import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulate login API call
export const loginUser = createAsyncThunk('auth/login', async (credentials) => {
  const { username, password } = credentials;
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'shivam' && password === 'Shivam@123') {
        resolve({ name: 'Shivam Sharma', token: 'secret-token' });
      } else {
        reject('Invalid credentials');
      }
    }, 1000);
  });
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    token: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.name;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;