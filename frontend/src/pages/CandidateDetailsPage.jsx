import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { ReadinessBadge } from '../components/ReadinessBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatScore, formatDate } from '../utils/formatters';
import { User, Mail, Briefcase, GraduationCap, ArrowLeft, Eye } from 'lucide-react';

export function CandidateDetailsPage() {
  const { id: candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await adminService.getCandidates();
        const found = list.find(c => String(c.candidateId) === String(candidateId));
        setCandidate(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (candidateId) load();
  }, [candidateId]);

  if (loading) return <LoadingSpinner message="Loading Candidate Profile Dossier..." />;

  if (!candidate) {
    return (
      <div className="content-wrapper" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ color: '#94a3b8' }}>Candidate record not found.</p>
        <Link to="/admin" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Return to Admin Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="content-wrapper" style={{ maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#06b6d4', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Admin Overview
      </Link>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#fff' }}>{candidate.candidateName}</h1>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{candidate.email}</span>
          </div>
          <ReadinessBadge level={candidate.readinessLevel} />
        </div>

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Target Job Role</span>
            <h3 style={{ fontSize: '1.1rem', color: '#22d3ee', marginTop: '0.25rem' }}>{candidate.jobRole}</h3>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Overall Assessment Score</span>
            <h3 style={{ fontSize: '1.1rem', color: '#34d399', marginTop: '0.25rem' }}>{formatScore(candidate.overallScore)}%</h3>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          {candidate.lastSessionId && (
            <Link to={`/result/${candidate.lastSessionId}`} className="btn btn-primary">
              <Eye size={16} /> View Full Assessment Report
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}
