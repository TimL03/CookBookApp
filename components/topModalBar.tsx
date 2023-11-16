import React from 'react';
import { Pressable, TextInput, View, StyleSheet, Platform } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { AlataLarge } from './StyledText';

export default function TopModalBar({ title, onClose }: { title: string, onClose: () => void}) {
    const titleAlign = Platform.OS === 'ios' ? 'center' : 'left';
    const paddingText = Platform.OS === 'ios' ? 40 : 0;

    return(
        <View style={styles.barTop}>
        <AlataLarge style={{paddingTop: paddingText, textAlign: 'center'}}>{title}</AlataLarge>
        <Pressable onPress={onClose} style={{paddingTop: paddingText + 5}}>
          <X color={Colors.dark.text} size={24} strokeWidth='2.5' style={{ alignSelf: 'center', marginBottom: 10}} />
        </Pressable>
      </View>
    )
}

const barHeight = Platform.OS === 'ios' ? 110 : 70;

const styles = StyleSheet.create({   
  barTop: {
    height: barHeight,
    backgroundColor: Colors.dark.mainColorDark,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
    paddingHorizontal: 30,
  },
});