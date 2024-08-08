import React from 'react';
import { useWeather } from '../context/Weather_Context';
import styled from 'styled-components';

const CurrentWeatherContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 20px 0;
`;

function CurrentWeather() {
  const { weatherData } = useWeather();

  if (!weatherData || !weatherData.current) {
    return <p>No weather data available</p>;
  }

  const isoDateString = weatherData.current.time;
  const date = new Date(isoDateString);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);

  return (
    <CurrentWeatherContainer>
      <h1>Time: {formattedDate}</h1>
      <h2>Current Weather</h2>
      <p>Temperature: {weatherData.current.temperature}°C</p>
      <p>Humidity: {weatherData.current.humidity}%</p>
      <p>Wind Speed: {weatherData.current.wind_speed} km/h</p>
      <p>Weather: {weatherData.current.weather}</p>
      <p>Visibility: {weatherData.current.visibility}</p>
      <p>Rain: {weatherData.current.rain}</p>
    </CurrentWeatherContainer>
  );
}

export default CurrentWeather;
