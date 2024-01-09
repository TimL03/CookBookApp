import { View, SectionList } from 'react-native';
import React from 'react';
import Recipe from '../../components/RecipeFeedElement'
import { Alata20 } from '../../components/StyledText'
import gStyles from '../../constants/Global_Styles';
import { db } from '../../FirebaseConfig'
import { useState, useEffect } from "react"
import { RecipeData } from '../../api/cookBookRecipesFirebase/model';
import { useFeedRecipes, calculateAverageRating } from '../../api/cookBookRecipesFirebase/client';
import { useFocusEffect } from 'expo-router';

export default function TabThreeScreen() {
  // Fetch feed recipes data
  const data = useFeedRecipes();
  
  // Initialize state to store average ratings for each recipe
  const [averageRatings, setAverageRatings] = useState<Record<string, { average: number; totalRatings: number }>>({});

  // Use the useFocusEffect hook to trigger actions when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Iterate through the feed recipes data
      data.forEach(section => {
        section.data.forEach(async recipe => {
          // Calculate the average rating for each recipe
          const result = await calculateAverageRating(recipe);
          
          // Update the state with the calculated average rating
          setAverageRatings(prevState => ({
            ...prevState,
            [recipe.id]: result,
          }));
        });
      });
      return () => {}; // This is the cleanup function, not needed in this case, but required by useCallback
    }, [data]) // Trigger the effect whenever 'data' changes
  );

  // Render the component with the fetched data and calculated average ratings
  return (
    <View style={gStyles.screenContainer}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Recipe item={item} averageRating={averageRatings[item.id] || { average: 0, totalRatings: 0 }} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Alata20>{title}</Alata20>
        )}
      />
    </View>
  )
}