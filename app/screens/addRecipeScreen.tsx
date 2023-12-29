import React, { useState } from 'react';
import { TextInput, StyleSheet, ScrollView, View, Pressable, Text, Image } from 'react-native';
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { db } from '../../FirebaseConfig'
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Alata16, Alata20, Alata12, AlataText } from '../../components/StyledText';
import { X, PlusCircle, Plus, Save, ChevronDown } from 'lucide-react-native';
import TopModalBar from '../../components/topModalBar';
import DropDown from '../../components/DropDown';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface AddRecipeScreenProps {
  closeModal: () => void;
  userID: string | null;
  recipeToEdit?: {
    id: string;
    categories: string[];
    name: string;
    cookHTime: string;
    cookMinTime: string;
    ingredients: Ingredient[];
    steps: string[];
    imageUrl: string;
    userID: string;
  };
}

export default function AddRecipeScreen({ closeModal, userID, recipeToEdit }: AddRecipeScreenProps) {
  const [name, setName] = useState('');
  const [cookHTime, setCookHTime] = useState('');
  const [cookMinTime, setCookMinTime] = useState('');
  const [categories, setCategories] = useState<string[]>(['']);
  const [ingredients, setIngredients] = useState([{ name: '', unit: 'x', amount: '' },]);
  const [steps, setSteps] = useState(['']);
  const [imageUri, setImageUri] = useState<string | null>(null);

  React.useEffect(() => {
    if (recipeToEdit) {
      setName(recipeToEdit.name);
      setCookHTime(recipeToEdit.cookHTime);
      setCookMinTime(recipeToEdit.cookMinTime);
      setCategories(recipeToEdit.categories);
      setIngredients(recipeToEdit.ingredients);
      setSteps(recipeToEdit.steps);
      setImageUri(recipeToEdit.imageUrl);
    }
  }, [recipeToEdit]);

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
      quality: 1,
    });

    if (result && !result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
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

  const handleSave = async () => {
    try {
      let imageUrl = imageUri;
      // Bild nur hochladen, wenn ein neues Bild ausgewählt wurde
      if (imageUri && !recipeToEdit?.imageUrl) {
        imageUrl = await uploadImage(imageUri, name);
      }

      const recipeData = {
        name,
        cookHTime,
        cookMinTime,
        categories,
        ingredients,
        steps,
        imageUrl,
        userID
      };

      // Bestehendes Rezept aktualisieren, falls eine ID vorhanden ist
      if (recipeToEdit && recipeToEdit.id) {
        const recipeRef = doc(db, 'recipes', recipeToEdit.id);
        await setDoc(recipeRef, recipeData);
        console.log('Rezept aktualisiert mit ID: ', recipeToEdit.id);
      } else {
        // Neues Rezept hinzufügen
        const docRef = await addDoc(collection(db, 'recipes'), recipeData);
        console.log('Dokument geschrieben mit ID: ', docRef.id);
      }
      closeModal();
    } catch (e) {
      console.error('Fehler beim Speichern des Rezepts: ', e);
    }
  };



  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (indexToRemove: number) => {
    setSteps(steps.filter((_, index) => index !== indexToRemove));
  };


  const addCategory = () => {
    setCategories([...categories, '']);
  };

  const removeCategory = (index: number) => {
    const newCategories = [...categories];
    newCategories.splice(index, 1);
    setCategories(newCategories);
  };

  return (
    <View style={[gStyles.defaultContainer, { backgroundColor: Colors.dark.mainColorDark }]}>
      {/* Top bar with close button */}
      <TopModalBar title="Add Recipe" onClose={closeModal} />

      {/* Main content */}
      <ScrollView style={[gStyles.fullScreenBackgroundContainer, { backgroundColor: Colors.dark.background }]} keyboardShouldPersistTaps='handled'>

        {/* Recipe image selection */}
        <Pressable onPress={addImage}>
          {imageUri != null ?
            <Image
              style={gStyles.image}
              source={{ uri: imageUri }}
            />
            :
            <View style={styles.addImage}>
              <PlusCircle color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
              <Alata20>Add Image</Alata20>
            </View>
          }
        </Pressable>


        <View style={[gStyles.fullScreenContentContainerLessGap]}>
          {/* adding Recipe name */}
          <Alata20>Name:</Alata20>
          <View style={gStyles.cardInput}>
            <TextInput placeholder="Name" value={name} onChangeText={setName} style={gStyles.textInput} placeholderTextColor={Colors.dark.text} />
          </View>


          {/* adding Recipe category */}
          <Alata20>Categories:</Alata20>
          {categories.map((category, index) => (
            <View key={index} style={gStyles.cardInput}>
              <TextInput
                placeholder={`Category ${index + 1}`}
                value={category}
                placeholderTextColor={Colors.dark.text}
                onChangeText={(text) => {
                  const newCategories = [...categories];
                  newCategories[index] = text;
                  setCategories(newCategories);
                }}
                style={gStyles.textInput}
              />
              <Pressable onPress={() => removeCategory(index)} style={[gStyles.iconButton, styles.marginRight]}>
                <X color={Colors.dark.text} size={22} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
              </Pressable>
            </View>
          ))}
          <Pressable onPress={addCategory} style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]}>
            <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
          </Pressable>

          {/* adding Recipe preparation time */}
          <Alata20>Preperation Time:</Alata20>
          <View style={[gStyles.HorizontalLayout, { gap: 12 }]}>
            <View style={[gStyles.cardInput, gStyles.flex]}>
              <TextInput inputMode="numeric" maxLength={2} placeholder="00" value={cookHTime} onChangeText={setCookHTime} style={gStyles.textInput} placeholderTextColor={Colors.dark.text} />
              <Alata16 style={gStyles.alignCenter}>hours</Alata16>
            </View>

            <View style={[gStyles.cardInput, gStyles.flex]}>
              <TextInput inputMode="numeric" maxLength={2} placeholder="00" value={cookMinTime} onChangeText={setCookMinTime} style={gStyles.textInput} placeholderTextColor={Colors.dark.text} />
              <Alata16 style={gStyles.alignCenter}>minutes</Alata16>
            </View>
          </View>

          {/* adding Recipe ingredients */}
          <Alata20>Ingredients:</Alata20>
          <View style={styles.gap}>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={[gStyles.HorizontalLayout, { gap: 12, zIndex: 1 }]}>
                <View style={[gStyles.cardInput, { flex: 3 }]}>
                  <TextInput
                    placeholder={`Ingredient ${index + 1}`}
                    placeholderTextColor={Colors.dark.text}
                    value={ingredient.name}
                    onChangeText={(text) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].name = text;
                      setIngredients(newIngredients);
                    }}
                    style={gStyles.textInput}
                  />
                  <Pressable onPress={() => removeIngredient(index)} style={[gStyles.iconButton, styles.marginRight]}>
                    <X color={Colors.dark.text} size={22} strokeWidth='2.5' />
                  </Pressable>
                </View>
                <View style={styles.flex2}>
                  <DropDown
                    item={units}
                    selectedUnit={ingredient.unit}
                    selectedAmount={ingredient.amount}
                    onSelect={(unit, amount) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index] = { ...newIngredients[index], unit, amount };
                      setIngredients(newIngredients);
                    }}
                  />
                </View>
              </View>
            ))}

            <Pressable onPress={addIngredient} style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]}>
              <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={gStyles.alignCenter} />
            </Pressable>
          </View>

          {/* adding Recipe steps */}
          <Alata20>Instructions:</Alata20>
          <View style={styles.gap}>
            {steps.map((step, index) => (
              <View key={index} style={[gStyles.cardInput, gStyles.cardInputMultiline]}>
                <TextInput
                  multiline
                  numberOfLines={3}
                  placeholder={`Step ${index + 1}`}
                  value={step}
                  placeholderTextColor={Colors.dark.text}
                  onChangeText={(text) => {
                    const newSteps = [...steps];
                    newSteps[index] = text;
                    setSteps(newSteps);
                  }}
                  style={[gStyles.textInput, gStyles.textAlignVerticalTop]}
                />
                <Pressable onPress={() => removeStep(index)} style={gStyles.iconButton}>
                  <X color={Colors.dark.text} size={22} strokeWidth='2.5' style={gStyles.alignCenter} />
                </Pressable>
              </View>

            ))}
            <Pressable onPress={addStep} style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
              <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={gStyles.alignCenter} />
            </Pressable>
          </View>

          {/* Save button */}
          <Pressable onPress={handleSave} style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { marginTop: 30, backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
            <Save color={Colors.dark.text} size={28} style={gStyles.alignCenter} />
            <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>Save Recipe</Alata20>
          </Pressable>
        </View>
      </ScrollView >
    </View >
  );
}


const styles = StyleSheet.create({
  gap: {
    gap: 20,
  },
  flex2: {
    flex: 2,
  },
  marginRight: {
    marginRight: -4,
  },
  addImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    backgroundColor: Colors.dark.mainColorLight,
    borderRadius: 20,
  }
});