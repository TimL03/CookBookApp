import React, { useState } from 'react'
import AwesomeAlert from 'react-native-awesome-alerts'
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native'
import Colors from '../../../constants/Colors'
import {
  Alata22,
  Alata16,
  Alata14,
  Alata20,
} from '../../../components/StyledText'
import gStyles from '../../../constants/Global_Styles'

interface AlertModalProps {
  minutes: string
  setMinutes: (minutes: string) => void
  hours: string
  setHours: (hours: string) => void
  alertModalVisible: boolean
  onConfirm: () => void
  setAlertModalVisible: (visible: boolean) => void
}

export default function AlertModal(this: any, props: AlertModalProps) {
  const {
    minutes,
    setMinutes,
    hours,
    setHours,
    alertModalVisible,
    setAlertModalVisible,
    onConfirm,
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
        <View
          style={[
            styles.alertCard,
            { backgroundColor: Colors.dark.background },
          ]}
        >
          <Alata22>You want to save this recipe?</Alata22>
          <Alata16>Please enter a cook time</Alata16>
          <>
            {/* adding Recipe preparation time */}
            <Alata20>Preperation Time:</Alata20>
            <View style={[gStyles.HorizontalLayout, { gap: 12 }]}>
              <View style={[gStyles.cardInput, gStyles.flex]}>
                <TextInput
                  inputMode="numeric"
                  maxLength={2}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this.minuteInput.focus()
                  }}
                  placeholder="00"
                  value={hours}
                  onChangeText={setHours}
                  style={gStyles.textInput}
                  placeholderTextColor={Colors.dark.text}
                />
                <Alata16 style={gStyles.alignCenter}>hours</Alata16>
              </View>

              <View style={[gStyles.cardInput, gStyles.flex]}>
                <TextInput
                  inputMode="numeric"
                  maxLength={2}
                  ref={(input) => {
                    this.minuteInput = input
                  }}
                  placeholder="00"
                  value={minutes}
                  onChangeText={setMinutes}
                  style={gStyles.textInput}
                  placeholderTextColor={Colors.dark.text}
                />
                <Alata16 style={gStyles.alignCenter}>minutes</Alata16>
              </View>
            </View>
          </>
          <View style={styles.horizontal}>
            <Pressable
              style={styles.button}
              onPress={() => {
                setAlertModalVisible(false)
              }}
            >
              <Alata14>cancel</Alata14>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: Colors.dark.tint }]}
              onPress={() => {
                setAlertModalVisible(false), onConfirm()
              }}
            >
              <Alata14>save to cookbook</Alata14>
            </Pressable>
          </View>
        </View>
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
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  alertCard: {
    gap: 10,
    borderRadius: 15,
    padding: 20,
    width: '90%',
    elevation: 10,
  },
  button: {
    backgroundColor: Colors.dark.mainColorLight,
    padding: 10,
    alignSelf: 'flex-end',
    borderRadius: 30,
    paddingHorizontal: 20,
  },
})
