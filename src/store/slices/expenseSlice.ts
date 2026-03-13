import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense } from '../../types/expense';

interface ExpenseState {
  expenses: Expense[];
}

const initialState: ExpenseState = {
  expenses: [],
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Omit<Expense, 'id' | 'date'>>) => {
      const newExpense: Expense = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString(),
      };
      state.expenses.unshift(newExpense);
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
    },
  },
});

export const { addExpense, deleteExpense } = expenseSlice.actions;

// Selectors
export const selectExpenses = (state: { expenses: ExpenseState }) => state.expenses.expenses;
export const selectTotalAmount = (state: { expenses: ExpenseState }) =>
  state.expenses.expenses.reduce((sum, e) => sum + e.amount, 0);

export default expenseSlice.reducer;
