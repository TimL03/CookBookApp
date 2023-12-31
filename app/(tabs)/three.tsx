import { View, SectionList } from 'react-native';
import React from 'react';
import Recipe from '../../components/RecipeFeedElement'
import { Alata20 } from '../../components/StyledText'
import gStyles from '../../constants/Global_Styles';
import { db } from '../../FirebaseConfig'
import { useState, useEffect } from "react"
import { RecipeData } from '../../api/cookBookRecipesFirebase/model';
import { fetchFeedRecipes, calculateAverageRating } from '../../api/cookBookRecipesFirebase/client';

export default function TabThreeScreen() {
  const [data, setData] = useState<Array<{ title: string, data: RecipeData[] }>>([]);
  const [averageRatings, setAverageRatings] = useState<Record<string, { average: number; totalRatings: number }>>({});

  useEffect(() => {
    const unsubscribe = fetchFeedRecipes(setData);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    data.forEach(section => {
      section.data.forEach(async recipe => {
        const result = await calculateAverageRating(recipe);
        setAverageRatings(prevState => ({
          ...prevState,
          [recipe.id]: result,
        }));
      });
    });
  }, [data]);


  useEffect(() => {
    const calculateAndSetAverageRating = async (recipe: RecipeData) => {
      const result = await calculateAverageRating(db, recipe);
      setAverageRatings(prevState => ({
        ...prevState,
        [recipe.id]: result,
      }));
    };

    data.forEach(section => {
      section.data.forEach(recipe => {
        calculateAndSetAverageRating(recipe);
      });
    });
  }, [data]);

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