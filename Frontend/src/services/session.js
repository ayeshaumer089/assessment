const AUTH_TOKEN_KEY = 'authToken';
const ONBOARDING_KEY = '_obDone';

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function getOnboardingDone() {
  return localStorage.getItem(ONBOARDING_KEY);
}

export function setOnboardingDone() {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}
