import React, { useEffect, useRef, useState } from 'react';
import { getGoogleAuthConfig, googleAuth, login } from '../services/auth';
import { initGoogleSignIn, loadGoogleIdentityScript, renderGoogleButton } from '../services/googleIdentity';
import { setAuthToken } from '../services/session';
import { nxToast } from '../utils/helpers';
import AuthShell from '../components/auth/AuthShell';

const SignInPage = ({ goHome, goSignUp, openApp, postAuthTab = 'chat' }) => {
  const safePostAuthTab = ['chat', 'marketplace', 'agents', 'research'].includes(postAuthTab) ? postAuthTab : 'chat';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [error, setError] = useState('');
  const hasGoogleInitRef = useRef(false);
  const googleBtnRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login({ email, password });
      if (data?.accessToken) {
        setAuthToken(data.accessToken);
      }
      openApp(safePostAuthTab);
    } catch (err) {
      setError(err.message || 'Unable to sign in');
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
              setError(err.message || 'Google sign in failed');
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
      setError('Google sign in is not available right now. Check backend Google client configuration.');
    }
  };

  return (
    <div id="signin-page" className="page active">
      <AuthShell activeTab="signin" onSwitchTab={(tab) => (tab === 'signup' ? goSignUp() : null)} onClose={goHome}>
        <form className="nlr-form active" onSubmit={handleSubmit}>
          <div className="nlr-form-title">Welcome back</div>
          <div className="nlr-form-sub">Sign in to your NexusAI account to continue.</div>
          <div className="nlr-field">
            <label className="nlr-label" htmlFor="email">Email address</label>
            <input className="nlr-input" id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="nlr-field">
            <label className="nlr-label" htmlFor="password">Password</label>
            <input className="nlr-input" id="password" type="password" placeholder="Enter your password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="button" className="nlr-forgot" onClick={() => nxToast('Password reset flow coming soon')}>Forgot password?</button>
          {error ? <div className="auth-error" style={{ marginBottom: '0.75rem' }}>{error}</div> : null}
          <button type="submit" className="nlr-submit" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign in'}</button>
          <div className="nlr-divider">Or continue with</div>
          <div className="nlr-socials">
            <div className="nlr-google-wrap" onClick={handleGoogleClick}>
              <div ref={googleBtnRef} />
              {!isGoogleReady ? <button type="button" className="nlr-social-btn" disabled>Google</button> : null}
              {isGoogleLoading ? <span className="nlr-google-loading">Signing in...</span> : null}
            </div>
          </div>
          <div className="nlr-switch-text">Don't have an account? <button type="button" className="nlr-switch-link" onClick={goSignUp}>Create one →</button></div>
        </form>
      </AuthShell>
    </div>
  );
};

export default SignInPage;
