"use client"
import React, { useState, useEffect } from 'react';
import { AnimatedPin } from '@/components/home/animatedPin';
import GlobeShape from '@/components/home/globeShape';
import { LinkPreview } from '@/components/ui/link-preview';
import { Vortex } from '@/components/ui/vortex';
import { ArrowUp } from 'lucide-react';

export default function Home() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const data = [
    {
      id: "1",
      title: "Get weather report",
      description: "You can get weather report based on your area",
      devlink: "http://localhost:3000/climate",
      imageUrl: "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: "2",
      title: "Get Recipe",
      description: "You can get environmentally friendly recipe ",
      devlink: "http://localhost:3000/recipe",
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: "3",
      title: "Water Tracker",
      description: "Track your daily water intake and maintain a healthy streak",
      devlink: "http://localhost:3000/drinkwater",
      imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  return (
    <div className="text-center relative">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes colorChange {
          0% { color: #4ade80; }
          50% { color: #60a5fa; }
          100% { color: #f472b6; }
        }
        .fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
        .color-change {
          animation: colorChange 4s infinite alternate;
        }
      `}</style>
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <div className='h-screen flex flex-col justify-center items-center'>
          <h1 className="text-6xl font-bold mb-4 fade-in-up">
            Welcome to <span className="color-change">SusDev</span>
          </h1>
          <p className="mb-8 text-xl fade-in-up" style={{animationDelay: '0.5s'}}>
            Generate environmentally friendly{" "}
            <LinkPreview url="https://sus-dev-crv3.vercel.app/recipe" className="font-bold text-white">
              Recipes
            </LinkPreview>{" "}
            using AI <br/>& know about the{" "}
            <LinkPreview url="https://sus-dev-crv3.vercel.app/climate" className="font-bold text-white">
              Weather
            </LinkPreview>{" "}
            conditions in your area
          </p>
        </div>
      </Vortex>
      <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 max-w-6xl mx-auto px-4 py-8">
        {data.map((item) => (
          <div key={item.id} className="flex-1 min-w-0">
            <AnimatedPin
              devlink={item.devlink}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
            />
          </div>
        ))}
      </div>
      <GlobeShape />
      {showTopBtn && (
        <button
          className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
          onClick={goToTop}
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}