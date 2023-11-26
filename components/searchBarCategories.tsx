import React, { useRef } from 'react';
import { Pressable, TextInput, View, StyleSheet, Keyboard } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { AlataLarge, AlataMedium } from './StyledText';
import { FlatList } from 'react-native-gesture-handler';

type SelectionProps = {
  item: { 
    key: string;
    value: string;
    selected: boolean;
  }[];
  currentListCategories: { 
    key: string;
    value: string;
    selected: boolean;
  }[];
  onCurrentListCategoriesUpdated: (searchList: { 
    key: string;
    value: string;
    selected: boolean;
  }[]) => void;
};

export default function SearchBarCategories({ item, currentListCategories, onCurrentListCategoriesUpdated }: SelectionProps) {
  const [thiscurrentListCategories, setCurrentListCategories] = React.useState(currentListCategories);
  const [searchCategories, setSearchCategories] = React.useState(false);

  const searchActive = () => {
    setSearchCategories(true);
  }

  const searchInactive = () => {
    setSearchCategories(false);
    Keyboard.dismiss();
  }

  const updateListCategories = (text: string) => {
    if(text === '') {
      setCurrentListCategories(item.filter((i) => ( i.selected === true)));
      return;
    } else {
      setCurrentListCategories(item.filter((i) => i.value.toLowerCase().includes(text.toLowerCase())));
    };
  }

  const isItemSelected = (itemKey: string) => {
    return item.find((i) => i.key === itemKey)?.selected;
  }

  const itemSelected = (itemKey: string) => {
    const selectedItem = item.find((i) => i.key === itemKey);
    if (selectedItem) {
      selectedItem.selected = !selectedItem.selected;
    }

    onCurrentListCategoriesUpdated(thiscurrentListCategories);
  }

    return(
        <>
            <View style={{flexDirection:'row', gap: -1}}>
              <TextInput
              onPressIn={searchActive}
              onEndEditing={searchInactive}
              placeholder={`search...`}
              onChangeText={updateListCategories}
              placeholderTextColor={Colors.dark.text}
              style={styles.inputDelete}
            />
            {
              searchCategories ?
              <Pressable onPress={searchInactive} style={styles.deleteButton}>
              <X color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
              </Pressable>
              :
              <Pressable onPress={searchInactive} style={styles.deleteButton}>
              <Search color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
              </Pressable>
            }
            </View>
          {
            (searchCategories) ?
            <View style={styles.searchList}>  
              {
                thiscurrentListCategories.map((i) => (
                    <Pressable  key={i.key} onPress={() => itemSelected(i.key)} style={({ pressed }) => [styles.button, { backgroundColor: (isItemSelected(i.key)) ? Colors.dark.tint : Colors.dark.mainColorDark }]}>
                      <AlataMedium>{i.value}</AlataMedium>
                    </Pressable>
                ))
              }
            </View>
           : null
          }
        </>
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
    searchList: {
      backgroundColor: Colors.dark.mainColorDark, 
      marginTop: -10, 
      borderRadius: 15, 
      paddingBottom: 15, 
      paddingTop: 15,
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
    button: {
      padding: 10,
    }
  });