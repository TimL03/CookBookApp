import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import Colors from '../constants/Colors';
import { DarkTheme } from '@react-navigation/native';
import {View} from './Themed';
import { AlataMedium } from './StyledText';

export default function Recipe(){
    return (
        <TouchableOpacity style={styles.item}>  
            <Image
                style={styles.logoSmall}
                source={require('../assets/images/ramenImage.png')}
            />
            <View style={styles.test}>
                <AlataMedium>Gericht 1</AlataMedium>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: Colors.dark.mainColorDark,
        borderRadius: 10,
        height: 96,
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    logoSmall: {
        width: 96,
        height: 96,
        borderRadius: 10,
    },
    test: {
        backgroundColor: Colors.dark.mainColorDark,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        height: 96,
        width: 216,    
        opacity: 100, 
    },
    title: {
        paddingLeft: 12,
        paddingTop: 6,
    }
});