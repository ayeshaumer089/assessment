import { apiRequest } from './apiClient';

export async function fetchModels() {
  return apiRequest('/models');
}
