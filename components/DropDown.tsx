import React, { useRef } from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { AlataLarge, AlataMedium, AlataText } from './StyledText';
import { FlatList } from 'react-native-gesture-handler';

type SelectionProps = {
  item: { 
    key: string;
    value: string;
  }[];
};

export default function DropDown({ item }: SelectionProps) {
    const [dropDown, setDropDrown] = React.useState(false);
    const [unit, setNewUnit] = React.useState('x');

    const activateDropDown = () => {
        setDropDrown(true);
    }

    const deactivateDropDown = () => {
        setDropDrown(false);
    }

    const setUnit = (itemKey: string) => {
        setNewUnit(itemKey);
        setDropDrown(false);
    }

    return(
       <View style={{flex: 2, flexDirection: 'column'}}>
            <View style={styles.inputSmaller}>
                <TextInput
                    placeholder={`00`}
                    inputMode='numeric'
                    maxLength={4}
                    placeholderTextColor={Colors.dark.text}
                    onChangeText={(text) => {
                    }}
                    style={{fontFamily: 'Alata', flex: 1, color: Colors.dark.text}}
                />
                <AlataText style={{fontSize: 16, color: Colors.dark.text, flex: 1, textAlign: 'center'}}>{unit}</AlataText>
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
                <View style={{ backgroundColor: Colors.dark.mainColorDark, borderRadius: 15, paddingVertical: 15, marginTop: 54, width: 130, position: 'absolute', zIndex: 1}}>
                    {item.map((item) => (
                        <Pressable
                            key={item.key}
                            onPress={() => setUnit(item.value)}
                            style={({ pressed }) => [
                            styles.button,
                            {
                                backgroundColor: pressed
                                ? Colors.dark.mainColorLight
                                : Colors.dark.mainColorDark,
                            },
                            ]}
                        >
                            <AlataMedium>{item.value}</AlataMedium>
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