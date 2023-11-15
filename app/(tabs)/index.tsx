import { StyleSheet, Text, View, SafeAreaView, SectionList, Pressable, ScrollView} from 'react-native';
import React from 'react';
import ItemSelectorSwitch from '../../components/ItemSelectorSwitch'
import {AlataLarge, AlataMedium} from '../../components/StyledText'
import Colors from '../../constants/Colors';
import { Plus } from 'lucide-react-native';
import { FlatList } from 'react-native-gesture-handler';
import SearchBar from '../../components/searchBar';

const DATA = [
  
    { name: 'Salmon'},
      { name: 'Rice'},
      { name: 'Soy Sauce'},
      { name: 'Chocolate Cake'},
      { name: 'Sesame Seeds'},
      { name: 'Green Onions'},
      { name: 'Avocado'},
      { name: 'Cucumber'},
      { name: 'Carrots'},
      { name: 'Nori'},
  
];

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <View>
        <AlataLarge>Select Ingredients:</AlataLarge>
        <SearchBar/>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
        >
          <FlatList
            contentContainerStyle={{alignSelf: 'flex-start'}}
            numColumns={Math.ceil(DATA.length / 3)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={DATA}
            renderItem={({item}) => (
              <ItemSelectorSwitch item={item}/>
            )}
          />
      </ScrollView>
        
      </View>
        
      <Pressable style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
        <AlataLarge style={{marginBottom: 5, textAlign: 'center'}}>Get a Recipe</AlataLarge>
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    flexDirection: 'column',
    padding: 30,
    alignContent: 'center',
    justifyContent : 'space-between',
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
    alignSelf: 'center',
  },
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
  }
});

