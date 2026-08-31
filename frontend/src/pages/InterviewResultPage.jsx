import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { interviewService } from '../services/interviewService';
import { ScoreCard } from '../components/ScoreCard';
import { ReadinessBadge } from '../components/ReadinessBadge';
import { SkillRadarChart } from '../components/SkillRadarChart';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatScore } from '../utils/formatters';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  ArrowRight, 
  Printer, 
  RotateCcw, 
  TrendingUp, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export function InterviewResultPage() {
  const { id: sessionId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await interviewService.getAssessment(sessionId);
        setAssessment(data);
      } catch (err) {
        console.error('Failed to load assessment report:', err);
      } finally {
        setLoading(false);
      }
    }
    if (sessionId) loadData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="content-wrapper" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <LoadingSpinner message="Synthesizing Multi-Agent Skill Profile & Career Readiness Report..." />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="content-wrapper" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ color: '#94a3b8' }}>Assessment record not found.</p>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const skills = assessment.skillAssessment || {};
  const career = assessment.careerReadiness || {};
  const gaps = assessment.skillGaps || [];
  const strengths = career.strengths || skills.strengths || ['Solid programming foundation'];
  const weaknesses = career.weaknesses || skills.weaknesses || ['Edge-case analysis'];
  const recommendations = career.recommendations || [
    'Focus on hands-on distributed microservices architectures',
    'Practice explaining algorithm trade-offs concisely'
  ];

  return (
    <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.2) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Sparkles size={16} color="#22d3ee" />
            <span style={{ fontSize: '0.85rem', color: '#22d3ee', fontWeight: 700, textTransform: 'uppercase' }}>
              Official Assessment Report
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.25rem' }}>
            {assessment.candidateName}'s Results
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Role: <strong>{assessment.jobRole}</strong> • Track: <strong>{assessment.interviewType}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
              Readiness Status
            </span>
            <ReadinessBadge level={career.readinessLevel || 'INTERVIEW READY'} />
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.print()}
            style={{ padding: '0.75rem 1.25rem' }}
          >
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* KPI Scores Row */}
      <div className="grid-4">
        <ScoreCard
          title="Overall Readiness Score"
          score={career.readinessScore || assessment.overallScore}
          subtitle="Formula: 35% Tech + 25% Prob + 20% Comm + 20% Beh"
          icon={Award}
          color="#38bdf8"
        />
        <ScoreCard
          title="Technical Depth"
          score={skills.technicalScore}
          subtitle="Domain syntax & fundamentals"
          icon={TrendingUp}
          color="#06b6d4"
        />
        <ScoreCard
          title="Problem Solving"
          score={skills.problemSolvingScore}
          subtitle="System design & complexity"
          icon={TrendingUp}
          color="#6366f1"
        />
        <ScoreCard
          title="Communication & Behavior"
          score={((Number(skills.communicationScore || 0) + Number(skills.behavioralScore || 0)) / 2)}
          subtitle="Clarity, STAR structure & poise"
          icon={TrendingUp}
          color="#10b981"
        />
      </div>

      {/* Radar Matrix + Actionable Recommendations */}
      <div className="grid-2">
        <SkillRadarChart
          technical={skills.technicalScore}
          problemSolving={skills.problemSolvingScore}
          communication={skills.communicationScore}
          behavioral={skills.behavioralScore}
        />

        {/* Actionable Career Recommendations */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Personalized Career Roadmap</h3>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Career Agent</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recommendations.map((rec, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '0.9rem',
                  display: 'flex',
                  gap: '0.75rem'
                }}
              >
                <Target size={20} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                  {rec}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
            <Link to="/setup" className="btn btn-primary" style={{ flex: 1 }}>
              <RotateCcw size={16} /> Retake Assessment
            </Link>
            <Link to="/dashboard" className="btn btn-secondary" style={{ flex: 1 }}>
              Candidate Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Breakdown */}
      <div className="grid-2">
        {/* Strengths */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={20} color="#34d399" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399' }}>Demonstrated Strengths</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {strengths.map((str, i) => (
              <li
                key={i}
                style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.88rem',
                  color: '#e2e8f0'
                }}
              >
                • {str}
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Areas / Weaknesses */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertTriangle size={20} color="#fbbf24" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fbbf24' }}>Identified Growth Areas</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {weaknesses.map((wk, i) => (
              <li
                key={i}
                style={{
                  background: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.88rem',
                  color: '#e2e8f0'
                }}
              >
                • {wk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Target Skill Gaps Table */}
      {gaps.length > 0 && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Detected Skill Gaps & Development Targets
          </h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Competency / Topic</th>
                  <th>Current Level</th>
                  <th>Target Level</th>
                  <th>Recommended Learning Action</th>
                </tr>
              </thead>
              <tbody>
                {gaps.map((g, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: '#22d3ee' }}>{g.skillName}</td>
                    <td>
                      <span className="badge badge-medium">{g.currentLevel}</span>
                    </td>
                    <td>
                      <span className="badge badge-easy">{g.targetLevel}</span>
                    </td>
                    <td style={{ color: '#cbd5e1' }}>{g.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Question Trajectory Breakdown */}
      {assessment.questions && assessment.questions.length > 0 && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Adaptive Question Trajectory & Scoring
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {assessment.questions.map((q, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>
                    QUESTION {q.sequenceNumber} ({q.category} • {q.difficulty})
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                    {formatScore(q.score)} / 100
                  </span>
                </div>
                <p style={{ color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>{q.question}</p>
                {q.candidateAnswer && (
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                    "{q.candidateAnswer}"
                  </p>
                )}
                {q.feedback && (
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', background: 'rgba(6, 182, 212, 0.06)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                    <strong style={{ color: '#22d3ee' }}>Feedback: </strong>{q.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
