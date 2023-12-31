import { View, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Alata20 } from '../../components/StyledText'
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import ViewRandomRecipeScreen from '../modals/viewRandomRecipeModal';
import SearchSwitch from '../../components/SearchSwitch';
import { searchRecipesInFirebase } from '../../api/cookBookRecipesFirebase/client';
import SearchBarSelector from '../../components/searchBarSelector';
import { Item } from '../../api/externalRecipesLibrary/model';
import { ItemListToCSVString, useCategories, useGetRandomMeal, useIngredients } from '../../api/externalRecipesLibrary/client';
import { useFirebaseIngredients, useFirebaseCategories } from '../../api/cookBookRecipesFirebase/client';
import { useSession } from '../../api/firebaseAuthentication/client';
import { router } from 'expo-router';
import AlertModal from '../modals/alerts/infoAlert';

export default function TabOneScreen() {

  // Themealdb categories and ingredients
  const apiIngredients: Item[] = useIngredients();
  const [selectedApiIngredients, setSelectedApiIngredients] = useState<Item[]>([]);
  const apiCategories: Item[] = useCategories();
  const [selectedApiCategories, setSelectedApiCategories] = useState<Item[]>([]);

  // CookBook categories and ingredients
  const firebaseIngredients: Item[] = useFirebaseIngredients();
  const [selectedFirebaseIngredients, setSelectedFirebaseIngredients] = useState<Item[]>([]);
  const firebaseCategories: Item[] = useFirebaseCategories();
  const [selectedFirebaseCategories, setSelectedFirebaseCategories] = useState<Item[]>([]);

  const [searchMode, setSearchMode] = useState<'database' | 'cookbook'>('database');
  const { selectedMeal, fetchMeal } = useGetRandomMeal(ItemListToCSVString(selectedApiIngredients), ItemListToCSVString(selectedApiCategories));
  const [selectedFirebaseRecipe, setSelectedFirebaseRecipe] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const { session } = useSession();
  const userID = session;

  // Alert Modal
  const [alertModalVisible, setAlertModalVisible] = useState(false);

  //add Selection Property to Ingredients
  useEffect(() => {
    if (searchMode === 'database') {
      setSelectedApiIngredients(apiIngredients.map(ingredient => ({ ...ingredient, selected: false })));
    } else if (searchMode === 'cookbook') {
      setSelectedFirebaseIngredients(firebaseIngredients.map(ingredient => ({ ...ingredient, selected: false })));
    }
  }, [apiIngredients, firebaseIngredients, searchMode]);


  // add Selection Property to Categories
  useEffect(() => {
    if (searchMode === 'database') {
      setSelectedApiCategories(apiCategories.map(category => ({ ...category, selected: false })));
    } else if (searchMode === 'cookbook') {
      setSelectedFirebaseCategories(firebaseCategories.map(category => ({ ...category, selected: false })));
    }
  }, [apiCategories, firebaseCategories, searchMode]);


  // CookBookSearch
  const handleSearchInFirebase = async () => {
    console.log('handleSearchInFirebase aufgerufen');
    const selectedCookBookIngredients = selectedFirebaseIngredients
      .filter(item => item.selected)
      .map(item => item.value);

    const selectedCookBookCategories = selectedFirebaseCategories
      .filter(item => item.selected)
      .map(item => item.value);

    console.log('Selected Ingredients for Firebase Search:', selectedCookBookIngredients);
    console.log('Selected Categories for Firebase Search:', selectedCookBookCategories);

    const matchingRecipes = await searchRecipesInFirebase(selectedCookBookIngredients, selectedCookBookCategories, userID);
    console.log('Gefundene Rezepte in Firebase:', matchingRecipes);
    if (matchingRecipes.length > 0) {
      setSelectedFirebaseRecipe(matchingRecipes[0]);
      router.push("/screens/viewRecipeScreen")
      } else {
        setAlertModalVisible(true);
    }
  };


// Themealdb get a random meal
const getMeal = async () => {
  const success = await fetchMeal();
  if (success) {
    setModalVisible(true);
  } else {
    setAlertModalVisible(true);
  }
};

const findNewRecipe = () => {
  if (searchMode === 'database') {
    getMeal();
  } else if (searchMode === 'cookbook') {
    handleSearchInFirebase();
  }
};


return (
  <View style={gStyles.screenContainer}>
    <SearchSwitch onToggle={(isDatabaseSearch) => setSearchMode(isDatabaseSearch ? 'database' : 'cookbook')} />
    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
      {searchMode === 'database' && (
        <View>
          <Alata20 style={styles.margin}>Select Ingredients:</Alata20>
          <SearchBarSelector
            selectedItems={selectedApiIngredients}
            setSelectedItems={setSelectedApiIngredients}
            singleSelection={false} />
          <Alata20 style={styles.margin}>Select Categories:</Alata20>
          <SearchBarSelector
            selectedItems={selectedApiCategories}
            setSelectedItems={setSelectedApiCategories}
            singleSelection={true} />
        </View>
      )}
      {searchMode === 'cookbook' && (
        <View>
          <Alata20 style={styles.margin}>Select Ingredients:</Alata20>
          <SearchBarSelector
            selectedItems={selectedFirebaseIngredients}
            setSelectedItems={setSelectedFirebaseIngredients}
            singleSelection={false} />
          <Alata20 style={styles.margin}>Select Categories:</Alata20>
          <SearchBarSelector
            selectedItems={selectedFirebaseCategories}
            setSelectedItems={setSelectedFirebaseCategories}
            singleSelection={false} />
        </View>
      )}
    </ScrollView>
    <Pressable onPress={() => searchMode === 'cookbook' ? handleSearchInFirebase() : getMeal()} style={({ pressed }) => [gStyles.squareButtonText, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
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
    <AlertModal 
      title='No Recipes found'
      message='Please select other ingredients or categories'
      buttonText='ok'
      alertModalVisible={alertModalVisible} 
      setAlertModalVisible={setAlertModalVisible} 
    />
  </View>
)
}

const styles = StyleSheet.create({
  margin: {
    marginBottom: 10,
    marginTop: 10,
  },
  alert: {
    backgroundColor: Colors.dark.mainColorDark,
    borderColor: Colors.dark.mainColorDark,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 1,
    margin: 10,
    padding: 10,
  }
});
