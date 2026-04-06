import React, { useEffect, useRef, useState } from 'react';
import { getGoogleAuthConfig, googleAuth, register } from '../services/auth';
import { initGoogleSignIn, loadGoogleIdentityScript, renderGoogleButton } from '../services/googleIdentity';
import { setAuthToken } from '../services/session';
import AuthShell from '../components/auth/AuthShell';

const SignUpPage = ({ goHome, goSignIn, openApp, postAuthTab = 'chat' }) => {
  const safePostAuthTab = ['chat', 'marketplace', 'agents', 'research'].includes(postAuthTab) ? postAuthTab : 'chat';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [error, setError] = useState('');
  const hasGoogleInitRef = useRef(false);
  const googleBtnRef = useRef(null);

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
      openApp(safePostAuthTab);
    } catch (err) {
      setError(err.message || 'Unable to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const setupGoogle = async () => {
      try {
        const config = await getGoogleAuthConfig();
        if (!config?.enabled || !config?.clientId || cancelled) return;

        await loadGoogleIdentityScript();
        if (cancelled) return;

        initGoogleSignIn({
          clientId: config.clientId,
          onCredential: async (credential) => {
            try {
              setError('');
              setIsGoogleLoading(true);
              const data = await googleAuth(credential);
              if (data?.accessToken) {
                setAuthToken(data.accessToken);
              }
              openApp(safePostAuthTab);
            } catch (err) {
              setError(err.message || 'Google sign up failed');
            } finally {
              setIsGoogleLoading(false);
            }
          },
        });
        hasGoogleInitRef.current = true;
        renderGoogleButton(googleBtnRef.current);
        setIsGoogleReady(true);
      } catch {
        // Keep classic auth fully usable if Google script/config fails.
      }
    };

    setupGoogle();
    return () => {
      cancelled = true;
    };
  }, [openApp, safePostAuthTab]);

  const handleGoogleClick = () => {
    if (!hasGoogleInitRef.current || !window.google?.accounts?.id) {
      setError('Google sign up is not available right now. Check backend Google client configuration.');
    }
  };

  return (
    <div id="signup-page" className="page active">
      <AuthShell activeTab="signup" onSwitchTab={(tab) => (tab === 'signin' ? goSignIn() : null)} onClose={goHome}>
        <form className="nlr-form active" onSubmit={handleSubmit}>
          <div className="nlr-form-title">Create your account</div>
          <div className="nlr-form-sub">Get started with NexusAI — it's free.</div>
          <div className="nlr-field">
            <label className="nlr-label" htmlFor="name">Full name</label>
            <input className="nlr-input" id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="nlr-field">
            <label className="nlr-label" htmlFor="signup-email">Email address</label>
            <input className="nlr-input" id="signup-email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="nlr-field">
            <label className="nlr-label" htmlFor="signup-password">Password</label>
            <input className="nlr-input" id="signup-password" type="password" placeholder="Create a strong password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="nlr-field">
            <label className="nlr-label" htmlFor="confirm-password">Confirm password</label>
            <input className="nlr-input" id="confirm-password" type="password" placeholder="Confirm your password" minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {error ? <div className="auth-error" style={{ marginBottom: '0.75rem' }}>{error}</div> : null}
          <button type="submit" className="nlr-submit" disabled={isLoading}>{isLoading ? 'Creating account...' : 'Create account'}</button>
          <div className="nlr-divider">Or continue with</div>
          <div className="nlr-socials">
            <div className="nlr-google-wrap" onClick={handleGoogleClick}>
              <div ref={googleBtnRef} />
              {!isGoogleReady ? <button type="button" className="nlr-social-btn" disabled>Google</button> : null}
              {isGoogleLoading ? <span className="nlr-google-loading">Creating account...</span> : null}
            </div>
          </div>
          <div className="nlr-switch-text">Already have an account? <button type="button" className="nlr-switch-link" onClick={goSignIn}>Sign in →</button></div>
        </form>
      </AuthShell>
    </div>
  );
};

export default SignUpPage;
