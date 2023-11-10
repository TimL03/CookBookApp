import { StyleSheet, Text, View, SafeAreaView, SectionList, Pressable} from 'react-native';
import React from 'react';
import Recipe from '../../components/RecipeElement'
import {AlataLarge, AlataMedium} from '../../components/StyledText'
import Colors from '../../constants/Colors';
import { Plus } from 'lucide-react-native';

const DATA = [
  {
    title: 'Asian',
    data: [
      { name: 'ChowMein', cookTime: '30 minutes' },
      { name: 'Ramen', cookTime: '20 minutes' },
      { name: 'Chicken Wings', cookTime: '40 minutes' }
    ],
  },
  {
    title: 'Breakfast',
    data: [
      { name: 'Breakfast 1', cookTime: '30 minutes' },
      { name: 'Breakfast 2', cookTime: '20 minutes' },
      { name: 'Breakfast 3', cookTime: '40 minutes' }
    ],
  },
  {
    title: 'Drinks',
    data: [
      { name: 'Drink 1', cookTime: '2 minutes' },
      { name: 'Drink 2', cookTime: '3 minutes' },
      { name: 'Drink 3', cookTime: '1 minutes' }
    ],
  },
  {
    title: 'Desserts',
    data: [
      { name: 'Desserts 1', cookTime: '2 minutes' },
      { name: 'Desserts 2', cookTime: '3 minutes' },
      { name: 'Desserts 3', cookTime: '1 minutes' }
    ],
  },
];

export default function TabOneScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
      <Pressable style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
        <AlataLarge style={{marginBottom: 5, textAlign: 'center'}}>Get a Recipe</AlataLarge>
      </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 36,
    alignContent: 'center',
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
    borderRadius: 10, 
    width: 200,
    padding: 12,
    justifyContent: 'center',
  }
});

