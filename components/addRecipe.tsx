import React, { useState } from 'react';
import { TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { db } from '../FirebaseConfig'
import { collection, addDoc } from 'firebase/firestore';

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
    } catch (e) {
      console.error('Fehler beim Hinzufügen des Dokuments: ', e);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput placeholder="Kategorie" value={category} onChangeText={setCategory} style={styles.input}/>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input}/>
      <TextInput placeholder="Zubereitungszeit" value={cookTime} onChangeText={setCookTime} style={styles.input}/>
      {ingredients.map((ingredient, index) => (
        <TextInput
          key={index}
          placeholder={`Zutat ${index + 1}`}
          value={ingredient}
          onChangeText={(text) => {
            const newIngredients = [...ingredients];
            newIngredients[index] = text;
            setIngredients(newIngredients);
          }}
          style={styles.input}
        />
      ))}
      <Button title="Zutat hinzufügen" onPress={addIngredient} />
      {steps.map((step, index) => (
        <TextInput
          key={index}
          placeholder={`Schritt ${index + 1}`}
          value={step}
          onChangeText={(text) => {
            const newSteps = [...steps];
            newSteps[index] = text;
            setSteps(newSteps);
          }}
          style={styles.input}

        />
      ))}
      <Button title="Schritt hinzufügen" onPress={addStep} />
      <Button title="Rezept speichern" onPress={handleSave} />
      <Button title="Schließen" onPress={closeModal} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20, 
  },
  input: {
    borderWidth: 1,  
    borderColor: '#ccc',  
    padding: 10,  
    borderRadius: 5,  
    marginBottom: 10,  
  },
});