import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Colors from '../../../constants/Colors';
import { Alata22, Alata16, Alata14 } from '../../../components/StyledText';

interface AlertModalProps {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  alertModalVisible: boolean;
  onConfirm: () => void;
  setAlertModalVisible: (visible: boolean) => void;
}

export default function AlertModal(props: AlertModalProps) {
  const { title, message, cancelText, confirmText, alertModalVisible, setAlertModalVisible, onConfirm} = props;

  return (
    <Modal
      visible={alertModalVisible}
      transparent={true}
      onRequestClose={() => setAlertModalVisible(false)}
    >
      <View style={styles.background}>
        <View style={styles.alertCard}>
          <Alata22>{title}</Alata22>
          <Alata16>{message}</Alata16>
          <View style={styles.horizontal}>
            <Pressable style={styles.button} onPress={() => {setAlertModalVisible(false)}}>
              <Alata14>{cancelText}</Alata14>
            </Pressable>
            <Pressable style={[styles.button, {backgroundColor: Colors.dark.alert}] } onPress={() => {setAlertModalVisible(false), onConfirm()}}>
              <Alata14>{confirmText}</Alata14>
            </Pressable>
          </View>
        </View>
      </View>
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
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  alertCard: {
    backgroundColor: Colors.dark.mainColorDark,
    gap: 10,
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
    paddingHorizontal: 20,
  },

  });
