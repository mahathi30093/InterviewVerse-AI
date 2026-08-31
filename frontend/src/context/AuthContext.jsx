import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('interviewverse_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('interviewverse_user');
    const savedToken = localStorage.getItem('interviewverse_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem('interviewverse_user');
        localStorage.removeItem('interviewverse_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const userData = {
      userId: res.userId,
      name: res.name,
      email: res.email,
      role: res.role
    };
    setUser(userData);
    setToken(res.token);
    localStorage.setItem('interviewverse_token', res.token);
    localStorage.setItem('interviewverse_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    const userData = {
      userId: res.userId,
      name: res.name,
      email: res.email,
      role: res.role
    };
    setUser(userData);
    setToken(res.token);
    localStorage.setItem('interviewverse_token', res.token);
    localStorage.setItem('interviewverse_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('interviewverse_token');
    localStorage.removeItem('interviewverse_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
