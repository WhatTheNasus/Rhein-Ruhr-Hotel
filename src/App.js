import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './Dashboard';
import HotelDetails from './HotelDetails';
import SignIn from './SignIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/hotels/:hotelId" element={<HotelDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
