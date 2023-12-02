import React, { useEffect, useRef } from 'react';
import { Pressable, TextInput, View, StyleSheet, Keyboard } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { AlataLarge, AlataMedium } from './StyledText';
import { FlatList } from 'react-native-gesture-handler';
import ItemSelectorSwitch from './ItemSelectorSwitch';

type SelectionProps = {
  allItems: { 
    key: string;
    value: string;
    selected: boolean;
  }[];
  currentList: { 
    key: string;
    value: string;
    selected: boolean;
  }[];
  onCurrentListUpdated: (searchList: { 
    key: string;
    value: string;
    selected: boolean;
  }[]) => void;
};

export default function SearchBar({ allItems, currentList, onCurrentListUpdated }: SelectionProps) {
  const [thiscurrentList, setCurrentList] = React.useState(currentList);
  const [thisallItems, setAllItems] = React.useState(allItems);
  const [search, setSearch] = React.useState(false);

  const searchActive = () => {
    setSearch(true);
  }

  const searchInactive = () => {
    setSearch(false);
    Keyboard.dismiss();
  }

  const updateList = (text: string) => {
    if(text === '') {
      setAllItems(allItems);
      return;
    } else {
      setAllItems(allItems.filter((i) => i.value.toLowerCase().includes(text.toLowerCase())));
    };
    onCurrentListUpdated(thisallItems);
  }

  const itemSelected = (itemKey: string) => {
    const selectedItem = thisallItems.find((i) => i.key === itemKey);
    if (selectedItem !== undefined) {
      selectedItem.selected = !selectedItem.selected;
    }
    setCurrentList(thisallItems.filter((i) => i.selected).concat(currentList.filter((i) => !i.selected)));
    onCurrentListUpdated(thiscurrentList);
  }

    return(
        <>
            <View style={{flexDirection:'row', gap: -1}}>
              <TextInput
              onPressIn={searchActive}
              onEndEditing={searchInactive}
              placeholder={`search...`}
              onChangeText={updateList}
              placeholderTextColor={Colors.dark.text}
              style={styles.inputDelete}
            />
            {
              search ?
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
            (search) ?
            <>
              <View style={styles.searchList}>  
                {
                  thisallItems.map((item) => (
                      <Pressable  key={item.key} onPress={() => itemSelected(item.key)} style={({ pressed }) => [styles.button, { backgroundColor: item.selected ? Colors.dark.tint : Colors.dark.mainColorDark }]}>
                        <AlataMedium>{item.value}</AlataMedium>
                      </Pressable>
                  ))
                }
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' }}>
              {thiscurrentList.map((item) => (
                <Pressable onPress={() => itemSelected(item.key)} style={() => [styles.selectedButton, { backgroundColor: item.selected ? Colors.dark.tint : Colors.dark.mainColorDark }]}>
                  <AlataMedium style={{marginBottom: 5, textAlign: 'center'}}>{item.value}</AlataMedium>
                </Pressable>
              ))}
            </View>
          </>
           : 
          <View style={{ flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' }}>
            {thiscurrentList.map((item) => (
              <Pressable onPress={() => itemSelected(item.key)} style={() => [styles.selectedButton, { backgroundColor: item.selected ? Colors.dark.tint : Colors.dark.mainColorDark }]}>
                <AlataMedium style={{marginBottom: 5, textAlign: 'center'}}>{item.value}</AlataMedium>
              </Pressable>
            ))}
          </View>
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
    }, 
    selectedButton: {
      borderRadius: 120,
      padding: 10,
      paddingHorizontal: 20,
      elevation: 2,
      margin: 5,
    }
  });