import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Recipe from '../../components/RecipeElement'
import Colors from '../../constants/Colors';


export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Recipe/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 36,
    
  },
  
});