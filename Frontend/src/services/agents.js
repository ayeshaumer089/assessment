import { apiRequest } from './apiClient';
import { getAuthToken } from './session';

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function fetchAgentTemplates(signal) {
  return apiRequest('/agents/templates', {
    method: 'GET',
    signal,
    headers: authHeaders(),
  });
}

export function createAgent(payload) {
  return apiRequest('/agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
}

export function updateAgent(agentId, payload) {
  return apiRequest(`/agents/${agentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
}

