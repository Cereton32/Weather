import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { WeatherProvider, useWeather } from './context/Weather_Context';
import Header from './component/header';
import { fetchWeatherData } from './api/api';
import CurrentWeather from './component/CurrentWeather';
import PastAndpredictedContainer from './component/PastAndPredicted';
import ErrorBoundary from './component/ErrorBoundary';
import { ThreeDots } from 'react-loader-spinner'; // Import the specific loader

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const { setWeatherData } = useWeather();

  const handleSearch = ({ latitude, longitude }) => {
    setLatitude(latitude);
    setLongitude(longitude);
  };

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchWeatherData(latitude, longitude);

        console.log('API response data:', data);

        if (!data || !data.hourly || !data.hourly.time || data.hourly.time.length === 0) {
          throw new Error('No hourly weather data available');
        }

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];

        const currentIndex = data.hourly.time.findIndex(time => time.startsWith(currentDate));

        if (currentIndex === -1 || currentIndex >= data.hourly.time.length) {
          throw new Error('Current date not found in hourly data or index out of range');
        }

        const hourlyData = data.hourly;
        const currentData = {
          time: hourlyData.time[currentIndex] ?? 'N/A',
          temperature: hourlyData.temperature_2m[currentIndex] ?? 'N/A',
          humidity: hourlyData.relative_humidity_2m[currentIndex] ?? 'N/A',
          wind_speed: hourlyData.wind_speed_10m ? hourlyData.wind_speed_10m[currentIndex] ?? 'N/A' : 'N/A',
          weather: hourlyData.weathercode ? hourlyData.weathercode[currentIndex] ?? 'N/A' : 'N/A',
          visibility: hourlyData.visibility ? hourlyData.visibility[currentIndex] ?? 'N/A' : 'N/A',
          rain: hourlyData.rain[currentIndex] ?? 'N/A',
        };

        const everyday = data.daily;
        const everydatdata = everyday.time.slice(0, 14).map((date, index) => ({
          date,
          temperature_max: everyday.temperature_2m_max[index] ?? 'N/A',
          temperature_min: everyday.temperature_2m_min[index] ?? 'N/A',
        }));

        setWeatherData({
          current: currentData,
          hourly: hourlyData ?? {},
          daily: everyday ?? {},
          past: data.past_weather ?? {},
          past14Days: everydatdata,
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err.message || 'Failed to fetch weather data.');
      }
      setLoading(false);
    };

    fetchData();
  }, [latitude, longitude, setWeatherData]);

  return (
    <AppContainer>
      <Header onsearch={handleSearch} />
      {loading && (
        <div style={{ textAlign: 'center' }}>
          <ThreeDots height="100" width="100" color="#61dafb" ariaLabel="loading" />
        </div>
      )}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <CurrentWeather />
      <PastAndpredictedContainer />
    </AppContainer>
  );
}

const WrappedApp = () => (
  <WeatherProvider>
    <App />
  </WeatherProvider>
);

export default WrappedApp;
