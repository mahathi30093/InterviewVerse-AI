import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { ScoreCard } from '../components/ScoreCard';
import { ReadinessBadge } from '../components/ReadinessBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatScore } from '../utils/formatters';
import { Printer, FileText, Award, Users, CheckCircle, TrendingUp } from 'lucide-react';

export function ReportsPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminService.getReports();
        setDashboard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Generating Official Assessment Reports..." />;

  const stats = dashboard || {};
  const table = stats.candidateTable || [];

  return (
    <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <FileText size={18} color="#06b6d4" />
            <span style={{ fontSize: '0.85rem', color: '#22d3ee', fontWeight: 700, textTransform: 'uppercase' }}>
              Executive Analytics
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#fff' }}>Candidate Readiness Assessment Summary</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Aggregated institutional report for hiring readiness, competency gaps, and cohort benchmarks.
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          <Printer size={16} /> Print Full Report
        </button>
      </div>

      {/* Cohort Stats */}
      <div className="grid-4">
        <ScoreCard title="Total Candidates" score={stats.totalCandidates || 0} icon={Users} color="#38bdf8" />
        <ScoreCard title="Completed Sessions" score={stats.completedInterviews || 0} icon={CheckCircle} color="#818cf8" />
        <ScoreCard title="Cohort Average" score={stats.averageScore || 0} icon={TrendingUp} color="#34d399" />
        <ScoreCard title="Job Ready Ratio" score={stats.jobReadyCount || 0} icon={Award} color="#fbbf24" />
      </div>

      {/* Full Institutional Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Candidate Evaluation Breakdown</h3>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Target Job Role</th>
                <th>Technical</th>
                <th>Problem Solving</th>
                <th>Communication</th>
                <th>Behavioral</th>
                <th>Overall Score</th>
                <th>Readiness Level</th>
              </tr>
            </thead>
            <tbody>
              {table.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{c.candidateName}</td>
                  <td>{c.jobRole}</td>
                  <td>{formatScore(c.technicalScore)}%</td>
                  <td>{formatScore(c.problemSolvingScore)}%</td>
                  <td>{formatScore(c.communicationScore)}%</td>
                  <td>{formatScore(c.behavioralScore)}%</td>
                  <td style={{ fontWeight: 700, color: '#38bdf8' }}>{formatScore(c.overallScore)}%</td>
                  <td><ReadinessBadge level={c.readinessLevel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
