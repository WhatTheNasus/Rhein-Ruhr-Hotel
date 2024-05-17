import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import HotelDetails from './HotelDetails';
import SignIn from './SignIn';
import { AuthProvider, useAuth } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hotels/:hotelId" element={<HotelDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;