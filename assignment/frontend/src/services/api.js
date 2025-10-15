import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Overlay CRUD operations
  async getOverlays() {
    try {
      const response = await api.get('/overlays');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch overlays');
    }
  },

  async getOverlay(id) {
    try {
      const response = await api.get(`/overlays/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch overlay');
    }
  },

  async saveOverlay(overlay) {
    try {
      const response = await api.post('/overlays', overlay);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to save overlay');
    }
  },

  async updateOverlay(id, overlay) {
    try {
      const response = await api.put(`/overlays/${id}`, overlay);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update overlay');
    }
  },

  async deleteOverlay(id) {
    try {
      const response = await api.delete(`/overlays/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete overlay');
    }
  },

  // Stream operations
  async startStream(rtspUrl) {
    try {
      const response = await api.post('/stream/start', { rtspUrl });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to start stream');
    }
  },

  async stopStream() {
    try {
      const response = await api.post('/stream/stop');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to stop stream');
    }
  },

  async getStreamStatus() {
    try {
      const response = await api.get('/stream/status');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get stream status');
    }
  },
};

export default api;