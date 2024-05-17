import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserLocation = ({ setCurrency, setExchangeRate }) => {
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

        // Fetch exchange rate from EUR to the local currency
        const exchangeRateResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/EUR`);
        const exchangeRate = exchangeRateResponse.data.rates[currencyCode];
        setExchangeRate(exchangeRate);
      } catch (error) {
        setCountry('Unknown');
        setCurrency('€'); // Default to Euro symbol
        setExchangeRate(1); // 1 EUR to 1 EUR
      }
    };

    fetchLocationAndCurrency();
  }, [setCurrency, setExchangeRate]);

  return (
    <div>
      <h2>User's location: {country || 'Loading...'}</h2>
      <p></p>
    </div>
  );
};

export default UserLocation;
