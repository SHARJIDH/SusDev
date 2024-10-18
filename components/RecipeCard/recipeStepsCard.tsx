// components/RecipeStepsCard/RecipeStepsCard.jsx
"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RecipeStepsCard = ({ recipe }) => {
  // Split recipe into sections based on headers (marked with **)
  const parseRecipe = (recipeText) => {
    if (!recipeText || typeof recipeText !== 'string') {
      console.error('Invalid recipe text:', recipeText);
      return [];
    }

    const sections = [];
    let currentSection = null;
    let currentContent = [];
    
    recipeText.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if line is a header (surrounded by **)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        // Save previous section if exists
        if (currentSection) {
          sections.push({
            title: currentSection,
            content: currentContent
          });
        }
        // Start new section
        currentSection = trimmedLine.replace(/\*\*/g, '').replace(':', '');
        currentContent = [];
      } 
      // Add content to current section
      else if (currentSection && trimmedLine) {
        // Clean up bullet points and extra spaces
        const cleanedLine = trimmedLine.replace(/^\* /, '').trim();
        if (cleanedLine) {
          currentContent.push(cleanedLine);
        }
      }
    });
    
    // Add last section
    if (currentSection && currentContent.length > 0) {
      sections.push({
        title: currentSection,
        content: currentContent
      });
    }
    
    return sections;
  };

  const sections = parseRecipe(recipe);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    const currentSection = sections[currentSectionIndex];
    if (currentStep < currentSection.content.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentStep(sections[currentSectionIndex - 1].content.length - 1);
    }
  };

  if (!sections.length) return <p>No recipe data available.</p>;

  const currentSection = sections[currentSectionIndex];

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Section navigation */}
      <div className="flex justify-center gap-4 mb-6 overflow-x-auto">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSectionIndex(index);
              setCurrentStep(0);
            }}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentSectionIndex === index
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Content card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {currentSection.title}
            {currentSection.content.length > 1 && 
              ` - Step ${currentStep + 1} of ${currentSection.content.length}`
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          <div className="space-y-4">
            {currentSection.content.length === 1 ? (
              // Show full list if there's only one item in the section
              <ul className="list-disc list-inside space-y-2">
                {currentSection.content.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              // Show single step if there are multiple items
              <p className="text-lg">{currentSection.content[currentStep]}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentSectionIndex === 0 && currentStep === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentSectionIndex === 0 && currentStep === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={
            currentSectionIndex === sections.length - 1 &&
            currentStep === currentSection.content.length - 1
          }
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentSectionIndex === sections.length - 1 &&
            currentStep === currentSection.content.length - 1
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default RecipeStepsCard;