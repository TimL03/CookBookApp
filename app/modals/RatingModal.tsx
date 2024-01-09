import React, { useState, ReactElement, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Button, Pressable } from 'react-native';
import { Rating } from 'react-native-ratings'; 
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { Alata20, Alata24 } from '../../components/StyledText';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchRatings, getRecipeByIdForFeed } from '../../api/cookBookRecipesFirebase/client';
import { RecipeData } from '../../api/cookBookRecipesFirebase/model';
import { useSession } from '../../api/firebaseAuthentication/client';
import { doc, collection, getDocs, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';


  const starImage = require('../../assets/images/star.png');

  const RatingModal = (): ReactElement => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const { session } = useSession();
    const userID = session;
    const [recipe, setRecipe] = useState<RecipeData | null>(null);
    const [sortedRatings, setSortedRatings] = useState<Array<{ id: string; username: string; rating: number; comment: string; timestamp: Timestamp }>>([]);

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

  const handleRating = (value: number) => {
    console.log('Received rating:', value);
    setRating(value);
  };

  const handleCommentChange = (text: string) => {
    setComment(text);
  };

  const handleSubmit = async () => {
    const ratingData = {
      rating,
      comment,
    };

    await handleRatingSubmit(ratingData);
  };

  useEffect(() => {
    fetchRatings(params.recipeID, setSortedRatings);
  }, [params.recipeID]);

  const handleRatingSubmit = async (ratingData: { rating: number; comment: string }) => {
    try {
      if (params.recipeID) {
        const recipeRef = doc(db, 'feed', params.recipeID.toString());
        const ratingsCollectionRef = collection(recipeRef, 'ratings');
        const ratingsSnapshot = await getDocs(ratingsCollectionRef);
        const ratingCount = ratingsSnapshot.size;
        const ratingID = `rating${ratingCount + 1}`;
        const ratingDocRef = doc(ratingsCollectionRef, ratingID);
  
        await setDoc(ratingDocRef, {
          userID,
          timestamp: Timestamp.now(),
          ...ratingData,
        });
        
        await fetchRatings(params.recipeID, setSortedRatings);
        console.log('Rating successfully added!');
        router.back();
      } else {
        console.error('No recipe ID found');
      }
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };


  return (
    <Pressable onPress={() => router.back()} style={gStyles.modalBackgroundContainer}>
      <View style={[gStyles.modalContentContainer,{backgroundColor: Colors.dark.background}]}>
        <Alata24 style={gStyles.alignCenter}>Rate the Recipe</Alata24>
        <Rating
          type='custom'
          ratingImage={starImage}
          ratingColor={Colors.dark.rating}
          startingValue={0}
          ratingBackgroundColor={Colors.dark.background}
          style={{ paddingVertical: 10}}
          showRating
          onFinishRating={handleRating}
          imageSize={40}
          
        />
        <Alata20>Comment:</Alata20>
        <View style={[gStyles.cardInput, gStyles.cardInputMultiline]}>
          <TextInput
            multiline
            numberOfLines={3}
            style={[gStyles.textInput, gStyles.textAlignVerticalTop]}
            placeholder="Optional comment"
            value={comment}
            onChangeText={handleCommentChange}
            placeholderTextColor={Colors.dark.text}
            />
        </View>
        <Pressable style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]} onPress={handleSubmit}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>Submit Review</Alata20>
        </Pressable>
      </View>
    </Pressable>
  );
};


export default RatingModal;

const styles = StyleSheet.create({
  ratingContainerStyle: {
    backgroundColor: Colors.dark.background,
  },
});
function setSortedRatings(arg0: any): void {
  throw new Error('Function not implemented.');
}

