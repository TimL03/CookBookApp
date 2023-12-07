import React, { useState } from 'react';
import { View, Image, Pressable, Modal } from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { Share2, PenSquare, Trash2, ArrowUpToLine } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alata20, Alata12, Alata24, Alata14, Alata16 } from '../../components/StyledText';
import ShareRecipeScreen from './shareRecipeModal';
import { db } from '../../FirebaseConfig'
import { doc, setDoc, Timestamp } from 'firebase/firestore';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface AddRecipeScreenProps {
  closeModal: () => void;
  recipe: {
    id: string;
    category: string;
    name: string;
    cookHTime: string;
    cookMinTime: string;
    ingredients: Ingredient[];
    steps: string[];
    imageUrl: string;
    userID: string;
  };
}

export default function ViewRecipeScreen({ closeModal, recipe }: AddRecipeScreenProps) {
  const [isShareRecipeModalVisible, setIsShareRecipeModalVisible] = useState(false);

  const toggleModal = () => {
    setIsShareRecipeModalVisible(!isShareRecipeModalVisible);
  };

  const handleDatabaseSave = async () => {
    try {
      const recipeRef = doc(db, 'feed', recipe.id);

      await setDoc(recipeRef, {
        name: recipe.name,
        category: recipe.category,
        cookHTime: recipe.cookHTime,
        cookMinTime: recipe.cookMinTime,
        imageUrl: recipe.imageUrl,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        userID: recipe.userID,
        timestamp: Timestamp.now(),
      });

      console.log('Rezept erfolgreich gespeichert!');
    } catch (error) {
      console.error('Fehler beim Speichern des Rezepts:', error);
    }
  };

  const currentCategories = [
    { key: '1', value: 'Breakfast', selected: null },
    { key: '2', value: 'Snacks', selected: null },
    { key: '3', value: 'Desert', selected: null },
  ];

  return (
    <View style={[gStyles.defaultContainer, {backgroundColor: Colors.dark.mainColorDark}]}>
      {/* Top bar with close button */}
      <TopModalBar title="From your Cookbook" onClose={closeModal} />

      {/* Main content */}
      <ScrollView style={gStyles.fullScreenBackgroundContainer}>
        {/* Recipe image */}
        <Image
          style={gStyles.image}
          source={recipe.imageUrl == '' ? require("../../assets/images/no-image.png") : { uri: recipe.imageUrl }}
        />

        {/* Recipe details */}
        <View style={gStyles.fullScreenContentContainer}>
          
          <View>
            {/* Recipe name and action buttons */}
            <View style={gStyles.HorizontalLayout}>
              <Alata24 style={gStyles.flex}>{recipe.name}</Alata24>
              {/* Share button */}
              <Pressable onPress={toggleModal} style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                  <Share2 color={Colors.dark.text} size={24} />
                </Pressable>
              
                {/* Push to discover button */}
                <Pressable onPress={handleDatabaseSave} style={({ pressed }) => [gStyles.iconButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                  <ArrowUpToLine color={Colors.dark.text} size={24} />
                </Pressable>

                {/* Delete button */}
                <Pressable style={({ pressed }) => [gStyles.iconButton, {backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                  <Trash2 color={Colors.dark.text} size={24} />
                </Pressable>

                {/* Edit button */}
                <Pressable style={({ pressed }) => [gStyles.iconButton, {backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                  <PenSquare color={Colors.dark.text} size={24} />
                </Pressable>  
            </View>

            {/* Cook time */}
            <Alata14>{(recipe.cookHTime == '0' || recipe.cookHTime == '') ? '' : (recipe.cookHTime == '1') ? (recipe.cookHTime + ' hour ') : (recipe.cookHTime + ' hours ')}{(recipe.cookHTime == '0' || recipe.cookHTime == '' || recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : 'and '}{(recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : (recipe.cookMinTime == '1') ? (recipe.cookMinTime + ' minute ') : (recipe.cookMinTime + ' minutes ')}</Alata14>
          </View>

          {/* Categories */}
          <View style={gStyles.mapHorizontal}>
            {currentCategories?.map((item, index) => (
              <View key={item.key} style={gStyles.switchButton}>
                <Alata12>{item.value}</Alata12>
              </View>
            ))}
          </View>

          {/* Ingredients */}
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

          {/* Steps */}
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

      {/* Share Recipe Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShareRecipeModalVisible}
        onRequestClose={() => setIsShareRecipeModalVisible(false)}
      >
        {/* Pass closeModal and recipe as props to ShareRecipeScreen */}
        <ShareRecipeScreen closeModal={() => setIsShareRecipeModalVisible(false)} recipe={recipe} />
      </Modal>
    </View>
  );
}
