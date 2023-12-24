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
          const categorieList = data.meals.map((categorie: any) => ({
            key: categorie.strCategory,
            value: categorie.strCategory,
            selected: false,
            
          }));
          
          setCurrentList(categorieList);
        } else {
          console.error('Fehler beim Abrufen der Zutatenliste.');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Zutatenliste:', error);
      }
    };

    fetchCategoriesList();
  }, []);

  return currentList;
};

export const useGetRandomMeal = (selectedIngredients: string, selectedCategories: string) => {
  const [selectedMeal, setSelectedMeal] = useState(null);

  const fetchMeal = async () => {
    try {

      if (selectedIngredients === '' && selectedCategories === '') {
        const randomResponse = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const randomData = await randomResponse.json();

        if (randomData.meals) {
          setSelectedMeal(randomData.meals[0]);
        } else {
          alert("Details for the selected meal not found!");
        }
        return;
      }
      
      console.log('Selected Ingredients:', selectedIngredients);
      console.log('Selected Categories:', selectedCategories);
      const responseIngredients = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${selectedIngredients}`);
      const dataIngredients = await responseIngredients.json();

      const responseCategories = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?c=${selectedCategories}`);
      const dataCategories = await responseCategories.json();

      let data = null;
      if(selectedCategories != '' && selectedIngredients != '') {
        console.log('both');
        data = dataIngredients.meals.filter((ingredientMeal : any) => 
          dataCategories.meals.some((categoryMeal : any) => categoryMeal.idMeal === ingredientMeal.idMeal)
        );
      } else if (selectedIngredients != '') {
        console.log('nur ingredients');
        data = dataIngredients.meals;
      } else if (selectedCategories != '') {
        console.log('nur categories');
        data = dataCategories.meals;
      } 

      if (data != null) {
        const randomMealId = data[Math.floor(Math.random() * data.length)].idMeal;
        const detailedResponse = await fetch(`https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=${randomMealId}`);
        const detailedData = await detailedResponse.json();
        if (detailedData.meals) {
          setSelectedMeal(detailedData.meals[0]);
        } else {
          alert("Details for the selected meal not found!");
        }
      } else {
        alert("Sorry, we didn't find any meal!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { selectedMeal, fetchMeal };
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

