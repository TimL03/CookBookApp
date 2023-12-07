import { StatusBar } from 'expo-status-bar';
import { Modal, Platform, Pressable, StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import React from 'react';
import { Link, Stack } from 'expo-router';
import { ChevronLeft} from 'lucide-react-native'
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { Alata16, Alata18, Alata20 } from '../../components/StyledText';


export default function aboutScreen() {    
    return (
      <>
        <Stack.Screen options={{ 
          title: 'About (Legal Notice)',
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
        <View style={[gStyles.screenContainer, {justifyContent: 'flex-start'}]}>
          <View style={gStyles.HorizontalLayout}>
            <Alata18 style={gStyles.alignCenter}>Name: </Alata18>
            <Alata16 style={gStyles.alignCenter}>Tim Liesegang</Alata16>
          </View>
          <View style={gStyles.HorizontalLayout}>
            <Alata18 style={gStyles.alignCenter}>Street, House Number: </Alata18>
            <Alata16 style={gStyles.alignCenter}>Zwischen den Gärten, 1c</Alata16>
          </View>
          
          <Link href={"https://github.com/TimL03/CookBookApp"}>
            <Text style={styles.linkText}>Go to Git</Text>
          </Link>
        </View>
      </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  });