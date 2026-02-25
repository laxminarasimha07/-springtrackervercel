import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // Important for session-based auth
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth APIs
export const registerUser = (userData) => {
  return api.post('/register', userData);
};

export const loginUser = (credentials) => {
  return api.post('/login', credentials);
};

export const logoutUser = () => {
  return api.post('/logout');
};

export const checkSession = () => {
  return api.get('/check-session');
};

// Expense APIs
export const addExpense = (expenseData) => {
  return api.post('/expense', expenseData);
};

export const getExpenses = () => {
  return api.get('/expenses');
};

export const updateExpense = (id, expenseData) => {
  return api.put(`/expense/${id}`, expenseData);
};

export const deleteExpense = (id) => {
  return api.delete(`/expense/${id}`);
};

// Income APIs
export const addIncome = (incomeData) => {
  return api.post('/income', incomeData);
};

export const getIncome = () => {
  return api.get('/income');
};

// Summary API
export const getSummary = () => {
  return api.get('/summary');
};

export default api;