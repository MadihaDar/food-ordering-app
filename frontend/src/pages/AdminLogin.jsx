import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await api.login(username, password);
      localStorage.setItem('zaiqa_admin_token', result.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <span className="eyebrow">Staff access</span>
        <h1>Zaiqa admin</h1>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="admin-login__error">{error}</p>}
        <button className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="admin-login__hint">Default: admin / admin123</p>
      </form>
    </div>
  );
}
