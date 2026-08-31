import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatScore } from '../utils/formatters';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Keyboard, 
  RotateCcw, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export function LiveInterviewPage() {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    activeSession, 
    currentQuestion, 
    isAnalyzing, 
    lastEvaluation, 
    loadSession, 
    submitCandidateAnswer, 
    submitVoiceAnswer 
  } = useInterview();

  const [inputMode, setInputMode] = useState('text'); // 'text' or 'voice'
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);

  const {
    isRecording,
    audioBlob,
    recordingTime,
    volumeLevels,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder();

  useEffect(() => {
    if (sessionId && (!activeSession || activeSession.id !== Number(sessionId))) {
      loadSession(Number(sessionId));
    }
  }, [sessionId]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (inputMode === 'voice' && audioBlob) {
      const response = await submitVoiceAnswer(audioBlob, typedAnswer);
      if (response) {
        setCurrentFeedback(response);
        setShowFeedbackModal(true);
        resetRecording();
        setTypedAnswer('');
      }
    } else if (typedAnswer.trim().length > 0) {
      const response = await submitCandidateAnswer(typedAnswer);
      if (response) {
        setCurrentFeedback(response);
        setShowFeedbackModal(true);
        setTypedAnswer('');
      }
    } else {
      alert('Please type your answer or record your voice response before submitting.');
    }
  };

  const handleProceedToNext = () => {
    setShowFeedbackModal(false);
    if (currentFeedback && currentFeedback.isInterviewComplete) {
      navigate(`/result/${sessionId}`);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activeSession || !currentQuestion) {
    return (
      <div className="content-wrapper" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <LoadingSpinner message="Connecting to LangChain Orchestrator & Initializing Question..." />
      </div>
    );
  }

  const sequenceNum = currentQuestion.sequenceNumber || 1;
  const progressPct = ((sequenceNum - 1) / 5) * 100;

  return (
    <div className="content-wrapper" style={{ maxWidth: '920px' }}>
      
      {/* Session Top Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span>CANDIDATE: <strong style={{ color: '#fff' }}>{user?.name || 'Candidate'}</strong></span>
              <span>•</span>
              <span>ROLE: <strong style={{ color: '#22d3ee' }}>{activeSession.jobRole}</strong></span>
              <span>•</span>
              <span>TRACK: <strong style={{ color: '#c084fc' }}>{activeSession.interviewType}</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
              Question {sequenceNum} of 5
            </span>
            <DifficultyBadge difficulty={currentQuestion.difficulty || activeSession.currentDifficulty} />
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '6px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginTop: '1rem'
        }}>
          <div style={{
            height: '100%',
            width: `${Math.max(progressPct, 5)}%`,
            background: 'linear-gradient(90deg, #06b6d4 0%, #6366f1 100%)',
            borderRadius: '3px',
            transition: 'width 0.6s ease'
          }} />
        </div>
      </div>

      {/* Main Question & Answer Interface */}
      {isAnalyzing ? (
        <div className="glass-card" style={{ minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner message="Analyzing your response..." />
        </div>
      ) : (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Question Header & Category */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {currentQuestion.category || 'Technical'}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Topic: {currentQuestion.topic || 'General'}
              </span>
            </div>

            <h2 style={{
              fontSize: '1.35rem',
              color: '#ffffff',
              lineHeight: 1.5,
              fontWeight: 600,
              fontFamily: 'var(--font-primary)'
            }}>
              {currentQuestion.question}
            </h2>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '0.75rem'
          }}>
            <button
              type="button"
              className={`btn ${inputMode === 'text' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setInputMode('text')}
            >
              <Keyboard size={16} /> Type Answer
            </button>
            <button
              type="button"
              className={`btn ${inputMode === 'voice' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setInputMode('voice')}
            >
              <Mic size={16} /> Voice Answer (Whisper)
            </button>
          </div>

          {/* Text Input Mode */}
          {inputMode === 'text' && (
            <div>
              <textarea
                className="form-textarea"
                style={{ minHeight: '180px', fontSize: '0.95rem', lineHeight: '1.6' }}
                placeholder="Type your structured answer here. Cover technical principles, reasoning, and practical trade-offs..."
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {typedAnswer.split(/\s+/).filter(Boolean).length} words
                </span>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!typedAnswer.trim()}
                  style={{ padding: '0.75rem 1.75rem' }}
                >
                  <Send size={16} /> Submit Answer
                </button>
              </div>
            </div>
          )}

          {/* Voice Input Mode */}
          {inputMode === 'voice' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
              gap: '1.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: isRecording ? '#f43f5e' : '#94a3b8',
                  fontWeight: 700,
                  marginBottom: '0.5rem'
                }}>
                  {formatTimer(recordingTime)}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  {isRecording ? 'Listening... Speak clearly into your microphone.' : (audioBlob ? 'Audio captured! You can review or submit.' : 'Click to start voice recording.')}
                </span>
              </div>

              {/* Dynamic Wave Visualizer */}
              <AudioVisualizer isRecording={isRecording} volumeLevels={volumeLevels} />

              {/* Recording Controls */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {!isRecording ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={startRecording}
                    style={{
                      padding: '0.85rem 2rem',
                      background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
                    }}
                  >
                    <Mic size={18} /> {audioBlob ? 'Record Again' : 'Start Voice Answer'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger pulsing"
                    onClick={stopRecording}
                    style={{ padding: '0.85rem 2rem' }}
                  >
                    <MicOff size={18} /> Stop Recording
                  </button>
                )}

                {audioBlob && !isRecording && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSubmit}
                    style={{ padding: '0.85rem 2rem' }}
                  >
                    <Send size={18} /> Submit Voice Recording
                  </button>
                )}
              </div>

              {/* Optional Text Supplement for Voice */}
              <div style={{ width: '100%', maxWidth: '600px', marginTop: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>
                  Optional: Add text notes or switch to text if voice is noisy
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Optional text summary fallback..."
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                />
              </div>
            </div>
          )}

        </div>
      )}

      {/* Immediate Clean Score & Feedback Modal (No internal reasoning exposed) */}
      {showFeedbackModal && currentFeedback && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '550px',
            width: '100%',
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.2)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '2px solid #06b6d4',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22d3ee',
                fontSize: '1.5rem',
                fontWeight: 800,
                marginBottom: '0.75rem'
              }}>
                {formatScore(currentFeedback.score)}
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.25rem' }}>
                Question {sequenceNum} Evaluation
              </h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Next Difficulty Calibrated:
                </span>
                <DifficultyBadge difficulty={currentFeedback.nextDifficulty} />
              </div>
            </div>

            {/* Clean Short Feedback */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <strong style={{ fontSize: '0.85rem', color: '#38bdf8', display: 'block', marginBottom: '0.35rem' }}>
                Evaluation Feedback:
              </strong>
              <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {currentFeedback.feedback}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleProceedToNext}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {currentFeedback.isInterviewComplete ? (
                <>
                  View Complete Final Assessment <Sparkles size={18} />
                </>
              ) : (
                <>
                  Proceed to Next Question <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
