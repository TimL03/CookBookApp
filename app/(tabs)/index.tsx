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
import { searchRecipesInFirebase } from '../../api/cookBookRecipesFirebase/client';
import { ScreenContainer } from 'react-native-screens';
import SearchBarSelector from '../../components/searchBarSelector';
import { Item } from '../../api/externalRecipesLibrary/model';
import { ItemListToCSVString, useCategories, useGetRandomMeal, useIngredients } from '../../api/externalRecipesLibrary/client';


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
  const {selectedMeal, fetchMeal} = useGetRandomMeal(ItemListToCSVString(selectedIngredients), ItemListToCSVString(selectedCategories));

  //add Selection Property to Ingredients
  useEffect(() => {
      setSelectedIngredients(ingredients.map(ingredient => ({ ...ingredient, selected: false })));
  }, [ingredients]);

   //add Selection Property to Categories
   useEffect(() => {
    setSelectedCategories(categories.map(categories => ({ ...categories, selected: false })));
}, [categories]);


  const [currentListCookBookIngredients, setCurrentListCookBookIngredients] = useState(recomendedCookBookListIngredients);
  const [currentListCookBookCategories, setCurrentListCookBookCategories] = useState(recomendedCookBookListCategories);
  const [isModalVisible, setModalVisible] = useState(false);


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
    const selectedAPIIngredients = ItemListToCSVString(selectedIngredients);
    const selectedAPICategories = ItemListToCSVString(selectedCategories);

    await fetchMeal();
    if (selectedMeal) {
  	setModalVisible(true);
  } else {
    alert('Kein Rezept gefunden. Bitte versuchen Sie es erneut.');
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
              setSelectedItems={setSelectedIngredients}
              singleSelection={false} />
            <Alata20 style={styles.margin}>Select Categories:</Alata20>
            <SearchBarSelector
              selectedItems={selectedCategories} 
              setSelectedItems={setSelectedCategories} 
              singleSelection={true}/>
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
      <Pressable onPress={() => searchMode == 'cookbook' ? handleSearchInFirebase : getMeal()} style={({ pressed }) => [gStyles.squareButtonText, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
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
