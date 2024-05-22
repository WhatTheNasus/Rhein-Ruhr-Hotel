import React, { useEffect, useState } from 'react';
import { getAllHotels, signOut } from './firebase'; // Import signOut from firebase
import { useAuth } from './AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file
import UserLocation from './UserLocation'; // Adjust the path if necessary
import HotelItem from './HotelItem'; // Import the HotelItem component

function Dashboard() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const { currentUser, setCurrentUser } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('€');
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    // Fetch all hotels when component mounts
    getAllHotels().then((data) => {
      setHotels(data);
    });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  // Filter hotels based on search term
  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="top-panel">
        <h1>Hotel Dashboard</h1>
        <div className="auth-buttons">
          {currentUser ? (
            <>
              <span className="user-name">{currentUser.email}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <button onClick={() => navigate('/signin')} className="login-button">Login</button>
          )}
        </div>
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
