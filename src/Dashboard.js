import React, { useEffect, useState } from 'react';
import { getAllHotels } from './firebase'; // Function to fetch all hotels from Firestore
import { useAuth } from './AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file (create this file if it doesn't exist)
import UserLocation from './UserLocation'; // Adjust the path if necessary
import HotelItem from './HotelItem'; // Import the HotelItem component

function Dashboard() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const { currentUser } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('€');
  const [exchangeRate, setExchangeRate] = useState(1);

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
      <div className="top-panel">
        <h1>Hotel Dashboard</h1>
      </div>
      <UserLocation 
        setCurrency={setCurrency} 
        setExchangeRate={setExchangeRate} 
      />
      <input
        type="text"
        placeholder="Search hotels..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      
      <div className="hotel-list">
        {filteredHotels.map((hotel) => (
          <HotelItem 
            key={hotel.id} 
            hotel={hotel} 
            currency={currency} 
            exchangeRate={exchangeRate} 
            currentUser={currentUser} 
            navigate={navigate} 
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
