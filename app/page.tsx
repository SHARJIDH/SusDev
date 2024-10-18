import { AnimatedPin } from '@/components/home/animatedPin';
import { GlobeShape } from '@/components/home/globeShape';
import { Vortex } from '@/components/ui/vortex';


export default function Home() {
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
    <div className="text-center">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <div className='h-screen flex flex-col justify-center items-center'>
          <h1 className="text-4xl font-bold mb-4">Welcome to SusDev</h1>
          <p className="mb-8">
            Generate environmentally friendly recipes using AI & know about the weather conditions in your area
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
    </div>
  );
}