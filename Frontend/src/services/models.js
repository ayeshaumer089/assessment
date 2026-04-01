const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function fetchModels() {
  const response = await fetch(`${API_BASE_URL}/models`);
  if (!response.ok) {
    throw new Error('Unable to fetch models');
  }
  return response.json();
}
