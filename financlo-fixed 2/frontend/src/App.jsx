import './App.css';
import React, { useState, useCallback } from 'react';
import Header from './Header';
import LoggedHeader from './LoggedHeader';
import UserCreationForm from './UserCreationForm';
import LoginForm from './LoginForm';
import Profile from './Profile';
import Transactions from './Transactions';
import { parseToken } from './api';

// Read a saved token on first load, but only keep it if it is still valid.
const loadInitialToken = () => {
  const saved = localStorage.getItem('token');
  return saved && parseToken(saved) ? saved : null;
};

const App = () => {
  const [token, setToken] = useState(loadInitialToken);
  const user = token ? parseToken(token) : null; // { id, username }
  const [page, setPage] = useState(user ? 'dashboard' : 'home');

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setPage('dashboard');
  };

  // useCallback keeps this function's identity stable so child useEffects
  // that depend on it do not re-run on every render.
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setPage('home');
  }, []);

  return (
    <div>
      {user ? (
        <LoggedHeader
          username={user.username}
          onDashboardClick={() => setPage('dashboard')}
          onLogoutClick={handleLogout}
        />
      ) : (
        <Header
          onRegisterClick={() => setPage('register')}
          onLoginClick={() => setPage('login')}
        />
      )}

      {page === 'home' && (
        <div>
          <h1>Welcome to Financlo</h1>
          <p>Manage your finances easily.</p>
        </div>
      )}

      {page === 'login' && <LoginForm onLogin={handleLogin} />}

      {page === 'register' && <UserCreationForm />}

      {page === 'dashboard' && user && (
        <>
          <Profile userId={user.id} token={token} onAuthError={handleLogout} />
          <Transactions userId={user.id} token={token} onAuthError={handleLogout} />
        </>
      )}
    </div>
  );
};

export default App;
