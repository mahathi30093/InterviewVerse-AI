import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { ScoreCard } from '../components/ScoreCard';
import { ReadinessBadge } from '../components/ReadinessBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatScore } from '../utils/formatters';
import { 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Eye, 
  Search, 
  ShieldCheck,
  FileText
} from 'lucide-react';

export function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await adminService.getDashboard();
        setDashboard(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <LoadingSpinner message="Aggregating Enterprise Admin Metrics..." />;

  const stats = dashboard || {
    totalCandidates: 2,
    completedInterviews: 1,
    averageScore: 82.5,
    jobReadyCount: 1,
    needsImprovementCount: 0,
    candidateTable: []
  };

  const filteredCandidates = (stats.candidateTable || []).filter(c => {
    return c.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
           c.email?.toLowerCase().includes(search.toLowerCase()) ||
           c.jobRole?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ShieldCheck size={18} color="#c084fc" />
            <span style={{ fontSize: '0.85rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>
              Admin Operations Center
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: '#fff' }}>Interview Assessment Oversight</h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Monitor candidate performance, skill distributions, and career readiness across all job tracks.
          </p>
        </div>

        <Link to="/reports" className="btn btn-secondary">
          <FileText size={16} /> View Exportable Reports
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid-4">
        <ScoreCard
          title="Total Candidates"
          score={stats.totalCandidates}
          subtitle="Registered talent pool"
          icon={Users}
          color="#38bdf8"
        />
        <ScoreCard
          title="Completed Interviews"
          score={stats.completedInterviews}
          subtitle="Multi-agent sessions finished"
          icon={CheckCircle}
          color="#818cf8"
        />
        <ScoreCard
          title="Average Score"
          score={stats.averageScore}
          subtitle="Overall cohort baseline"
          icon={TrendingUp}
          color="#34d399"
        />
        <ScoreCard
          title="Job Ready Candidates"
          score={stats.jobReadyCount}
          subtitle="Score >= 80% benchmark"
          icon={Award}
          color="#fbbf24"
        />
      </div>

      {/* Candidate Performance Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Candidate Evaluation Roster</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Multi-competency scores and readiness levels</span>
          </div>

          <div style={{ width: '280px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search candidate name, email, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job Role</th>
                <th>Interview Track</th>
                <th>Technical</th>
                <th>Problem Solving</th>
                <th>Communication</th>
                <th>Behavioral</th>
                <th>Overall</th>
                <th>Readiness</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((c) => (
                <tr key={c.candidateId}>
                  <td>
                    <div>
                      <strong style={{ color: '#fff', display: 'block' }}>{c.candidateName}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.email}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.jobRole}</td>
                  <td>{c.lastInterviewType || 'Mixed'}</td>
                  <td>{formatScore(c.technicalScore)}%</td>
                  <td>{formatScore(c.problemSolvingScore)}%</td>
                  <td>{formatScore(c.communicationScore)}%</td>
                  <td>{formatScore(c.behavioralScore)}%</td>
                  <td style={{ fontWeight: 700, color: '#38bdf8' }}>{formatScore(c.overallScore)}%</td>
                  <td><ReadinessBadge level={c.readinessLevel} /></td>
                  <td>
                    <Link
                      to={c.lastSessionId ? `/result/${c.lastSessionId}` : `/admin/candidate/${c.candidateId}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <Eye size={14} /> Open Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
