import { StyleSheet, Text, View, Pressable, ScrollView, Modal, TouchableOpacity } from 'react-native';
import React, { useReducer, useRef, useState } from 'react';
import ItemSelectorSwitch from '../../components/ItemSelectorSwitch'
import { AlataLarge } from '../../components/StyledText'
import Colors from '../../constants/Colors';
import SearchBar from '../../components/searchBar';
import SearchBarCategories from '../../components/searchBarCategories';
import ViewRandomRecipeScreen from '../modals/viewRandomRecipeModal';
import SearchSwitch from '../../components/SearchSwitch';
import { searchRecipesInFirebase } from '../../components/searchRecipesInFirebase';

const dataIngredients = [
  { key: '1', value: 'Tomato', selected: true },
  { key: '2', value: 'Spaghetti', selected: true },
  { key: '3', value: 'Garlic', selected: false },
  { key: '4', value: 'Milk', selected: false },
  { key: '5', value: 'Soy Sauce', selected: false },
  { key: '6', value: 'Salad', selected: false },
  { key: '7', value: 'Butter', selected: false },
  { key: '8', value: 'Onion', selected: false },
];

const dataCategories = [
  { key: '1', value: 'Asia', selected: true },
  { key: '2', value: 'Italian', selected: false },
];

const recomendedListIngredients = dataIngredients.filter((i) => i.key === '1' || i.key === '2' || i.key === '3');
const recomendedListCategories = dataCategories.filter((i) => i.key === '1' || i.key === '2');


export default function TabOneScreen() {
  const [currentListIngredients, setCurrentListIngredients] = useState(recomendedListIngredients);
  const [currentListCategories, setCurrentListCategories] = useState(recomendedListCategories);
  const [ingredients, setIngredients] = useState(dataIngredients);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [searchMode, setSearchMode] = useState<'database' | 'cookbook'>('database');
  
  const toggleIngredientSelected = (key: string) => {
    setIngredients(ingredients =>
      ingredients.map(ingredient =>
        ingredient.key === key ? { ...ingredient, selected: !ingredient.selected } : ingredient
      )
    );
  
    setIngredients((updatedIngredients) => {
      console.log('Ingredients after toggle:', updatedIngredients);
      return updatedIngredients;
    });
  };

  const handleCurrentListIngredientsUpdate = (updatedList: { key: string, value: string, selected: boolean }[]) => {
    setCurrentListIngredients(updatedList);
  };

  const handleCurrentListCategoriesUpdate = (updatedList: { key: string, value: string, selected: boolean }[]) => {
    setCurrentListCategories(updatedList);
  };

  const getCurrentSelectedIngredients = () => {
    return currentListIngredients
    .filter(item => item.selected)
    .map(item => item.value);
};

  const getCurrentSelectedCategories = () => {
    return currentListCategories
      .filter(item => item.selected)
      .map(item => item.value);
  };


  const handleSearchInFirebase = async () => {
    const selectedIngredients = getCurrentSelectedIngredients();
    const selectedCategories = getCurrentSelectedCategories().join(',');
  
    console.log('Selected Ingredients for Firebase Search:', selectedIngredients);
    console.log('Selected Category for Firebase Search:', selectedCategories);
  
    const matchingRecipes = await searchRecipesInFirebase(selectedIngredients, selectedCategories);
    console.log('Gefundene Rezepte in Firebase:', matchingRecipes);
  };

  const getSelectedIngredients = () => {
    return currentListIngredients
      .filter(item => item.selected)
      .map(item => item.value.toLowerCase())
      .join(',');
  };

  const getMeal = async () => {
    const selectedIngredients = getSelectedIngredients();
    console.log('Selected Ingredients:', selectedIngredients);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${selectedIngredients}`);
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

  return (
    <View style={styles.container}>
      <SearchSwitch onToggle={(isDatabaseSearch) => setSearchMode(isDatabaseSearch ? 'database' : 'cookbook')} />
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        {searchMode === 'database' && (
          <View>
            <AlataLarge>Select Ingredients:</AlataLarge>
            <SearchBar allItems={dataIngredients} currentList={recomendedListIngredients} onCurrentListUpdated={handleCurrentListIngredientsUpdate} />
          </View>
        )}
        {searchMode === 'cookbook' && (
          <View>
            <AlataLarge>Select Ingredients:</AlataLarge>
            <SearchBar allItems={dataIngredients} currentList={recomendedListIngredients} onCurrentListUpdated={handleCurrentListIngredientsUpdate} />
            <View style={{ flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' }}>
              {currentListIngredients.map((item) => (
                <ItemSelectorSwitch key={item.key} item={item} onToggle={() => toggleIngredientSelected(item.key)} />
              ))}
            </View>
            <AlataLarge>Select Categories:</AlataLarge>
            <SearchBarCategories item={dataCategories} currentListCategories={recomendedListCategories} onCurrentListCategoriesUpdated={handleCurrentListCategoriesUpdate} />
            <View style={{ flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' }}>
              {
                currentListCategories?.map((item, index) => {
                  return (
                    <ItemSelectorSwitch key={item.key} item={item} />
                  )
                })
              }
            </View>
            
          </View>
        )}
      </ScrollView>
      <Pressable onPress={ searchMode === 'cookbook' ? handleSearchInFirebase : getMeal} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
              <AlataLarge style={{ marginBottom: 5, textAlign: 'center' }}>Get a Recipe</AlataLarge>
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
    marginBottom: -10,
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

