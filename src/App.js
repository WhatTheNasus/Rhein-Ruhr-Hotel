import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import SignIn from './SignIn';
import AdminPanel from './AdminPanel';
import UserManagement from './UserManagment';
import { AuthProvider, useAuth } from './AuthContext';
import NotFound from './NotFound';

// Protected Route Component to handle authentication
const ProtectedRoute = ({ element, ...rest }) => {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Dashboard />} />
          {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />} />
          <Route path="/users" element={<ProtectedRoute element={<UserManagement />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;