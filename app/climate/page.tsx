"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const timeFrames = ['Hourly', 'Daily'];

export default function EnhancedClimateCharts() {
  const [location, setLocation] = useState('');
  const [climateData, setClimateData] = useState({ hourlyData: [], dailyData: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeFrame, setTimeFrame] = useState('Daily');

  const handleSearch = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }
  
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/climate?location=${encodeURIComponent(location.trim())}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (data.forecast.hourlyData.length === 0 && data.forecast.dailyData.length === 0) {
        setError('No data available for this location. Please try a different location.');
        setClimateData({ hourlyData: [], dailyData: [] });
      } else {
        setClimateData(data.forecast);
        setError('');
      }
    } catch (error) {
      console.error('Error fetching climate data:', error);
      setError(`Failed to fetch climate data: ${error.message}. Please try again later.`);
      setClimateData({ hourlyData: [], dailyData: [] });
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{timeFrame}: {label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {item.value.toFixed(2)} {item.unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderTemperatureChart = () => {
    const data = timeFrame === 'Hourly' ? climateData.hourlyData : climateData.dailyData;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {timeFrame === 'Hourly' ? (
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature" unit="°C" />
          ) : (
            <>
              <Line type="monotone" dataKey="temperatureMax" stroke="#ff7300" name="Max Temperature" unit="°C" />
              <Line type="monotone" dataKey="temperatureMin" stroke="#82ca9d" name="Min Temperature" unit="°C" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderWindSpeedChart = () => {
    const data = timeFrame === 'Hourly' ? climateData.hourlyData : climateData.dailyData;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Wind Speed (m/s)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="windSpeed" stroke="#8884d8" name="Wind Speed" unit="m/s" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderPrecipitationChart = () => {
    const data = timeFrame === 'Hourly' ? climateData.hourlyData : climateData.dailyData;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Precipitation (mm)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {timeFrame === 'Hourly' ? (
            <Line type="monotone" dataKey="precipitation" stroke="#82ca9d" name="Precipitation" unit="mm" />
          ) : (
            <Line type="monotone" dataKey="precipitationSum" stroke="#82ca9d" name="Precipitation Sum" unit="mm" />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Climate Data Visualization</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-grow"
                disabled={loading}
              />
              <Button 
                onClick={handleSearch} 
                disabled={loading || !location.trim()}
              >
                {loading ? 'Loading...' : 'Search'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(climateData.hourlyData.length > 0 || climateData.dailyData.length > 0) && (
        <>
          <div className="flex space-x-4 mb-4 text-black">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                {timeFrames.map((frame) => (
                  <SelectItem key={frame} value={frame}>{frame}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTemperatureChart()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wind Speed</CardTitle>
              </CardHeader>
              <CardContent>
                {renderWindSpeedChart()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Precipitation</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPrecipitationChart()}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}