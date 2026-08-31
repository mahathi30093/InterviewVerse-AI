import React, { useEffect, useState } from 'react';
import { candidateService } from '../services/candidateService';
import { UserCircle, Save, CheckCircle, AlertCircle, Briefcase, GraduationCap, Award } from 'lucide-react';
import { JOB_ROLES } from '../utils/constants';

export function CandidateProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    education: '',
    experience: '',
    targetRole: 'Software Developer',
    skills: '',
    resumeText: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await candidateService.getProfile();
        setProfile({
          name: data.name || '',
          email: data.email || '',
          education: data.education || '',
          experience: data.experience || '',
          targetRole: data.targetRole || 'Software Developer',
          skills: data.skills || '',
          resumeText: data.resumeText || ''
        });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await candidateService.updateProfile(profile);
      setMessage('Profile updated successfully! AI Agents will adapt to your updated background.');
    } catch (err) {
      setError(err.message || 'Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const skillsList = profile.skills
    ? profile.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="content-wrapper" style={{ maxWidth: '850px' }}>
      <div className="glass-card">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.35)'
          }}>
            <UserCircle size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Candidate Profile</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Your profile directly influences Orchestrator & Adaptive Question generation
            </p>
          </div>
        </div>

        {message && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#34d399',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <CheckCircle size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#fb7185',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-Only)</label>
              <input
                type="email"
                className="form-control"
                value={profile.email}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Target Job Role</label>
              <select
                className="form-select"
                value={profile.targetRole}
                onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
              >
                {JOB_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Experience Summary</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 1 year internship / Junior Engineer"
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Education Background</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. B.Tech Computer Science & Engineering, 2024"
              value={profile.education}
              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Skills & Technologies (Comma Separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Java, Python, SQL, REST APIs, Docker, Git"
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            />
            {skillsList.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                {skillsList.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'rgba(6, 182, 212, 0.12)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      color: '#22d3ee',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Resume Text / Bio Highlights</label>
            <textarea
              className="form-textarea"
              placeholder="Paste your resume summary, project highlights, or specialized domain interests..."
              value={profile.resumeText}
              onChange={(e) => setProfile({ ...profile, resumeText: e.target.value })}
              rows={4}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ padding: '0.85rem 2rem' }}
            >
              {saving ? 'Saving...' : (
                <>
                  <Save size={18} /> Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
