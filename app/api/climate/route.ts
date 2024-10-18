import { NextResponse } from 'next/server';

const OPEN_METEO_FORECAST_API = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

async function geocodeLocation(location, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const url = new URL(OPEN_METEO_GEOCODING_API);
      url.searchParams.append('name', location);
      url.searchParams.append('count', '1');
      url.searchParams.append('language', 'en');
      url.searchParams.append('format', 'json');

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Geocoding API Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return {
          latitude: data.results[0].latitude,
          longitude: data.results[0].longitude,
          name: data.results[0].name,
          country: data.results[0].country
        };
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error(`Geocoding attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
}

async function fetchWeatherData(lat, lon, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const url = new URL(OPEN_METEO_FORECAST_API);
      const params = {
        latitude: lat,
        longitude: lon,
        hourly: 'temperature_2m,wind_speed_10m,precipitation',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
        timezone: 'GMT',
        forecast_days: 7
      };

      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Weather API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Weather data fetch attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

function processWeatherData(rawData) {
  const hourlyData = rawData.hourly.time.map((time, index) => ({
    date: time,
    temperature: rawData.hourly.temperature_2m[index],
    windSpeed: rawData.hourly.wind_speed_10m[index],
    precipitation: rawData.hourly.precipitation[index]
  }));

  const dailyData = rawData.daily.time.map((time, index) => ({
    date: time,
    temperatureMax: rawData.daily.temperature_2m_max[index],
    temperatureMin: rawData.daily.temperature_2m_min[index],
    precipitationSum: rawData.daily.precipitation_sum[index]
  }));

  return { hourlyData, dailyData };
}

export async function GET(request) {
  console.log('API route hit');
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  
  console.log('Requested location:', location);

  if (!location) {
    return NextResponse.json(
      { error: 'Location is required' },
      { status: 400 }
    );
  }

  try {
    const geoData = await geocodeLocation(location);
    console.log('Geocoded location:', geoData);

    const weatherData = await fetchWeatherData(geoData.latitude, geoData.longitude);
    const processedData = processWeatherData(weatherData);

    if (processedData.hourlyData.length === 0 && processedData.dailyData.length === 0) {
      return NextResponse.json(
        { error: 'No data found for this location' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      location: {
        name: geoData.name,
        country: geoData.country,
        latitude: geoData.latitude,
        longitude: geoData.longitude
      },
      forecast: processedData
    });

  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}