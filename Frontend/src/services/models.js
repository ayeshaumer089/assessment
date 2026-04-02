import { apiRequest } from './apiClient';

export async function fetchModels(signal) {
  return apiRequest('/models', { 
    signal,
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
}
