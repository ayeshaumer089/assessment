import { apiRequest } from './apiClient';

export function getChatResponse(key, payload = {}) {
  return apiRequest('/chat/respond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, payload }),
  });
}

