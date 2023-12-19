import React, { useState } from 'react';
import { View, Image, Pressable, TextInput, Modal } from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../FirebaseConfig'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Share2, Save, ArrowDownToLine } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alata12, Alata16, Alata20, Alata24 } from '../../components/StyledText';
import LoginModalScreen from './logInModal';

// Define the Ingredient interface
interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

// Define the props for the ViewRandomRecipeScreen component
interface ViewRandomRecipeScreenProps {
  closeModal: () => void;
  onFindNewRecipe: () => void;
  recipe: {
    strMeal: string;
    strMealThumb: string;
    idMeal: string;
    strInstructions: string;
    strCategory?: string;
    // Additional ingredients and measures for dynamic data
    strIngredient1?: string;
    strIngredient2?: string;
    // ... (up to strIngredient20 and strMeasure20)
    strMeasure1?: string;
    strMeasure2?: string;
    // ... (up to strMeasure20)
  };
}

// Define the Recipe interface
interface Recipe {
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
}

// Main component function
export default function ViewRandomRecipeScreen({ closeModal, recipe, onFindNewRecipe }: ViewRandomRecipeScreenProps) {
  // State variables
  const [category, setCategory] = useState('');
  const [cookHTime, setCookHTime] = useState('');
  const [cookMinTime, setCookMinTime] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  // Function to handle login success
  const handleLoginSuccess = (user: User) => {
    setIsAuthenticated(true);
    setUserID(user.uid);
  };

  // Authentication instance
  const auth = getAuth();

  // Check authentication status on component mount
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserID(user.uid);
    }
  });

  // Extract ingredients and measures from recipe data
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}`;
    const measureKey = `strMeasure${i}`;

    const recipeAny: any = recipe;
    const ingredient = recipeAny[ingredientKey];
    const measure = recipeAny[measureKey];

    if (ingredient && measure) {
      // Check if the measure contains numbers
      const hasNumbers = /\d/.test(measure);

      let amount, unit;

      if (hasNumbers) {
        // Extract amount and unit from measure
        const match = measure.match(/(\d+)([^\d]+)/);
        if (match) {
          amount = match[1];
          unit = match[2].trim();
        } else {
          amount = measure;
          unit = ''; 
        }
      } else {
        // Set default amount and unit
        amount = '1'; 
        unit = 'x';
      }

      // Push ingredient details to the array
      ingredients.push({ name: ingredient, amount, unit });
    }
  }

  // Function to save recipe data to the database
  async function saveRecipeToDatabase(recipe: Recipe) {
    try {
      const recipesCollectionRef = collection(db, 'recipes');
      const newRecipeRef = await addDoc(recipesCollectionRef, {
        name: recipe.strMeal,
        imageUrl: recipe.strMealThumb,
        ingredients, 
        steps: recipe.strInstructions.split('\n'),
        userID,
        category,
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
    if (!userID) {
      // Show login modal if user is not authenticated
      setIsLoginModalVisible(true);
    } else {
      // Show input fields for category and cooking times
      setShowInputs(true);
    }
  };

  // Event handler for the final save button click
  const handleFinalSaveClick = () => {
    if (recipe && !hasBeenSaved) {
      // Save the recipe to the database
      saveRecipeToDatabase(recipe);
      setHasBeenSaved(true);
    }
  };

  // JSX rendering
  return (
    <View style={[gStyles.defaultContainer, {backgroundColor: Colors.dark.mainColorDark}]}>
      {/* Top modal bar component */}
      <TopModalBar title="From your Cookbook" onClose={closeModal} />
      {/* Main content */}
      <ScrollView style={gStyles.fullScreenBackgroundContainer}>
        {/* Recipe image */}
        <Image
          style={gStyles.image}
          source={recipe.strMealThumb == null ? { uri: '../../assets/images/no-image.png' } : { uri: recipe.strMealThumb }}
        />

        <View style={gStyles.fullScreenContentContainer}>
          {/* Recipe title and actions */}
          <View style={gStyles.HorizontalLayout}>
            <Alata24 style={gStyles.flex}>{recipe.strMeal}</Alata24>
            {/* Action buttons */}
              <Pressable style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough}]}>
                <Share2 color={Colors.dark.text} />
              </Pressable>
              {showInputs ? (
                <Pressable onPress={handleFinalSaveClick} style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough}]}>
                  <Save color={hasBeenSaved ? Colors.dark.tint : Colors.dark.text} size={24}/>
                </Pressable>
              ) : (
                <Pressable onPress={handleSaveButtonClick} style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough}]}>
                  <ArrowDownToLine color={Colors.dark.text} size={24}/>
                </Pressable>
              )}
          </View>

          {/* Input fields for category and cooking times */}
          {showInputs && (
            <>
            <View style={gStyles.cardInput}>
              <TextInput
                  placeholder="Category"
                  placeholderTextColor={Colors.dark.text}
                  style={gStyles.textInput}
                  value={category}
                  onChangeText={setCategory}
                />
            </View>

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
                <Alata12>{recipe.strCategory}</Alata12>
              </View>
          </View>

          {/* Ingredients section */}
          <View style={gStyles.card}>
            <Alata20>Ingredients:</Alata20>
            <View style={gStyles.VerticalLayout}>
              {ingredients.map((item, index) => (
                <View key={index} style={gStyles.IngredientLayout}>
                  <Alata16 style={gStyles.flex}>{index + 1}. {item.name}</Alata16>
                  <Alata16>{item.measure}</Alata16>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions section */}
          <View style={gStyles.card}>
            <Alata20>Instructions:</Alata20>
            <View style={gStyles.VerticalLayout}>
              <View style={gStyles.IngredientLayout}>
                <Alata16>{recipe.strInstructions}</Alata16>
              </View>
            </View>
          </View>
        </View>

        {/* Button to find a new recipe */}
        <Pressable onPress={onFindNewRecipe} style={({ pressed }) => [gStyles.squareButtonText, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>Get new recipe!</Alata20>
        </Pressable>
      </ScrollView>

      {/* Login modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLoginModalVisible}
        onRequestClose={() => setIsLoginModalVisible(false)}
      >
        <LoginModalScreen onClose={() => setIsLoginModalVisible(false)} setUserID={setUserID}
          setIsAuthenticated={setIsAuthenticated} onLoginSuccess={handleLoginSuccess} />
      </Modal>
    </View>
  );
}
