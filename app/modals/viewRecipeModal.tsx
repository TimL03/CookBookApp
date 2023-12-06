import React, { useState } from 'react';
import { View, Image, Pressable, Modal } from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import { Share2, PenSquare, Trash2, ArrowUpToLine } from 'lucide-react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { AlataLarge, AlataMedium, AlataText } from '../../components/StyledText';
import ItemSelectorSwitch from '../../components/ItemSelectorSwitch';
import ShareRecipeScreen from './shareRecipeModal';
import { db } from '../../FirebaseConfig'
import { doc, setDoc, Timestamp, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DropDown from '../../components/DropDown';
import * as ImagePicker from 'expo-image-picker';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface AddRecipeScreenProps {
  closeModal: () => void;
  recipe: {
    id: string;
    categories: string[];
    name: string;
    cookHTime: string;
    cookMinTime: string;
    description: string;
    ingredients: Ingredient[];
    steps: string[];
    imageUrl: string;
    userID: string;
  };
}

export default function ViewRecipeScreen({ closeModal, recipe }: AddRecipeScreenProps) {
  const [isShareRecipeModalVisible, setIsShareRecipeModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(recipe);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editedCategories, setEditedCategories] = useState<string[]>(recipe.categories);
  const [editedSteps, setEditedSteps] = useState(recipe.steps);

  const units = [
    { key: '1', value: 'tbsp' },
    { key: '2', value: 'tsp' },
    { key: '3', value: 'cup' },
    { key: '4', value: 'ml' },
    { key: '5', value: 'l' },
    { key: '6', value: 'g' },
    { key: '7', value: 'kg' },
    { key: '8', value: 'x' },
  ];

  const toggleModal = () => {
    setIsShareRecipeModalVisible(!isShareRecipeModalVisible);
  };

  const toggleEditMode = () => {
    setIsEditMode(true);
    setEditedRecipe(recipe);
  };

  const handleNameChange = (newName: string) => {
    setEditedRecipe({ ...editedRecipe, name: newName });
  };

  const handleCookHTimeChange = (newCookHTime: string) => {
    setEditedRecipe({ ...editedRecipe, cookHTime: newCookHTime });
  };

  const handleCookMinTimeChange = (newCookMinTime: string) => {
    setEditedRecipe({ ...editedRecipe, cookMinTime: newCookMinTime });
  };

  const updateStep = (index: number, text: string) => {
    const newSteps = [...editedSteps];
    newSteps[index] = text;
    setEditedSteps(newSteps);
  };

  const addStep = (index: number) => {
    const newSteps = [...editedRecipe.steps];
    newSteps.splice(index + 1, 0, '');
    setEditedRecipe({ ...editedRecipe, steps: newSteps });
  };


  const removeStep = (index: number) => {
    const newSteps = editedRecipe.steps.filter((_, stepIndex) => stepIndex !== index);
    setEditedRecipe({ ...editedRecipe, steps: newSteps });
  };

  const handleIngredientChange = (index: number, newIngredientName: string, newUnit: string, newAmount: string) => {
    const updatedIngredients = editedRecipe.ingredients.map((ingredient, idx) => {
      if (idx === index) {
        return { ...ingredient, name: newIngredientName, unit: newUnit, amount: newAmount };
      }
      return ingredient;
    });

    setEditedRecipe({ ...editedRecipe, ingredients: updatedIngredients });
  };

  const addIngredient = (index: number) => {
    const newIngredient = { name: '', amount: '', unit: 'x' };
    const newIngredients = [
      ...editedRecipe.ingredients.slice(0, index + 1),
      newIngredient,
      ...editedRecipe.ingredients.slice(index + 1)
    ];
    setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = editedRecipe.ingredients.filter((_, i) => i !== index);
    setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
  };

  const updateCategory = (index: number, text: string) => {
    const newCategories = [...editedCategories];
    newCategories[index] = text;
    setEditedCategories(newCategories);
  };

  const addCategory = (index: number) => {
    const newCategories = [...editedCategories];
    newCategories.splice(index + 1, 0, '');
    setEditedCategories(newCategories);
  };

  const removeCategory = (index: number) => {
    const newCategories = editedCategories.filter((_, categoryIndex) => categoryIndex !== index);
    setEditedCategories(newCategories);
  };

  const addImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
    });

    if (result && !result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      const newImageUrl = await uploadImage(uri, editedRecipe.name);
      setEditedRecipe({ ...editedRecipe, imageUrl: newImageUrl });
    }
  };


  const uploadImage = async (uri: string, recipeName: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage();
    const imagePath = `images/${recipeName}/${Date.now()}.jpg`;
    const storageRef = ref(storage, imagePath);

    const snapshot = await uploadBytes(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
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

  const deleteRecipe = async () => {
    try {
      const recipeRef = doc(db, 'recipes', recipe.id);
      await deleteDoc(recipeRef);
      console.log('Rezept erfolgreich gelöscht');
      // Weitere Aktionen nach dem Löschen (z.B. Schließen des Modals oder Aktualisierung der Anzeige)
    } catch (error) {
      console.error('Fehler beim Löschen des Rezepts:', error);
    }
  };

  const saveChangesToFirebase = async () => {
    try {
      let imageUrl = editedRecipe.imageUrl;
      if (imageUri && imageUri !== recipe.imageUrl) {
        imageUrl = await uploadImage(imageUri, editedRecipe.name);
      }

      const updatedRecipe = {
        ...editedRecipe,
        imageUrl: editedRecipe.imageUrl
      };

      const recipeRef = doc(db, 'recipes', recipe.id);
      await setDoc(recipeRef, updatedRecipe);
      console.log('Rezept erfolgreich aktualisiert!');
      setIsEditMode(false);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Rezepts:', error);
    }
  };


  return (
    <View style={[gStyles.defaultContainer, {backgroundColor: Colors.dark.mainColorDark}]}>
      {/* Top bar with close button */}
      <TopModalBar title="From your Cookbook" onClose={closeModal} />

      {/* Main content */}
      <ScrollView style={styles.scrollView}>
        {/* Recipe image */}
        <Image
          style={styles.image}
          source={recipe.imageUrl == '' ? require("../../assets/images/no-image.png") : { uri: recipe.imageUrl }}
        />

        {/* Recipe details */}
        <View style={{ padding: 30, marginTop: -20, backgroundColor: Colors.dark.mainColorDark, borderRadius: 15, flex: 1 }}>
          {/* Recipe name and action buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AlataText style={{ fontSize: 25, color: Colors.dark.text, flex: 2 }}>{recipe.name}</AlataText>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flex: 1 }}>
              {/* Share button */}
              <Pressable onPress={toggleModal} style={({ pressed }) => [{ alignSelf: 'center', padding: 5, borderRadius: 20, backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                <Share2 color={Colors.dark.text} size={24} />
              </Pressable>
             
              {/* Push to discover button */}
              <Pressable onPress={handleDatabaseSave} style={({ pressed }) => [{ alignSelf: 'center', padding: 5, borderRadius: 20, backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                <ArrowUpToLine color={Colors.dark.text} size={24} />
              </Pressable>

              {/* Delete button */}
              <Pressable style={({ pressed }) => [{ alignSelf: 'center', padding: 5, borderRadius: 20, backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                <Trash2 color={Colors.dark.text} size={24} />
              </Pressable>

              {/* Edit button */}
              <Pressable style={({ pressed }) => [{ alignSelf: 'center', padding: 5, borderRadius: 20, backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough }]}>
                <PenSquare color={Colors.dark.text} size={24} />
              </Pressable>
            </View>

            {/* Cook time */}
            <Alata14>{(recipe.cookHTime == '0' || recipe.cookHTime == '') ? '' : (recipe.cookHTime == '1') ? (recipe.cookHTime + ' hour ') : (recipe.cookHTime + ' hours ')}{(recipe.cookHTime == '0' || recipe.cookHTime == '' || recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : 'and '}{(recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : (recipe.cookMinTime == '1') ? (recipe.cookMinTime + ' minute ') : (recipe.cookMinTime + ' minutes ')}</Alata14>
          </View>

          {/* Cook time */}
          <AlataMedium>{(recipe.cookHTime == '0' || recipe.cookHTime == '') ? '' : (recipe.cookHTime == '1') ? (recipe.cookHTime + ' hour ') : (recipe.cookHTime + ' hours ')}{(recipe.cookHTime == '0' || recipe.cookHTime == '' || recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : 'and '}{(recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : (recipe.cookMinTime == '1') ? (recipe.cookMinTime + ' minute ') : (recipe.cookMinTime + ' minutes ')}</AlataMedium>

          {/* Categories */}
          <View style={{ justifyContent: 'flex-start', flexDirection: 'row', paddingTop: 20, marginBottom: 20, flexWrap: 'wrap' }}>
            {currentCategories?.map((item, index) => (
              <View key={item.key} style={{ backgroundColor: Colors.dark.tint, padding: 10, borderRadius: 20, marginRight: 5 }}>
                <AlataText style={{ fontSize: 12 }}>{item.value}</AlataText>
              </View>
            ))
          ) : (
            editedCategories.map((category, index) => (
              <View key={index} style={{ backgroundColor: Colors.dark.tint, padding: 10, borderRadius: 20, marginRight: 5 }}>
                <AlataText style={{ fontSize: 12 }}>{category}</AlataText>
              </View>
            ))
          )}

          {/* Ingredients */}
          <View style={styles.contentBox}>
            <AlataText style={{ fontSize: 20 }}>Ingredients:</AlataText>
            <View style={{ flexDirection: 'column', flexWrap: 'wrap', paddingHorizontal: 10, paddingTop: 5 }}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={{ paddingVertical: 2, justifyContent: 'space-between', flexDirection: 'row' }}>
                  <AlataText style={{ flex: 1, fontSize: 16 }}>{index + 1}. {ingredient.name}</AlataText>
                  <AlataText style={{ fontSize: 16 }}>{ingredient.amount} {ingredient.unit}</AlataText>
                </View>
              ))}
            </View>
          </View>

          {/* Steps */}
          <View style={styles.contentBox}>
            <AlataText style={{ fontSize: 20 }}>Steps:</AlataText>
            <View style={{ flexDirection: 'column', flexWrap: 'wrap', paddingLeft: 10, paddingTop: 5 }}>
              {recipe.steps.map((step, index) => (
                <View key={index} style={{ paddingVertical: 10, justifyContent: 'space-between' }}>
                  <AlataText style={{ fontSize: 16 }}>{index + 1}. {step}</AlataText>
                </View>
              ))}
            </View>
          </View>

        </View>
      </ScrollView >

      {/* Share Recipe Modal */}
      < Modal
        animationType="slide"
        transparent={true}
        visible={isShareRecipeModalVisible}
        onRequestClose={() => setIsShareRecipeModalVisible(false)
        }
      >
        {/* Pass closeModal and recipe as props to ShareRecipeScreen */}
        < ShareRecipeScreen closeModal={() => setIsShareRecipeModalVisible(false)} recipe={recipe} />
      </Modal >
    </View >
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
});
