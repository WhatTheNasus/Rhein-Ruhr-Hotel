import React, { useEffect, useState } from 'react';
import { getAllHotels, signOut } from './firebase'; // Import signOut from firebase
import { useAuth } from './AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file
import UserLocation from './UserLocation'; // Adjust the path if necessary
import HotelItem from './HotelItem'; // Import the HotelItem component
import AdminPanel from './AdminPanel'; // Import the AdminPanel component

function Dashboard() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [sortedBy, setSortedBy] = useState(''); // State for sorting
  const [sortOrder, setSortOrder] = useState('asc'); // State for sort order
  const { currentUser, setCurrentUser } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('€');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [showAdminPanel, setShowAdminPanel] = useState(false); // State to control the display of AdminPanel

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
      navigate('/signin'); // Redirect to sign-in page after logout
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  // Filter hotels based on search term
  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort hotels based on sorting option and order
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortedBy === 'alphabetical') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortedBy === 'rating') {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    }
    return 0;
  });

  // Function to check if the user is an admin
  const isAdmin = () => currentUser && currentUser.email.endsWith('@admin.com');

  return (
    <div className="dashboard-container">
      <div className="top-panel">
        <h1>Hotel Dashboard</h1>
        <div className="auth-buttons">
          {currentUser ? (
            <>
              <span className="user-name">{currentUser.email}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
              {isAdmin() && (
                <button onClick={() => setShowAdminPanel(true)} className="admin-button">Go to Admin Panel</button>
              )}
            </>
          ) : (
            <button onClick={() => navigate('/signin')} className="login-button">Login</button>
          )}
        </div>
      </div>
      <div className="dashboard-options">
        <UserLocation 
          setCurrency={setCurrency} 
          setExchangeRate={setExchangeRate} 
        />
        <div className="sort-options">
          <label>
            Sort by: 
            <select value={sortedBy} onChange={(e) => setSortedBy(e.target.value)}>
              <option value="">None</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="rating">Rating</option>
            </select>
          </label>
          <label>
            Order: 
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search hotels..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      
      <div className="hotel-list">
        {sortedHotels.map((hotel) => (
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
      {showAdminPanel && (
        <div className="admin-panel-overlay">
          <div className="admin-panel">
            <button className="close-button" onClick={() => setShowAdminPanel(false)}>×</button>
            <AdminPanel />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;