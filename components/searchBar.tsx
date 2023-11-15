import React from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import Colors from '../constants/Colors';

export default function SearchBar() {
    const search = () => {
        console.log('search');
    }
    return(
        <View style={{flexDirection:'row', gap: -1}}>
            <TextInput
            placeholder={`search...`}
            placeholderTextColor={Colors.dark.text}
            style={styles.inputDelete}
          />
          <Pressable onPress={search} style={styles.deleteButton}>
          <Search color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
          </Pressable>
          </View>
    )
}


const styles = StyleSheet.create({
    inputDelete: {
      color: Colors.dark.text,
      backgroundColor: Colors.dark.mainColorLight,
      padding: 10, 
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
      marginBottom: 10, 
      marginTop: 5, 
      fontFamily: 'Alata',
      flex: 2
    },
    deleteButton: {
      backgroundColor: Colors.dark.mainColorLight,
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
      padding: 10,
      justifyContent: 'center',
      marginBottom: 10,
      marginTop: 5,
    },
  });