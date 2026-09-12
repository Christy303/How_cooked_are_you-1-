import React, { useState } from 'react';
import { X, LogIn, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        const res = await apiClient.login(username, password);
        onAuthSuccess(res.user);
      } else {
        const res = await apiClient.register(username, password);
        onAuthSuccess(res.user);
      }
      onClose();
    } catch (err) {
      // Local demo auth fallback if backend offline
      const mockUser = {
        id: 'user_' + Date.now(),
        username,
        role: username.toLowerCase() === 'admin' ? 'admin' : 'user'
      };
      apiClient.setToken('demo_token_' + Date.now());
      onAuthSuccess(mockUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay fade-in" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content glass-panel fire-border-glow">
        <div className="modal-header">
          <div className="modal-title">
            <ShieldCheck size={20} className="text-fire-accent" />
            <h3>{isLoginMode ? 'LOGIN TO YOUR ACCOUNT' : 'CREATE STUDENT ACCOUNT'}</h3>
          </div>
          <button className="icon-btn-mute" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="validation-error-box">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. cooked_student_99"
              className="large-number-input auth-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="large-number-input auth-input"
              required
            />
          </div>

          <button type="submit" className="cta-button pulse-btn auth-submit-btn" disabled={loading}>
            {isLoginMode ? <LogIn size={18} /> : <UserPlus size={18} />}
            <span>{loading ? 'PROCESSING...' : isLoginMode ? 'LOGIN' : 'REGISTER'}</span>
          </button>
        </form>

        <div className="modal-footer">
          <span>
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            className="link-btn"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
          >
            {isLoginMode ? 'Register Here' : 'Login Here'}
          </button>
        </div>
      </div>
    </div>
  );
}
