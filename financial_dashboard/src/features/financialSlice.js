import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulate fetching financial data
export const fetchFinancialData = createAsyncThunk('financial/fetch', async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        accountBalance: 5500,
        transactions: [
          { id: 1, date: '2024-10-01', amount: 100, type: 'Deposit' },
          { id: 2, date: '2024-10-02', amount: 50, type: 'Withdrawal' },
        ],
        notifications: ['Reminder: Pay bills by 10th Oct'],
      });
    }, 1000);
  });
});

const financialSlice = createSlice({
  name: 'financial',
  initialState: {
    accountBalance: 0,
    transactions: [],
    notifications: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFinancialData.fulfilled, (state, action) => {
        state.accountBalance = action.payload.accountBalance;
        state.transactions = action.payload.transactions;
        state.notifications = action.payload.notifications;
        state.loading = false;
      });
  },
});

export default financialSlice.reducer;