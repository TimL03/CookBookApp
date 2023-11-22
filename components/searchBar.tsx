import React, { useRef } from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
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
};

export default function SearchBar({ item }: SelectionProps) {
  const [search, setSearch] = React.useState(false);
  //const [selectedItems, setSelectedItems] = React.useState<{ [key: string]: boolean }>({});

  const searchActive = () => {
    setSearch(true);
  }

  const searchInactive = () => {
    setSearch(false);
  }

  const isItemSelected = (itemKey: string) => {
    return item.find((i) => i.key === itemKey)?.selected;
  }

  const itemSelected = (itemKey: string) => {
    const selectedItem = item.find((i) => i.key === itemKey);
    if (selectedItem) {
      selectedItem.selected = !selectedItem.selected;
    }
  }

    return(
        <>
            <View style={{flexDirection:'row', gap: -1}}>
              <TextInput
              onPressIn={searchActive}
              onEndEditing={searchInactive}
              placeholder={`search...`}
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
            <View style={styles.searchList}>   
                <FlatList 
                  data={item} 
                  renderItem={({ item }) => (
                    <Pressable onPress={() => itemSelected(item.key)} style={({ pressed }) => [styles.button, { backgroundColor: (isItemSelected(item.key)) ? Colors.dark.tint : Colors.dark.mainColorDark }]}>
                      <AlataMedium>{item.value}</AlataMedium>
                    </Pressable>
                  )}
                  keyExtractor={(item, index) => item.key + index}             
                >
                </FlatList>
            </View>
           : null
          }
        </>
    )
}


const styles = StyleSheet.create({
    inputDelete: {
      position: 'sticky',
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