import React, { useState } from 'react';
import { Car, Lightbulb, Utensils, Recycle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CarbonFootprintCalculator = () => {
  const [transport, setTransport] = useState('');
  const [energy, setEnergy] = useState('');
  const [food, setFood] = useState('');
  const [waste, setWaste] = useState('');
  const [carbonFootprint, setCarbonFootprint] = useState(null);

  const calculateFootprint = () => {
    const transportEmissions = parseFloat(transport) * 0.2; // 0.2 kg CO2 per km
    const energyEmissions = parseFloat(energy) * 0.5; // 0.5 kg CO2 per kWh
    const foodEmissions = parseFloat(food) * 3; // 3 kg CO2 per meal
    const wasteEmissions = parseFloat(waste) * 0.5; // 0.5 kg CO2 per kg waste

    const totalEmissions = transportEmissions + energyEmissions + foodEmissions + wasteEmissions;
    setCarbonFootprint(totalEmissions.toFixed(2));
  };

  return (
    <Card className="w-full max-w-md bg-gray-800 text-white">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-green-400">Carbon Footprint Calculator</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Car className="text-blue-400" />
            <Input
              type="number"
              placeholder="km traveled"
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              className="bg-gray-700 text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Lightbulb className="text-yellow-400" />
            <Input
              type="number"
              placeholder="kWh used"
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
              className="bg-gray-700 text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Utensils className="text-red-400" />
            <Input
              type="number"
              placeholder="meals eaten"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              className="bg-gray-700 text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Recycle className="text-green-400" />
            <Input
              type="number"
              placeholder="kg waste produced"
              value={waste}
              onChange={(e) => setWaste(e.target.value)}
              className="bg-gray-700 text-white"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Button 
          onClick={calculateFootprint}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Calculate
        </Button>
        {carbonFootprint !== null && (
          <p className="mt-4 text-xl font-bold">
            Your carbon footprint: {carbonFootprint} kg CO2
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default CarbonFootprintCalculator;