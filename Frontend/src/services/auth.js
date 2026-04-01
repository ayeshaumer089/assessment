const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, payload, token) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message;
    throw new Error(Array.isArray(message) ? message.join(', ') : message || 'Request failed');
  }

  return data;
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
