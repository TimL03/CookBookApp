import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Carrot, Soup } from 'lucide-react-native';



import Colors from '../constants/Colors';
import { DarkTheme } from '@react-navigation/native';
import {View} from './Themed';
import { AlataLarge, AlataMedium } from './StyledText';

type RecipeProps = {
    item: {
        name: string;
        cookTime: string;
    };
};

export default function Recipe({ item }: RecipeProps) {

    return (
        <TouchableOpacity style={styles.outerBox} activeOpacity={0.2}>  
            <Image
                style={styles.logoSmall}
                source={require('../assets/images/ramenImage.png')}
            />
            <View style={styles.innerBox}>
                <AlataLarge>{item.name}</AlataLarge>
                <AlataMedium>{item.cookTime}</AlataMedium>
            </View>
            <View style={styles.icons}>
                    <Soup color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />
                    <Carrot color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />
            </View>
            

            
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    outerBox: {
        backgroundColor: Colors.dark.mainColorDark,
        borderRadius: 10,
        height: 96,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 5,
        marginVertical: 8,
    },
    innerBox: {
        backgroundColor: Colors.dark.mainColorDark,
        margin: 8,
        gap: 0
    },
    logoSmall: {
        alignContent: 'flex-start',
        width: 96,
        height: 96,
        borderRadius: 10,        
    },
    icons: {
        backgroundColor: Colors.dark.mainColorDark,
        flex: 2,
        margin: 8,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'flex-end',
        flexWrap: 'wrap-reverse',
        borderRadius: 10,
    }
});