
export type Item = {
    key: string;
    value: string;
    selected: boolean;
  };

  // Define the Ingredient interface
export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

// Define the props for the ViewRandomRecipeScreen component
export interface ViewRandomRecipeScreenProps {
  closeModal: () => void;
  onFindNewRecipe: () => void;
  recipe: {
    strMeal: string;
    strMealThumb: string;
    idMeal: string;
    strInstructions: string;
    strCategory?: string;
    // Additional ingredients and measures for dynamic data
    strIngredient1?: string;
    strIngredient2?: string;
    // ... (up to strIngredient20 and strMeasure20)
    strMeasure1?: string;
    strMeasure2?: string;
    // ... (up to strMeasure20)
  };
}

// Define the Recipe interface
export interface Recipe {
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strCategory: string
}