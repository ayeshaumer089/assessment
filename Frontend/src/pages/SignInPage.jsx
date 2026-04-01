import React, { useState } from 'react';
import { login } from '../services/auth';

const SignInPage = ({ goHome, goSignUp, openApp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login({ email, password });
      if (data?.accessToken) {
        localStorage.setItem('authToken', data.accessToken);
      }
      openApp('chat');
    } catch (err) {
      setError(err.message || 'Unable to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="signin-page" className="page active">
      <nav>
        <div className="logo" onClick={goHome}>
          <div className="logo-mark">
            <svg viewBox="0 0 14 14">
              <path d="M7 1 L13 7 L7 13 L1 7 Z" />
            </svg>
          </div>
          NexusAI
        </div>
      </nav>

      <section className="signin-wrap">
        <div className="signin-card">
          <h1>Sign In</h1>
          <p>Welcome back. Sign in to continue to your AI workspace.</p>
          <form className="signin-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Enter your password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error ? <div className="auth-error">{error}</div> : null}
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <button type="button" className="btn btn-ghost" onClick={goSignUp}>
            New here? Create an account
          </button>
          <button type="button" className="btn btn-ghost" onClick={goHome}>
            Back to Home
          </button>
        </div>
      </section>
    </div>
  );
};

export default SignInPage;
