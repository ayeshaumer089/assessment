import React, { useState } from 'react';
import { register } from '../services/auth';
import { setAuthToken } from '../services/session';

const SignUpPage = ({ goHome, goSignIn, openApp }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const data = await register({ name, email, password, confirmPassword });
      if (data?.accessToken) {
        setAuthToken(data.accessToken);
      }
      openApp('chat');
    } catch (err) {
      setError(err.message || 'Unable to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="signup-page" className="page active">
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
          <h1>Create Account</h1>
          <p>Sign up to start using your AI workspace.</p>
          <form className="signin-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" placeholder="Minimum 8 characters" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label htmlFor="confirm-password">Confirm Password</label>
            <input id="confirm-password" type="password" placeholder="Repeat your password" minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            {error ? <div className="auth-error">{error}</div> : null}
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          <button type="button" className="btn btn-ghost" onClick={goSignIn}>
            Already have an account? Sign In
          </button>
          <button type="button" className="btn btn-ghost" onClick={goHome}>
            Back to Home
          </button>
        </div>
      </section>
    </div>
  );
};

export default SignUpPage;
