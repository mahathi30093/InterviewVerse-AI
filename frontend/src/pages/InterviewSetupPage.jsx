import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { JOB_ROLES, INTERVIEW_TYPES } from '../utils/constants';
import { PlayCircle, Sparkles, AlertCircle, CheckCircle2, Sliders, ShieldCheck, Cpu } from 'lucide-react';

export function InterviewSetupPage() {
  const [jobRole, setJobRole] = useState('Software Developer');
  const [interviewType, setInterviewType] = useState('Mixed');
  const [initialDifficulty, setInitialDifficulty] = useState('EASY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { startNewInterview } = useInterview();
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const session = await startNewInterview({
        jobRole,
        interviewType,
        initialDifficulty
      });
      navigate(`/live/${session.id}`);
    } catch (err) {
      setError(err.message || 'Failed to start interview session.');
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper" style={{ maxWidth: '850px' }}>
      <div className="glass-card">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          }}>
            <PlayCircle size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Setup Your Interview Session</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Configure your target domain and let the Orchestrator & Adaptive Agents curate your assessment.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#fb7185',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStart}>
          
          {/* Target Role Selection */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
              1. Select Target Job Role
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem',
              marginTop: '0.5rem'
            }}>
              {JOB_ROLES.map(role => (
                <div
                  key={role}
                  onClick={() => setJobRole(role)}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: jobRole === role ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${jobRole === role ? '#06b6d4' : 'rgba(255, 255, 255, 0.08)'}`,
                    color: jobRole === role ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.2s ease',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{role}</span>
                  {jobRole === role && <CheckCircle2 size={16} color="#06b6d4" />}
                </div>
              ))}
            </div>
          </div>

          {/* Interview Type Selection */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
              2. Select Assessment Track
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {INTERVIEW_TYPES.map(type => (
                <div
                  key={type.id}
                  onClick={() => setInterviewType(type.id)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: interviewType === type.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${interviewType === type.id ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ color: interviewType === type.id ? '#fff' : '#e2e8f0', fontSize: '0.95rem', display: 'block' }}>
                      {type.label}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {type.desc}
                    </span>
                  </div>
                  {interviewType === type.id && <CheckCircle2 size={18} color="#818cf8" />}
                </div>
              ))}
            </div>
          </div>

          {/* Starting Difficulty */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
              3. Starting Difficulty (Initial Baseline)
            </label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              {['EASY', 'MEDIUM', 'HARD'].map(diff => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setInitialDifficulty(diff)}
                  className={`btn ${initialDifficulty === diff ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  {diff}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.4rem' }}>
              * Difficulty dynamically scales after each answer based on your evaluation score.
            </span>
          </div>

          {/* Assessment Protocol Notice */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.06)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '2rem',
            fontSize: '0.85rem',
            color: '#cbd5e1'
          }}>
            <strong style={{ color: '#22d3ee', display: 'block', marginBottom: '0.25rem' }}>
              🤖 Agentic Session Rules:
            </strong>
            <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
              <li>5 sequential adaptive questions calibrated in real time.</li>
              <li>Scores $\ge 80\%$ trigger harder architectural questions; scores $&lt; 60\%$ provide foundational assistance.</li>
              <li>You may answer using <strong>Voice Recording (Whisper STT)</strong> or <strong>Text Input</strong>.</li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', fontWeight: 700 }}
          >
            {loading ? 'Initializing Agent Ecosystem...' : (
              <>
                <PlayCircle size={20} /> START ADAPTIVE INTERVIEW NOW
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
