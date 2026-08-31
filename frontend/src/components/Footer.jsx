import React from 'react';
import { Sparkles, Brain, Cpu, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(7, 11, 20, 0.95)',
      padding: '3rem 2rem 2rem 2rem',
      marginTop: 'auto'
    }}>
      <div className="content-wrapper" style={{ padding: 0 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={18} color="#06b6d4" />
              <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>
                InterviewVerse<span style={{ color: '#06b6d4' }}>AI</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6' }}>
              An Agentic Intelligent Interview Assessment Ecosystem for Adaptive Skill Evaluation and Personalized Career Readiness.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '0.75rem' }}>
              Core AI Agents
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.8' }}>
              <li>• Interview Orchestrator Agent</li>
              <li>• Adaptive Interview Agent</li>
              <li>• Answer Evaluation Agent</li>
              <li>• Skill Assessment Agent</li>
              <li>• Career Readiness Agent</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '0.75rem' }}>
              Technology Stack
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.8' }}>
              <li>• React SPA & Web Audio API</li>
              <li>• Spring Boot 3 & Spring Security</li>
              <li>• FastAPI & LangChain Agents</li>
              <li>• OpenAI GPT-5 & Whisper Speech</li>
              <li>• PostgreSQL & Docker Compose</li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: '#64748b',
          fontSize: '0.8rem'
        }}>
          <div>
            © {new Date().getFullYear()} InterviewVerseAI. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Assessment</span>
            <span>•</span>
            <span>API Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
