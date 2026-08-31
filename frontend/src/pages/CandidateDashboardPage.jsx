import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { candidateService } from '../services/candidateService';
import { ScoreCard } from '../components/ScoreCard';
import { ReadinessBadge } from '../components/ReadinessBadge';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { SkillRadarChart } from '../components/SkillRadarChart';
import { formatScore, formatDate } from '../utils/formatters';
import { 
  PlayCircle, 
  History, 
  Award, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export function CandidateDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, histData] = await Promise.all([
          candidateService.getProfile(),
          candidateService.getHistory()
        ]);
        setProfile(profData);
        setHistory(histData || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute summary stats
  const totalInterviews = history.length;
  const completedSessions = history.filter(s => s.status === 'COMPLETED');
  const scores = completedSessions.map(s => Number(s.overallScore) || 0).filter(s => s > 0);
  const averageScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

  // Most recent session
  const lastSession = completedSessions.length > 0 ? completedSessions[0] : null;
  const currentReadiness = lastSession && lastSession.careerReadiness
    ? lastSession.careerReadiness.readinessLevel
    : (averageScore >= 80 ? 'JOB READY' : (averageScore >= 60 ? 'INTERVIEW READY' : (averageScore >= 40 ? 'BEGINNER READY' : 'NOT READY')));

  // Latest skill scores
  const lastSkills = lastSession && lastSession.skillAssessment ? lastSession.skillAssessment : {
    technicalScore: averageScore || 75,
    problemSolvingScore: averageScore || 70,
    communicationScore: averageScore || 78,
    behavioralScore: averageScore || 80
  };

  return (
    <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#22d3ee', fontWeight: 600 }}>CANDIDATE PORTAL</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Target: {profile?.targetRole || 'Software Developer'}</span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>
            Welcome, <span className="gradient-text">{user?.name || 'Candidate'}</span>
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Track your adaptive interview progress, competency growth, and job-readiness milestones.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/setup" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
            <PlayCircle size={18} /> Start New Interview
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid-4">
        <ScoreCard
          title="Total Interviews"
          score={totalInterviews}
          subtitle="Completed mock assessments"
          icon={History}
          color="#38bdf8"
        />
        <ScoreCard
          title="Average Score"
          score={averageScore}
          subtitle="Across all evaluations"
          icon={TrendingUp}
          color="#34d399"
        />
        <ScoreCard
          title="Best Score"
          score={bestScore}
          subtitle="Peak performance record"
          icon={Award}
          color="#fbbf24"
        />
        
        {/* Career Readiness Badge Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Readiness
          </span>
          <div style={{ margin: '0.5rem 0' }}>
            <ReadinessBadge level={currentReadiness} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Calculated via LangChain Agent
          </span>
        </div>
      </div>

      {/* Main Grid: Skills Chart + Recommendations */}
      <div className="grid-2">
        <SkillRadarChart
          technical={lastSkills.technicalScore}
          problemSolving={lastSkills.problemSolvingScore}
          communication={lastSkills.communicationScore}
          behavioral={lastSkills.behavioralScore}
        />

        {/* Recommended Improvements Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Personalized Next Steps</h3>
            <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 600 }}>AI Guidance</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '0.9rem',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#f8fafc', display: 'block' }}>
                  Target System Architecture & Scalability
                </strong>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Practice distributed rate-limiting and asynchronous event architectures to bridge to Job Ready.
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '0.9rem',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <BookOpen size={20} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#f8fafc', display: 'block' }}>
                  STAR-Format Behavioral Structuring
                </strong>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Elaborate on quantified resolution metrics during conflict and deadline management scenarios.
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '0.9rem',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <Target size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#f8fafc', display: 'block' }}>
                  Voice Practice Rounds
                </strong>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Use Whisper voice recording mode to build conversational fluidity and confidence under pressure.
                </p>
              </div>
            </div>
          </div>

          <Link to="/setup" className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
            Launch Targeted Mock Session <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Recent Interviews Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Interview Sessions</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>History of adaptive assessments</span>
          </div>
          <Link to="/history" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#06b6d4' }}>
            View All History →
          </Link>
        </div>

        {history.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Job Role</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map((s) => (
                  <tr key={s.id}>
                    <td>{formatDate(s.startedAt)}</td>
                    <td style={{ fontWeight: 600 }}>{s.jobRole}</td>
                    <td>{s.interviewType}</td>
                    <td><DifficultyBadge difficulty={s.currentDifficulty} /></td>
                    <td style={{ fontWeight: 700, color: '#38bdf8' }}>{formatScore(s.overallScore)}%</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: s.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: s.status === 'COMPLETED' ? '#34d399' : '#fbbf24'
                      }}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={s.status === 'COMPLETED' ? `/result/${s.id}` : `/live/${s.id}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        {s.status === 'COMPLETED' ? 'View Report' : 'Resume'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
            <p>No interview sessions recorded yet.</p>
            <Link to="/setup" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Start Your First Interview
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
