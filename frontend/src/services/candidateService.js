import { request } from './api';

export const candidateService = {
  async getProfile() {
    return request('/candidates/profile');
  },

  async updateProfile(profileData) {
    return request('/candidates/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async getHistory() {
    return request('/candidates/history');
  }
};
