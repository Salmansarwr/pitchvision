import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/player-tracking" element={<PlayerTrackingPage />} />
        <Route path="/event-detection" element={<EventDetectionPage />} />
        <Route path="/tactical-analysis" element={<TacticalAnalysisPage />} />
        <Route path="/match-reports" element={<MatchReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;