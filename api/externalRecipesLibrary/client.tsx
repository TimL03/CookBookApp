import { useEffect, useState } from 'react';
import { Item } from './model';

// Custom hook to fetch a list of ingredients from an external API
export const useIngredients = () => {
  // State variable to store the current list of ingredients
  const [currentList, setCurrentList] = useState([]);

  useEffect(() => {
    // Function to fetch the ingredients list from an external API
    const fetchIngredientsList = async () => {
      try {
        // Make a GET request to the external API to retrieve the list of ingredients
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        const data = await response.json();

        // Check if the response contains "meals" data
        if (data.meals) {
          // Extract the list of ingredients and format them into an array of objects
          const ingredientsList = data.meals.map((ingredient: any) => ({
            key: ingredient.idIngredient,
            value: ingredient.strIngredient,
            selected: false,
          }));
          // Update the state with the fetched ingredients list
          setCurrentList(ingredientsList);
        } else {
          // Log an error message if there's an issue with fetching the ingredients list
          console.error('Error fetching ingredients list.');
        }
      } catch (error) {
        // Log an error message if there's an error while fetching the ingredients list
        console.error('Error fetching ingredients list:', error);
      }
    };

    // Call the function to fetch the ingredients list when the component mounts
    fetchIngredientsList();
  }, []);

  // Return the current list of ingredients
  return currentList;
};


// Custom hook to fetch a list of categories from an external API
export const useCategories = () => {
  // State variable to store the current list of categories
  const [currentList, setCurrentList] = useState([]);

  useEffect(() => {
    // Function to fetch the categories list from an external API
    const fetchCategoriesList = async () => {
      try {
        // Make a GET request to the external API to retrieve the list of categories
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const data = await response.json();

        // Check if the response contains "meals" data
        if (data.meals) {
          // Extract the list of categories and format them into an array of objects
          const categoryList = data.meals.map((category: any, index: number) => ({
            key: index.toString(),
            value: category.strCategory,
            selected: false,
          }));
          // Update the state with the fetched categories list
          setCurrentList(categoryList);
        } else {
          // Log an error message if there's an issue with fetching the categories list
          console.error('Error fetching categories list.');
        }
      } catch (error) {
        // Log an error message if there's an error while fetching the categories list
        console.error('Error fetching categories list:', error);
      }
    };

    // Call the function to fetch the categories list when the component mounts
    fetchCategoriesList();
  }, []);

  // Return the current list of categories
  return currentList;
};


// Custom hook to fetch a random meal ID or a meal ID based on selected ingredients and categories
export const useGetRandomMealId = () => {
  // State variable to store the selected meal ID
  const [selectedMealId, setSelectedMealId] = useState(null);

  // Function to fetch a meal ID based on selected ingredients and categories
  const fetchMeal = async (selectedIngredients: string, selectedCategories: string) => {
    try {
      if (!selectedIngredients && !selectedCategories) {
        // Fetch a random meal ID from the API when no specific criteria are provided
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        
        // Check if the API response contains meals and select a random meal ID
        if (data.meals && data.meals.length > 0) {
          const randomMealId = data.meals[0].idMeal;
          setSelectedMealId(randomMealId); 
          return randomMealId; 
        } else {
          console.error("Random meal API returned no meals");
          return null;
        }
      } else {
        let mealsByIngredients = null;
        let mealsByCategories = null;

        // Fetch meals based on selected ingredients
        if (selectedIngredients) {
          const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${selectedIngredients}`);
          const data = await response.json();
          mealsByIngredients = data.meals;
        }

        // Fetch meals based on selected categories
        if (selectedCategories) {
          const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?c=${selectedCategories}`);
          const data = await response.json();
          mealsByCategories = data.meals;
        }

        let matchedMeals = [];
        if (mealsByIngredients && mealsByCategories) {
          // Filter meals that match both selected ingredients and categories
          matchedMeals = mealsByIngredients.filter(ingredientMeal => 
            mealsByCategories.some(categoryMeal => categoryMeal.idMeal === ingredientMeal.idMeal)
          );
        } else {
          // Use the meals from either ingredients or categories, or an empty array
          matchedMeals = mealsByIngredients || mealsByCategories || [];
        }

        // Log the matched meals for debugging
        console.log("Matched Meals:", matchedMeals);
        
        // Select a random meal ID from the matched meals
        if (matchedMeals.length > 0) {
          const randomMealId = matchedMeals[Math.floor(Math.random() * matchedMeals.length)].idMeal;
          setSelectedMealId(randomMealId);
          console.log("Selected Meal:", randomMealId)
          return randomMealId;
        } else {
          console.log("No matching meals found");
          return null;
        }
      }
    } catch (error) {
      // Log an error message if there's an issue with fetching the meal
      console.error("Error in fetchMeal:", error);
      return false;
    }
  };

  // Return the selected meal ID and the fetchMeal function
  return { selectedMealId, fetchMeal };
};


// Custom hook to fetch meal details by meal ID
export const useGetMealById = (mealId: string) => {
  // State variable to store the selected meal details
  const [selectedMeal, setSelectedMeal] = useState(null);

  // Function to fetch meal details by meal ID
  const fetchMeal = async () => {
    try {
      // Make a GET request to the external API to retrieve meal details based on the provided meal ID
      const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=${mealId}`);
      const data = await response.json();

      // Check if the API response contains meal details
      if (data.meals) {
        // Set the selected meal details
        setSelectedMeal(data.meals[0]);
      } else {
        // Show an alert if details for the selected meal are not found
        alert("Details for the selected meal not found!");
      }
    } catch (error) {
      // Log an error message if there's an issue with fetching meal details
      console.error(error);
    }
  };

  // Return the selected meal details and the fetchMeal function
  return { selectedMeal, fetchMeal };
};

// Function to convert an item list to a CSV string
export function ItemListToCSVString(itemList: Item[]) {
  return itemList
    .filter(item => item.selected)
    .map(item => item.value.toLowerCase())
    .join(',');
}


