import { StyleSheet, Text, View, Pressable, ScrollView, Modal, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import ItemSelectorSwitch from '../../components/ItemSelectorSwitch'
import {AlataLarge} from '../../components/StyledText'
import Colors from '../../constants/Colors';
import SearchBar from '../../components/searchBar';
import ViewRandomRecipeScreen from '../modals/viewRandomRecipeModal'; 

const data = [
  {key:'1', value:'Tomato', selected: false},
  {key:'2', value:'Spagetti', selected: false},
  {key:'3', value:'Garlic', selected: true},
  {key:'4', value:'Milk', selected: false},
  {key:'5', value:'Soy Sauce', selected: false},
  {key:'6', value:'Salad', selected: false},
  {key:'7', value:'Butter', selected: false},
  {key:'8', value:'Onion', selected: false},
];

export default function TabOneScreen() {  
  const [ingredients, setIngredients] = useState(data);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const getSelectedIngredients = () => {
    return ingredients
    .filter(item => item.selected)
    .map(item => item.value.toLowerCase()) 
    .join(',');
};

  const getMeal = async () => {
    console.log("getMeal aufgerufen");
    const selectedIngredients = getSelectedIngredients();
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${selectedIngredients}`);
      console.log("URL für den API-Aufruf: ", response);
      const data = await response.json();
      if (data.meals) {
        const randomMealId = data.meals[Math.floor(Math.random() * data.meals.length)].idMeal;
        const detailedResponse = await fetch(`https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=${randomMealId}`);
        const detailedData = await detailedResponse.json();
        if (detailedData.meals) {
          const detailedMeal = detailedData.meals[0];
          setSelectedMeal(detailedMeal);
          setModalVisible(true);
        } else {
          alert("Details for the selected meal not found!");
        }
      } else {
        alert("Sorry, we didn't find any meal!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const findNewRecipe = () => {
    console.log("findNewRecipe aufgerufen");
    getMeal(); 
  };

  const toggleIngredientSelected = (key: string) => {
    setIngredients(ingredients =>
      ingredients.map(ingredient =>
        ingredient.key === key ? { ...ingredient, selected: !ingredient.selected } : ingredient
      )
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
      <View>
        <AlataLarge>Select Ingredients:</AlataLarge>
        <SearchBar item={data}/>
        <View style={{ flexDirection:'row',marginBottom:20,flexWrap:'wrap'}}>
        {
              ingredients.map((item) => (
                <ItemSelectorSwitch key={item.key} item={item} onToggle={() => toggleIngredientSelected(item.key)} />
              ))
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
            <ItemSelectorSwitch item={item} />
          )
          })
        }
      </View>
      </View>
      </ScrollView>
        
      <Pressable onPress={getMeal} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
        <AlataLarge style={{marginBottom: 5, textAlign: 'center'}}>Get a Recipe</AlataLarge>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        >
        <ViewRandomRecipeScreen closeModal={() => setModalVisible(false)} recipe={selectedMeal} onFindNewRecipe={findNewRecipe}/>
      </Modal>
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

