import { apiRequest } from './apiClient';

async function request(path, payload, token) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return apiRequest(path, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return request('/auth/login', payload);
}

export function register(payload) {
  return request('/auth/register', payload);
}

export function logout(token) {
  return request('/auth/logout', {}, token);
}

export function googleAuth(credential) {
  return request('/auth/google', { credential });
}

export function getGoogleAuthConfig() {
  return apiRequest('/auth/google/config', {
    method: 'GET',
  });
}