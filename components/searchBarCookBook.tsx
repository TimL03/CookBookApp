import React from "react";
import { TextInput, View, StyleSheet, Keyboard } from "react-native";
import { Search } from "lucide-react-native";
import gStyles from "../constants/Global_Styles";
import Colors from "../constants/Colors";
export default function SearchBarCookBook({ setSearchCriteria }) {
  return (
    <View style={[gStyles.cardInput]}>
      <TextInput
        onEndEditing={() => Keyboard.dismiss()}
        placeholder={`search...`}
        onChangeText={text => setSearchCriteria(text)}
        placeholderTextColor={Colors.dark.text}
        style={gStyles.textInput}
      />
      <Search color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
    </View>
  );
}

