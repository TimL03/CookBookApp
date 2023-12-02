
import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Button, Animated, } from 'react-native';
import { Settings, User2, Info } from 'lucide-react-native';
import { BlurView, VibrancyView } from 'react-native-blur';
import Colors from '../../constants/Colors';
import { Link, router, Stack } from 'expo-router';
import { AlataLarge, AlataMedium, AlataLargeMiddle } from '../../components/StyledText';
import { AlignCenter } from 'lucide-react-native';
import SettingsModal from '../screens/settingsScreen';


interface ActionsModalProps {
    visible: boolean;
    onClose: () => void;
}

const ActionsModal = ({ visible, onClose}: ActionsModalProps) => {


  const handleSettingsPress = () => {
    onClose();  
    debugger;
  };

  
  return (
      <Pressable style={styles.modalContainer} onPress={router.back}>
        <View style={styles.modalContent}>
          <AlataLargeMiddle>Aktionen</AlataLargeMiddle>     
            <Pressable style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.background }]} onPress={() => router.replace('/screens/settingsScreen')}>
                <Settings color={Colors.dark.text} size={22} style={{alignSelf: 'center'}} />
                <AlataLarge style={{paddingBottom: 4}}>Settings</AlataLarge>
            </Pressable>
            
            <Pressable style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.background }]} onPress={() => router.replace('/screens/accountScreen')}>
              <User2 color={Colors.dark.text} size={22} style={{alignSelf: 'center'}} />
              <AlataLarge style={{paddingBottom: 4}}>Account</AlataLarge>
            </Pressable>
            
            <Pressable style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.background },]} onPress={() => router.replace('/screens/aboutScreen')}>
              <Info color={Colors.dark.text} size={22} style={{alignSelf: 'center'}} />
              <AlataLarge style={{paddingBottom: 4}}>About the App</AlataLarge>
            </Pressable>
        </View>
      </Pressable>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#0000'
  },
  modalContent: {
    backgroundColor: Colors.dark.mainColorDark,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 15,
  },
  fadeIn: {
    backgroundColor: '#000',
    flex: 1,
    flexGrow: 3
  }
});

export default ActionsModal;
