import { StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View, useThemeColor } from '../../components/Themed';
import { ScrollView } from 'react-native-gesture-handler';
import Recipe from '../../components/RecipeElement';
import { DarkTheme } from '@react-navigation/native';

export default function TabOneScreen() {
  const [recipes, setRecipes] = useState([
    { text: 'Spagetti Bolognese', key: '1'},
    { text: 'Ramen', key: '2'},
    { text: 'Pizza', key: '3'},
  ])
  return (
    <View>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <Recipe item={item} />
        )} 
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  header: {
    backgroundColor: 'green',
    alignItems: 'center',
    padding: 20,
  },
  boldText:{
    fontWeight: 'bold',
  },
  body: {
    backgroundColor: 'yellow',    
  },
  buttonContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
    backgroundColor: '#FFF'
  },
  item: {
    marginTop: 24,
    padding: 30,
    backgroundColor: 'green',
    fontSize: 24,
  }
});
