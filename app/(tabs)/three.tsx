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
  const data = useFeedRecipes();
  const [averageRatings, setAverageRatings] = useState<Record<string, { average: number; totalRatings: number }>>({});

  useFocusEffect(
    React.useCallback(() => {
      data.forEach(section => {
        section.data.forEach(async recipe => {
          const result = await calculateAverageRating(recipe);
          setAverageRatings(prevState => ({
            ...prevState,
            [recipe.id]: result,
          }));
        });
      });
      return () => {}; // This is the cleanup function, it's not needed in this case but it's required by the useCallback hook
    }, [data])
  );

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