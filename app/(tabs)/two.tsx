import { StyleSheet, Text, View, SafeAreaView, SectionList, Button, Pressable, Modal } from 'react-native';
import React from 'react';
import { Plus } from 'lucide-react-native';
import Recipe from '../../components/RecipeElement'
import { AlataLarge, AlataMedium } from '../../components/StyledText'
import Colors from '../../constants/Colors';
import { db } from '../../FirebaseConfig'
import { useState, useEffect } from "react"
import { collection, onSnapshot, query } from 'firebase/firestore';
import AddRecipeScreen from '../../components/addRecipe'; // Pfad zu Ihrer addRecipe.tsx


interface RecipeData {
  id: string; 
  name: string;
  category: string;
  cookTime: string;
  description: string;
  ingredients: string[];
  steps: string[];
}

interface GroupedByCategory {
  [key: string]: RecipeData[];
}
export default function TabTwoScreen() {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [data, setData] = useState<Array<{ title: string, data: RecipeData[] }>>([]);

  useEffect(() => {
    const q = query(collection(db, "recipes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes: RecipeData[] = [];
      querySnapshot.forEach((doc) => {
        const recipeData = doc.data() as Omit<RecipeData, 'id'>;
        recipes.push({ id: doc.id, ...recipeData });
      });

      const groupedByCategory = recipes.reduce((acc: GroupedByCategory, recipe) => {
        const { category } = recipe;
        acc[category] = acc[category] || [];
        acc[category].push(recipe);
        return acc;
      }, {});

      const sections = Object.keys(groupedByCategory).map(key => ({
        title: key,
        data: groupedByCategory[key],
      }));

      setData(sections);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={data}
        keyExtractor={(item, index) => item.category + index}
        renderItem={({ item }) => (
          <Recipe item={item} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <AlataLarge style={styles.header}>{title}</AlataLarge>
        )}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Pressable onPress={toggleModal} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
          <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
        </Pressable>
        <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <AddRecipeScreen closeModal={toggleModal} />
      </Modal>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 30,
    alignContent: 'center',
    flexDirection: 'column',
  },
  item: {
    backgroundColor: Colors.dark.background,
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: Colors.dark.background,
  },
  button: {
    backgroundColor: Colors.dark.mainColorDark,
    height: 50,
    width: 50,
    borderRadius: 30,
    padding: 12,
    justifyContent: 'center',
    marginBottom: -15,
    marginTop: 10,
  }
});
