import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { candidateService } from '../services/candidateService';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatScore, formatDate } from '../utils/formatters';
import { History, PlayCircle, Eye, Search, Filter } from 'lucide-react';

export function InterviewHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    async function load() {
      try {
        const data = await candidateService.getHistory();
        setHistory(data || []);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Loading Session History..." />;

  const filteredHistory = history.filter(s => {
    const matchesSearch = s.jobRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.interviewType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || s.jobRole === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <History size={18} color="#06b6d4" />
            <span style={{ fontSize: '0.85rem', color: '#22d3ee', fontWeight: 700, textTransform: 'uppercase' }}>
              Historical Archives
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#fff' }}>Interview Session History</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Review past adaptive interview recordings, question trajectories, and multi-skill evaluations.
          </p>
        </div>

        <Link to="/setup" className="btn btn-primary">
          <PlayCircle size={18} /> Start New Interview
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by role or interview track..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ width: '220px' }}>
          <select
            className="form-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="ALL">All Job Roles</option>
            <option value="Software Developer">Software Developer</option>
            <option value="Python Developer">Python Developer</option>
            <option value="Java Developer">Java Developer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Machine Learning Engineer">Machine Learning Engineer</option>
            <option value="Web Developer">Web Developer</option>
          </select>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="glass-card">
        {filteredHistory.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Date & Time</th>
                  <th>Job Role</th>
                  <th>Assessment Track</th>
                  <th>Final Difficulty</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>#{s.id}</td>
                    <td>{formatDate(s.startedAt)}</td>
                    <td style={{ fontWeight: 600, color: '#f8fafc' }}>{s.jobRole}</td>
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
                        <Eye size={14} /> {s.status === 'COMPLETED' ? 'View Report' : 'Resume'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <p>No interview sessions match your filter.</p>
          </div>
        )}
      </div>

    </div>
  );
}
