import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: [],
  },
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = [...action.payload];
    },
    addExpense: (state, action) => {
      state.expenses = [action.payload, ...state.expenses];
    },
    updateExpense: (state, action) => {
      const { id } = action.payload;
      state.expenses = state.expenses.map((expense) => {
        if (expense.id === id) {
          return action.payload;
        }
        return expense;
      });
    },
    deleteExpense: (state, action) => {
      const { id } = action.payload;
      state.expenses = state.expenses.filter((expense) => expense.id !== id);
    },
  },
});

export const { addExpense, deleteExpense, updateExpense, setExpenses } =
  expenseSlice.actions;
export default expenseSlice.reducer;
