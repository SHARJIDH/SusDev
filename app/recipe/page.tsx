"use client"
import React, { useState, useEffect } from 'react';
import { generateRecipe } from '../../utils/gemini';
import { searchYouTubeVideos } from '../../utils/youtube';
import RecipeCard from '@/components/RecipeCard/recipeCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 px-4 rounded-lg text-center transition-colors ${
      active
        ? 'bg-slate-100 text-slate-800'
        : ' bg-slate-800 text-white hover:bg-slate-200'
    }`}
  >
    {children}
  </button>
);

export default function Recipes() {
  const [recipe, setRecipe] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('recipe');
  const [recipeCards, setRecipeCards] = useState([]);
  const [hasSearchResults, setHasSearchResults] = useState(false);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [ingredients, setIngredients] = useState('');
  useEffect(() => {
    // Generate 20 random recipe cards when the component mounts
    const generateRandomRecipes = () => {
      const recipes = [
        { title: "Vegan Lentil Curry", description: "A hearty and flavorful plant-based dish", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2070&auto=format&fit=crop" },
        { title: "Quinoa Stuffed Bell Peppers", description: "Colorful and nutritious vegetarian meal", image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=2070&auto=format&fit=crop" },
        { title: "Zucchini Noodles with Pesto", description: "Light and refreshing low-carb option", image: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?q=80&w=2070&auto=format&fit=crop" },
        { title: "Mushroom Risotto", description: "Creamy and comforting Italian classic", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=2070&auto=format&fit=crop" },
        { title: "Chickpea Salad Sandwich", description: "Quick and easy plant-based lunch", image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?q=80&w=2070&auto=format&fit=crop" },
        { title: "Vegetable Stir-Fry", description: "Colorful mix of veggies in a savory sauce", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=2072&auto=format&fit=crop" },
        { title: "Sweet Potato Black Bean Burrito", description: "Filling and flavorful wrapped delight", image: "https://images.unsplash.com/photo-1618414466256-4b62f39b5b30?q=80&w=2070&auto=format&fit=crop" },
        { title: "Cauliflower Buffalo Wings", description: "Spicy and crispy vegetarian appetizer", image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=2073&auto=format&fit=crop" },
        { title: "Eggplant Parmesan", description: "Classic Italian comfort food", image: "https://images.unsplash.com/photo-1629115916087-31b1a55f2b5e?q=80&w=2070&auto=format&fit=crop" },
        { title: "Spinach and Feta Quiche", description: "Savory breakfast or brunch option", image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=2012&auto=format&fit=crop" },
        { title: "Vegetable Lasagna", description: "Layers of pasta, veggies, and cheese", image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=2070&auto=format&fit=crop" },
        { title: "Tomato Basil Soup", description: "Comforting and classic soup", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop" },
        { title: "Vegetable Sushi Rolls", description: "Colorful and healthy Japanese-inspired dish", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=2069&auto=format&fit=crop" },
        { title: "Lentil Shepherd's Pie", description: "Hearty and comforting vegetarian version", image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?q=80&w=2070&auto=format&fit=crop" },
        { title: "Greek Salad", description: "Fresh and tangy Mediterranean classic", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2067&auto=format&fit=crop" },
        { title: "Vegetable Paella", description: "Flavorful Spanish rice dish", image: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?q=80&w=2074&auto=format&fit=crop" },
        { title: "Portobello Mushroom Burger", description: "Meaty vegetarian alternative", image: "https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=2020&auto=format&fit=crop" },
        { title: "Caprese Salad", description: "Simple and elegant Italian appetizer", image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=2069&auto=format&fit=crop" },
        { title: "Vegetable Spring Rolls", description: "Light and crispy Asian-inspired snack", image: "https://images.unsplash.com/photo-1606335543042-57c525922933?q=80&w=2070&auto=format&fit=crop" },
        { title: "Roasted Vegetable Medley", description: "Colorful mix of oven-roasted veggies", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=2069&auto=format&fit=crop" },
      ];
      setRecipeCards(recipes);
    };

    generateRandomRecipes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await generateRecipeAndFetchVideos(searchTerm ? `Generate a recipe for ${searchTerm}` : "Generate an environmentally friendly recipe");
  };

  const handleCardClick = async (recipe) => {
    setSearchTerm(recipe.title);
    await generateRecipeAndFetchVideos(`Generate a recipe for ${recipe.title}`);
  };

  const handleIngredientSubmit = async (e) => {
    e.preventDefault();
    await generateRecipeAndFetchVideos(`Generate a recipe using these ingredients: ${ingredients}`);
    setIsIngredientModalOpen(false);
  };

  const generateRecipeAndFetchVideos = async (prompt) => {
    setLoading(true);
    setError('');
    try {
      const generatedRecipe = await generateRecipe(prompt);
      setRecipe(generatedRecipe);
      const videoResults = await searchYouTubeVideos(
        `${searchTerm || ingredients || 'eco-friendly'} ${generatedRecipe.split('\n')[0]}`
      );
      setVideos(videoResults);
      setHasSearchResults(true);
      setActiveTab('recipe');
    } catch (error) {
      console.error('Error generating recipe or fetching videos:', error);
      setError(
        'An error occurred while generating the recipe or fetching videos. Please try again.'
      );
      setRecipe('');
      setVideos([]);
      setHasSearchResults(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 mt-20">
      <div className='flex flex-col sm:flex-row justify-between items-center mb-4 gap-4'>
        <h1 className="text-3xl font-bold">Video Recipes</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={() => setIsIngredientModalOpen(true)} className="bg-slate-500 hover:bg-slate-600">
            Search by Ingredients
          </Button>
          <form onSubmit={handleSubmit} className="flex w-full sm:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter a recipe to search (optional)"
              className="px-4 py-2 border rounded-l text-black w-full"
            />
            <Button type="submit" disabled={loading} className="bg-blue-700 hover:bg-slate-600 rounded-l-none">
              {loading ? 'Generating...' : 'Generate Recipe'}
            </Button>
          </form>
        </div>
      </div>

      <Dialog open={isIngredientModalOpen} onOpenChange={setIsIngredientModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search by Ingredients</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleIngredientSubmit} className="space-y-4">
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter ingredients (comma-separated)"
              className="px-4 py-2 border rounded w-full text-black"
            />
            <DialogFooter>
              <Button type="submit" disabled={loading} className="bg-blue-700 hover:bg-slate-600">
                {loading ? 'Generating...' : 'Find Recipe'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {hasSearchResults ? (
        <>
          <div className="flex mb-4 justify-center">
            <TabButton
              active={activeTab === 'recipe'}
              onClick={() => setActiveTab('recipe')}
            >
              Recipe
            </TabButton>
            <TabButton
              active={activeTab === 'videos'}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </TabButton>
          </div>

          {activeTab === 'recipe' && recipe && (
            <div className="p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-2">Generated Recipe:</h2>
              <pre className="whitespace-pre-wrap">{recipe}</pre>
            </div>
          )}

          {activeTab === 'videos' && videos.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-2">Related Videos:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <div
                    key={video.id.videoId}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${video.id.videoId}`}
                      title={video.snippet.title}
                      allowFullScreen
                    ></iframe>
                    <div className="p-4">
                      <h3 className="font-bold">{video.snippet.title}</h3>
                      <p className="text-sm text-gray-600">
                        {video.snippet.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recipeCards.map((recipeCard, index) => (
            <RecipeCard 
              key={index} 
              recipe={recipeCard} 
              onClick={() => handleCardClick(recipeCard)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}