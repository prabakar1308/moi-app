import axios from "axios";

const API_URL = "https://react-native-expense-1308-default-rtdb.firebaseio.com";

export const fetchExpensesAPI = async () => {
  const response = await axios.get(`${API_URL}/expenses.json`);
  const expenses = [];

  for (const key in response.data) {
    const expObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };
    expenses.push(expObj);
  }

  return expenses;
};

export const storeExpenseAPI = async (expenseData) => {
  const response = await axios.post(`${API_URL}/expenses.json`, expenseData);
  console.log(response.data);
  return response.data.name;
};

export const updateExpenseAPI = (id, expenseData) => {
  return axios.put(`${API_URL}/expenses/${id}.json`, expenseData);
};

export const deleteExpenseAPI = (id) => {
  return axios.delete(`${API_URL}/expenses/${id}.json`);
};
