import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import SignIn from './SignIn';
import AdminPanel from './AdminPanel';
import { AuthProvider, useAuth } from './AuthContext';
import NotFound from './NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Dashboard />} />
          {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/admin" element={<AdminPanel />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;