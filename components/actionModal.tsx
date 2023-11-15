
import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Button, } from 'react-native';
import { Settings, User2, Info } from 'lucide-react-native';
import { BlurView, VibrancyView } from 'react-native-blur';
import Colors from '../constants/Colors';
import { Link } from 'expo-router';
import { AlataLarge, AlataMedium, AlataLargeMiddle } from './StyledText';
import { AlignCenter } from 'lucide-react-native';
import SettingsModal from '../app/settingsModal';


interface ActionsModalProps {
    visible: boolean;
    onClose: () => void;
}

const ActionsModal = ({ visible, onClose}: ActionsModalProps) => {

  const modalStyle = {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: visible ? 'blur(px)' : 'none',
  };

  const handleSettingsPress = () => {
    onClose(); // Close the modal before opening the settings
    debugger;
    // Navigate to the SettingsModal or perform an action related to settings
    // For navigation, you'd typically use a navigation library like react-navigation here
    // For example:
    // navigation.navigate('SettingsScreen') if using react-navigation
  };

  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose()}
    >
      <Pressable style={styles.modalContainer} onPress={onClose}>
        <View style={styles.modalContent}>
          <AlataLargeMiddle>Aktionen</AlataLargeMiddle>        
            <Link href="/settingsModal" asChild>
              <Pressable style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.background }]}>
                <View style={styles.button}>
                  <Settings color={Colors.dark.text} size={22} style={{alignSelf: 'center'}} />
                  <AlataLarge style={{paddingBottom: 4}}>Settings</AlataLarge>
                </View>
              </Pressable>
            </Link>    
            
            <Pressable style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.background },]} onPress={onClose}>
              <User2 color={Colors.dark.text} size={22} style={{alignSelf: 'center'}} />
              <AlataLarge style={{paddingBottom: 4}}>Account</AlataLarge>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.button, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.background },]} onPress={onClose}>
              <Info color={Colors.dark.text} size={22} style={{alignSelf: 'center'}} />
              <AlataLarge style={{paddingBottom: 4}}>About the App</AlataLarge>
            </Pressable>
        </View>
      </Pressable>
        
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    backdropFilter: 'blur(5px)',
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
  }
});

export default ActionsModal;
