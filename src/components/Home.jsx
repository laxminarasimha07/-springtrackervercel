import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSummary,
  addIncome,
  addExpense,
  getIncome,
  getExpenses,
  updateExpense,
  deleteExpense,
  checkSession
} from '../api';
import Navbar from './Navbar';

function Home() {
  const navigate = useNavigate();
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  
  // Summary state
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    remainingAmount: 0
  });

  // Income state
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    source: '',
    date: '',
    description: ''
  });

  // Expense state
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: '',
    date: '',
    description: ''
  });

  // Lists state
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  
  // Edit state
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Message state
  const [message, setMessage] = useState({ type: '', text: '' });

  // Categories (hardcoded in frontend)
  const categories = ['Food', 'Travel', 'Rent', 'EMI', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Others'];

  // Check session on component mount
  useEffect(() => {
    checkUserSession();
  }, []);

  // Fetch data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn]);

  const checkUserSession = async () => {
    try {
      const response = await checkSession();
      if (response.data.loggedIn) {
        setIsLoggedIn(true);
        setUsername(response.data.username);
      } else {
        navigate('/login');
      }
    } catch (err) {
      navigate('/login');
    }
  };

  const fetchAllData = async () => {
    try {
      // Fetch summary
      const summaryRes = await getSummary();
      setSummary(summaryRes.data);

      // Fetch income
      const incomeRes = await getIncome();
      setIncomeList(incomeRes.data);

      // Fetch expenses
      const expenseRes = await getExpenses();
      setExpenseList(expenseRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  // Handle Income Form
  const handleIncomeChange = (e) => {
    setIncomeForm({
      ...incomeForm,
      [e.target.name]: e.target.value
    });
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    
    if (!incomeForm.amount || !incomeForm.source || !incomeForm.date) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    try {
      await addIncome(incomeForm);
      showMessage('success', 'Income added successfully');
      setIncomeForm({ amount: '', source: '', date: '', description: '' });
      fetchAllData();
    } catch (err) {
      showMessage('error', 'Failed to add income');
    }
  };

  // Handle Expense Form
  const handleExpenseChange = (e) => {
    setExpenseForm({
      ...expenseForm,
      [e.target.name]: e.target.value
    });
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    
    if (!expenseForm.amount || !expenseForm.category || !expenseForm.date) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    try {
      if (editingExpense) {
        // Update existing expense
        await updateExpense(editingExpense.id, expenseForm);
        showMessage('success', 'Expense updated successfully');
        setEditingExpense(null);
      } else {
        // Add new expense
        await addExpense(expenseForm);
        showMessage('success', 'Expense added successfully');
      }
      
      setExpenseForm({ amount: '', category: '', date: '', description: '' });
      fetchAllData();
    } catch (err) {
      showMessage('error', 'Failed to save expense');
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setExpenseForm({ amount: '', category: '', date: '', description: '' });
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        showMessage('success', 'Expense deleted successfully');
        fetchAllData();
      } catch (err) {
        showMessage('error', 'Failed to delete expense');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  // Combine income and expense for history
  const getTransactionHistory = () => {
    const incomeTransactions = incomeList.map(item => ({
      id: `income-${item.id}`,
      date: item.date,
      type: 'INCOME',
      categoryOrSource: item.source,
      amount: item.amount,
      description: item.description
    }));

    const expenseTransactions = expenseList.map(item => ({
      id: `expense-${item.id}`,
      date: item.date,
      type: 'EXPENSE',
      categoryOrSource: item.category,
      amount: item.amount,
      description: item.description,
      expenseId: item.id
    }));

    // Combine and sort by date (latest first)
    const combined = [...incomeTransactions, ...expenseTransactions];
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return combined;
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      
      <div className="container">
        {/* Message */}
        {message.text && (
          <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
            {message.text}
          </div>
        )}

        {/* Balance Card */}
        <div className="card balance-card">
          <h2>Remaining Balance</h2>
          <div className="balance-amount">₹{summary.remainingAmount.toFixed(2)}</div>
          <div className="balance-details">
            <div className="balance-item">
              <h3>Total Income</h3>
              <p>₹{summary.totalIncome.toFixed(2)}</p>
            </div>
            <div className="balance-item">
              <h3>Total Expense</h3>
              <p>₹{summary.totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Add Income Form */}
        <div className="card">
          <h2>Add Income</h2>
          <form onSubmit={handleIncomeSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  name="amount"
                  value={incomeForm.amount}
                  onChange={handleIncomeChange}
                  placeholder="Enter amount"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Source *</label>
                <input
                  type="text"
                  name="source"
                  value={incomeForm.source}
                  onChange={handleIncomeChange}
                  placeholder="e.g., Salary, Freelance"
                  required
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={incomeForm.date}
                  onChange={handleIncomeChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={incomeForm.description}
                  onChange={handleIncomeChange}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <button type="submit" className="btn">Add Income</button>
          </form>
        </div>

        {/* Add/Edit Expense Form */}
        <div className="card">
          <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
          <form onSubmit={handleExpenseSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  name="amount"
                  value={expenseForm.amount}
                  onChange={handleExpenseChange}
                  placeholder="Enter amount"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={expenseForm.category}
                  onChange={handleExpenseChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={expenseForm.date}
                  onChange={handleExpenseChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={expenseForm.description}
                  onChange={handleExpenseChange}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn">
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
              {editingExpense && (
                <button type="button" className="btn btn-danger" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Transaction History */}
        <div className="card">
          <h2>Transaction History</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category/Source</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getTransactionHistory().length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  getTransactionHistory().map(transaction => (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>
                        <span style={{ 
                          color: transaction.type === 'INCOME' ? 'green' : 'red',
                          fontWeight: 'bold'
                        }}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.categoryOrSource}</td>
                      <td>₹{transaction.amount.toFixed(2)}</td>
                      <td>{transaction.description || '-'}</td>
                      <td>
                        {transaction.type === 'EXPENSE' && (
                          <div className="action-buttons">
                            <button
                              className="btn btn-edit"
                              onClick={() => handleEditExpense(
                                expenseList.find(e => e.id === transaction.expenseId)
                              )}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteExpense(transaction.expenseId)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;