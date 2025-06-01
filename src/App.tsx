import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loading from './components/ui/Loading';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/projects/ProjectList';
import ProjectDetail from './pages/projects/ProjectDetail';
import CreateProject from './pages/projects/CreateProject';
import TimesheetPage from './pages/timesheets/TimesheetPage';
import ExcelIntegrationPage from './pages/ExcelIntegrationPage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen text="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects" 
        element={
          <ProtectedRoute>
            <ProjectList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/create" 
        element={
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/:id" 
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/timesheets" 
        element={
          <ProtectedRoute>
            <TimesheetPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/excel-integration" 
        element={
          <ProtectedRoute>
            <ExcelIntegrationPage />
          </ProtectedRoute>
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;