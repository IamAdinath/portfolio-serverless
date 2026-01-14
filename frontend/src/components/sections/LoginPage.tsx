// src/components/sections/LoginPage.tsx - Streamlined with Auth Context
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css'; 
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/ToastProvider';
import { usePageTitle } from '../common/usePageTitle';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { login, register, isLoading, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  usePageTitle(isLogin ? 'Login' : 'Sign Up');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login(username, password);
        addToast('success', 'Logged in successfully!');
        
        // Redirect to intended page or home
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        if (password !== confirmPassword) {
          addToast('error', 'Passwords do not match!');
          return;
        }

        if (!email.trim() || !name.trim()) {
          addToast('error', 'Please fill in all fields');
          return;
        }

        await register(username, email, name, password);
        addToast('success', 'Account created and logged in successfully!');
        
        // Redirect to intended page or home
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      const msg = error?.message || 'Authentication failed. Please try again.';
      addToast('error', msg);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-tabs">
          <button
            type="button"
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className={`form-fields-wrapper ${!isLogin ? 'show-signup' : ''}`}>
            {!isLogin && (
              <div className="signup-fields">
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
            )}
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {!isLogin && (
              <div className="signup-fields">
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </div>
            )}
          </div>
          <button className="submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;