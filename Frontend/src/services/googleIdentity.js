const GOOGLE_SCRIPT_ID = 'google-identity-services';
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

function hasGoogleApi() {
  return Boolean(window.google?.accounts?.id);
}

export function loadGoogleIdentityScript() {
  return new Promise((resolve, reject) => {
    if (hasGoogleApi()) {
      resolve();
      return;
    }

    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Google script')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(script);
  });
}

export function initGoogleSignIn({ clientId, onCredential }) {
  if (!hasGoogleApi()) {
    throw new Error('Google Identity API not loaded');
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response?.credential) {
        onCredential(response.credential);
      }
    },
  });
}

export function renderGoogleButton(container, theme = 'outline') {
  if (!container || !hasGoogleApi()) {
    return;
  }
  container.innerHTML = '';
  window.google.accounts.id.renderButton(container, {
    theme,
    size: 'large',
    width: 240,
    text: 'continue_with',
    shape: 'pill',
  });
}

