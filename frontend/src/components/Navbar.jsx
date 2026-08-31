import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  LayoutDashboard, 
  PlayCircle, 
  UserCircle, 
  History, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  UserPlus 
} from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem'
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
        }}>
          <Sparkles size={20} color="#fff" />
        </div>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>
            InterviewVerse<span style={{ color: '#06b6d4' }}>AI</span>
          </span>
          <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Adaptive Assessment Ecosystem
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {user ? (
          <>
            {user.role === 'ADMIN' ? (
              <>
                <Link
                  to="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: isActive('/admin') ? '#06b6d4' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <ShieldCheck size={16} /> Admin Center
                </Link>
                <Link
                  to="/reports"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: isActive('/reports') ? '#06b6d4' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  Reports
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: isActive('/dashboard') ? '#06b6d4' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link
                  to="/setup"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: isActive('/setup') ? '#06b6d4' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <PlayCircle size={16} /> Start Interview
                </Link>
                <Link
                  to="/history"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: isActive('/history') ? '#06b6d4' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <History size={16} /> History
                </Link>
                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: isActive('/profile') ? '#06b6d4' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <UserCircle size={16} /> Profile
                </Link>
              </>
            )}

            {/* User Profile Pill & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.82rem'
              }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>{user.name}</span>
                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '10px',
                  background: user.role === 'ADMIN' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                  color: user.role === 'ADMIN' ? '#c084fc' : '#22d3ee',
                  fontWeight: 700
                }}>
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.4rem',
                  borderRadius: '8px',
                  transition: 'color 0.2s'
                }}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <LogIn size={15} /> Sign In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <UserPlus size={15} /> Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
