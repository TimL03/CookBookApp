import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { User2, Mail, KeyRound, Eye, EyeOff } from 'lucide-react-native'
import Colors from '../../constants/Colors'
import gStyles from '../../constants/Global_Styles'
import { Alata20, Alata22, Alata24 } from '../../components/StyledText'
import { TextInput } from 'react-native-gesture-handler'
import { useSession } from '../../api/firebaseAuthentication/client'
import { router } from 'expo-router'

// Define and export the LoginModalScreen function
export default function LoginModalScreen(this: any) {
  // Initialize state variables
  const [hidePassword, setHidePassword] = useState(true)
  const [loginMode, setLoginMode] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const { signIn, signUp, isLoading } = useSession()

  // Function to handle the login process
  const logIn = async () => {
    if (loginMode) {
      // Attempt to sign in using email and password
      await signIn(email, password)
      // Redirect to the home page upon successful login
      router.replace('/')
    } else {
      // Switch to login mode if currently in signup mode
      setLoginMode(true)
    }
  }

  // Function to handle the signup process
  const handleSignUp = async () => {
    if (!loginMode) {
      // Attempt to sign up using email, password, and username
      await signUp(email, password, username)
      // Redirect to the home page upon successful signup
      router.replace('/')
    } else {
      // Switch to signup mode if currently in login mode
      setLoginMode(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[gStyles.defaultContainer, styles.center]}
    >
      <View>
        {loginMode ? (
          <Alata24 style={[gStyles.alignCenter, styles.marginBottom]}>
            Welcome back!
          </Alata24>
        ) : (
          <Alata24 style={[gStyles.alignCenter, styles.marginBottom]}>
            Welcome to the{'\n'}CookBook App!
          </Alata24>
        )}
        <Image
          source={require('../../assets/images/login_image.png')}
          style={styles.image}
        />
      </View>
      <View
        style={[
          gStyles.modalContentContainer,
          styles.contentBox,
          { paddingVertical: loginMode ? 105 : 40 },
        ]}
      >
        {!loginMode ? (
          <>
            <View style={gStyles.cardInput}>
              <User2
                color={Colors.dark.text}
                size={24}
                style={gStyles.alignCenter}
              />
              <TextInput
                value={username}
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.emailInput.focus()
                }}
                blurOnSubmit={false}
                onChangeText={setUsername}
                placeholder="Name"
                placeholderTextColor={Colors.dark.text}
                style={gStyles.textInput}
              />
            </View>
          </>
        ) : null}

        <View style={gStyles.cardInput}>
          <Mail
            color={Colors.dark.text}
            size={24}
            style={gStyles.alignCenter}
          />
          <TextInput
            placeholder="Email"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.passwordInput.focus()
            }}
            ref={(input) => {
              this.emailInput = input
            }}
            onChangeText={setEmail}
            value={email}
            placeholderTextColor={Colors.dark.text}
            style={gStyles.textInput}
          />
        </View>

        <View style={gStyles.cardInput}>
          <KeyRound
            color={Colors.dark.text}
            size={24}
            style={gStyles.alignCenter}
          />
          <TextInput
            placeholder="Password"
            returnKeyType={loginMode ? 'done' : 'next'}
            onSubmitEditing={() => {
              loginMode ? logIn() : this.passwordRepeatInput.focus()
            }}
            blurOnSubmit={false}
            ref={(input) => {
              this.passwordInput = input
            }}
            onChangeText={setPassword}
            value={password}
            placeholderTextColor={Colors.dark.text}
            style={gStyles.textInput}
            secureTextEntry={hidePassword}
          />
          {hidePassword ? (
            <Pressable
              onPress={() => setHidePassword(false)}
              style={gStyles.alignCenter}
            >
              <Eye
                color={Colors.dark.text}
                size={24}
                style={gStyles.alignCenter}
              />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setHidePassword(true)}
              style={gStyles.alignCenter}
            >
              <EyeOff
                color={Colors.dark.text}
                size={24}
                style={gStyles.alignCenter}
              />
            </Pressable>
          )}
        </View>

        {!loginMode ? (
          <View style={gStyles.cardInput}>
            <KeyRound
              color={Colors.dark.text}
              size={24}
              style={gStyles.alignCenter}
            />
            <TextInput
              placeholder="Repeat Password"
              onSubmitEditing={handleSignUp}
              ref={(input) => {
                this.passwordRepeatInput = input
              }}
              placeholderTextColor={Colors.dark.text}
              style={gStyles.textInput}
              secureTextEntry={hidePassword}
            />
            {hidePassword ? (
              <Pressable
                onPress={() => setHidePassword(false)}
                style={gStyles.alignCenter}
              >
                <Eye
                  color={Colors.dark.text}
                  size={24}
                  style={gStyles.alignCenter}
                />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setHidePassword(true)}
                style={gStyles.alignCenter}
              >
                <EyeOff
                  color={Colors.dark.text}
                  size={24}
                  style={gStyles.alignCenter}
                />
              </Pressable>
            )}
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            gStyles.cardHorizontal,
            gStyles.justifyCenter,
            {
              backgroundColor: !loginMode
                ? Colors.dark.mainColorDark
                : pressed
                  ? Colors.dark.mainColorLight
                  : Colors.dark.tint,
            },
          ]}
          onPress={logIn}
          disabled={isLoading}
        >
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>
            {loginMode ? 'Log in' : 'already have a acount'}
          </Alata20>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            gStyles.cardHorizontal,
            gStyles.justifyCenter,
            {
              backgroundColor: loginMode
                ? Colors.dark.mainColorDark
                : pressed
                  ? Colors.dark.mainColorLight
                  : Colors.dark.tint,
            },
          ]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>
            {!loginMode ? 'create Account' : 'Sign up'}
          </Alata20>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  center: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadiusBottomLeft: 0,
    borderRadiusBottomRight: 0,
    backgroundColor: Colors.dark.mainColorDark,
  },
  marginBottom: {
    marginBottom: 30,
  },
  contentBox: {
    borderRadius: 20,
    backgroundColor: Colors.dark.background,
  },
  image: {
    width: 300,
    height: 300,
    marginRight: 20,
    marginBottom: -30,
    zIndex: 1,
    resizeMode: 'contain',
  },
})
