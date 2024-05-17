import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserLocation = ({ setCurrency }) => {
  const [country, setCountry] = useState('');

  useEffect(() => {
    const fetchLocationAndCurrency = async () => {
      try {
        // Fetch user's country based on IP address
        const locationResponse = await axios.get('https://ipapi.co/json/');
        const countryCode = locationResponse.data.country;
        setCountry(locationResponse.data.country_name);

        // Fetch currency information based on the country code
        const countryResponse = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const currencyCode = Object.keys(countryResponse.data[0].currencies)[0];
        const currencySymbol = countryResponse.data[0].currencies[currencyCode].symbol;

        setCurrency(currencySymbol);
      } catch (error) {
        setCountry('Could not fetch location');
        setCurrency('Unknown Currency');
      }
    };

    fetchLocationAndCurrency();
  }, [setCurrency]);

  return (
    <div>
      <h2>User's location: {country || 'Loading...'}</h2>
    </div>
  );
};

export default UserLocation;
