import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import { useState } from "react";

const RecipeCard = ({ recipe, onClick }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
  
    return (
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full sm:w-[15rem] h-auto rounded-xl p-6 border">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            {recipe.title}
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            {recipe.description}
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <div className="relative h-40 w-full">
              {imageLoading && !imageError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
              )}
              <Image
                src={imageError ? "/placeholder-image.jpg" : recipe.image}
                alt={recipe.title}
                layout="fill"
                objectFit="cover"
                className={`rounded-xl group-hover/card:shadow-xl transition-opacity duration-500 ease-in-out ${
                  imageLoading || imageError ? 'opacity-0' : 'opacity-100'
                }`}
                placeholder="blur"
                blurDataURL="/placeholder-blur.jpg"
                loading="lazy"
                onLoadingComplete={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            </div>
          </CardItem>
          <div className="flex justify-center items-center mt-6">
            <CardItem
              translateZ={20}
              as="button"
              onClick={onClick}
              className="px-4 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600"
            >
              View Recipe
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    );
  };
  export default RecipeCard;