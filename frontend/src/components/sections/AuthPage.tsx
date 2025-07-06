import React, { useState } from 'react';
import {
  signIn,
  signUp,
  fetchAuthSession,
} from 'aws-amplify/auth';
import './AuthPage.css';
import { requestUserConfirmation } from '../common/userAPI';
import { useToast } from '../common/ToastProvider'; // ✅ Import useToast

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { showSuccess, showError } = useToast(); // ✅ Use toast context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await signIn({ username, password });
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (idToken) localStorage.setItem('token', idToken);
        showSuccess('Logged in successfully!');
      } else {
        if (password !== confirmPassword) {
          showError('Passwords do not match');
          return;
        }

        await signUp({
          username,
          password,
          options: {
            userAttributes: {
              email,
              name,
              preferred_username: username,
            },
          },
        });

        await requestUserConfirmation({ username });
        await signIn({ username, password });
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (idToken) localStorage.setItem('token', idToken);

        showSuccess('Signed up and logged in successfully!');
      }
    } catch (error: any) {
      console.error(error);
      const msg =
        (typeof error === 'object' && error?.message?.trim()) || 'Something went wrong';
      showError(msg);
    }
  };

  return (
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

      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}
        <button className="submit-btn" type="submit">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
