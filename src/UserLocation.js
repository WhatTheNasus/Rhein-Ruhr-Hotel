import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserLocation = () => {
  const [country, setCountry] = useState('');
  
  useEffect(() => {
    axios.get('https://ipapi.co/json/')
      .then(response => setCountry(response.data.country_name))
      .catch(() => setCountry('Could not fetch location'));
  }, []);

  return (
    <div>
      <h2>User's location: {country || 'Loading...'}</h2>
    </div>
  );
};

export default UserLocation;
