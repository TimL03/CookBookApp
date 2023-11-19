import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import { Share2, PenSquare, Trash2 } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AlataLarge, AlataMedium } from '../../components/StyledText';



interface AddRecipeScreenProps {
  closeModal: () => void;
  recipe: {
    name: string;
    cookHTime: string;
    cookMinTime: string;
    imageUrl: string;
    ingredients: string[];
    steps: string[];
  };
}

export default function ViewRecipeScreen({ closeModal, recipe }: AddRecipeScreenProps) {
  return (
    <View style={styles.container}>
      <TopModalBar title="From your Cookbook" onClose={closeModal} />
      <ScrollView style={styles.scrollView}>
        <Image
          style={styles.image}
          source={{ uri: recipe.imageUrl }}
        />
        <View style={{ padding: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'Alata', fontSize: 25, color: Colors.dark.text }}>{recipe.name}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable style={{ alignSelf: 'center' }}>
                <Share2 color={Colors.dark.text} size={24} style={{ marginBottom: -5 }} />
              </Pressable>
              <Pressable style={{ alignSelf: 'center' }}>
                <Trash2 color={Colors.dark.text} size={24} style={{ marginBottom: -5 }} />
              </Pressable>
              <Pressable style={{ alignSelf: 'center' }}>
                <PenSquare color={Colors.dark.text} size={24} style={{ marginBottom: -5 }} />
              </Pressable>
            </View>
          </View>
          <AlataMedium>{recipe.cookHTime} h {recipe.cookMinTime} min</AlataMedium>
          <View>
            <AlataMedium>Ingredients:</AlataMedium>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={{ margin: 5, padding: 5 }}>
                  <AlataMedium>{ingredient}</AlataMedium>
                </View>
              ))}
            </View>
            <View>
              <AlataMedium>Steps:</AlataMedium>
              {recipe.steps.map((step, index) => (
                <AlataMedium key={index}>{step}</AlataMedium>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
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
});