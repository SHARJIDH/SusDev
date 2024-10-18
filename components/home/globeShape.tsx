"use client"
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Feature, Point } from 'geojson';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  weather: string;
  temperature: number;
  sustainability: number;
}

interface Activity {
  name: string;
  impact: number;
}

const activities: Activity[] = [
  { name: "Plant Trees", impact: 5 },
  { name: "Install Solar Panels", impact: 8 },
  { name: "Implement Recycling Program", impact: 3 },
  { name: "Improve Public Transportation", impact: 6 },
];

const GlobeShape: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [globeData, setGlobeData] = useState<Feature<Point, Location>[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulated data - replace with actual API calls in a real application
    const sampleLocations: Location[] = [
      { id: '1', name: 'New York', latitude: 40.7128, longitude: -74.0060, weather: 'Sunny', temperature: 25, sustainability: 70 },
      { id: '2', name: 'London', latitude: 51.5074, longitude: -0.1278, weather: 'Rainy', temperature: 18, sustainability: 80 },
      { id: '3', name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, weather: 'Cloudy', temperature: 22, sustainability: 85 },
    ];
    setLocations(sampleLocations);
  }, []);

  useEffect(() => {
    const features: Feature<Point, Location>[] = locations.map(location => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
      properties: location,
    }));
    setGlobeData(features);
  }, [locations]);

  const getPointColor = useCallback((d: Feature<Point, Location>) => {
    const sustainability = d.properties?.sustainability || 0;
    if (sustainability > 80) return 'green';
    if (sustainability > 60) return 'yellow';
    return 'red';
  }, []);

  const handlePointClick = useCallback((point: Feature<Point, Location>) => {
    const location = point.properties;
    if (location) {
      setSelectedLocation(location);
      setIsModalOpen(true);
    }
  }, []);

  const handleActivityClick = useCallback((activity: Activity) => {
    if (selectedLocation) {
      const updatedLocations = locations.map(loc => 
        loc.id === selectedLocation.id 
          ? {...loc, sustainability: Math.min(100, loc.sustainability + activity.impact)}
          : loc
      );
      setLocations(updatedLocations);
      setSelectedLocation(prev => prev ? {...prev, sustainability: Math.min(100, prev.sustainability + activity.impact)} : null);
    }
  }, [locations, selectedLocation]);

  return (
    <div className="w-full h-screen">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        pointsData={globeData}
        pointColor={getPointColor}
        pointAltitude={0.1}
        pointRadius={0.05}
        pointLabel={(d: Feature<Point, Location>) => d.properties?.name || ''}
        onPointClick={handlePointClick}
        atmosphereColor="lightskyblue"
        atmosphereAltitude={0.25}
      />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedLocation?.name}</DialogTitle>
            <DialogDescription>
              Weather: {selectedLocation?.weather}<br/>
              Temperature: {selectedLocation?.temperature}°C<br/>
              Sustainability Score: {selectedLocation?.sustainability}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {activities.map((activity, index) => (
              <Button key={index} onClick={() => handleActivityClick(activity)}>
                {activity.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlobeShape;