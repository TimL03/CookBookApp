import React from 'react';
import { View, StatusBar, Platform, StyleSheet, Pressable } from 'react-native';
import gStyles from '../constants/Global_Styles';
import EditScreenInfo from './EditScreenInfo';
import { Alata14 } from './StyledText';
import Colors from '../constants/Colors';
import { useLocalSearchParams } from 'expo-router';


export default function alertModal() {
    const params = useLocalSearchParams();
    return (
        <View style={styles.modalBackgroundContainer}>
            <View style={styles.modalContentContainer}> 
                <Alata14>Modal</Alata14>
                <View style={styles.footer}>
                    <Pressable>
                        <Alata14>Close</Alata14>
                    </Pressable>
                    <Pressable>
                        <Alata14>Close</Alata14>
                    </Pressable>
                </View>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    modalBackgroundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.dark.seeThrough,
    },
    modalContentContainer: {
        backgroundColor: Colors.dark.mainColorDark,
        padding: 25,
        borderRadius: 20,
        gap: 15,
        width: '100%',
        justifyContent: 'space-between',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
})