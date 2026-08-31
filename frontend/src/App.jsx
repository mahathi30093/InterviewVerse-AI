import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CandidateDashboardPage } from './pages/CandidateDashboardPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { InterviewSetupPage } from './pages/InterviewSetupPage';
import { LiveInterviewPage } from './pages/LiveInterviewPage';
import { InterviewResultPage } from './pages/InterviewResultPage';
import { SkillAnalysisPage } from './pages/SkillAnalysisPage';
import { CareerReadinessPage } from './pages/CareerReadinessPage';
import { InterviewHistoryPage } from './pages/InterviewHistoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CandidateDetailsPage } from './pages/CandidateDetailsPage';
import { ReportsPage } from './pages/ReportsPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InterviewProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Candidate Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <CandidateDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <CandidateProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/setup"
                  element={
                    <ProtectedRoute>
                      <InterviewSetupPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/live/:id"
                  element={
                    <ProtectedRoute>
                      <LiveInterviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/result/:id"
                  element={
                    <ProtectedRoute>
                      <InterviewResultPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/skills"
                  element={
                    <ProtectedRoute>
                      <SkillAnalysisPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/readiness"
                  element={
                    <ProtectedRoute>
                      <CareerReadinessPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <InterviewHistoryPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/candidate/:id"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <CandidateDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </InterviewProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
