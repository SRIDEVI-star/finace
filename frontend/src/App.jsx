import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [name, setName] = useState(localStorage.getItem('name') || '');

  function onLogin(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
    setToken(data.token);
    setName(data.name);
  }
  function logout() {
    localStorage.clear();
    setToken(null);
  }

  return token ? <Dashboard token={token} name={name} onLogout={logout} /> : <AuthForm onLogin={onLogin} />;
}

// ---------- Login / Register in one form ----------
function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const res = await fetch(`${API}/${isLogin ? 'login' : 'register'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.message);
    if (isLogin) onLogin(data);
    else { setMsg('Account created. Please log in.'); setIsLogin(true); }
  }

  return (
    <div className="card auth">
      <h1>Finance Tracker</h1>
      <form onSubmit={submit}>
        {!isLogin && <input name="name" placeholder="Full name" onChange={change} required />}
        <input name="email" type="email" placeholder="Email" onChange={change} required />
        <input name="password" type="password" placeholder="Password" onChange={change} required />
        <button>{isLogin ? 'Log in' : 'Create account'}</button>
      </form>
      {msg && <p className="msg">{msg}</p>}
      <p className="link" onClick={() => { setIsLogin(!isLogin); setMsg(''); }}>
        {isLogin ? 'New here? Create an account' : 'Have an account? Log in'}
      </p>
    </div>
  );
}

// ---------- Dashboard ----------
function Dashboard({ token, name, onLogout }) {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ type: 'expense', amount: '', category: '', note: '' });
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function load() {
    const res = await fetch(`${API}/transactions`, { headers });
    if (res.status === 401) return onLogout();
    setList(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    await fetch(`${API}/transactions`, { method: 'POST', headers, body: JSON.stringify(form) });
    setForm({ ...form, amount: '', category: '', note: '' });
    load();
  }
  async function remove(id) {
    await fetch(`${API}/transactions/${id}`, { method: 'DELETE', headers });
    load();
  }

  const income = list.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="wrap">
      <header>
        <h1>Hi, {name}</h1>
        <button className="ghost" onClick={onLogout}>Log out</button>
      </header>

      <div className="totals">
        <div className="card"><span>Income</span><b className="green">₹{income}</b></div>
        <div className="card"><span>Expenses</span><b className="red">₹{expense}</b></div>
        <div className="card"><span>Balance</span><b>₹{income - expense}</b></div>
      </div>

      <form className="card add" onSubmit={add}>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input type="number" placeholder="Amount" value={form.amount} required
          onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input placeholder="Category (Food, Rent...)" value={form.category} required
          onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Note (optional)" value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <button>Add</button>
      </form>

      <div className="card">
        {list.length === 0 && <p>No transactions yet. Add your first one above.</p>}
        {list.map((t) => (
          <div className="row" key={t._id}>
            <div>
              <b>{t.category}</b>
              <small>{t.note} {new Date(t.date).toLocaleDateString()}</small>
            </div>
            <span className={t.type === 'income' ? 'green' : 'red'}>
              {t.type === 'income' ? '+' : '-'}₹{t.amount}
            </span>
            <button className="ghost" onClick={() => remove(t._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
