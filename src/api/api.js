export const fetchWeatherData = async (latitude, longitude) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation,rain,snowfall,visibility,wind_speed_10m,temperature_80m,temperature_150hPa&daily=temperature_2m_max,temperature_2m_min&timezone=auto&past_days=7`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response is bad");
  }
  const data = await response.json();
  return data;
};
