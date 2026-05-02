import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Meera from './pages/Meera';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUpload from './pages/admin/AdminUpload';
import AdminNotes from './pages/admin/AdminNotes';
import AdminSubjects from './pages/admin/AdminSubjects';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notes" element={<Notes />} />
            <Route path="meera" element={<Meera />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Admin Routes */}
            <Route path="admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin/upload" element={
              <ProtectedRoute adminOnly>
                <AdminUpload />
              </ProtectedRoute>
            } />
            <Route path="admin/notes" element={
              <ProtectedRoute adminOnly>
                <AdminNotes />
              </ProtectedRoute>
            } />
            <Route path="admin/subjects" element={
              <ProtectedRoute adminOnly>
                <AdminSubjects />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
