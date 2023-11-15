import { StatusBar } from 'expo-status-bar';
import { Modal, Platform, StyleSheet } from 'react-native';

import { BlurView } from 'react-native-blur';
import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import React from 'react';

interface props {
    onClose: () => void;
};


export default function SettingsModal({ onClose }: props) {

    onClose = () => {
        onClose();
    } 
    
    return (
      <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={() => onClose()}
    >
      <View style={styles.container}>
          <Text style={styles.title}>Settings Page</Text>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          <EditScreenInfo path="app/settingsModal.tsx" />
    
          {/* Use a light status bar on iOS to account for the black space above the modal */}
          <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
        </View>
    </Modal>
        
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
  });