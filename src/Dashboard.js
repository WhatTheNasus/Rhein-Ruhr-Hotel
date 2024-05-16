import React, { useEffect, useState } from 'react';
import { getAllHotels } from './firebase'; // Function to fetch all hotels from Firestore
import './Dashboard.css'; // Import your CSS file (create this file if it doesn't exist)

function Dashboard() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  useEffect(() => {
    // Fetch all hotels when component mounts
    getAllHotels().then((data) => {
      setHotels(data);
    });
  }, []);

  // Filter hotels based on search term
  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h1>Hotel Dashboard</h1>
      <input
        type="text"
        placeholder="Search hotels..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <div className="hotel-list">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="hotel-item">
            <h2>{hotel.name}</h2>
            {/* Display other hotel details */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
