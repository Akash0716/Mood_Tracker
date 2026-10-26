import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MoodCheckInPage from './pages/MoodCheckInPage';
import MoodHistoryPage from './pages/MoodHistoryPage';
import MoodCalendarPage from './pages/MoodCalendarPage';
import JournalListPage from './pages/JournalListPage';
import JournalEditorPage from './pages/JournalEditorPage';
import JournalDetailPage from './pages/JournalDetailPage';
import HabitsPage from './pages/HabitsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated Dashboard App */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/check-in" element={<MoodCheckInPage />} />
        <Route path="/moods" element={<MoodHistoryPage />} />
        <Route path="/calendar" element={<MoodCalendarPage />} />
        <Route path="/journal" element={<JournalListPage />} />
        <Route path="/journal/new" element={<JournalEditorPage />} />
        <Route path="/journal/edit/:id" element={<JournalEditorPage />} />
        <Route path="/journal/:id" element={<JournalDetailPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
