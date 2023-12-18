import { useEffect, useState } from 'react';
import { Ingredient } from './model';

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

export const useRandomRecipe = async (ingredients: string, categories: string) => {
  const [currentRecipe, setCurrentRecipe] = useState([]);
  try {
    const response = await fetch(
      'https://www.themealdb.com/api/json/v1/1/random.php',
    );
    const data = await response.json();

    if (data.meals) {
      const randomRecipe = data.meals[Math.floor(Math.random() * data.meals.length)];
      console.log('api call klappt');
      console.log(randomRecipe);
      setCurrentRecipe(randomRecipe)
    } else {
      console.error('Fehler beim Abrufen des Rezepts.');
    }
  } catch (error) {
    console.error('Fehler beim Abrufen des Rezepts:', error);
  }

  return currentRecipe;
};