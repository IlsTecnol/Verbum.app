import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '/contexts/AuthContext';
import { ThemeProvider } from '/contexts/ThemeContext';
import { Toaster } from '/components/ui/toaster';
import ScrollToTop from '/components/ScrollToTop';
import LoginPage from '/pages/LoginPage';
import SignupPage from '/pages/SignupPage';
import OnboardingFlow from '/pages/OnboardingFlow';
import DashboardPage from '/pages/DashboardPage';
import BiblePage from '/pages/BiblePage';
import SermonsPage from '/pages/SermonsPage';
import ProfilePage from '/pages/ProfilePage';
import AgendaPage from '/pages/AgendaPage';
import MyFavoritesPage from '/pages/MyFavoritesPage';
import FormationPage from '/pages/FormationPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingFlow /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/bible" element={<ProtectedRoute><BiblePage /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><MyFavoritesPage /></ProtectedRoute>} />
      <Route path="/agenda" element={<ProtectedRoute><AgendaPage /></ProtectedRoute>} />
      <Route path="/sermons" element={<ProtectedRoute><SermonsPage /></ProtectedRoute>} />
      <Route path="/formation" element={<ProtectedRoute><FormationPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
