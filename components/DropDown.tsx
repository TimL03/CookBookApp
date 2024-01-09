import React from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import gStyles from '../constants/Global_Styles';
import Colors from '../constants/Colors';
import { Alata12, Alata14 } from './StyledText';

// Define the type for the SelectionProps
type SelectionProps = {
    index: number;
    item: {
        key: string;
        value: string;
    }[];
    selectedUnit: string;
    selectedAmount: string;
    onSelect: (unit: string, amount: string) => void;
    onDropDown: () => void;
};

// Initialize the property dropDownInputs (this will be an array)
this.dropDownInputs = [];

// Define and export the DropDown component function
export default function DropDown(this: any, { index, item, selectedUnit, selectedAmount, onSelect, onDropDown }: SelectionProps) {
    // Initialize state variables
    const [dropDown, setDropDrown] = React.useState(false);
    const [unit, setUnit] = React.useState(selectedUnit || 'x');
    const [amount, setAmount] = React.useState(selectedAmount || '');
    const [inputWidth, setInputWidth] = React.useState(0);

    // Function to handle input layout
    const handleInputLayout = (event: { nativeEvent: { layout: { width: any; }; }; }) => {
        const { width } = event.nativeEvent.layout;
        setInputWidth(width);
    };

    // Function to activate the dropdown
    const activateDropDown = () => {
        setDropDrown(true);
        onDropDown();
    }

    // Function to deactivate the dropdown
    const deactivateDropDown = () => {
        setDropDrown(false);
    }

    // Function to handle unit selection
    const handleSelectUnit = (selectedUnit: string) => {
        setUnit(selectedUnit);
        onSelect(selectedUnit, amount);
        setDropDrown(false);
    };

    // Function to handle amount change
    const handleAmountChange = (text: string) => {
        setAmount(text);
        onSelect(unit, text);
    };

    return (
        <View style={styles.horizontalLayout}>
            <View style={[gStyles.cardInput, { gap: 5 }]} onLayout={handleInputLayout}>
                <TextInput
                    placeholder={`00`}
                    inputMode='numeric'
                    value={amount}
                    ref={(input) => { this.dropDownInputs[index] = input; }}
                    returnKeyType="next"
                    blurOnSubmit={true}
                    onSubmitEditing={() => { this.ingredientInputs[index + 1] != undefined ? this.ingredientInputs[index + 1].focus() : null; }}
                    maxLength={4}
                    placeholderTextColor={Colors.dark.text}
                    onChangeText={handleAmountChange}
                    style={[gStyles.textInput]}
                />
                <Alata14 style={[gStyles.alignCenter, styles.marginRight, { flex: 2 }]} numberOfLines={1} ellipsizeMode='tail'>{unit}</Alata14>
                {
                    dropDown ?
                        <Pressable onPress={deactivateDropDown} style={gStyles.alignCenter}>
                            <ChevronUp color={Colors.dark.text} size={28} strokeWidth='2.5' />
                        </Pressable>
                        :
                        <Pressable onPress={activateDropDown} style={gStyles.alignCenter}>
                            <ChevronDown color={Colors.dark.text} size={28} strokeWidth='2.5' style={gStyles.alignCenter} />
                        </Pressable>
                }
            </View>

            {
                dropDown ?
                    <View style={[gStyles.dropDownContainer, { width: inputWidth }]}>
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