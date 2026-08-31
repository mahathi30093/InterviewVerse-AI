import React, { createContext, useContext, useState } from 'react';
import { interviewService } from '../services/interviewService';

const InterviewContext = createContext(null);

export function InterviewProvider({ children }) {
  const [activeSession, setActiveSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const startNewInterview = async (setupData) => {
    setIsAnalyzing(true);
    try {
      const session = await interviewService.startInterview(setupData);
      setActiveSession(session);
      if (session.questions && session.questions.length > 0) {
        setCurrentQuestion(session.questions[0]);
      }
      setQuestionHistory([]);
      setLastEvaluation(null);
      setAssessmentResult(null);
      return session;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const submitCandidateAnswer = async (answerText) => {
    if (!activeSession || !currentQuestion) return;
    setIsAnalyzing(true);
    try {
      const response = await interviewService.submitAnswer(
        activeSession.id,
        currentQuestion.id,
        answerText
      );

      setLastEvaluation(response);
      setQuestionHistory(prev => [
        ...prev,
        {
          ...currentQuestion,
          candidateAnswer: answerText,
          score: response.score,
          feedback: response.feedback,
          strengths: response.strengths,
          weaknesses: response.weaknesses
        }
      ]);

      if (response.nextQuestion && !response.isInterviewComplete) {
        setCurrentQuestion(response.nextQuestion);
      } else {
        // Fetch completed assessment
        const assessment = await interviewService.getAssessment(activeSession.id);
        setAssessmentResult(assessment);
      }

      return response;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const submitVoiceAnswer = async (audioBlob, fallbackText = '') => {
    if (!activeSession || !currentQuestion) return;
    setIsAnalyzing(true);
    try {
      const response = await interviewService.submitVoiceAnswer(
        activeSession.id,
        currentQuestion.id,
        audioBlob,
        fallbackText
      );

      setLastEvaluation(response);
      setQuestionHistory(prev => [
        ...prev,
        {
          ...currentQuestion,
          candidateAnswer: fallbackText || 'Voice Answer',
          score: response.score,
          feedback: response.feedback,
          strengths: response.strengths,
          weaknesses: response.weaknesses
        }
      ]);

      if (response.nextQuestion && !response.isInterviewComplete) {
        setCurrentQuestion(response.nextQuestion);
      } else {
        const assessment = await interviewService.getAssessment(activeSession.id);
        setAssessmentResult(assessment);
      }

      return response;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSession = async (sessionId) => {
    setIsAnalyzing(true);
    try {
      const session = await interviewService.getSession(sessionId);
      setActiveSession(session);
      if (session.status === 'COMPLETED') {
        const assessment = await interviewService.getAssessment(sessionId);
        setAssessmentResult(assessment);
      }
      return session;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <InterviewContext.Provider value={{
      activeSession,
      currentQuestion,
      questionHistory,
      lastEvaluation,
      isAnalyzing,
      assessmentResult,
      startNewInterview,
      submitCandidateAnswer,
      submitVoiceAnswer,
      loadSession,
      setActiveSession,
      setCurrentQuestion
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
