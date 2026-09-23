import React, { useState, useEffect } from 'react';
import './Transactions.css';
import { API_URL } from './api';

const PAYMENT_METHODS = ['Cash', 'Card', 'Bank transfer', 'Other'];
const EMPTY_FORM = { amount: '', category: '', description: '', paymentMethod: 'Cash' };

const Transactions = ({ userId, token, onAuthError }) => {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/myTransactions/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401 || response.status === 403) {
          onAuthError();
          return;
        }
        if (!response.ok) throw new Error('Request failed');
        setTransactions(await response.json());
      } catch (err) {
        console.error(err);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, token, onAuthError]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/transaction/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });

      if (response.status === 401 || response.status === 403) {
        onAuthError();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Could not save the transaction');
        return;
      }

      setTransactions([data, ...transactions]); // newest first
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      setError('Could not reach the server. Is the backend running?');
    }
  };

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="transactions">
      <h3>Add an expense</h3>
      <form onSubmit={handleSubmit} className="transaction-form">
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g. Food)"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
        />
        <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>

      {error && <p className="transactions-error">{error}</p>}

      <h3>Your expenses {transactions.length > 0 && `(total: ${total.toFixed(2)})`}</h3>
      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No expenses yet. Add your first one above.</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Method</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{new Date(t.time).toLocaleDateString()}</td>
                <td>{t.category}</td>
                <td>{t.description || '-'}</td>
                <td>{t.paymentMethod}</td>
                <td>{t.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
