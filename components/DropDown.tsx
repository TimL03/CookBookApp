import React from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import gStyles from '../constants/Global_Styles';
import Colors from '../constants/Colors';
import { Alata12, Alata14 } from './StyledText';

type SelectionProps = {
    item: {
        key: string;
        value: string;
    }[];
    selectedUnit: string;
    selectedAmount: string;
    onSelect: (unit: string, amount: string) => void;
    onDropDown: () => void;
};


export default function DropDown({ item, selectedUnit, selectedAmount, onSelect, onDropDown }: SelectionProps) {
    const [dropDown, setDropDrown] = React.useState(false);
    const [unit, setUnit] = React.useState(selectedUnit || 'x');
    const [amount, setAmount] = React.useState(selectedAmount || '');
    const [inputWidth, setInputWidth] = React.useState(0);

    const handleInputLayout = (event: { nativeEvent: { layout: { width: any; }; }; }) => {
        const { width } = event.nativeEvent.layout;
        setInputWidth(width);
      };

    const activateDropDown = () => {
        setDropDrown(true);
        onDropDown();
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
        <View style={styles.horizontalLayout}>
            <View style={gStyles.cardInput} onLayout={handleInputLayout}>
                <TextInput
                    placeholder={`00`}
                    inputMode='numeric'
                    value={amount}
                    maxLength={4}
                    placeholderTextColor={Colors.dark.text}
                    onChangeText={handleAmountChange}
                    style={[gStyles.textInput]}
                />
                <Alata14 style={[gStyles.alignCenter, styles.marginRight, {flex: 3}]} numberOfLines={1} ellipsizeMode='tail'>{unit}</Alata14>
                {
                    dropDown ?
                        <Pressable onPress={deactivateDropDown} style={gStyles.alignCenter}>
                            <ChevronUp color={Colors.dark.text} size={28} strokeWidth='2.5'  />
                        </Pressable>
                        :
                        <Pressable onPress={activateDropDown} style={gStyles.alignCenter}>
                            <ChevronDown color={Colors.dark.text} size={28} strokeWidth='2.5' style={gStyles.alignCenter} />
                        </Pressable>
                }
            </View>

            {
                dropDown ?
                    <View style={[gStyles.dropDownContainer, {width: inputWidth}]}>
                        {item.map((unitItem) => (
                            <Pressable
                                key={unitItem.key}
                                onPress={() => handleSelectUnit(unitItem.value)}
                                style={({ pressed }) => [
                                    styles.dropDownElement,
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
    marginRight: {
        marginRight: -4
    },
    dropDownElement: {
        padding: 10,
        paddingLeft: 15
    }, 
    horizontalLayout: {
        flex: 2, 
        flexDirection: 'column'
    }
})