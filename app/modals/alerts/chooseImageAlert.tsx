import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Button, Modal, Pressable, StyleSheet, View } from 'react-native';
import Colors from '../../../constants/Colors';
import { Alata14, Alata16, Alata22 } from '../../../components/StyledText';

interface AlertModalProps {
  title: string;
  message: string;
  optionOneText: string;
  optionTwoText: string;
  cancelText: string;
  alertModalVisible: boolean;
  optionOneConfirm: () => void;
  optionTwoConfirm: () => void;
  setAlertModalVisible: (visible: boolean) => void;
}

export default function AlertModal(props: AlertModalProps) {
  const { title, message, optionOneText, optionTwoText, cancelText, alertModalVisible, setAlertModalVisible, optionOneConfirm, optionTwoConfirm } = props;

  return (
    <Modal
      visible={alertModalVisible}
      transparent={true}
      onRequestClose={() => setAlertModalVisible(false)}
    >
      <Pressable onPress={() => setAlertModalVisible(false)} style={styles.background}>
        <View style={styles.alertCard}>
          <Alata22>{title}</Alata22>
          <Alata16>{message}</Alata16>
          <View style={styles.horizontal}>
            <Pressable style={[styles.button, {backgroundColor: Colors.dark.alert}]} onPress={() => { setAlertModalVisible(false); }}>
              <Alata14>{cancelText}</Alata14>  
            </Pressable>
            <Pressable style={styles.button} onPress={() => {setAlertModalVisible(false), optionOneConfirm()}}>
              <Alata14>{optionOneText}</Alata14>
            </Pressable>
            <Pressable style={styles.button} onPress={() => {setAlertModalVisible(false), optionTwoConfirm()}}>
              <Alata14>{optionTwoText}</Alata14>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
    background: {
      backgroundColor: 'transparent',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
    },
    alertCard: {
      backgroundColor: Colors.dark.mainColorDark,
      gap: 20,
      borderRadius: 15,
      padding: 20,
      width: '90%',
      elevation: 10,
    },
    button: {
      backgroundColor: Colors.dark.tint,
      padding: 10,
      alignSelf: 'flex-end',
      borderRadius: 30,
      paddingHorizontal: 15,
    },
  });
