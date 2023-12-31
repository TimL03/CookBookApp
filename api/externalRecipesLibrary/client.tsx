import { useEffect, useState } from 'react';
import { Item } from './model';

export const useIngredients = () => {
  const [currentList, setCurrentList] = useState([]);

  useEffect(() => {
    const fetchIngredientsList = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        const data = await response.json();

        if (data.meals) {
          const ingredientsList = data.meals.map((ingredient: any) => ({
            key: ingredient.idIngredient,
            value: ingredient.strIngredient,
            selected: false,
          }));
          setCurrentList(ingredientsList);
        } else {
          console.error('Fehler beim Abrufen der Zutatenliste.');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Zutatenliste:', error);
      }
    };

    fetchIngredientsList();
  }, []);

  return currentList;
};

export const useCategories = () => {
  const [currentList, setCurrentList] = useState([]);

  useEffect(() => {
    const fetchCategoriesList = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const data = await response.json();

        if (data.meals) {
          const categorieList = data.meals.map((categorie: any, index: number) => ({
            key: index.toString(),
            value: categorie.strCategory,
            selected: false,
          }));

          setCurrentList(categorieList);
        } else {
          console.error('Fehler beim Abrufen der Kategorienliste.');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Kategorienliste:', error);
      }
    };

    fetchCategoriesList();
  }, []);

  return currentList;
};

export const useGetRandomMealId = () => {
  const [selectedMealId, setSelectedMealId] = useState(null);

  const fetchMeal = async (selectedIngredients: string, selectedCategories: string) => {
    try {
      if (!selectedIngredients && !selectedCategories) {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
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

        if (selectedIngredients) {
          const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${selectedIngredients}`);
          const data = await response.json();
          mealsByIngredients = data.meals;
        }

        if (selectedCategories) {
          const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?c=${selectedCategories}`);
          const data = await response.json();
          mealsByCategories = data.meals;
        }

        let matchedMeals = [];
        if (mealsByIngredients && mealsByCategories) {
          matchedMeals = mealsByIngredients.filter(ingredientMeal => 
            mealsByCategories.some(categoryMeal => categoryMeal.idMeal === ingredientMeal.idMeal)
          );
        } else {
          matchedMeals = mealsByIngredients || mealsByCategories || [];
        }

        console.log("Matched Meals:", matchedMeals);
        if (matchedMeals.length > 0) {
          const randomMealId = matchedMeals[Math.floor(Math.random() * matchedMeals.length)].idMeal;
          setSelectedMealId(randomMealId);
          return randomMealId;
        } else {
          console.log("No matching meals found");
          return null;
        }
      }
    } catch (error) {
      console.error("Error in fetchMeal:", error);
      return false;
    }
  };

  return { selectedMealId, fetchMeal };
};


export const useGetMealById = (mealId: string) => {
  const [selectedMeal, setSelectedMeal] = useState(null);

  const fetchMeal = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=${mealId}`);
      const data = await response.json();

      if (data.meals) {
        setSelectedMeal(data.meals[0]);
      } else {
        alert("Details for the selected meal not found!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { selectedMeal, fetchMeal };
}

export function ItemListToCSVString(itemList: Item[]) {
  return itemList
    .filter(item => item.selected)
    .map(item => item.value.toLowerCase())
    .join(',');
}

