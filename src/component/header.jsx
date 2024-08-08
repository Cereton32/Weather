import styled from 'styled-components';
import React, { useState } from 'react';
import axios from 'axios';

const HeaderContainer = styled.header`
  padding: 20px;
  text-align: center;
  background-color: #282c34;
  color: white;
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  margin: 5px;
  width: 100%;
  box-sizing: border-box;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #61dafb;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #21a1f1;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LoadingIndicator = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #61dafb;
`;

const SuggestionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  position: absolute;
  width: 100%;
  z-index: 1000;
  top: 100%;
  left: 0;
`;

const SuggestionItem = styled.li`
  padding: 10px;
  cursor: pointer;
  color: black;

  &:hover {
    background-color: #f0f0f0;
  }
`;


const indianCities = [
  "Mumbai", "Delhi", "Bengaluru", "Kolkata", "Chennai",
  "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
  "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad",
  "Agra", "Aurangabad", "Bareilly", "Belgaum", "Bhavnagar",
  "Bhubaneswar", "Bikaner", "Bilaspur", "Dhanbad", "Firozabad",
  "Gurgaon", "Gwalior", "Haldia", "Jabalpur", "Jalandhar",
  "Jamshedpur", "Jhansi", "Kakinada", "Kangra", "Kharagpur",
  "Kochi", "Kota", "Kurnool", "Ludhiana", "Mangalore",
  "Mathura", "Meerut", "Mohali", "Moradabad", "Muzaffarpur",
  "Nanded", "Nashik", "Navi Mumbai", "Noida", "Raipur",
  "Rajkot", "Ranchi", "Rourkela", "Siliguri", "Srinagar",
  "Surat", "Thiruvananthapuram", "Tiruchirappalli", "Tirupati", "Udaipur",
  "Ujjain", "Vadodara", "Varanasi", "Vijayawada", "Visakhapatnam",
  "Warangal", "Amritsar", "Shimla", "Dehradun", "Haridwar",
  "Jodhpur", "Bhubaneswar", "Durgapur", "Tirunelveli", "Sambalpur",
  "Imphal", "Shillong", "Gangtok", "Agartala", "Itanagar",
  "Kohima", "Dimapur", "Aizawl", "Silchar", "Kohima",
  "Kangra", "Mysuru", "Hubli", "Rourkela", "Ranchi",
  "Dibrugarh", "Jorhat", "Bongaigaon", "Tinsukia", "Tezpur"
];


const Header = ({ onsearch }) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationName, setLocationName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async () => {
    if (locationName) {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: locationName + ', India',
            format: 'json',
            addressdetails: 1,
          },
        });

        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setLatitude(lat);
          setLongitude(lon);
          onsearch({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
          setError(null);
        } else {
          setError('Location not found');
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
        setError('Error fetching location data');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter a location name');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocationName(value);

    if (value.length > 1) {
      const filteredSuggestions = indianCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city) => {
    setLocationName(city);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <HeaderContainer>
      <h1>Weather Insight Website</h1>
      <p>All rights reserved to @Abhishek</p>
      <div style={{ position: 'relative', width: '300px', margin: '0 auto' }}>
        <SearchInput
          type='text'
          placeholder='Enter city name'
          value={locationName}
          onChange={handleInputChange}
        />
        <SearchButton onClick={handleSearch}>Get Coordinates</SearchButton>
        {showSuggestions && (
          <SuggestionsList>
            {suggestions.map((city, index) => (
              <SuggestionItem key={index} onClick={() => handleSuggestionClick(city)}>
                {city}
              </SuggestionItem>
            ))}
          </SuggestionsList>
        )}
      </div>
      {loading && <LoadingIndicator>Loading...</LoadingIndicator>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {latitude && longitude && (
        <div>
          <p>Latitude: {latitude}</p>
          <p>Longitude: {longitude}</p>
        </div>
      )}
    </HeaderContainer>
  );
};

export default Header;
