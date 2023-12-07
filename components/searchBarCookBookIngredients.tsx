import React, { useRef, useState, useEffect } from 'react';
import { Pressable, TextInput, View, StyleSheet, Keyboard, Modal } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '../constants/Colors';
import {  Alata12 } from './StyledText';
import { db } from '../FirebaseConfig'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import LoginModalScreen from '../app/modals/logInModal';

type SelectionProps = {
  item: {
    key: string;
    value: string;
    selected: boolean;
  }[];
  currentListCookBook: {
    key: string;
    value: string;
    selected: boolean;
  }[];
  onCurrentListCookBookUpdated: (searchList: {
    key: string;
    value: string;
    selected: boolean;
  }[]) => void;
  onIngredientSelectedCookBook: (ingredientKey: string) => void;
};

export default function SearchBarCookBookIngredients({ item, currentListCookBook, onCurrentListCookBookUpdated, onIngredientSelectedCookBook }: SelectionProps) {
  const [thiscurrentList, setCurrentList] = React.useState(currentListCookBook);
  const [search, setSearch] = React.useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserID(user.uid);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (user: User) => {
    setIsAuthenticated(true);
    setUserID(user.uid);
  };

  const fetchIngredientsFromFirebase = async () => {
    setIsLoading(true); 
    try {
      const user = auth.currentUser;

      if (!user) {
        setIsLoginModalVisible(true);
        return;
      }

      const q = query(collection(db, 'recipes'), where('userID', '==', userID));
      const recipesSnapshot = await getDocs(q);
      const recipes = recipesSnapshot.docs.map((doc) => doc.data());

      const newIngredients: { key: string; value: string; selected: boolean }[] = [];
      let keyIndex = 1;

      recipes.forEach((recipe) => {
        const recipeIngredients = recipe.ingredients || [];

        recipeIngredients.forEach((ingredient: any) => {
          while (newIngredients.some((item) => item.key === keyIndex.toString())) {
            keyIndex++;
          }

          newIngredients.push({
            key: keyIndex.toString(),
            value: ingredient.name, 
            selected: false,
          });

          keyIndex++;
        });
      });

      console.log("Extrahierte Zutaten für Dropdown:", newIngredients); 


      const updatedIngredients = newIngredients.map(newIngredient => {
        const existingIngredient = thiscurrentList.find(ingredient => ingredient.key === newIngredient.key);
        return existingIngredient ? { ...newIngredient, selected: existingIngredient.selected } : newIngredient;
      });

      setCurrentList(updatedIngredients);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      throw error;
    }
    setIsLoading(false);
};



  const searchActive = async () => {
    await fetchIngredientsFromFirebase();
    setSearch(true);
  }

  const searchInactive = () => {
    setSearch(false);
    Keyboard.dismiss();
  }

  const updateListCookBook = (text: string) => {
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
    const selectedItem = thiscurrentList.find((i) => i.key === itemKey);
    if (selectedItem) {
      selectedItem.selected = !selectedItem.selected;
      onCurrentListCookBookUpdated([...thiscurrentList]); 
      onIngredientSelectedCookBook(itemKey);
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
          onChangeText={updateListCookBook}
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
        (search && !isLoading) ?
          <View style={styles.searchList}>
            {thiscurrentList && thiscurrentList.map((i) => (
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLoginModalVisible}
        onRequestClose={() => setIsLoginModalVisible(false)}
      >
        <LoginModalScreen onClose={() => setIsLoginModalVisible(false)} setUserID={setUserID}
          setIsAuthenticated={setIsAuthenticated} onLoginSuccess={handleLoginSuccess} />
      </Modal>
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