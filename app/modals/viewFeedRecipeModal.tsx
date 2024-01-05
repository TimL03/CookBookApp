import React, { useState, useEffect } from 'react';
import { View, Image, Pressable, Modal } from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { Share2, ArrowDownToLine, X, MessageSquareIcon, Star } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alata20, Alata12, Alata16, Alata14, Alata24, Alata18 } from '../../components/StyledText';
import ShareRecipeScreen from './shareRecipeModal';
import { db, auth } from '../../FirebaseConfig'
import { doc, setDoc, Timestamp, collection, getDocs } from 'firebase/firestore';
import RatingModal from './RatingModal';
import { RecipeData } from '../../api/cookBookRecipesFirebase/model';
import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { fetchRatings, getRecipeByIdForFeed } from '../../api/cookBookRecipesFirebase/client';
import { useSession } from '../../api/firebaseAuthentication/client';


// Define the main component
export default function ViewFeedRecipeScreen() {
  // State variables
  const [sortedRatings, setSortedRatings] = useState<Array<{ id: string; username: string; rating: number; comment: string; timestamp: Timestamp }>>([]);

  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [recipeSaved, setRecipeSaved] = useState(false);

  // Get recipe id from router params
  const params = useLocalSearchParams();

  // Fetch recipe from database
  useEffect(() => {
    if (params.recipeID) {
      const fetchRecipe = async () => {
        const fetchedRecipe = await getRecipeByIdForFeed(params.recipeID.toString());
        setRecipe(fetchedRecipe);
      };
      fetchRecipe();
    }
  }, [params.recipeID]);

  // Effect hook to fetch ratings on component mount
  useFocusEffect(
    React.useCallback(() => {
      fetchRatings(params.recipeID, setSortedRatings);
      return () => {}; // This is the cleanup function, it's not needed in this case but it's required by the useCallback hook
    }, [])
  );

// If recipe is null (data is still loading), return a View with the same background color
if (!recipe) {
  return (
    <>
    <Stack.Screen options={{
      headerShown: false, }} />
    <View style={{flex: 1, backgroundColor: Colors.dark.mainColorDark}} />
    </>
  );
}


// Function to save recipe to the database
const saveRecipeToDatabase = async () => {
  console.log('Saving recipe to database')
  try {
    if (params.recipeID && recipe) {
      const recipeRef = doc(db, 'recipes', params.recipeID.toString());
      await setDoc(recipeRef, {
        //... rest of your recipe data
      });

      console.log('Recipe successfully saved!');
      setRecipeSaved(true);
    } else {
      console.error('No recipe ID or recipe data found');
    }
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};


  // Return the JSX for the component
  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: 'From the Feed',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: Colors.dark.mainColorDark,
        },
        navigationBarColor: Colors.dark.mainColorDark,
        headerRight: () =>
          <Pressable onPress={router.back} style={({ pressed }) => [{ padding: 5, borderRadius: 20, backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
            <X color={Colors.dark.text} size={28} />
          </Pressable>,
        headerLeft: () =>
          <></>
      }}
      />
      <View style={[gStyles.defaultContainer, { backgroundColor: Colors.dark.mainColorDark }]}>

        {/* Main content */}
        <ScrollView style={gStyles.fullScreenBackgroundContainer} showsVerticalScrollIndicator={false}>
          {/* Recipe image */}
          <Image
            style={gStyles.image}
            source={recipe.imageUrl == '' ? require("../../assets/images/no-image.png") : { uri: recipe.imageUrl }}
          />

          <View style={gStyles.fullScreenContentContainer}>
            <View>
              {/* Recipe name and actions */}
              <View style={gStyles.HorizontalLayout}>
                <Alata24 style={gStyles.flex}>{recipe.name}</Alata24>
                <View style={[gStyles.mapHorizontal, gStyles.alignCenter]}>
                  {/* Rate recipe button */}
                  <Pressable onPress={() => router.push({ pathname: "/modals/RatingModal", params: { recipeID: params.recipeID } })} style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                    <MessageSquareIcon color={Colors.dark.text} size={24} />
                  </Pressable>
                  {/* Share recipe button */}
                  <Pressable onPress={() => router.push({ pathname: "/modals/shareRecipeModal", params: { recipeID: params.recipeID } })} style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                    <Share2 color={Colors.dark.text} size={24} />
                  </Pressable>
                  {/* Save recipe button */}
                  <Pressable onPress={saveRecipeToDatabase} style={({ pressed }) => [gStyles.iconButton, { backgroundColor:pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]} disabled={recipeSaved}>
                    <ArrowDownToLine color={recipeSaved ? Colors.dark.tint : Colors.dark.text} size={24} />
                  </Pressable>
                </View>
              </View>
              {/* Recipe cooking time */}
              <Alata14>{(recipe.cookHTime == '0' || recipe.cookHTime == '') ? '' : (recipe.cookHTime == '1') ? (recipe.cookHTime + ' hour ') : (recipe.cookHTime + ' hours ')}{(recipe.cookHTime == '0' || recipe.cookHTime == '' || recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : 'and '}{(recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : (recipe.cookMinTime == '1') ? (recipe.cookMinTime + ' minute ') : (recipe.cookMinTime + ' minutes ')}</Alata14>
            </View>

            {/* Display current categories */}
            <View style={gStyles.mapHorizontal}>
              {recipe.categories.map((category, index) => (
                <View key={index} style={gStyles.switchButton}>
                  <Alata12>{category}</Alata12>
                </View>
              ))}
            </View>

            {/* Display latest ratings */}
            {sortedRatings.length > 0 ?
              <View style={[gStyles.card, {gap: 8}]}>
              <Alata20>Latest Ratings:</Alata20>
              {sortedRatings.map((rating, index) => (
                <View style={[gStyles.cardHorizontal, {flexDirection: 'column', backgroundColor: Colors.dark.mainColorLight}]} key={index}>
                  <View style={{justifyContent: 'space-between', flexDirection: 'row'}}> 
                    <Alata18>{`${rating.username} (${rating.timestamp.toDate().toLocaleDateString()})`}</Alata18>
                    <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
                      <Alata18>{rating.rating}</Alata18>
                      <Star name="star" style={{ alignSelf: 'center', marginBottom: -3 }} strokeWidth={2.5} size={18} color={Colors.dark.text} />
                    </View>
                  </View>
                  {rating.comment !== '' && <Alata16>{rating.comment}</Alata16>}
                </View>
              ))}
            </View> : null
            }

            {/* Ingredients section */}
            <View style={gStyles.card}>
              <Alata20>Ingredients:</Alata20>
              <View style={gStyles.VerticalLayout}>
                {recipe.ingredients.map((ingredient, index) => (
                  <View key={index} style={gStyles.IngredientLayout}>
                    <Alata16 style={gStyles.flex}>{index + 1}. {ingredient.name}</Alata16>
                    <Alata16>{ingredient.amount} {ingredient.unit}</Alata16>
                  </View>
                ))}
              </View>
            </View>

            {/* Insturctions section */}
            <View style={gStyles.card}>
              <Alata20>Steps:</Alata20>
              <View style={gStyles.VerticalLayout}>
                {recipe.steps.map((step, index) => (
                  <View key={index} style={gStyles.IngredientLayout}>
                    <Alata16>{index + 1}. {step}</Alata16>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  )
}
function setForceRender(arg0: (prevState: any) => boolean) {
  throw new Error('Function not implemented.');
}

