import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHotelDetails } from './firebase'; // Function to fetch hotel details from Firestore

function HotelDetails() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    // Fetch hotel details when component mounts
    getHotelDetails(hotelId).then((data) => {
      setHotel(data);
    });
  }, [hotelId]);

  return (
    <div>
      <h1>Hotel Details</h1>
      {hotel && (
        <div>
          <h2>{hotel.name}</h2>
          {/* Display hotel details */}
        </div>
      )}
    </div>
  );
}

export default HotelDetails;
