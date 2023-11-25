import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import { Share2, PenSquare, Trash2, Save, ArrowDownToLine } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AlataLarge, AlataMedium, AlataText } from '../../components/StyledText';

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
          source={recipe.strMealThumb == null ? {uri: '../../assets/images/no-image.png'} : { uri: recipe.strMealThumb }}
        />
        <View style={{ padding: 30, marginTop: -20, backgroundColor: Colors.dark.mainColorDark, borderRadius: 15, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'Alata', fontSize: 24, color: Colors.dark.text }}>{recipe.strMeal}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable style={{ alignSelf: 'center' }}>
                <Share2 color={Colors.dark.text} size={24} style={{ marginBottom: -5 }} />
              </Pressable>
              <Pressable style={{ alignSelf: 'center' }}>
                <ArrowDownToLine color={Colors.dark.text} size={24} style={{ marginBottom: -5 }} />
              </Pressable>
            </View>
          </View>

          <View style={{ justifyContent: 'flex-start', flexDirection:'row', paddingTop: 20, marginBottom:20,flexWrap:'wrap'}}>
            
          </View>

        <View style={styles.contentBox}>
            <AlataText style={{fontSize: 20}}>Ingredients:</AlataText>
            <View style={{ flexDirection: 'column', flexWrap: 'wrap', paddingHorizontal: 10, paddingTop: 5}}>
              {ingredients.map((item, index) => (
                <View key={index} style={{paddingVertical: 2, justifyContent: 'space-between', flexDirection: 'row'}}>
                  <AlataText style={{flex: 1, fontSize: 16}}>{index + 1}. {item.name}</AlataText>
                  <AlataText style={{fontSize: 16}}>{item.measure}</AlataText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.contentBox}>
            <AlataText style={{fontSize: 20}}>Instructions:</AlataText>
            <View style={{ flexDirection: 'column', flexWrap: 'wrap', paddingLeft: 10, paddingTop: 5 }}>
              <View style={{paddingVertical: 10, justifyContent: 'space-between'}}>
                <AlataText style={{fontSize: 16}}>{recipe.strInstructions}</AlataText>
              </View>
            </View>
          </View>
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
    backgroundColor: Colors.dark.mainColorDark,
    flexDirection: 'column',
    gap: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  contentBox: {
    backgroundColor: Colors.dark.background,
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: Colors.dark.mainColorDark,
    borderRadius: 10, 
    width: 200,
    padding: 10,
    marginBottom: 40,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});