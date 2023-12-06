import React, { useRef, useEffect } from 'react';
import { Pressable, TextInput, View, StyleSheet, Keyboard } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { Alata20, Alata12 } from './StyledText';

type SelectionProps = {
  item: {
    key: string;
    value: string;
    selected: boolean;
  }[];
  currentListAPI: {
    key: string;
    value: string;
    selected: boolean;
  }[];
  onCurrentListAPIUpdated: (searchList: {
    key: string;
    value: string;
    selected: boolean;
  }[]) => void;
  onIngredientSelectedAPI: (ingredientKey: string) => void;
};

export default function SearchBarAPI({ item, currentListAPI, onCurrentListAPIUpdated, onIngredientSelectedAPI }: SelectionProps) {
  const [thiscurrentList, setCurrentList] = React.useState(currentListAPI);
  const [search, setSearch] = React.useState(false);

  useEffect(() => {
    const fetchIngredientsList = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        const data = await response.json();

        if (data.meals) {
          const ingredientsList = data.meals.map((ingredient: any) => ({
            key: ingredient.idIngredient,
            value: ingredient.strIngredient,
            selected: false,
          }));

          console.log('Abgerufene Zutaten aus API:', ingredientsList);
          setCurrentList(ingredientsList);
        } else {
          console.error('Fehler beim Abrufen der Zutatenliste.');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Zutatenliste:', error);
      }
    };

    fetchIngredientsList();
  }, []);

  const searchActive = () => {
    setSearch(true);
  }

  const searchInactive = () => {
    setSearch(false);
    Keyboard.dismiss();
  }

  const updateList = (text: string) => {
    if (text === '') {
      setCurrentList(thiscurrentList.filter((i) => i.selected === true));
      return;
    } else {
      setCurrentList(thiscurrentList.filter((i) => i.value.toLowerCase().includes(text.toLowerCase())));
    }
  };

  const isItemSelected = (itemKey: string) => {
    return item.find((i) => i.key === itemKey)?.selected;
  }

  const itemSelected = (itemKey: string) => {
    const selectedItem = thiscurrentList.find((i) => i.key == itemKey);
    if (selectedItem) {
      selectedItem.selected = !selectedItem.selected;
      onCurrentListAPIUpdated([...thiscurrentList]);
      onIngredientSelectedAPI(itemKey);
      setSearch(false);
    }
  };

  return (
    <>
      <View style={{ flexDirection: 'row', gap: -1 }}>
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
          <View style={styles.searchList}>
            {thiscurrentList.map((i) => (
            <Pressable
              key={i.key}
              onPress={() => itemSelected(i.key)}
              style={({ pressed }) => [styles.button, { backgroundColor: (isItemSelected(i.key)) ? Colors.dark.tint : Colors.dark.mainColorDark }]}
            >
              <Alata12>{i.value}</Alata12>
            </Pressable>
          ))}
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