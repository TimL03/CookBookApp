import React, { useEffect } from 'react'
import AwesomeAlert from 'react-native-awesome-alerts'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import Colors from '../../../constants/Colors'
import { Alata22, Alata16, Alata14 } from '../../../components/StyledText'

interface AlertModalProps {
  title: string
  message: string
  buttonText: string
  alertModalVisible: boolean
  setAlertModalVisible: (visible: boolean) => void
}

export default function AlertModal(props: AlertModalProps) {
  const {
    title,
    message,
    buttonText,
    alertModalVisible,
    setAlertModalVisible,
  } = props

  return (
    <Modal
      visible={alertModalVisible}
      transparent={true}
      onRequestClose={() => setAlertModalVisible(false)}
    >
      <Pressable
        onPress={() => setAlertModalVisible(false)}
        style={styles.background}
      >
        <Pressable style={styles.alertCard}>
          <Alata22>{title}</Alata22>
          <Alata16>{message}</Alata16>
          <View style={styles.horizontal}>
            <Pressable
              style={styles.button}
              onPress={() => {
                setAlertModalVisible(false)
              }}
            >
              <Alata14>{buttonText}</Alata14>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
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
    paddingHorizontal: 20,
  },
})
