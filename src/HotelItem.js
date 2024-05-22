import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import './Dashboard.css'; // Import your CSS file (create this file if it doesn't exist)

function HotelItem({ hotel, currency, exchangeRate, currentUser, navigate }) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const storage = getStorage();
        const imagePath = `images/${encodeURIComponent(hotel.name)}.jpg`;
        const imageRef = ref(storage, imagePath);
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error(`Failed to fetch image for ${hotel.name}:`, error);
      }
    };

    fetchImage();
  }, [hotel.name]);

  const handleBookNow = () => {
    if (!currentUser) {
      navigate('/signin');
    } else {
      // Handle booking logic
    }
  };

  const convertedPrice = (hotel.price * exchangeRate).toFixed(2);

  return (
    <div className="hotel-item">
      <div className="hotel-content">
        <h2>{hotel.name}</h2>
        <p>Price: {convertedPrice} {currency}</p>
        <p>Address: {hotel.address}</p>
        <p>
          Website: <a href={hotel.link} target="_blank" rel="noopener noreferrer">{hotel.link}</a>
        </p>
        <p>Rating: {hotel.rating}/5⭐</p>
      </div>
      <div className="hotel-image-container">
        {imageUrl ? (
          <img src={imageUrl} alt={`${hotel.name}`} className="hotel-image" />
        ) : (
          <p>Image not available</p>
        )}
      </div>
      <button onClick={handleBookNow} className="book-button">
        Book Now
      </button>
    </div>
  );
}

export default HotelItem;
