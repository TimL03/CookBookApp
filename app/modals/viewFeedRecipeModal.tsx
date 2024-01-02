import React, { useState, useEffect } from 'react';
import { View, Image, Pressable, Modal } from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { Share2, ArrowDownToLine, X, MessageSquareIcon } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alata20, Alata12, Alata16, Alata14, Alata24 } from '../../components/StyledText';
import ShareRecipeScreen from './shareRecipeModal';
import { db, auth } from '../../FirebaseConfig'
import { doc, setDoc, Timestamp, collection, getDocs } from 'firebase/firestore';
import RatingModal from './RatingModal';
import { RecipeData } from '../../api/cookBookRecipesFirebase/model';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { getRecipeByIdForFeed } from '../../api/cookBookRecipesFirebase/client';


// Define the main component
export default function ViewFeedRecipeScreen() {

  // State variables
  const [isShareRecipeModalVisible, setIsShareRecipeModalVisible] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [sortedRatings, setSortedRatings] = useState<Array<{ id: string; username: string; rating: number; comment: string; timestamp: Timestamp }>>([]);

  const [recipe, setRecipe] = useState<RecipeData | null>(null);

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

  // Function to sort ratings by timestamp
  const sortRatingsByTimestamp = (ratings: Array<{ id: string, username: string, rating: number, comment: string, timestamp: Timestamp }>) => {
    return ratings.sort((a, b) => b.timestamp - a.timestamp);
  };

  // Effect hook to fetch ratings on component mount
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersMap = new Map();
        usersSnapshot.forEach(doc => {
          const userData = doc.data();
          usersMap.set(userData.uid, userData.username);
        });
  
        if (params.recipeID) {
          const recipeRef = doc(db, 'feed', params.recipeID.toString());
          const ratingsCollectionRef = collection(recipeRef, 'ratings');
          const ratingsSnapshot = await getDocs(ratingsCollectionRef);
  
          let ratingsData = [];
          ratingsSnapshot.forEach(ratingDoc => {
            const ratingData = ratingDoc.data();
            const username = usersMap.get(ratingData.userID) || 'Unknown';
            ratingsData.push({
              id: ratingDoc.id,
              username,
              rating: ratingData.rating,
              comment: ratingData.comment,
              timestamp: ratingData.timestamp
            });
          });
  
          ratingsData = sortRatingsByTimestamp(ratingsData);
          setSortedRatings(ratingsData);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };
  
    fetchRatings();
  }, [params.recipeID]);

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

  // Function to handle rating submission
  const handleRatingSubmit = async (ratingData: { rating: number; comment: string }) => {
    try {
      // Get current user
      const user = auth.currentUser;
      const userID = user ? user.uid : null;

      // Prepare data for rating submission
      const recipeRef = doc(db, 'feed', recipe.id);
      const ratingsCollectionRef = collection(recipeRef, 'ratings');
      const ratingsSnapshot = await getDocs(ratingsCollectionRef);
      const ratingCount = ratingsSnapshot.size;
      const ratingID = `rating${ratingCount + 1}`;
      const ratingDocRef = doc(ratingsCollectionRef, ratingID);

      // Submit rating to Firebase
      await setDoc(ratingDocRef, {
        userID,
        timestamp: Timestamp.now(),
        ...ratingData,
      });

      console.log('Rating successfully added!');
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

  // Function to toggle the Share Recipe modal
  const toggleModal = () => {
    setIsShareRecipeModalVisible(!isShareRecipeModalVisible);
  };

  // Function to save recipe to the database
  const saveRecipeToDatabase = async () => {
    try {
      // Get current user
      const user = auth.currentUser;
      const userID = user ? user.uid : null;

      // Save recipe data to Firebase
      const recipeRef = doc(db, 'recipes', recipe.id);
      await setDoc(recipeRef, {
        name: recipe.name,
        cookHTime: recipe.cookHTime,
        cookMinTime: recipe.cookMinTime,
        imageUrl: recipe.imageUrl,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        userID: userID,
        categories: recipe.categories,
      });

      console.log('Recipe successfully saved!');
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  // Return the JSX for the component
  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: 'From your Cookbook',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: Colors.dark.mainColorDark,
        },
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
                  <Pressable onPress={() => setIsRatingModalVisible(true)} style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                    <MessageSquareIcon color={Colors.dark.text} size={24} />
                  </Pressable>
                  {/* Share recipe button */}
                  <Pressable onPress={toggleModal} style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                    <Share2 color={Colors.dark.text} size={24} />
                  </Pressable>
                  {/* Save recipe button */}
                  <Pressable onPress={saveRecipeToDatabase} style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                    <ArrowDownToLine color={Colors.dark.text} size={24} />
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

            {/* Display latest ratings */}
            <View style={gStyles.card}>
              <Alata20>Latest Ratings:</Alata20>
              {sortedRatings.map((rating, index) => (
                <View key={index}>
                  <Alata16>{`${rating.username} rated ${rating.rating} stars: ${rating.comment} ${rating.timestamp.toDate().toLocaleString()}`} </Alata16>
                </View>
              ))}
            </View>
          </View>

          {/* Add your opinion button */}
          <View>
            {/* Rating modal */}
            <RatingModal
              isVisible={isRatingModalVisible}
              onClose={() => setIsRatingModalVisible(false)}
              onSubmit={handleRatingSubmit}
            />
          </View>
        </ScrollView>

        {/* Share Recipe modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isShareRecipeModalVisible}
          onRequestClose={() => setIsShareRecipeModalVisible(false)}
        >
          <ShareRecipeScreen closeModal={() => setIsShareRecipeModalVisible(false)}
            recipe={recipe} />
        </Modal>

      </View>
    </>
  )
}
