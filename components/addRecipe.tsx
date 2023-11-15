import React, { useState } from 'react';
import { TextInput, Button, StyleSheet, ScrollView, View, Pressable, Text } from 'react-native';
import Colors from '../constants/Colors';
import { db } from '../FirebaseConfig'
import { collection, addDoc } from 'firebase/firestore';
import { AlataLarge, AlataMedium } from './StyledText';
import { X, PlusCircle, Plus, Save } from 'lucide-react-native';

interface AddRecipeScreenProps {
  closeModal: () => void;
}

export default function AddRecipeScreen({ closeModal }: AddRecipeScreenProps) {
  const [name, setName] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  const handleSave = async () => {
    try {
      const docRef = await addDoc(collection(db, 'recipes'), {
        name,
        cookTime,
        category,
        ingredients,
        steps,
      });
      console.log('Dokument geschrieben mit ID: ', docRef.id);
      closeModal();
    } catch (e) {
      console.error('Fehler beim Hinzufügen des Dokuments: ', e);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = () => {
    
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = () => {
    
  };

  const addImage = () => {
    console.log('Add Image');
  }


  return (
    <View style={styles.container}>
      <View style={styles.barTop}>
        <AlataLarge>Add Recipe</AlataLarge>
        <Pressable onPress={closeModal} style={{paddingTop: 5}}>
          <X color={Colors.dark.text} size={24} strokeWidth='2.5' style={{ alignSelf: 'center', marginBottom: 10}} />
        </Pressable>
      </View>
      <ScrollView style={styles.scrollView}>
        <Pressable onPress={addImage} style={({ pressed }) => [styles.addImage, { backgroundColor: pressed ? Colors.dark.background : Colors.dark.mainColorLight },]}>
          <PlusCircle color={Colors.dark.text} size={24} style={{alignSelf: 'center'}} />
          <AlataLarge>Add Image</AlataLarge>
      </Pressable>
        <View style={{padding: 30}}>
        <AlataLarge>Name:</AlataLarge>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input}/>
        <AlataLarge>Kategory:</AlataLarge>
        <TextInput placeholder="Kategory" value={category} onChangeText={setCategory} style={styles.input}/>
        <AlataLarge>Preperation Time:</AlataLarge>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TextInput inputMode="numeric" maxLength={2} placeholder="00" value={cookTime} onChangeText={setCookTime} style={styles.inputNumber}/>
          <Text style={{paddingVertical: 15, textAlign: 'center', fontSize: 16, fontFamily: 'Alata', color: Colors.dark.text}}>hours</Text>
          <TextInput inputMode="numeric" maxLength={2} placeholder="00" value={cookTime} onChangeText={setCookTime} style={styles.inputNumber}/>
          <Text style={{paddingVertical: 15, alignContent: 'center', textAlign: 'center', fontSize: 16, fontFamily: 'Alata', color: Colors.dark.text}}>minutes</Text>
        </View>
        <AlataLarge>Ingredients:</AlataLarge>
        {ingredients.map((ingredient, index) => (
          <View style={{flexDirection:'row', gap: -1}}>
            <TextInput
            key={index}
            placeholder={`Ingredient ${index + 1}`}
            value={ingredient}
            onChangeText={(text) => {
              const newIngredients = [...ingredients];
              newIngredients[index] = text;
              setIngredients(newIngredients);
            }}
            style={styles.inputDelete}
          />
          <Pressable onPress={removeIngredient} style={styles.deleteButton}>
          <X color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
          </Pressable>
          </View>
        ))}
        <Pressable onPress={addIngredient} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
          <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
        </Pressable>
        <AlataLarge>Instructions:</AlataLarge>
        {steps.map((step, index) => (
          <View style={{flexDirection:'row', gap: -1}}>
            <TextInput
            multiline
            numberOfLines={3}
            key={index}
            placeholder={`Step ${index + 1}`}
            value={step}
            onChangeText={(text) => {
              const newSteps = [...steps];
              newSteps[index] = text;
              setSteps(newSteps);
            }}
            style={styles.inputDelete}
          />
          <Pressable onPress={removeStep} style={styles.deleteButton}>
          <X color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
          </Pressable>
          </View>
        ))}
        <Pressable onPress={addStep} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
          <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
        </Pressable>
        <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveButton, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
          <Save color={Colors.dark.text} size={28} style={{ alignSelf: 'center' }} />
          <AlataLarge style={{marginBottom: 5, textAlign: 'center'}}>Save Recipe</AlataLarge>
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
    padding: 10, 
    borderRadius: 15,  
    marginBottom: 10, 
    marginTop: 5, 
    fontFamily: 'Alata',
    flex: 2
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
  barTop: {
    height: 80,
    backgroundColor: Colors.dark.mainColorDark,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
    paddingHorizontal: 30,
  },
  scrollView: {
    flex: 1,
    borderRadius: 20,
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
});