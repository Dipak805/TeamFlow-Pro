import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Manager
import ManagerDashboard from './pages/manager/ManagerDashboard';
import TeamsPage from './pages/manager/TeamsPage';
import UsersPage from './pages/manager/UsersPage';
import ManagerTasksPage from './pages/manager/ManagerTasksPage';
import AnalyticsPage from './pages/manager/AnalyticsPage';

// Team Lead
import TeamLeadDashboard from './pages/teamlead/TeamLeadDashboard';
import TeamLeadTasksPage from './pages/teamlead/TeamLeadTasksPage';
import TeamPage from './pages/teamlead/TeamPage';

// Member
import MemberTasksPage from './pages/member/MemberTasksPage';
import NotificationsPage from './pages/member/NotificationsPage';
import FilesPage from './pages/member/FilesPage';

function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="spinner"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'MANAGER') return <Navigate to="/manager/dashboard" replace />;
    if (user.role === 'TEAM_LEAD') return <Navigate to="/teamlead/dashboard" replace />;
    return <Navigate to="/member/tasks" replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />

      {/* Root redirect */}
      <Route path="/" element={
        user ? (
          user.role === 'MANAGER' ? <Navigate to="/manager/dashboard" replace /> :
          user.role === 'TEAM_LEAD' ? <Navigate to="/teamlead/dashboard" replace /> :
          <Navigate to="/member/tasks" replace />
        ) : <Navigate to="/login" replace />
      } />

      {/* Manager */}
      <Route path="/manager/dashboard" element={<PrivateRoute allowedRoles={['MANAGER']}><ManagerDashboard /></PrivateRoute>} />
      <Route path="/manager/teams" element={<PrivateRoute allowedRoles={['MANAGER']}><TeamsPage /></PrivateRoute>} />
      <Route path="/manager/users" element={<PrivateRoute allowedRoles={['MANAGER']}><UsersPage /></PrivateRoute>} />
      <Route path="/manager/tasks" element={<PrivateRoute allowedRoles={['MANAGER']}><ManagerTasksPage /></PrivateRoute>} />
      <Route path="/manager/analytics" element={<PrivateRoute allowedRoles={['MANAGER']}><AnalyticsPage /></PrivateRoute>} />

      {/* Team Lead */}
      <Route path="/teamlead/dashboard" element={<PrivateRoute allowedRoles={['TEAM_LEAD','MANAGER']}><TeamLeadDashboard /></PrivateRoute>} />
      <Route path="/teamlead/tasks" element={<PrivateRoute allowedRoles={['TEAM_LEAD','MANAGER']}><TeamLeadTasksPage /></PrivateRoute>} />
      <Route path="/teamlead/team" element={<PrivateRoute allowedRoles={['TEAM_LEAD','MANAGER']}><TeamPage /></PrivateRoute>} />

      {/* Member (accessible by all roles) */}
      <Route path="/member/tasks" element={<PrivateRoute><MemberTasksPage /></PrivateRoute>} />
      <Route path="/member/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
      <Route path="/member/files" element={<PrivateRoute><FilesPage /></PrivateRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '10px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
