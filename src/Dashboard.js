import React, { useEffect, useState } from 'react';
import { getAllHotels } from './firebase'; // Function to fetch all hotels from Firestore
import { useAuth } from './AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file
import UserLocation from './UserLocation'; // Adjust the path if necessary
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

function Dashboard() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const { currentUser } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('€');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    // Fetch all hotels when component mounts
    getAllHotels().then((data) => {
      setHotels(data);
    });
  }, []);

  useEffect(() => {
    if (hotels.length > 0) {
      fetchImages(hotels).then(results => {
        const imageMap = results.reduce((acc, { name, url }) => {
          return { ...acc, [name]: url };
        }, {});
        setImageUrls(imageMap);
      });
    }
  }, [hotels]);

  const fetchImages = (hotels) => {
    const storage = getStorage();

    let imagePromises = hotels.map(hotel => {
      console.log(`Fetching image for: ${hotel.name}`);
      const imagePath = `images/${encodeURIComponent(hotel.name)}.jpg`;
      const imageRef = ref(storage, imagePath);

      return getDownloadURL(imageRef)
        .then(url => {
          console.log(`Fetched URL for ${hotel.name}: ${url}`);
          return { name: hotel.name, url };
        })
        .catch(error => {
          console.error(`Failed to fetch image for ${hotel.name}:`, error);
          return { name: hotel.name, url: null };
        });
    });

    return Promise.all(imagePromises);
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
            <div key={hotel.id} className="hotel-item">
              <div className="hotel-content">
                <h2>{hotel.name}</h2>
                <p>Price: {convertedPrice} {currency}</p>
                <p>Address: {hotel.address}</p>
                <p>
                  Website: <a href={hotel.link} target="_blank" rel="noopener noreferrer">{hotel.link}</a>
                </p>
                <p>Rating: {hotel.rating}/5⭐</p>
              </div>
              {imageUrl ? (
                <div className="hotel-image-container">
                  <img src={imageUrl} alt={`${hotel.name}`} className="hotel-image" />
                </div>
              ) : (
                <p>Image not available</p>
              )}
              <button onClick={handleBookNow} className="book-button">
                Book Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
