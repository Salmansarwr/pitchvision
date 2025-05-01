import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import { UserProvider } from './context/UserProvider'; // Updated import
import Dashboard from './pages/Dashboard';
import SignupPage from './pages/SignupPage';
import SignInPage from './pages/SignInPage';
import PlayerTrackingPage from './pages/PlayerTrackingPage';
import EventDetectionPage from './pages/EventDetectionPage';
import TacticalAnalysisPage from './pages/TacticalAnalysisPage';
import MatchReportsPage from './pages/MatchReportsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LandingPage from './pages/LandingPage';
import './scrollbar.css';

// ProtectedRoute component to guard authenticated routes
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem('token');
  return user && token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route
            path="/player-tracking"
            element={
              <ProtectedRoute>
                <PlayerTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event-detection"
            element={
              <ProtectedRoute>
                <EventDetectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tactical-analysis"
            element={
              <ProtectedRoute>
                <TacticalAnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match-reports"
            element={
              <ProtectedRoute>
                <MatchReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;