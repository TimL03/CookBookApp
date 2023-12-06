import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, Pressable } from 'react-native';


import Colors from '../constants/Colors';
import gStyles from '../constants/Global_Styles';
import { Alata12 } from './StyledText';

type SelectionProps = {
    item: {
        key: string;
        value: string;
        selected: boolean;
    };
    onToggle?: () => void;
};

export default function ItemSelectorSwitch({ item, onToggle }: SelectionProps) {
    const [isSelected, setSelected] = React.useState(item.selected);

    const switchPressed = () => {
        if(item.selected !== null) {
            setSelected(!isSelected);
            if (onToggle) {
                onToggle();
            }
        }
    }
    return (
        <Pressable onPress={switchPressed} style={() => [styles.button, { backgroundColor: isSelected ? Colors.dark.tint : Colors.dark.mainColorDark }]}>
            <Alata12 style={[gStyles.alignCenter, gStyles.marginBottom] }>{item.value}</Alata12>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 120,
        padding: 10,
        paddingHorizontal: 20,
        elevation: 2,

    },
});