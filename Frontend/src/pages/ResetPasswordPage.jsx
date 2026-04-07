import React, { useMemo, useState } from 'react';
import AuthShell from '../components/auth/AuthShell';
import { resetPassword } from '../services/auth';

const ResetPasswordPage = ({ goHome, goSignIn, goSignUp, token: initialToken = '' }) => {
  const [token] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isTokenMissing = useMemo(() => !token, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const data = await resetPassword({ token, newPassword, confirmPassword });
      setMessage(data?.message || 'Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Unable to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="reset-password-page" className="page active">
      <AuthShell activeTab="signin" onSwitchTab={(tab) => (tab === 'signup' ? goSignUp() : goSignIn())} onClose={goHome}>
        <form className="nlr-form active" onSubmit={handleSubmit}>
          <div className="nlr-form-title">Reset Password</div>
          <div className="nlr-form-sub">Set a new password for your account.</div>
          {isTokenMissing ? (
            <div className="auth-error" style={{ marginBottom: '0.75rem' }}>
              Reset token is missing or invalid. Please request a new reset link.
            </div>
          ) : null}
          <div className="nlr-field">
            <label className="nlr-label" htmlFor="new-password">New password</label>
            <input
              className="nlr-input"
              id="new-password"
              type="password"
              minLength={8}
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isTokenMissing}
            />
          </div>
          <div className="nlr-field">
            <label className="nlr-label" htmlFor="confirm-new-password">Confirm new password</label>
            <input
              className="nlr-input"
              id="confirm-new-password"
              type="password"
              minLength={8}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isTokenMissing}
            />
          </div>
          {error ? <div className="auth-error" style={{ marginBottom: '0.75rem' }}>{error}</div> : null}
          {message ? <div style={{ marginBottom: '0.75rem', color: '#16a34a', fontSize: '0.9rem' }}>{message}</div> : null}
          <button type="submit" className="nlr-submit" disabled={isLoading || isTokenMissing}>
            {isLoading ? 'Saving...' : 'Save new password'}
          </button>
          <div className="nlr-switch-text">
            Done? <button type="button" className="nlr-switch-link" onClick={goSignIn}>Go to sign in →</button>
          </div>
        </form>
      </AuthShell>
    </div>
  );
};

export default ResetPasswordPage;
