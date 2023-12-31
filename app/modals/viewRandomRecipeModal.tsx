import React, { useState, useEffect } from 'react';
import { View, Image, Pressable, TextInput } from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../FirebaseConfig'
import { Share2, Save, ArrowDownToLine } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alata12, Alata16, Alata20, Alata24 } from '../../components/StyledText';
import { useSession } from '../../api/firebaseAuthentication/client';
import { Ingredient, RecipeProps } from '../../api/externalRecipesLibrary/model';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useGetMealById } from '../../api/externalRecipesLibrary/client';

// Main component function
export default function ViewRandomRecipeScreen() {

  // userID
  // userID
  const { session } = useSession();
  const userID = session;

  // State variables
  const [cookHTime, setCookHTime] = useState('');
  const [cookMinTime, setCookMinTime] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const params = useLocalSearchParams();
  const recipeID = Array.isArray(params.recipeID) ? params.recipeID[0] : params.recipeID;
  const { selectedMeal, fetchMeal } = useGetMealById(recipeID);

  useEffect(() => {
    if (params.recipeID) {
      fetchMeal();
    }
  }, [params.recipeID, fetchMeal]);

  // If recipe is null (data is still loading), return a View with the same background color
  if (!selectedMeal) {
    return (
      <>
        <Stack.Screen options={{
          headerShown: false,
        }} />
        <View style={{ flex: 1, backgroundColor: Colors.dark.mainColorDark }} />
      </>
    );
  }

  // Extract ingredients and measures from recipe data
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}`;
    const measureKey = `strMeasure${i}`;

    const recipeAny: any = selectedMeal;
    const ingredient = recipeAny[ingredientKey];
    const measure = recipeAny[measureKey];


    if (ingredient && measure && measure.trim() !== '' && measure !== '/') {
      let [amount, unit] = measure.split(' ', 2);

      if (!isNaN(parseFloat(amount))) {
        unit = measure.substring(amount.length).trim();
      } else {
        amount = '';
        unit = measure;
      }
      ingredients.push({ name: ingredient, amount, unit });
    }
  }

  const ingredientNames = ingredients.map(ingredient => ingredient.name);

  const categories = selectedMeal.strCategory ? selectedMeal.strCategory.split(',').map(cat => cat.trim()) : [];

  const steps = selectedMeal.strInstructions.split('\n').filter(step => step.trim() !== '');

  // Function to save recipe data to the database
  async function saveRecipeToDatabase(recipe: RecipeProps) {
    try {
      const recipesCollectionRef = collection(db, 'recipes');
      const newRecipeRef = await addDoc(recipesCollectionRef, {
        name: recipe.strMeal,
        imageUrl: recipe.strMealThumb,
        ingredients,
        ingredientNames,
        steps,
        userID,
        categories,
        cookHTime,
        cookMinTime,
      });

      console.log('Recipe saved to database with ID:', newRecipeRef.id);
    } catch (error) {
      console.error('Error saving recipe to database:', error);
    }
  }

  // Event handler for the "Save" button click
  const handleSaveButtonClick = () => {
    setShowInputs(true);
  }


  // Event handler for the final save button click
  const handleFinalSaveClick = () => {
    if (selectedMeal && !hasBeenSaved) {
      // Save the recipe to the database
      saveRecipeToDatabase(selectedMeal);
      setHasBeenSaved(true);
    }
  };

  // JSX rendering
  return (
    <View style={[gStyles.defaultContainer, { backgroundColor: Colors.dark.mainColorDark }]}>
      {/* Top modal bar component */}
      <TopModalBar title="From your Cookbook" />
      {/* Main content */}
      <ScrollView style={gStyles.fullScreenBackgroundContainer}>
        {/* Recipe image */}
        <Image
          style={gStyles.image}
          source={selectedMeal.strMealThumb == null ? { uri: '../../assets/images/no-image.png' } : { uri: selectedMeal.strMealThumb }}
        />

        <View style={gStyles.fullScreenContentContainer}>
          {/* Recipe title and actions */}
          <View style={gStyles.HorizontalLayout}>
            <Alata24 style={gStyles.flex}>{selectedMeal.strMeal}</Alata24>
            {/* Action buttons */}
            <Pressable style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
              <Share2 color={Colors.dark.text} />
            </Pressable>
            {showInputs ? (
              <Pressable onPress={handleFinalSaveClick} style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                <Save color={hasBeenSaved ? Colors.dark.tint : Colors.dark.text} size={24} />
              </Pressable>
            ) : (
              <Pressable onPress={handleSaveButtonClick} style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                <ArrowDownToLine color={Colors.dark.text} size={24} />
              </Pressable>
            )}
          </View>

          {/* Input fields for category and cooking times */}
          {showInputs && (
            <>
              <View style={gStyles.cardInput}>
                <TextInput
                  placeholder="Cook Time Hours"
                  placeholderTextColor={Colors.dark.text}
                  style={gStyles.textInput}
                  value={cookHTime}
                  onChangeText={setCookHTime}
                />
              </View>

              <View style={gStyles.cardInput}>
                <TextInput
                  placeholder="Cook Time Min"
                  placeholderTextColor={Colors.dark.text}
                  style={gStyles.textInput}
                  value={cookMinTime}
                  onChangeText={setCookMinTime}
                />
              </View>
            </>
          )}

          {/* Categories */}
          <View style={gStyles.mapHorizontal}>
            <View style={gStyles.switchButton}>
              <Alata12>{selectedMeal.strCategory}</Alata12>
            </View>
          </View>

          {/* Ingredients section */}
          <View style={gStyles.card}>
            <Alata20>Ingredients:</Alata20>
            <View style={gStyles.VerticalLayout}>
              {ingredients.map((item, index) => (
                <View key={index} style={gStyles.IngredientLayout}>
                  <Alata16 style={gStyles.flex}>{index + 1}. {item.name}</Alata16>
                  <Alata16>{item.amount} {item.unit}</Alata16>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions section */}
          <View style={gStyles.card}>
            <Alata20>Instructions:</Alata20>
            <View style={gStyles.VerticalLayout}>
              <View style={gStyles.IngredientLayout}>
                <Alata16>{selectedMeal.strInstructions}</Alata16>
              </View>
            </View>
          </View>
        </View>

        {/* Button to find a new recipe */}
        <Pressable style={({ pressed }) => [gStyles.squareButtonText, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>Get new recipe!</Alata20>
        </Pressable>
      </ScrollView>
    
    </View>
  );
}
