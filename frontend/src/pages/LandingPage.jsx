import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Brain, 
  Cpu, 
  Mic, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  BarChart3, 
  Target 
} from 'lucide-react';
import { AI_AGENTS_INFO } from '../utils/constants';

export function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        paddingTop: '3rem',
        paddingBottom: '2rem',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '30px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: '#22d3ee',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} /> Autonomous 5-Agent Intelligence Ecosystem
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          maxWidth: '950px',
          margin: '0 auto 1.5rem auto'
        }}>
          Transforming Interviews into <span className="gradient-text">Intelligent Career Journeys</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          color: '#94a3b8',
          maxWidth: '780px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6
        }}>
          An Agentic Intelligent Interview Assessment Ecosystem for Adaptive Skill Evaluation and Personalized Career Readiness. Powered by LangChain, GPT-5, and Whisper Speech.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            Start Adaptive Interview <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            Candidate / Admin Login
          </Link>
        </div>

        {/* Floating Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1000px',
          margin: '4rem auto 0 auto'
        }}>
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>5 Specialist</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Autonomous AI Agents</div>
          </div>
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399' }}>Real-time</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Adaptive Difficulty (Easy-Hard)</div>
          </div>
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#818cf8' }}>Voice & Text</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Whisper Speech Transcription</div>
          </div>
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24' }}>Multi-Skill</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Career Readiness Benchmarks</div>
          </div>
        </div>
      </section>

      {/* 5 AI Agents Showcase */}
      <section className="content-wrapper">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Multi-Agent Architecture
          </span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>
            Meet the Five Core AI Agents
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Every interaction is processed through a collaborative LangChain multi-agent workflow.
          </p>
        </div>

        <div className="grid-3">
          {AI_AGENTS_INFO.map((agent, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22d3ee'
              }}>
                <Brain size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.25rem' }}>{agent.name}</h3>
                <div style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 600, marginBottom: '0.5rem' }}>{agent.role}</div>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>{agent.desc}</p>
              </div>
            </div>
          ))}

          {/* Adaptive Loop Architecture Card */}
          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>The Agentic Feedback Loop</h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              Observe Candidate Response → Evaluate Quality & Depth → Adapt Difficulty State → Generate Dynamic Follow-up → Synthesize Readiness Report.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22d3ee', fontWeight: 600, fontSize: '0.85rem' }}>
              <Zap size={16} /> Autonomous Continuous Adaptation
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="content-wrapper">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Comprehensive Capabilities
          </span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>
            Everything You Need for Career Readiness
          </h2>
        </div>

        <div className="grid-3">
          <div className="glass-card">
            <Cpu size={32} color="#06b6d4" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Adaptive Interviews</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Real-time difficulty scaling (EASY, MEDIUM, HARD). Strong scores unlock harder challenges; foundational support is provided when gaps emerge.
            </p>
          </div>

          <div className="glass-card">
            <Mic size={32} color="#8b5cf6" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Voice & Text Modes</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Speak naturally via microphone with Whisper speech-to-text integration or type detailed technical answers with instant transcription fallback.
            </p>
          </div>

          <div className="glass-card">
            <Activity size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Multi-Skill Evaluation</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Evaluates 4 core pillars: Technical Skill, Problem Solving, Communication, and Behavioral competencies rather than simple trivia.
            </p>
          </div>

          <div className="glass-card">
            <Target size={32} color="#f59e0b" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Actionable Skill Gaps</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Pinpoints exact technical gaps and provides personalized study recommendations, project suggestions, and target proficiency levels.
            </p>
          </div>

          <div className="glass-card">
            <TrendingUp size={32} color="#ec4899" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Career Readiness Score</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Mathematical readiness benchmarking: NOT READY (0-39), BEGINNER READY (40-59), INTERVIEW READY (60-79), and JOB READY (80-100).
            </p>
          </div>

          <div className="glass-card">
            <ShieldCheck size={32} color="#3b82f6" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Enterprise Admin Center</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Comprehensive admin dashboard with candidate pipeline analytics, score distributions, session drill-downs, and exportable reports.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="content-wrapper">
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.2) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.4)'
        }}>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
            Ready to Supercharge Your Career Readiness?
          </h2>
          <p style={{ color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
            Experience an intelligent, adaptive mock interview session tailored to your exact profile and dream role.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
}
