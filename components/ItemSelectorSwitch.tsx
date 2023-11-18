import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, Pressable } from 'react-native';


import Colors from '../constants/Colors';
import { AlataMedium } from './StyledText';

type SelectionProps = {
    item: {
        key: string;
        value: string;
        selected: boolean;
    };
};

export default function ItemSelectorSwitch({ item }: SelectionProps) {
    const [isSelected, setSelected] = React.useState(item.selected);
    const switchPressed = () => {
        setSelected(!isSelected);
    }
    return (
        <Pressable onPress={switchPressed} style={() => [styles.button, { backgroundColor: isSelected ? Colors.dark.tint : Colors.dark.mainColorDark }]}>
            <AlataMedium style={{marginBottom: 5, textAlign: 'center'}}>{item.value}</AlataMedium>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 120,
        padding: 10,
        paddingHorizontal: 20,
        elevation: 2,
        margin: 5,
    },
});