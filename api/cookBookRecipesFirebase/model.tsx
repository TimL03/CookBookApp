
export type Ingredient = {
  key: string;
  value: string;
  selected: boolean;
};

export type IngredientView = {
  name: string;
  amount: string;
  unit: string;
}

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

export type GroupedByCategory = {
  [key: string]: RecipeData[];
};

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

export type CategoryIconProps = {
  categories: string[];
}