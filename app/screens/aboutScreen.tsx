import { StatusBar } from 'expo-status-bar';
import { Modal, Platform, Pressable, StyleSheet, Image } from 'react-native';

import { Text, View } from '../../components/Themed';
import React from 'react';
import { Link, Stack } from 'expo-router';
import { ChevronLeft} from 'lucide-react-native'
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { Alata12, Alata14, Alata18, Alata20 } from '../../components/StyledText';

export default function aboutScreen() {    
    return (
      <>
        <Stack.Screen options={{ 
          title: 'About the App',
          headerStyle: {
            backgroundColor: Colors.dark.mainColorDark,
          },
          headerTitleAlign: 'center',
          headerLeft: () => 
          <Link href="/"> 
            <ChevronLeft color={Colors.dark.text} size={28}/>
          </Link>
        }} 
        />
        <View style={[gStyles.defaultContainer, styles.gap]}>
          <View style={styles.center}>
            <Image source={require('../../assets/images/icon.png')} style={styles.logo}/>
            <Alata12 style={styles.moreMarginBottom}>CookBook-App v1.0</Alata12>
          </View>

          <View style={styles.textBox}>
            <Alata20 style={styles.marginBottom}>Developed by:</Alata20>
            <Alata14>Leon Withake</Alata14>
            <Alata14>Hochkamerstraße, 75</Alata14>
            <Alata14>47506 Neukirchen-Vluyn</Alata14>
            <Alata14>Germany</Alata14>
          </View>
          
          <View style={[styles.textBox, styles.moreMarginBottom]}>
            <Alata14>Tim Liesegang</Alata14>
            <Alata14>Zwischen den Gärten, 1c</Alata14>
            <Alata14>45472 Mülheim an der Ruhr</Alata14>
            <Alata14>Germany</Alata14>
          </View>

          <View style={styles.textBox}>
          <Alata20 style={styles.marginBottom}>Contact:</Alata20>
            <Alata14>Email: Tim.Liesegang@stud.hs-ruhrwest.de</Alata14>
            <Alata14>Phone: +49 177 167 2199</Alata14>
          </View>
        </View>
      </>
    );
}

const styles = StyleSheet.create({
    gap: {
      gap: 20,
    },
    center: {
      alignItems: 'center',
      paddingTop: 40,
      gap: 10,
      paddingHorizontal: 0,
    },
    logo: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    },
    textBox: {
      justifyContent: 'flex-start',
      textAlign: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
    },
    marginBottom: {
      marginBottom: 10,
    },
    moreMarginBottom: {
      marginBottom: 40,
    },
  });