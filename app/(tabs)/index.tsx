import { StyleSheet, Text, View, SafeAreaView, SectionList, Pressable, ScrollView} from 'react-native';
import React from 'react';
import ItemSelectorSwitch from '../../components/ItemSelectorSwitch'
import {AlataLarge, AlataMedium} from '../../components/StyledText'
import Colors from '../../constants/Colors';
import { Plus } from 'lucide-react-native';
import { FlatList } from 'react-native-gesture-handler';

const DATA = [
  
    { name: 'Salmon'},
      { name: 'Rice'},
      { name: 'Soy Sauce'},
      { name: 'Sesame Seeds'},
      { name: 'Green Onions'},
      { name: 'Avocado'},
      { name: 'Cucumber'},
      { name: 'Carrots'},
      { name: 'Nori'},
  
];

export default function TabOneScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <AlataLarge>Ingredients</AlataLarge>
        <FlatList 
          data={DATA}
          renderItem={({item}) => (
            <ItemSelectorSwitch item={item}/>
          )}
          horizontal={true}
          wrap={true}
          numRows={3}
          HorizontalScrollbar
          showsHorizontalScrollIndicator={false}/>
        
      </View>
        
      <Pressable style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
        <AlataLarge style={{marginBottom: 5, textAlign: 'center'}}>Get a Recipe</AlataLarge>
      </Pressable>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    flexDirection: 'column',
    padding: 36,
    alignContent: 'center',
    marginTop: 40,
  },
  item: {
    backgroundColor: Colors.dark.mainColorLight,
    padding: 20,
    flexDirection: 'row',
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
  },
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
  }
});

