// src/components/sections/AuthPage.tsx
import React, { useState } from 'react';
import { signIn, signUp, fetchAuthSession } from 'aws-amplify/auth';
import './AuthPage.css'; 
import { requestUserConfirmation } from '../common/userAPI';
import { useToast } from '../common/ToastProvider';
import { usePageTitle } from '../common/usePageTitle';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();
  usePageTitle(isLogin ? 'Login' : 'Sign Up');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn({ username, password });
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (idToken) localStorage.setItem('token', idToken);
        addToast('success', 'Logged in successfully!');
      } else {
        if (password !== confirmPassword) {
          addToast('error', 'Passwords do not match!');
          return;
        }

        await signUp({
          username,
          password,
          options: { userAttributes: { email, name, preferred_username: username } },
        });

        await requestUserConfirmation({ username });
        await signIn({ username, password });
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (idToken) localStorage.setItem('token', idToken);
        addToast('success', 'Signed up and logged in successfully!');
      }
    } catch (error: any) {
      console.error(error);
      const msg = (typeof error === 'object' && error?.message?.trim()) || 'Something went wrong';
      addToast('error', msg);
    } finally {
      setLoading(false);
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
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;