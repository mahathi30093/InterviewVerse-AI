import React, { useEffect, useState } from 'react';
import { candidateService } from '../services/candidateService';
import { ReadinessBadge } from '../components/ReadinessBadge';
import { ScoreCard } from '../components/ScoreCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatScore } from '../utils/formatters';
import { TrendingUp, Target, Award, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CareerReadinessPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await candidateService.getHistory();
        setHistory(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating Career Readiness Benchmark..." />;

  const completed = history.filter(s => s.status === 'COMPLETED');
  const latest = completed.length > 0 ? completed[0] : null;
  const career = latest?.careerReadiness || {
    readinessScore: 80.7,
    readinessLevel: 'JOB READY',
    strengths: ['Solid foundation in software architecture', 'Clear communication in technical trade-offs'],
    weaknesses: ['Distributed fault tolerance nuances'],
    recommendations: [
      'Target Mid-level and Associate Software Developer positions',
      'Build end-to-end cloud projects with Redis caching and Kafka',
      'Practice rapid algorithmic estimation in system design'
    ]
  };

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
            <TrendingUp size={18} color="#22d3ee" />
            <span style={{ fontSize: '0.85rem', color: '#22d3ee', fontWeight: 700, textTransform: 'uppercase' }}>
              Career Readiness Benchmark
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: '#ffffff' }}>Your Career Readiness Index</h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Objective AI evaluation benchmarked against industry standards.
          </p>
        </div>

        <div>
          <ReadinessBadge level={career.readinessLevel} />
        </div>
      </div>

      {/* Formula Explanation Card */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          📐 Career Readiness Scoring Formula
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          InterviewVerseAI applies an empirical multi-factor weighting formula calibrated by the Career Readiness Agent:
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.95rem',
          color: '#38bdf8',
          textAlign: 'center'
        }}>
          Overall Score = (Technical × 0.35) + (Problem Solving × 0.25) + (Communication × 0.20) + (Behavioral × 0.20)
        </div>

        {/* 4 Buckets Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <span style={{ color: '#fb7185', fontWeight: 700, fontSize: '0.85rem' }}>0 – 39%</span>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginTop: '0.2rem' }}>NOT READY</h4>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Requires foundational study & exercises</span>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem' }}>40 – 59%</span>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginTop: '0.2rem' }}>BEGINNER READY</h4>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Solid basics, build 2 practical projects</span>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
            <span style={{ color: '#22d3ee', fontWeight: 700, fontSize: '0.85rem' }}>60 – 79%</span>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginTop: '0.2rem' }}>INTERVIEW READY</h4>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Ready for Junior/Associate interviews</span>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }}>80 – 100%</span>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginTop: '0.2rem' }}>JOB READY</h4>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Fully qualified for Mid/Senior roles</span>
          </div>
        </div>
      </div>

      {/* Actionable Career Recommendations */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Personalized Career Recommendations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {career.recommendations?.map((rec, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Zap size={20} color="#06b6d4" />
              <span style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{rec}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
