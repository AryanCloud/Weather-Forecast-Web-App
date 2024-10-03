const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherResult = document.getElementById('weatherResult');

getWeatherBtn.addEventListener('click', getWeather);

async function getWeather() {
    const cityName = cityInput.value.trim();
    
    // Fetching latitude and longitude of the city from the Open-Meteo API
    const locationUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`;
    const locationResponse = await fetch(locationUrl);
    
    if (!locationResponse.ok) {
        weatherResult.textContent = 'City not found';
        weatherResult.style.display = 'block';
        return;
    }

    const locationData = await locationResponse.json();
    const { latitude, longitude } = locationData.results[0];

    // Fetching weather data using latitude and longitude
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    try {
        const weatherResponse = await fetch(apiUrl);
        if (!weatherResponse.ok) throw new Error('Weather data not available');

        const weatherData = await weatherResponse.json();
        displayWeather(weatherData.current_weather, cityName);
    } catch (error) {
        weatherResult.textContent = error.message;
        weatherResult.style.display = 'block';
    }
}

function displayWeather(currentWeather, cityName) {
    weatherResult.innerHTML = `
        <h2>${cityName}</h2>
        <p>Temperature: ${currentWeather.temperature} °C</p>
        <p>Conditions: ${currentWeather.weathercode}</p>
        <p>Wind Speed: ${currentWeather.windspeed} m/s</p>
    `;
    weatherResult.style.display = 'block'; // Show the weather result
}


function getWeatherDescription(weatherCode) {
    switch (weatherCode) {
        case 0: return 'Clear sky';
        case 1: return 'Mainly clear';
        case 2: return 'Partly cloudy';
        case 3: return 'Overcast';
        case 45: return 'Fog';
        case 48: return 'Depositing rime fog';
        case 61: return 'Rain showers';
        case 63: return 'Moderate rain';
        case 65: return 'Heavy rain';
        case 80: return 'Rain showers';
        case 95: return 'Thunderstorm';
        case 99: return 'Severe thunderstorm';
        default: return 'Unknown conditions';
    }
}


function displayWeather(currentWeather, cityName) {
    const weatherDescription = getWeatherDescription(currentWeather.weathercode);
    
    weatherResult.innerHTML = `
        <h2>${cityName}</h2>
        <p>Temperature: ${currentWeather.temperature} °C</p>
        <p>Conditions: ${weatherDescription}</p>
        <p>Wind Speed: ${currentWeather.windspeed} m/s</p>
    `;
    weatherResult.style.display = 'block'; // Show the weather result
}
