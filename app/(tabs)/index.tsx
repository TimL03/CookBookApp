import { View, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import React, {useEffect, useState } from 'react';
import ItemSelectorSwitch from '../../components/ItemSelectorSwitch'
import { Alata20 } from '../../components/StyledText'
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import SearchBarAPI from '../../components/searchBarAPI';
import SearchBarCookBookIngredients from '../../components/searchBarCookBookIngredients';
import SearchBarCookBookCategories from '../../components/searchBarCookBookCategories';
import ViewRandomRecipeScreen from '../modals/viewRandomRecipeModal';
import SearchSwitch from '../../components/SearchSwitch';
import { searchRecipesInFirebase } from '../../components/searchRecipesInFirebase';
import { ScreenContainer } from 'react-native-screens';
import SearchBarSelector from '../../components/searchBarSelector';
import { Item } from '../../api/externalRecipesLibrary/model';
import { ItemListToCSVString, useCategories, useIngredients } from '../../api/externalRecipesLibrary/client';


const dataIngredients = [
  { key: '1', value: 'Tomato', selected: false },
  { key: '2', value: 'Cucumber', selected: false },
  { key: '3', value: 'Garlic', selected: false },
];

const dataIngredientsCookBook = [
  { key: '1', value: 'Tomato', selected: false },
  { key: '2', value: 'Cucumber', selected: false },
  { key: '3', value: 'Garlic', selected: false },
];

const dataCategories = [
  { key: '1', value: 'Breakfast', selected: false },
  { key: '2', value: 'Snacks', selected: false },
];


const recomendedAPIListIngredients = dataIngredients.filter((i) => i.key === '1' || i.key === '2' || i.key === '3');
const recomendedCookBookListIngredients = dataIngredientsCookBook.filter((i) => i.key === '1' || i.key === '2' || i.key === '3');
const recomendedCookBookListCategories = dataCategories.filter((i) => i.key === '1' || i.key === '2');


export default function TabOneScreen() {
  const ingredients: Item[] = useIngredients();
  const [selectedIngredients, setSelectedIngredients] = useState<Item[]>([]);
  const categories: Item[] = useCategories();
  const [selectedCategories, setSelectedCategories] = useState<Item[]>([]);
  const [searchMode, setSearchMode] = useState<'database' | 'cookbook'>('database');

  //add Selection Property to Ingredients
  useEffect(() => {
      setSelectedIngredients(ingredients.map(ingredient => ({ ...ingredient, selected: false })));
  }, [ingredients]);

   //add Selection Property to Categories
   useEffect(() => {
    setSelectedCategories(categories.map(categories => ({ ...categories, selected: false })));
}, [categories]);

  //add selected Ingredients to csv String
  const selectedIngredientsToCSV = () => {
    return selectedIngredients
      .filter(item => item.selected)
      .map(item => item.value.toLowerCase())
      .join(',');
  };

  const [currentListCookBookIngredients, setCurrentListCookBookIngredients] = useState(recomendedCookBookListIngredients);
  const [currentListCookBookCategories, setCurrentListCookBookCategories] = useState(recomendedCookBookListCategories);
  const [currentListAPIIngredients, setCurrentListAPIIngredients] = useState(recomendedAPIListIngredients);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  


  // API Ingredients
  const getDisplayedAPIIngredients = () => {
    const displayedAPIIngredients = currentListAPIIngredients.filter(
      (item) => item.selected || item.key === '1' || item.key === '2' || item.key === '3'
    );
    return displayedAPIIngredients;
  };

  const handleIngredientAPISelection = (ingredientKey: string) => {
    const selectedIngredient = recomendedAPIListIngredients.find((ingredient) => ingredient.key === ingredientKey);
    if (selectedIngredient) {
      setCurrentListAPIIngredients((prevList) => [...prevList, { ...selectedIngredient }]);
    }
  };

  const toggleIngredientSelectedAPI = (key: string) => {
    setCurrentListAPIIngredients(ingredients =>
      ingredients.map(ingredient =>
        ingredient.key === key ? { ...ingredient, selected: !ingredient.selected } : ingredient
      )
    );

    setCurrentListAPIIngredients((updatedIngredients) => {
      return updatedIngredients;
    });
  };

  const handleCurrentListAPIIngredientsUpdate = (updatedList: { key: string, value: string, selected: boolean }[]) => {
    setCurrentListAPIIngredients(updatedList);
  };

  const getSelectedAPIIngredients = () => {
    return currentListAPIIngredients
      .filter(item => item.selected)
      .map(item => item.value.toLowerCase())
      .join(',');
  };


  // CookBookIngredients
  const getCurrentSelectedCookBookIngredients = () => {
    return currentListCookBookIngredients
      .filter(item => item.selected)
      .map(item => item.value);
  };

  const getDisplayedCookBookIngredients = () => {
    const displayedCookBookIngredients = currentListCookBookIngredients.filter(
      (item) => item.selected || item.key === '1' || item.key === '2' || item.key === '3'
    );
    return displayedCookBookIngredients;
  };
  
  const handleIngredientCookBookSelection = (ingredientKey: string) => {
    setCurrentListCookBookIngredients(prevList => {
      const ingredientIndex = prevList.findIndex(ingredient => ingredient.key === ingredientKey);
      
      if (ingredientIndex > -1) {
        return prevList;
      } else {
        const selectedIngredientCookBook = recomendedCookBookListIngredients.find(ingredient => ingredient.key === ingredientKey);
        return selectedIngredientCookBook ? [...prevList, { ...selectedIngredientCookBook, selected: true }] : prevList;
      }
    });
  };

  const toggleIngredientSelectedCookBook = (key: string) => {
    setCurrentListCookBookIngredients(ingredients =>
      ingredients.map(ingredient =>
        ingredient.key === key ? { ...ingredient, selected: !ingredient.selected } : ingredient
      )
    );

    setCurrentListCookBookIngredients((updatedIngredients) => {
      return updatedIngredients;
    });
  };
  
  const handleCurrentListCookBookIngredientsUpdate = (updatedListCookBook: { key: string, value: string, selected: boolean }[]) => {
    setCurrentListCookBookIngredients(updatedListCookBook);
  };

  // CookBookSearch
  const handleSearchInFirebase = async () => {
    const selectedCookBookIngredients = getCurrentSelectedCookBookIngredients();
    const selectedCookBookCategories = getCurrentSelectedCookBookCategories().join(',');

    console.log('Selected Ingredients for Firebase Search:', selectedCookBookIngredients);
    console.log('Selected Category for Firebase Search:', selectedCookBookCategories);

    const matchingRecipes = await searchRecipesInFirebase(selectedCookBookIngredients, selectedCookBookCategories);
    console.log('Gefundene Rezepte in Firebase:', matchingRecipes);
  };

  // Themealdb get a random meal
  const getMeal = async () => {
    console.log('test');
    const selectedAPIIngredients = ItemListToCSVString(selectedIngredients);
    const selectedAPICategories = ItemListToCSVString(selectedCategories);
    console.log('Selected Ingredients:', selectedAPIIngredients);
    console.log('Selected Categories:', selectedAPICategories);
    try {
      const responseIngredients = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${selectedAPIIngredients}`);
      const dataIngredients = await responseIngredients.json();
      console.log('dataIngredients', dataIngredients.meals.length);

      const responseCategories = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?c=${selectedAPICategories}`);
      const dataCategories = await responseCategories.json();
      console.log('dataCategories', dataCategories.meals.length);

      const data = dataIngredients.meals.filter(ingredientMeal => 
        dataCategories.meals.some(categoryMeal => categoryMeal.idMeal === ingredientMeal.idMeal)
      );
      console.log('data beide zusammen', data);
      console.log('data.length', data.length);

      if (data.length > 0 && data) {
        const randomMealId = data[Math.floor(Math.random() * data.length)].idMeal;
        const detailedResponse = await fetch(`https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=${randomMealId}`);
        const detailedData = await detailedResponse.json();
        if (detailedData.meals) {
          const detailedMeal = detailedData.meals[0];
          setSelectedMeal(detailedMeal);
          setModalVisible(true);
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

  const findNewRecipe = () => {
    getMeal();
  };

  // CookBookCategories 
  const getCurrentSelectedCookBookCategories = () => {
    return currentListCookBookCategories
      .filter(item => item.selected)
      .map(item => item.value);
  };


  const getDisplayedCookBookCategories = () => {
    return currentListCookBookCategories.filter(category => 
      category.selected || category.key === '0' 
    );
  };  
  
  
  const handleCategoryCookBookSelection = (categoryKey: string) => {
    setCurrentListCookBookCategories(prevList => {
      const categoryIndex = prevList.findIndex(category => category.key === categoryKey);
      
      if (categoryIndex > -1) {
        return prevList;
      } else {
        const selectedCategoryCookBook = recomendedCookBookListCategories.find(category => category.key === categoryKey);
        return selectedCategoryCookBook ? [...prevList, { ...selectedCategoryCookBook, selected: true }] : prevList;
      }
    });
  };

  const toggleCategorySelectedCookBook = (key: string) => {
    setCurrentListCookBookCategories(categories =>
      categories.map(category => {
        if (category.key === key) {
          return { ...category, selected: !category.selected };
        } else {
          return { ...category, selected: false };
        }
      })
    );
  };
  
  
  const handleCurrentListCookBookCategoriesUpdate = (updatedListCookBookCategories: { key: string, value: string, selected: boolean }[]) => {
    setCurrentListCookBookCategories(updatedListCookBookCategories);
  };

  return (
    <View style={gStyles.screenContainer}>
      <SearchSwitch onToggle={(isDatabaseSearch) => setSearchMode(isDatabaseSearch ? 'database' : 'cookbook')} />
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        {searchMode === 'database' && (
          <View>
            <Alata20 style={styles.margin}>Select Ingredients:</Alata20>
            <SearchBarSelector
              selectedItems={selectedIngredients} 
              setSelectedItems={setSelectedIngredients} />
            <Alata20 style={styles.margin}>Select Categories:</Alata20>
            <SearchBarSelector
              selectedItems={selectedCategories} 
              setSelectedItems={setSelectedCategories} />
          </View>
        )}
        {searchMode === 'cookbook' && (
          <View>
            <Alata20>Select Ingredients:</Alata20>
            <SearchBarCookBookIngredients
              item={getDisplayedCookBookIngredients()}
              currentListCookBook={recomendedCookBookListIngredients}
              onCurrentListCookBookUpdated={handleCurrentListCookBookIngredientsUpdate}
              onIngredientSelectedCookBook={handleIngredientCookBookSelection}
            />
            <View style={gStyles.mapHorizontal}>
              {getDisplayedCookBookIngredients().map((item) => (
                <ItemSelectorSwitch key={item.key} item={item} onToggle={() => toggleIngredientSelectedCookBook(item.key)} />
              ))}
            </View>
            <Alata20>Select Category:</Alata20>
            <SearchBarCookBookCategories 
            item={getDisplayedCookBookCategories()} 
            currentListCategories={recomendedCookBookListCategories} 
            onCurrentListCategoriesUpdated={handleCurrentListCookBookCategoriesUpdate} 
            onCategorySelectedCookBook={handleCategoryCookBookSelection}
            />
            <View style={gStyles.mapHorizontal}>
              {getDisplayedCookBookCategories().map((item) => (
                <ItemSelectorSwitch key={item.key} item={item} onToggle={() => toggleCategorySelectedCookBook(item.key)} />
              ))}
            </View>
            
          </View>
        )}
      </ScrollView>
      <Pressable onPress={() => getMeal()} style={({ pressed }) => [gStyles.squareButtonText, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
        <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>Get a Recipe</Alata20>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ViewRandomRecipeScreen closeModal={() => setModalVisible(false)} recipe={selectedMeal} onFindNewRecipe={findNewRecipe} />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  margin: {
    marginBottom: 10,
    marginTop: 10,
  }
});
