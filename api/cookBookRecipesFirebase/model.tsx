
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
  category: string;
  name: string;
  cookHTime: string;
  cookMinTime: string;
  description: string;
  ingredients: IngredientView[];
  steps: string[];
  imageUrl: string;
  userID: string; 
};  
