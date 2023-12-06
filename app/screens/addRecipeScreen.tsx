import React, { useState } from 'react';
import { TextInput, StyleSheet, ScrollView, View, Pressable, Text, Image } from 'react-native';
import Colors from '../../constants/Colors';
import { db } from '../../FirebaseConfig'
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Alata20, Alata12, AlataText } from '../../components/StyledText';
import { X, PlusCircle, Plus, Save, ChevronDown } from 'lucide-react-native';
import TopModalBar from '../../components/topModalBar';
import DropDown from '../../components/DropDown';

interface AddRecipeScreenProps {
  closeModal: () => void;
  userID: string | null;
}

export default function AddRecipeScreen({ closeModal, userID }: AddRecipeScreenProps) {
  const [name, setName] = useState('');
  const [cookHTime, setCookHTime] = useState('');
  const [cookMinTime, setCookMinTime] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', unit: 'x', amount: '' },]);
  const [steps, setSteps] = useState(['']);
  const [imageUri, setImageUri] = useState<string | null>(null);

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
      let imageUrl = '';
      if (imageUri) {
        imageUrl = await uploadImage(imageUri, name);
      }

      const docRef = await addDoc(collection(db, 'recipes'), {
        name,
        cookHTime,
        cookMinTime,
        category,
        ingredients,
        steps,
        imageUrl,
        userID
      });
      console.log('Dokument geschrieben mit ID: ', docRef.id);
      closeModal();
    } catch (e) {
      console.error('Fehler beim Hinzufügen des Dokuments: ', e);
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



  return (
    <View style={styles.container}>
      {/* Top bar with close button */}
      <TopModalBar title="Add Recipe" onClose={closeModal} />

      {/* Main content */}
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>

        {/* Recipe image selection */}
        {imageUri != null ?
          <Image
            style={styles.image}
            source={{ uri: imageUri }}
          />
          :
          <Pressable onPress={addImage} style={({ pressed }) => [styles.addImage, { backgroundColor: pressed ? Colors.dark.background : Colors.dark.mainColorLight },]}>
            <PlusCircle color={Colors.dark.text} size={24} style={{ alignSelf: 'center' }} />
            <Alata20>Add Image</Alata20>
          </Pressable>
        }


        <View style={{ padding: 30 }}>
          {/* adding Recipe name */}
          <Alata20>Name:</Alata20>
          <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} placeholderTextColor={Colors.dark.text} />
          {/* adding Recipe category */}
          <Alata20>Category:</Alata20>
          <TextInput placeholder="Kategory" value={category} onChangeText={setCategory} style={styles.input} placeholderTextColor={Colors.dark.text} />
          {/* adding Recipe preparation time */}
          <Alata20>Preperation Time:</Alata20>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput inputMode="numeric" maxLength={2} placeholder="00" value={cookHTime} onChangeText={setCookHTime} style={styles.inputNumber} placeholderTextColor={Colors.dark.text} />
            <Text style={{ paddingVertical: 15, textAlign: 'center', fontSize: 16, fontFamily: 'Alata', color: Colors.dark.text }}>hours</Text>
            <TextInput inputMode="numeric" maxLength={2} placeholder="00" value={cookMinTime} onChangeText={setCookMinTime} style={styles.inputNumber} placeholderTextColor={Colors.dark.text} />
            <Text style={{ paddingVertical: 15, alignContent: 'center', textAlign: 'center', fontSize: 16, fontFamily: 'Alata', color: Colors.dark.text }}>minutes</Text>
          </View>

          {/* adding Recipe ingredients */}
          <Alata20>Ingredients:</Alata20>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={{ flexDirection: 'row', gap: 10, zIndex: 1 }}>
              <View style={styles.input}>
                <TextInput
                  placeholder={`Ingredient ${index + 1}`}
                  value={ingredient.name}
                  onChangeText={(text) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index].name = text;
                    setIngredients(newIngredients);
                  }}
                  style={{ fontFamily: 'Alata', flex: 1, color: Colors.dark.text }}
                />
                <Pressable onPress={() => removeIngredient(index)} style={{ alignSelf: 'center' }}>
                  <X color={Colors.dark.text} size={22} strokeWidth='2.5' />
                </Pressable>
              </View>
              <View style={{ flex: 2 }}>
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

          <Pressable onPress={addIngredient} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
            <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
          </Pressable>

          {/* adding Recipe steps */}
          <Alata20>Instructions:</Alata20>
          {steps.map((step, index) => (
            <View key={index} style={{ flexDirection: 'row', gap: -1 }}>
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
                style={styles.inputDelete}
              />
              <Pressable onPress={() => removeStep(index)} style={styles.deleteButton}>
                <X color={Colors.dark.text} size={22} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
              </Pressable>
            </View>
          ))}
          <Pressable onPress={addStep} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
            <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
          </Pressable>

          {/* Save button */}
          <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
            <Save color={Colors.dark.text} size={28} style={{ alignSelf: 'center' }} />
            <Alata20 style={{ marginBottom: 5, textAlign: 'center' }}>Save Recipe</Alata20>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.mainColorDark,
  },
  input: {
    color: Colors.dark.text,
    backgroundColor: Colors.dark.mainColorLight,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 5,
    fontFamily: 'Alata',
    flex: 3
  },
  inputDelete: {
    color: Colors.dark.text,
    backgroundColor: Colors.dark.mainColorLight,
    padding: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    marginBottom: 10,
    marginTop: 5,
    fontFamily: 'Alata',
    textAlignVertical: 'top',
    flex: 2
  },
  inputNumber: {
    color: Colors.dark.text,
    backgroundColor: Colors.dark.mainColorLight,
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 5,
    width: 100,
    fontFamily: 'Alata',
  },
  scrollView: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: Colors.dark.background,
    flexDirection: 'column',
    gap: 20,
  },
  addImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    backgroundColor: Colors.dark.mainColorLight,
    borderRadius: 20,
  },
  button: {
    backgroundColor: Colors.dark.mainColorDark,
    borderRadius: 15,
    padding: 10,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: Colors.dark.mainColorDark,
    borderRadius: 15,
    padding: 10,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 30,
    flexDirection: 'row',
    gap: 10,
  },
  deleteButton: {
    backgroundColor: Colors.dark.mainColorLight,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    padding: 10,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 20,
  },
});