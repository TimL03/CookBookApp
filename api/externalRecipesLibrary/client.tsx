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
        console.log('data use Categories', data);
        
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

export function ItemListToCSVString(itemList: Item[]) {
  return itemList
  .filter(item => item.selected)
  .map(item => item.value.toLowerCase())
  .join(',');
}