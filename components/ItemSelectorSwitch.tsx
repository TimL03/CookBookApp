import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, Pressable } from 'react-native';


import Colors from '../constants/Colors';
import { AlataMedium } from './StyledText';

type SelectionProps = {
    item: {
        name: string;
    };
};

export default function Switch({ item }: SelectionProps) {
    const [isSelected, setSelected] = React.useState(false);
    const switchPressed = () => {
        setSelected(!isSelected);
    }
    return (
        <Pressable onPress={switchPressed} style={() => [styles.button, { backgroundColor: isSelected ? Colors.dark.tint : Colors.dark.mainColorDark }]}>
            <AlataMedium style={{marginBottom: 5, textAlign: 'center'}}>{item.name}</AlataMedium>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 15,
        padding: 10,
        elevation: 2,
        margin: 5,
    },
});