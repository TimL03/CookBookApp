import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import { StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

interface AlertModalProps {
  title: string;
  message: string;
  buttonText: string;
  alertModalVisible: boolean;
  setAlertModalVisible: (visible: boolean) => void;
}

export default function AlertModal(props: AlertModalProps) {
  const { title, message, buttonText, alertModalVisible, setAlertModalVisible } = props;

  return (
    <AwesomeAlert
      show={alertModalVisible}
      title={title}
      message={message}
      closeOnTouchOutside={true}
      onDismiss={() => setAlertModalVisible(false)}
      showConfirmButton={true}
      overlayStyle={styles.background}
      actionContainerStyle={styles.actionContainer}
      titleStyle={styles.title}
      messageStyle={styles.text}
      confirmButtonTextStyle={styles.text}
      confirmText={buttonText}
      confirmButtonStyle={styles.button}
      confirmButtonColor={Colors.dark.tint}
      contentContainerStyle={styles.alertCard}
      modalProps={{}}
      onConfirmPressed={() => {
        setAlertModalVisible(false);
      }}
    />
  );
}

const styles = StyleSheet.create({
    background: {
      backgroundColor: 'transparent',
    },
    title: {
      color: Colors.dark.text,
      fontFamily: 'Alata',
      fontSize: 22,
    },
    alertCard: {
      backgroundColor: Colors.dark.mainColorDark,
      borderRadius: 15,
      elevation: 10,
    },
    button: {
      backgroundColor: Colors.dark.tint,
      alignSelf: 'flex-end',
      borderRadius: 30,
      paddingHorizontal: 20,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    text: {
        color: Colors.dark.text,
        fontFamily: 'Alata',
        fontSize: 16,
    },

  });
