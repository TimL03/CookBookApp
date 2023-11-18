import { StatusBar } from 'expo-status-bar';
import { Modal, Platform, Pressable, StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import React from 'react';
import { Link, Stack } from 'expo-router';
import { ChevronLeft} from 'lucide-react-native'
import Colors from '../../constants/Colors';

interface props {
    onClose: () => void;
};


export default function SettingsModal({ onClose }: props) {

    
    return (
      <>
        <Stack.Screen options={{ 
          title: 'Settings',
          animation: 'slide_from_bottom',
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
        <View style={styles.container}>
          <Text style={styles.title}>SettingsScreen</Text>
          <Link href="/">
            <Text style={styles.linkText}>Go to home screen!</Text>
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