import { StyleSheet, Text, View, SafeAreaView, SectionList, Button, Pressable} from 'react-native';
import React from 'react';
import { Plus } from 'lucide-react-native';
import Recipe from '../../components/RecipeElement'
import {AlataLarge, AlataMedium} from '../../components/StyledText'
import Colors from '../../constants/Colors';

const DATA = [
  {
    title: 'Asian',
    data: [
      { name: 'ChowMein', cookTime: '30 minutes'},
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

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={DATA}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({item}) => (
          <Recipe item={item}/>
        )}
        renderSectionHeader={({section: {title}}) => (
         <AlataLarge style={styles.header}>{title}</AlataLarge>
       )}
      />
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
      <Pressable style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
        <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={{alignSelf: 'center'}} />
      </Pressable>
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
