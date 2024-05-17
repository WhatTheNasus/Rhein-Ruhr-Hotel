import React, { useEffect, useState } from 'react';
import { getAllHotels } from './firebase'; // Function to fetch all hotels from Firestore
import { useAuth } from './AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file (create this file if it doesn't exist)

function Dashboard() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const { currentUser } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();

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

  // Function to handle booking button click
  const handleBookNow = () => {
    if (!currentUser) {
      // Prompt user to log in/sign up if not authenticated
      navigate('/signin');
    } else {
      // Handle booking logic
      // You can implement booking logic here
    }
  };

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
            <p>{hotel.description}</p>
            <p>{hotel.location}</p>
            <button onClick={handleBookNow} className="book-button">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
