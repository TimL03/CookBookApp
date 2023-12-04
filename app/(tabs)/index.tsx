import { StyleSheet, Text, View, Pressable, ScrollView, Modal, TouchableOpacity } from 'react-native';
import React, { useReducer, useRef, useState } from 'react';
import ItemSelectorSwitch from '../../components/ItemSelectorSwitch'
import { AlataLarge } from '../../components/StyledText'
import Colors from '../../constants/Colors';
import SearchBarAPI from '../../components/searchBarAPI';
import SearchBarCookBookIngredients from '../../components/searchBarCookBookIngredients';
import SearchBarCookBookCategories from '../../components/searchBarCookBookCategories';
import ViewRandomRecipeScreen from '../modals/viewRandomRecipeModal';
import SearchSwitch from '../../components/SearchSwitch';
import { searchRecipesInFirebase } from '../../components/searchRecipesInFirebase';

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
  const [currentListCookBookIngredients, setCurrentListCookBookIngredients] = useState(recomendedCookBookListIngredients);
  const [currentListCookBookCategories, setCurrentListCookBookCategories] = useState(recomendedCookBookListCategories);
  const [currentListAPIIngredients, setCurrentListAPIIngredients] = useState(recomendedAPIListIngredients);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [searchMode, setSearchMode] = useState<'database' | 'cookbook'>('database');

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

  const handleSearchInFirebase = async () => {
    const selectedCookBookIngredients = getCurrentSelectedCookBookIngredients();
    const selectedCookBookCategories = getCurrentSelectedCookBookCategories().join(',');

    console.log('Selected Ingredients for Firebase Search:', selectedCookBookIngredients);
    console.log('Selected Category for Firebase Search:', selectedCookBookCategories);

    const matchingRecipes = await searchRecipesInFirebase(selectedCookBookIngredients, selectedCookBookCategories);
    console.log('Gefundene Rezepte in Firebase:', matchingRecipes);
  };

  const getMeal = async () => {
    const selectedAPIIngredients = getSelectedAPIIngredients();
    console.log('Selected Ingredients:', selectedAPIIngredients);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${selectedAPIIngredients}`);
      const data = await response.json();
      if (data.meals) {
        const randomMealId = data.meals[Math.floor(Math.random() * data.meals.length)].idMeal;
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

  const handleCurrentListCookBookCategoriesUpdate = (updatedList: { key: string, value: string, selected: boolean }[]) => {
    setCurrentListCookBookCategories(updatedList);
  };

  const getCurrentSelectedCookBookCategories = () => {
    return currentListCookBookCategories
      .filter(item => item.selected)
      .map(item => item.value);
  };

  return (
    <View style={styles.container}>
      <SearchSwitch onToggle={(isDatabaseSearch) => setSearchMode(isDatabaseSearch ? 'database' : 'cookbook')} />
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        {searchMode === 'database' && (
          <View>
            <AlataLarge>Select Ingredients:</AlataLarge>
            <SearchBarAPI
              item={getDisplayedAPIIngredients()}
              currentListAPI={recomendedAPIListIngredients}
              onCurrentListAPIUpdated={handleCurrentListAPIIngredientsUpdate}
              onIngredientSelectedAPI={handleIngredientAPISelection}
            />
            <View style={{ flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' }}>
              {getDisplayedAPIIngredients().map((item) => (
                <ItemSelectorSwitch key={item.key} item={item} onToggle={() => toggleIngredientSelectedAPI(item.key)} />
              ))}
            </View>
            <Pressable onPress={getMeal} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
              <AlataLarge style={{ marginBottom: 5, textAlign: 'center' }}>Get a Recipe</AlataLarge>
            </Pressable>
          </View>
        )}
        {searchMode === 'cookbook' && (
          <View>
            <AlataLarge>Select Ingredients:</AlataLarge>
            <SearchBarCookBookIngredients
              item={getDisplayedCookBookIngredients()}
              currentListCookBook={recomendedCookBookListIngredients}
              onCurrentListCookBookUpdated={handleCurrentListCookBookIngredientsUpdate}
              onIngredientSelectedCookBook={handleIngredientCookBookSelection}
            />
            <View style={{ flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' }}>
              {getDisplayedCookBookIngredients().map((item) => (
                <ItemSelectorSwitch key={item.key} item={item} onToggle={() => toggleIngredientSelectedCookBook(item.key)} />
              ))}
            </View>
            <AlataLarge>Select Categories:</AlataLarge>
            <SearchBarCookBookCategories item={dataCategories} currentListCategories={recomendedCookBookListCategories} onCurrentListCategoriesUpdated={handleCurrentListCookBookCategoriesUpdate} />
            <View style={{ flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' }}>
              {recomendedCookBookListCategories.map((item) => (
                <ItemSelectorSwitch key={item.key} item={item} onToggle={() => toggleCategoriesSelectedCookBook(item.key)} />
              ))}
            </View>
            <Pressable onPress={handleSearchInFirebase} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
              <AlataLarge style={{ marginBottom: 5, textAlign: 'center' }}>Get a Recipe</AlataLarge>
            </Pressable>
          </View>
        )}
      </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    flexDirection: 'column',
    padding: 30,
    alignContent: 'center',
    justifyContent: 'space-evenly',
    gap: 15
  },
  item: {
    backgroundColor: Colors.dark.mainColorLight,
    padding: 20,
    flexDirection: 'row',
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: Colors.dark.background,
  },
  button: {
    backgroundColor: Colors.dark.mainColorDark,
    borderRadius: 10,
    width: 200,
    padding: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
  }
});

