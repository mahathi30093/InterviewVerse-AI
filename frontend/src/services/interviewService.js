import { request } from './api';

export const interviewService = {
  async startInterview(data = {}) {
    return request('/interviews/start', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getSession(sessionId) {
    return request(`/interviews/${sessionId}`);
  },

  async submitAnswer(sessionId, questionId, answerText) {
    return request(`/interviews/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ questionId, answerText })
    });
  },

  async submitVoiceAnswer(sessionId, questionId, audioBlob, fallbackText = '') {
    const formData = new FormData();
    formData.append('questionId', questionId);
    if (audioBlob) {
      formData.append('file', audioBlob, 'recording.wav');
    }
    if (fallbackText) {
      formData.append('fallbackText', fallbackText);
    }

    return request(`/interviews/${sessionId}/voice-answer`, {
      method: 'POST',
      body: formData
    });
  },

  async completeInterview(sessionId) {
    return request(`/interviews/${sessionId}/complete`, {
      method: 'POST'
    });
  },

  async getAssessment(sessionId) {
    return request(`/assessments/${sessionId}`);
  },

  async getSkillAssessment(sessionId) {
    return request(`/assessments/${sessionId}/skills`);
  },

  async getCareerReadiness(sessionId) {
    return request(`/assessments/${sessionId}/career-readiness`);
  }
};
