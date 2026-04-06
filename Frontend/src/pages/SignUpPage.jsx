import React, { useEffect, useRef, useState } from 'react';
import { getGoogleAuthConfig, googleAuth, register } from '../services/auth';
import { initGoogleSignIn, loadGoogleIdentityScript, renderGoogleButton } from '../services/googleIdentity';
import { setAuthToken } from '../services/session';
import { nxToast } from '../utils/helpers';
import AuthShell from '../components/auth/AuthShell';

const SignUpPage = ({ goHome, goSignIn, openApp, postAuthTab = 'chat' }) => {
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
      openApp(postAuthTab);
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
              openApp(postAuthTab);
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
  }, [openApp, postAuthTab]);

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
            <button type="button" className="nlr-social-btn" onClick={() => nxToast('GitHub auth coming soon')}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
            <button type="button" className="nlr-social-btn" onClick={() => nxToast('Microsoft auth coming soon')}>
              <svg viewBox="0 0 24 24" fill="#00A4EF"><path d="M11.4 24H0V12.6L11.4 0h1.2v11.4H24v1.2H12.6V24h-1.2z"/></svg>
              Microsoft
            </button>
          </div>
          <div className="nlr-switch-text">Already have an account? <button type="button" className="nlr-switch-link" onClick={goSignIn}>Sign in →</button></div>
        </form>
      </AuthShell>
    </div>
  );
};

export default SignUpPage;
