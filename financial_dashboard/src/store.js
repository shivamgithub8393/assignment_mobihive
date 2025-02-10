import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import financialReducer from './features/financialSlice';
import profileReducer from './features/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    financial: financialReducer,
    profile: profileReducer,
  },
});