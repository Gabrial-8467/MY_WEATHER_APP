import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // Update to your environment variable

  useEffect(() => {
    // Fetch weather for user's current location on component mount
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
          },
          (error) => {
            console.error('Error getting location:', error);
            setError('Error getting location. Please check your permissions.');
          },
          {
            timeout: 10000, // 10 seconds timeout
            enableHighAccuracy: true, // Use high accuracy
            maximumAge: 0 // No cached position
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  const handleSearch = (e) => {
    setCity(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (city.trim() === '') {
      setError('City name cannot be empty');
      return;
    }
    setError(null);
    setCurrentWeather(null);
    setForecast(null);
    setLoading(true);

    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const currentResponse = await axios.get(currentWeatherURL);
      setCurrentWeather(currentResponse.data);

      const forecastResponse = await axios.get(forecastURL);
      setForecast(forecastResponse.data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(`Error fetching weather data: ${err.response?.data?.message || err.message}`);
    }
    setLoading(false);
  };

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    try {
      const currentResponse = await axios.get(currentWeatherURL);
      setCurrentWeather(currentResponse.data);

      const forecastResponse = await axios.get(forecastURL);
      setForecast(forecastResponse.data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(`Error fetching weather data: ${err.response?.data?.message || err.message}`);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(); // Customize the format as needed
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 text-gray-900">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-white shadow-md bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-red-600">
        Weather Forecast
      </h1>
      <div className="w-full max-w-4xl p-8 bg-white bg-opacity-80 rounded-lg shadow-2xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row mb-6">
          <input
            type="text"
            value={city}
            onChange={handleSearch}
            className="flex-1 p-4 mb-4 md:mb-0 md:mr-4 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
            placeholder="Enter city name"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-gray-900 p-4 rounded-lg shadow-md hover:bg-yellow-400 transition duration-300"
          >
            Search
          </button>
        </form>
        {loading ? (
          <p className="text-xl text-yellow-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {currentWeather && (
              <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-3xl font-semibold mb-2">{currentWeather.name}</h2>
                <p className="text-xl capitalize mb-2 text-gray-700">{currentWeather.weather[0].description}</p>
                <p className="text-5xl font-bold mb-4">{currentWeather.main.temp}°C</p>
                <div className="text-lg text-gray-600">
                  <p>Humidity: {currentWeather.main.humidity}%</p>
                  <p>Wind: {currentWeather.wind.speed} m/s</p>
                </div>
              </div>
            )}
            {forecast && (
              <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">5-Day Forecast</h2>
                {forecast.list.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex flex-col mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                    <p className="text-lg font-semibold">{formatDate(item.dt)}</p>
                    <p className="text-gray-700">{item.weather[0].description}</p>
                    <p className="text-2xl font-bold">{item.main.temp}°C</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
