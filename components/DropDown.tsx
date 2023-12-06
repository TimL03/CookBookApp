import React, { useRef } from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { Alata20, Alata12, AlataText } from './StyledText';
import { FlatList } from 'react-native-gesture-handler';

type SelectionProps = {
    item: {
        key: string;
        value: string;
    }[];
    selectedUnit: string;
    selectedAmount: string;
    onSelect: (unit: string, amount: string) => void;
};


export default function DropDown({ item, selectedUnit, selectedAmount, onSelect }: SelectionProps) {
    const [dropDown, setDropDrown] = React.useState(false);
    const [unit, setUnit] = React.useState('x');
    const [amount, setAmount] = React.useState('');

    const activateDropDown = () => {
        setDropDrown(true);
    }

    const deactivateDropDown = () => {
        setDropDrown(false);
    }

    const handleSelectUnit = (selectedUnit: string) => {
        setUnit(selectedUnit);
        onSelect(selectedUnit, amount);  
        setDropDrown(false);
      };
    
      const handleAmountChange = (text: string) => {
        setAmount(text);
        onSelect(unit, text);  
      };

    return (
        <View style={{ flex: 2, flexDirection: 'column' }}>
            <View style={styles.inputSmaller}>
                <TextInput
                    placeholder={`00`}
                    inputMode='numeric'
                    value={amount}
                    maxLength={4}
                    placeholderTextColor={Colors.dark.text}
                    onChangeText={handleAmountChange}
                    style={{ fontFamily: 'Alata', flex: 1, color: Colors.dark.text }}
                />
                <AlataText style={{ fontSize: 16, color: Colors.dark.text, flex: 1, textAlign: 'center' }}>{unit}</AlataText>
                {
                    dropDown ?
                        <Pressable onPress={deactivateDropDown}>
                            <ChevronUp color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
                        </Pressable>
                        :
                        <Pressable onPress={activateDropDown}>
                            <ChevronDown color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
                        </Pressable>
                }
            </View>

            {
                dropDown ?
                    <View style={{ backgroundColor: Colors.dark.mainColorDark, borderRadius: 15, paddingVertical: 15, marginTop: 54, width: 130, position: 'absolute', zIndex: 1 }}>
                        {item.map((unitItem) => (
                            <Pressable
                                key={unitItem.key}
                                onPress={() => handleSelectUnit(unitItem.value)}
                                style={({ pressed }) => [
                                    styles.button,
                                    { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.mainColorDark },
                                ]}
                            >
                                <Alata12>{unitItem.value}</Alata12>
                            </Pressable>
                        ))}
                    </View>
                    : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    inputSmaller: {
        color: Colors.dark.text,
        backgroundColor: Colors.dark.mainColorLight,
        flexDirection: 'row',
        padding: 10,
        borderRadius: 15,
        marginBottom: 10,
        marginTop: 5,
        fontFamily: 'Alata',
        flex: 2
    },
    button: {
        padding: 10,
        paddingLeft: 15
    }
})