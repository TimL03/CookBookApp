import { View, SectionList, Modal } from 'react-native';
import React from 'react';
import Recipe from '../../components/RecipeFeedElement'
import { Alata20 } from '../../components/StyledText'
import gStyles from '../../constants/Global_Styles';
import { db } from '../../FirebaseConfig'
import { useState, useEffect } from "react"
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';

interface RecipeData {
  id: string;
  name: string;
  categories: string[];
  cookHTime: string;
  cookMinTime: string;
  description: string;
  ingredients: string[];
  steps: string[];
  imageUrl: string;
  userID: string;
}

interface GroupedByCategory {
  [key: string]: RecipeData[];
}
export default function TabThreeScreen() {
  const [data, setData] = useState<Array<{ title: string, data: RecipeData[] }>>([]);
  const [averageRatings, setAverageRatings] = useState<Record<string, { average: number; totalRatings: number }>>({});



  useEffect(() => {
    const feedQuery = query(collection(db, "feed"));

    const unsubscribe = onSnapshot(feedQuery, (querySnapshot) => {
      const feedRecipes: RecipeData[] = [];
      querySnapshot.forEach((doc) => {
        const recipeData = doc.data() as Omit<RecipeData, 'id'>;
        feedRecipes.push({ id: doc.id, ...recipeData });
      });

      const groupedByCategory = feedRecipes.reduce((acc, recipe) => {
        const category = recipe.categories[0];
        if (category) {
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(recipe);
        }
        return acc;
      }, {} as GroupedByCategory);

      const sections = Object.keys(groupedByCategory).map(key => ({
        title: key,
        data: groupedByCategory[key],
      }));

      setData(sections);
    });

    return () => unsubscribe();
  }, []);

  const calculateAverageRating = async (db: any, recipe: RecipeData) => {
    try {
      const ratingsCollectionRef = collection(db, 'feed', recipe.id, 'ratings');
      const ratingsSnapshot = await getDocs(ratingsCollectionRef);

      console.log('Recipe ID:', recipe.id);

      if (ratingsSnapshot.empty) {
        return { average: 0, totalRatings: 0 };
      }

      const ratingsData: number[] = [];

      ratingsSnapshot.forEach((doc) => {
        const rating = doc.data().rating || 0;
        console.log('Average Rating:', rating);
        ratingsData.push(rating);
      });

      const sum = ratingsData.reduce((acc, rating) => acc + (parseFloat(rating) || 0), 0);
      const average = sum / ratingsData.length;


      console.log('Average Rating:', average);
      return { average, totalRatings: ratingsData.length };
    } catch (error) {
      return { average: 0, totalRatings: 0 };
    }
  };

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