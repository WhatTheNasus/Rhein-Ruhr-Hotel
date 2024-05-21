import React, { useEffect, useState } from 'react';
import { getAllHotels } from './firebase'; // Function to fetch all hotels from Firestore
import { useAuth } from './AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage
import './Dashboard.css'; // Import your CSS file (create this file if it doesn't exist)
import UserLocation from './UserLocation'; // Adjust the path if necessary

function Dashboard() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [imageUrls, setImageUrls] = useState({}); // State to store image URLs
  const { currentUser } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('€');
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    // Fetch all hotels when component mounts
    getAllHotels().then((data) => {
      setHotels(data);
      fetchImages(data);
    });
  }, []);

  // Fetch image URLs for all hotels
  const fetchImages = (hotels) => {
    const storage = getStorage();
    let imagePromises = hotels.map(hotel => {
      const imageRef = ref(storage, `images/${hotel.name}.jpg`);
      return getDownloadURL(imageRef)
        .then(url => ({ [hotel.name]: url }))
        .catch(() => ({ [hotel.name]: null })); // Handle errors
    });

    Promise.all(imagePromises).then(results => {
      const imageMap = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setImageUrls(imageMap);
    });
  };

  // Filter hotels based on search term
  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle booking button click
  const handleBookNow = () => {
    console.log('Booking');
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
        {filteredHotels.map((hotel) => {
          const convertedPrice = (hotel.price * exchangeRate).toFixed(2);
          const imageUrl = imageUrls[hotel.name];

          return (
            <div 
              key={hotel.id} 
              className="hotel-item"
            >
              <h2>{hotel.name}</h2>
              <p>Price: {convertedPrice} {currency}</p>
              <p>Address: {hotel.address}</p>
              <button onClick={handleBookNow} className="book-button">
                Book Now
              </button>
              {imageUrl && (
                <div className="hotel-image-container">
                  <img src={imageUrl} alt={hotel.name} className="hotel-image" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
