import { request } from './api';

export const adminService = {
  async getDashboard() {
    return request('/admin/dashboard');
  },

  async getCandidates() {
    return request('/admin/candidates');
  },

  async getInterviews() {
    return request('/admin/interviews');
  },

  async getReports() {
    return request('/admin/reports');
  }
};
