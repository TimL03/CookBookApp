import React, { useState, useCallback } from "react";
import { Pressable, TextInput, View, StyleSheet, Keyboard } from "react-native";
import { Item } from "../api/externalRecipesLibrary/model";
import { Search, X } from "lucide-react-native";
import gStyles from "../constants/Global_Styles";
import Colors from "../constants/Colors";
import { Alata12 } from "./StyledText";

export default function SearchBarCookBook({ setSearchCriteria }) {
  return (
    <View style={[gStyles.cardInput, { flex: 1 }]}>
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

