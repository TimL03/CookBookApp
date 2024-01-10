// Type for Search bar selection
export type Ingredient = {
  key: string;
  value: string;
  selected: boolean;
};

export type CategoryIconProps = {
  categories: string[];
};

// Ingredient Structure
export type IngredientView = {
  name: string;
  amount: string;
  unit: string;
}

// Recipe type for ViewRecipeScreens
export type RecipeData = {
  id: string;
  categories: string[];
  name: string;
  cookHTime: string;
  cookMinTime: string;
  ingredientNames: string[];
  ingredients: IngredientView[];
  ratings: string[];
  steps: string[];
  imageUrl: string;
  userID: string; 
  averageRating: {
    average: number;
    totalRatings: number;
};
};  

// Type for Section List (CookBook & Feed)
export type GroupedByCategory = {
  [key: string]: RecipeData[];
};

// Recipe Type for Recipe(Feed)Element
export type RecipeProps = {
  item: {
      id: string;
      name: string;
      categories: string[];
      cookHTime: string;
      cookMinTime: string;
      ingredients: IngredientView[];
      ingredientNames: string[];
      steps: string[];
      imageUrl: string;
      userID: string;
  };
  averageRating: {
      average: number;
      totalRatings: number;
  };
}
