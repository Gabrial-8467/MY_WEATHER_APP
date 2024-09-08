import React from 'react';

const WeatherCard = ({ weather }) => {
  const { name, main, weather: weatherInfo, wind } = weather;
  const weatherIcon = `https://openweathermap.org/img/wn/${weatherInfo[0].icon}@4x.png`;

  return (
    <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <img src={weatherIcon} alt="weather icon" className="w-24 h-24 mx-auto mb-4" />
      <p className="text-xl capitalize mb-2">{weatherInfo[0].description}</p>
      <p className="text-4xl font-semibold">{Math.round(main.temp)}°C</p>
      <div className="mt-4 text-lg">
        <p>Humidity: {main.humidity}%</p>
        <p>Wind: {wind.speed} m/s</p>
      </div>
    </div>
  );
};

export default WeatherCard;
