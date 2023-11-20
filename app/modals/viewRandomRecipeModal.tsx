import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import { Share2, PenSquare, Trash2 } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AlataLarge, AlataMedium } from '../../components/StyledText';

interface ViewRandomRecipeScreenProps {
  closeModal: () => void;
  onFindNewRecipe: () => void;
  recipe: {
    strMeal: string;
    strMealThumb: string;
    idMeal: string;
    strInstructions: string;
    strIngredient1?: string;
    strIngredient2?: string;
    strIngredient3?: string;
    strIngredient4?: string;
    strIngredient5?: string;
    strIngredient6?: string;
    strIngredient7?: string;
    strIngredient8?: string;
    strIngredient9?: string;
    strIngredient10?: string;
    strIngredient11?: string;
    strIngredient12?: string;
    strIngredient13?: string;
    strIngredient14?: string;
    strIngredient15?: string;
    strIngredient16?: string;
    strIngredient17?: string;
    strIngredient18?: string;
    strIngredient19?: string;
    strIngredient20?: string;
    strMeasure1?: string;
    strMeasure2?: string;
    strMeasure3?: string;
    strMeasure4?: string;
    strMeasure5?: string;
    strMeasure6?: string;
    strMeasure7?: string;
    strMeasure8?: string;
    strMeasure9?: string;
    strMeasure10?: string;
    strMeasure11?: string;
    strMeasure12?: string;
    strMeasure13?: string;
    strMeasure14?: string;
    strMeasure15?: string;
    strMeasure16?: string;
    strMeasure17?: string;
    strMeasure18?: string;
    strMeasure19?: string;
    strMeasure20?: string;
  };
}

export default function ViewRandomRecipeScreen({ closeModal, recipe, onFindNewRecipe }: ViewRandomRecipeScreenProps) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}`;
    const measureKey = `strMeasure${i}`;

    const recipeAny: any = recipe;
    const ingredient = recipeAny[ingredientKey];
    const measure = recipeAny[measureKey];

    if (ingredient) {
      ingredients.push({ name: ingredient, measure: measure || '' });
    }
  }


  return (
    <View style={styles.container}>
      <TopModalBar title="From your Cookbook" onClose={closeModal} />
      <ScrollView style={styles.scrollView}>
        <Image
          style={styles.image}
          source={{ uri: recipe.strMealThumb }}
        />
        <View style={{ padding: 30 }}>
        <AlataLarge>
            {recipe.strMeal}
          </AlataLarge>
        <View>
          <AlataLarge>Ingredients:</AlataLarge>
            {ingredients.map((item, index) => (
              <AlataLarge key={index}>{item.name} - {item.measure}</AlataLarge>
            ))}
          </View>
          <AlataLarge>{recipe.strInstructions}</AlataLarge>
        </View>
        <Pressable onPress={onFindNewRecipe} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
        <AlataLarge style={{marginBottom: 5, textAlign: 'center'}}>Get new recipe!</AlataLarge>
      </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.mainColorDark,
  },
  scrollView: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: Colors.dark.background,
    flexDirection: 'column',
    gap: 20,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  button: {
    backgroundColor: Colors.dark.mainColorDark,
    borderRadius: 10, 
    width: 200,
    padding: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});