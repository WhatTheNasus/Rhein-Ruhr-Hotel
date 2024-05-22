import React, { useEffect, useState } from 'react';
import { db, signOut } from './firebase';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import UserLocation from './UserLocation'; // Adjust the path if necessary
import HotelItem from './HotelItem'; // Import the HotelItem component
import AdminPanel from './AdminPanel'; // Import the AdminPanel component
import { collection, onSnapshot } from 'firebase/firestore';

function Dashboard() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [sortedBy, setSortedBy] = useState('rating'); // Default to sorting by rating
  const [sortOrder, setSortOrder] = useState('desc'); // Default to descending order
  const { currentUser, setCurrentUser } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('€');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [showAdminPanel, setShowAdminPanel] = useState(false); // State to control the display of AdminPanel

  useEffect(() => {
    document.title = 'Hotel Dashboard';
    // Fetch all hotels when component mounts
    const unsubscribe = onSnapshot(collection(db, 'hotels'), (snapshot) => {
      const updatedHotels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const sortedHotels = sortHotels(updatedHotels);
      setHotels(sortedHotels);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Function to sort hotels based on sorting option and order
    const sortedHotels = sortHotels(hotels);
    setHotels(sortedHotels);
  }, [sortedBy, sortOrder]);

  const sortHotels = (hotelsToSort) => {
    return [...hotelsToSort].sort((a, b) => {
      if (sortedBy === 'alphabetical') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortedBy === 'rating') {
        return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0;
    });
  };

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

  // Function to toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Function to check if the user is an admin
  const isAdmin = () => currentUser && currentUser.email.endsWith('@admin.com');

  return (
    <div className="dashboard-container">
      <div className="top-panel">
        <h1>Hotel Dashboard</h1>
        <div className="auth-buttons">
          {currentUser && (currentUser.emailVerified || currentUser.email.endsWith('@admin.com')) ? (
            <>
              <span className="user-name">{currentUser.email}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
              {isAdmin() && (
                <button onClick={() => navigate('/admin')} className="admin-button">Go to Admin Panel</button>
              )}  
            </>
          ) : (
            <button onClick={() => navigate('/signin')} className="login-button">Login</button>
          )}
        </div>
      </div>
      <div className="dashboard-options">
        <UserLocation  className="user-location"
          setCurrency={setCurrency} 
          setExchangeRate={setExchangeRate} 
        />
        <div className="sort-options">
          <label>
            Sort by: 
            <select value={sortedBy} onChange={(e) => setSortedBy(e.target.value)}>
              <option value="alphabetical">Alphabetical</option>
              <option value="rating">Rating</option>
            </select>
          </label>
          <button className="sort-order-button" onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
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