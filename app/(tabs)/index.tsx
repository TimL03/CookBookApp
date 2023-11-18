import { StyleSheet, Text, View, Pressable, ScrollView} from 'react-native';
import React, { useState } from 'react';
import ItemSelectorSwitch from '../../components/ItemSelectorSwitch'
import {AlataLarge} from '../../components/StyledText'
import Colors from '../../constants/Colors';
import SearchBar from '../../components/searchBar';

const data = [
  {key:'1', value:'Tomato', selected: false},
  {key:'2', value:'Spagetti', selected: false},
  {key:'3', value:'Carrot', selected: true},
  {key:'7', value:'Milk', selected: false},
  {key:'4', value:'Soy Sauce', selected: false},
  {key:'5', value:'Salad', selected: false},
  {key:'6', value:'Toast Bread', selected: false},
  
];

export default function TabOneScreen() {  
  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
      <View>
        <AlataLarge>Select Ingredients:</AlataLarge>
        <SearchBar item={data}/>
        <View style={{ flexDirection:'row',marginBottom:20,flexWrap:'wrap'}}>
        {
          data?.map((item,index) => {
          return (
            <ItemSelectorSwitch item={item}/>
          )
          })
        }
      </View>                                  
      
      </View>

      <View>
        <AlataLarge>Select Categories:</AlataLarge>
        <SearchBar item={data}/>
        <View style={{ flexDirection:'row',marginBottom:20,flexWrap:'wrap'}}>
        {
          data?.map((item,index) => {
          return (
            <ItemSelectorSwitch item={item}/>
          )
          })
        }
      </View>
      </View>
      </ScrollView>
        
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
    justifyContent : 'space-around',
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
    padding: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
  }
});

