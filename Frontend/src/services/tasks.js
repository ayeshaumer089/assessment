import { apiRequest } from './apiClient';
import { getAuthToken } from './session';

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function fetchTasks(signal) {
  return apiRequest('/tasks', {
    method: 'GET',
    signal,
    headers: authHeaders(),
  });
}

export function createTask(name) {
  return apiRequest('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ name }),
  });
}

export function updateTask(taskId, payload) {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
}

export function duplicateTask(taskId) {
  return apiRequest(`/tasks/${taskId}/duplicate`, {
    method: 'POST',
    headers: authHeaders(),
  });
}

export function deleteTask(taskId) {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

