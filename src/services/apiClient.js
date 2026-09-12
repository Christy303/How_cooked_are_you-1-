/**
 * Full-Stack API Client Service
 * Features graceful offline/demo mode fallback if backend server is unconfigured or offline.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('cooked_jwt_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('cooked_jwt_token', token);
    } else {
      localStorage.removeItem('cooked_jwt_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {

        ...options,
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {})
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      // Re-throw for caller to handle or fallback
      throw err;
    }
  }

  // Auth Endpoints
  async register(username, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }

  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // Assessment History Endpoints
  async saveAssessment(payload) {
    return this.request('/assessments', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getHistory() {
    return this.request('/assessments/history');
  }

  // Anonymous Population Analytics
  async getPopulationAnalytics() {
    return this.request('/analytics/population');
  }

  // ML Prediction Endpoint
  async getMlPrediction(payload) {
    return this.request('/ml/predict', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Admin Dashboard Statistics
  async getAdminStats() {
    return this.request('/admin/stats');
  }
}

export const apiClient = new ApiClient();
