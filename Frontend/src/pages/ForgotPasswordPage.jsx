import React, { useState } from 'react';
import AuthShell from '../components/auth/AuthShell';
import { forgotPassword } from '../services/auth';

const ForgotPasswordPage = ({ goHome, goSignIn, goSignUp }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const data = await forgotPassword({ email });
      setMessage(data?.message || 'If this email is registered, a reset link has been sent.');
    } catch (err) {
      setError(err.message || 'Unable to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="forgot-password-page" className="page active">
      <AuthShell activeTab="signin" onSwitchTab={(tab) => (tab === 'signup' ? goSignUp() : goSignIn())} onClose={goHome}>
        <form className="nlr-form active" onSubmit={handleSubmit}>
          <div className="nlr-form-title">Forgot Password</div>
          <div className="nlr-form-sub">Enter your email and we will send you a password reset link.</div>
          <div className="nlr-field">
            <label className="nlr-label" htmlFor="forgot-email">Email address</label>
            <input
              className="nlr-input"
              id="forgot-email"
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error ? <div className="auth-error" style={{ marginBottom: '0.75rem' }}>{error}</div> : null}
          {message ? <div style={{ marginBottom: '0.75rem', color: '#16a34a', fontSize: '0.9rem' }}>{message}</div> : null}
          <button type="submit" className="nlr-submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send reset link'}
          </button>
          <div className="nlr-switch-text">
            Remembered your password? <button type="button" className="nlr-switch-link" onClick={goSignIn}>Back to sign in →</button>
          </div>
        </form>
      </AuthShell>
    </div>
  );
};

export default ForgotPasswordPage;
