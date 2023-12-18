import React, { useEffect, useState } from "react";
import { useIngredients } from "../api/externalRecipesLibrary/client";
import { Pressable, Text, TextInput, View, StyleSheet, Keyboard } from "react-native";
import { Ingredient } from "../api/externalRecipesLibrary/model";
import { Search, X } from "lucide-react-native";
import gStyles from "../constants/Global_Styles";
import Colors from "../constants/Colors";
import { Alata12 } from "./StyledText";

export default function SearchBarSelector({ selectedIngredients, setSelectedIngredients }: { selectedIngredients: Ingredient[], setSelectedIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>> }) {
    const [search, setSearch] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState('');

    const filteredIngredients = selectedIngredients.filter((ingredient: Ingredient) => ingredient.value.includes(searchCriteria));


    const searchFinished = () => {
        setSearch(false);
        setSearchCriteria('');
        Keyboard.dismiss();
    }

    const toggleSelected = (key: string) => {
        setSelectedIngredients(prevIngredients => 
            prevIngredients.map(ingredient => 
                ingredient.key === key ? { ...ingredient, selected: !ingredient.selected } : ingredient
            )
        );
    }

    const isSelected = (key: string) => {
        return selectedIngredients.find(ingredient => ingredient.key === key)?.selected;
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', gap: -1 }}>
                <View style={[gStyles.cardInput, {flex:1}]}>
                    <TextInput
                    onPressIn={() => setSearch(true)}
                    onEndEditing={() => Keyboard.dismiss()}
                    placeholder={`search...`}
                    onChangeText={setSearchCriteria}
                    placeholderTextColor={Colors.dark.text}
                    style={gStyles.textInput}
                    />
                
                {
                search ?
                    <Pressable onPress={searchFinished} style={[gStyles.iconButton, styles.marginRight]}>
                    <X color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
                    </Pressable>
                    :
                    <Pressable onPress={() => setSearch(false)} style={[gStyles.iconButton, styles.marginRight]}>
                    <Search color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
                    </Pressable>
                }
                </View>
            </View>
            {
                (search) ?
                <View style={styles.searchList}>
                    {filteredIngredients.slice(0,5).map((i) => (
                    <Pressable
                        key={i.key}
                        style={({ pressed }) => [styles.padding, { backgroundColor: (isSelected(i.key)) ? Colors.dark.tint : Colors.dark.mainColorDark }]}
                        onPress={() => toggleSelected(i.key)}
                    >
                        <Alata12>{i.value}</Alata12>
                    </Pressable>
                    ))}
                </View>
                : null
            }
            <View style={[gStyles.mapHorizontal, styles.paddingVertical]}>
                {filteredIngredients.filter((item) => item.selected)
                 .concat(filteredIngredients.filter((item) => !item.selected).slice(0,3))
                 .map((item) => (
                    <Pressable onPress={() => toggleSelected(item.key)} style={() => [styles.switchButton, { backgroundColor: isSelected(item.key) ? Colors.dark.tint : Colors.dark.mainColorDark }]}>
                        <Alata12 style={[gStyles.alignCenter, gStyles.marginBottom] }>{item.value}</Alata12>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    marginRight: {
      marginRight: -4,
    },
    paddingVertical: {
      paddingTop: 10,
      paddingBottom: 10,
    },
    addImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 100,
      backgroundColor: Colors.dark.mainColorLight,
      borderRadius: 20,
    },
    searchList: {
        backgroundColor: Colors.dark.mainColorDark,
        borderRadius: 10,
        paddingBottom: 15,
        paddingTop: 15,
      },
    padding: {
        padding: 10,
      },
    switchButton: {
        borderRadius: 120,
        padding: 10,
        paddingHorizontal: 20,
        elevation: 2,
    },
  });