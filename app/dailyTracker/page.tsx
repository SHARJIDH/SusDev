"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Droplets } from 'lucide-react';
import CarbonFootprintCalculator from '@/components/carbon/footPrint';

const WaterTracker = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [streak, setStreak] = useState(0);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [lastCompletionDate, setLastCompletionDate] = useState('');
  const goalIntake = 5000; // 5L in ml

  useEffect(() => {
    const savedStreak = localStorage.getItem('waterStreak');
    const savedLastCompletionDate = localStorage.getItem('lastCompletionDate');
    const savedWaterIntake = localStorage.getItem('waterIntake');
    const savedIsGoalReached = localStorage.getItem('isGoalReached');
    
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedLastCompletionDate) setLastCompletionDate(savedLastCompletionDate);
    if (savedWaterIntake) setWaterIntake(parseInt(savedWaterIntake, 10));
    if (savedIsGoalReached) setIsGoalReached(savedIsGoalReached === 'true');

    const today = new Date().toDateString();
    if (today !== savedLastCompletionDate) {
      setWaterIntake(0);
      setIsGoalReached(false);
      localStorage.setItem('waterIntake', '0');
      localStorage.setItem('isGoalReached', 'false');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGoalReached) return;

    const amount = parseFloat(inputValue);
    if (!isNaN(amount)) {
      setWaterIntake(prev => {
        const newIntake = prev + amount;
        localStorage.setItem('waterIntake', newIntake.toString());
        
        if (newIntake >= goalIntake && !isGoalReached) {
          const today = new Date().toDateString();
          if (today !== lastCompletionDate) {
            setStreak(s => {
              const newStreak = s + 1;
              localStorage.setItem('waterStreak', newStreak.toString());
              return newStreak;
            });
          }
          setIsGoalReached(true);
          setLastCompletionDate(today);
          localStorage.setItem('isGoalReached', 'true');
          localStorage.setItem('lastCompletionDate', today);
        }
        return newIntake;
      });
      setInputValue('');
    }
  };

  const percentageFilled = (waterIntake / goalIntake) * 100;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <div className='w-full max-w-6xl p-4'>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <h1 className="text-4xl font-bold mb-8 text-blue-400">Water Tracker</h1>
            
            <form onSubmit={handleSubmit} className="w-full mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter ml"
                  className="flex-grow px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-lg"
                  disabled={isGoalReached}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black text-lg font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  disabled={isGoalReached}
                >
                  Add
                </button>
              </div>
              <p className="text-xl text-blue-300 font-semibold">
                {waterIntake} / {goalIntake} ml
              </p>
            </form>

            {isGoalReached ? (
              <p className="text-green-400 font-bold text-xl mb-6">
                Daily goal achieved! See you tomorrow!
              </p>
            ) : (
              <p className="text-blue-400 font-bold text-xl mb-6">
                Keep drinking! You're doing great!
              </p>
            )}

            <div className="flex items-center justify-center gap-3 text-orange-400 bg-gray-800 px-6 py-3 rounded-full">
              <Calendar size={28} />
              <span className="font-bold text-xl">Streak: {streak} days</span>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-64 h-96 border-2 border-gray-700 rounded-3xl overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-1000 ease-in-out"
                style={{
                  height: `${percentageFilled}%`,
                  background: `linear-gradient(0deg, #1e40af 0%, #3b82f6 100%)`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-8 bg-blue-300 opacity-30 animate-wave"></div>
                <div className="absolute top-4 left-0 right-0 h-8 bg-blue-300 opacity-30 animate-wave animation-delay-1000"></div>
              </div>
              <Droplets className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-200" size={80} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-8">
        <CarbonFootprintCalculator />
      </div>
    </div>
  );
};

export default WaterTracker;