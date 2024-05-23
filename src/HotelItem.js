import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import './Dashboard.css'; // Import your CSS file (create this file if it doesn't exist)

function HotelItem({ hotel, currency, exchangeRate, currentUser, navigate }) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const storage = getStorage();
        const imagePath = `images/${hotel.id}/1.jpg`;
        const imageRef = ref(storage, imagePath);
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error(`Failed to fetch image for ${hotel.name}:`, error);
      }
    };

    fetchImage();
  }, [hotel.name]);

  const handleBookNow = (hotel) => {
    if (!currentUser) {
      navigate('/signin');
    } else {
      window.open(hotel.link, "_blank");
    }
  };

  const convertedPrice = (hotel.price * exchangeRate).toFixed(2);

  return (
    <div className="hotel-item">
      <div className="hotel-content">
        <h2>{hotel.name}</h2>
        <p>Price: {convertedPrice} {currency}</p>
        <p>Address: {hotel.address}</p>
        <p>Rating: {hotel.rating}/5⭐</p>
      </div>
      <div className="hotel-image-container">
        {imageUrl ? (
          <img src={imageUrl} alt={`${hotel.name}`} className="hotel-image" />
        ) : (
          <p>Image not available</p>
        )}
      </div>
      <button onClick={() => handleBookNow(hotel)} className="book-button">
        Book Now
      </button>
    </div>
  );
}

export default HotelItem;
