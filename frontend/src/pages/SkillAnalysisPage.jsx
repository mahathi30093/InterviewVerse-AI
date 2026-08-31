import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { candidateService } from '../services/candidateService';
import { interviewService } from '../services/interviewService';
import { SkillRadarChart } from '../components/SkillRadarChart';
import { ScoreCard } from '../components/ScoreCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Activity, Brain, Target, Award, CheckCircle2, TrendingUp } from 'lucide-react';

export function SkillAnalysisPage() {
  const { user } = useAuth();
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

  if (loading) return <LoadingSpinner message="Aggregating Skill Competency Matrix..." />;

  const completed = history.filter(s => s.status === 'COMPLETED');
  const latest = completed.length > 0 ? completed[0] : null;
  const skills = latest?.skillAssessment || {
    technicalScore: 82.0,
    problemSolvingScore: 76.0,
    communicationScore: 80.0,
    behavioralScore: 84.0,
    overallScore: 80.7
  };

  return (
    <div className="content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Activity size={18} color="#06b6d4" />
          <span style={{ fontSize: '0.85rem', color: '#22d3ee', fontWeight: 700, textTransform: 'uppercase' }}>
            Comprehensive Skill Profile
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', color: '#fff' }}>Candidate Skill & Competency Analysis</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Synthesized multi-turn evaluation across technical depth, problem solving, articulation, and situational composure.
        </p>
      </div>

      <div className="grid-4">
        <ScoreCard title="Technical Depth" score={skills.technicalScore} icon={Brain} color="#06b6d4" subtitle="Core domain mastery" />
        <ScoreCard title="Problem Solving" score={skills.problemSolvingScore} icon={Target} color="#6366f1" subtitle="System architecture" />
        <ScoreCard title="Communication" score={skills.communicationScore} icon={TrendingUp} color="#10b981" subtitle="Technical clarity" />
        <ScoreCard title="Behavioral" score={skills.behavioralScore} icon={Award} color="#f59e0b" subtitle="Leadership poise" />
      </div>

      <SkillRadarChart
        technical={skills.technicalScore}
        problemSolving={skills.problemSolvingScore}
        communication={skills.communicationScore}
        behavioral={skills.behavioralScore}
      />
    </div>
  );
}
