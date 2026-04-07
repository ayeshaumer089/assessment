import { apiRequest } from './apiClient';

export function subscribeEmail(email) {
  return apiRequest('/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

