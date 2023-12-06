
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Button, } from 'react-native';
import { User2, Mail, KeyRound, Eye, EyeOff } from 'lucide-react-native';
import { BlurView, VibrancyView } from 'react-native-blur';
import Colors from '../../constants/Colors';
import { Link } from 'expo-router';
import { auth } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { AlataLarge, AlataMedium, AlataLargeMiddle } from '../../components/StyledText';
import { AlignCenter } from 'lucide-react-native';
import SettingsModal from '../screens/settingsScreen';
import { TextInput } from 'react-native-gesture-handler';


interface LoginModalProps {
  onClose: () => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  onLoginSuccess: (user: any) => void;
  setUserID: (userID: string | null) => void;}

export default function LoginModalScreen({ onClose, setIsAuthenticated, setUserID, onLoginSuccess }: LoginModalProps) {
  const [hidePassword, setHidePassword] = React.useState(true);
  const [loginMode, setLoginMode] = React.useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  const showPassword = () => {
    setHidePassword(false);
  };

  const dontShowPassword = () => {
    setHidePassword(true);
  };

  const logIn = async () => {
    if (loginMode) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userID = userCredential.user.uid; 
        setUserID(userID); 
        onLoginSuccess(userCredential.user);
        setIsAuthenticated(true);
        onClose();
      } catch (error) {
        console.error("Fehler bei der Anmeldung: ", error);
      }
    } else {
      setLoginMode(true);
    }
  };

  const signUp = async () => {
    if (!loginMode) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userID = userCredential.user.uid; 
        setUserID(userID); 
        setIsAuthenticated(true);
        onClose();
      } catch (error) {
        console.error("Fehler bei der Registrierung: ", error);
      }
    } else {
      setLoginMode(false);
    }
  };

  return (
    <Pressable style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <AlataLargeMiddle>Welcome</AlataLargeMiddle>
        {
          !loginMode ?
            <View style={styles.input}>
              <User2 color={Colors.dark.text} size={24} style={{ alignSelf: 'center' }} />
              <TextInput placeholder="Name" placeholderTextColor={Colors.dark.text} style={{ fontFamily: 'Alata', flex: 1, color: Colors.dark.text }} />
            </View>
            : null
        }

        <View style={styles.input}>
          <Mail color={Colors.dark.text} size={24} style={{ alignSelf: 'center' }} />
          <TextInput placeholder="Email" onChangeText={setEmail} value={email}
            placeholderTextColor={Colors.dark.text} style={{ fontFamily: 'Alata', flex: 1, color: Colors.dark.text }} />
        </View>

        <View style={styles.input}>
          <KeyRound color={Colors.dark.text} size={24} style={{ alignSelf: 'center' }} />
          <TextInput placeholder="Password" onChangeText={setPassword} value={password}
            placeholderTextColor={Colors.dark.text} style={{ fontFamily: 'Alata', flex: 1, color: Colors.dark.text }} secureTextEntry={hidePassword} />
          {hidePassword ?
            <Pressable onPress={showPassword} style={{ alignSelf: 'center' }}>
              <Eye color={Colors.dark.text} size={24} style={{ alignSelf: 'center' }} />
            </Pressable>
            :
            <Pressable onPress={dontShowPassword} style={{ alignSelf: 'center' }}>
              <EyeOff color={Colors.dark.text} size={24} style={{ alignSelf: 'center' }} />
            </Pressable>
          }
        </View>

        {
          !loginMode ?
            <View style={styles.input}>
              <KeyRound color={Colors.dark.text} size={24} style={{ alignSelf: 'center' }} />
              <TextInput placeholder="Repeat Password" placeholderTextColor={Colors.dark.text} style={{ fontFamily: 'Alata', flex: 1, color: Colors.dark.text }} secureTextEntry={hidePassword} />
              {hidePassword ?
                <Pressable onPress={showPassword} style={{ alignSelf: 'center' }}>
                  <Eye color={Colors.dark.text} size={24} style={{ alignSelf: 'center' }} />
                </Pressable>
                :
                <Pressable onPress={dontShowPassword} style={{ alignSelf: 'center' }}>
                  <EyeOff color={Colors.dark.text} size={24} style={{ alignSelf: 'center' }} />
                </Pressable>
              }
            </View>
            : null
        }

        <Pressable style={({ pressed }) => [styles.button, { backgroundColor: !loginMode ? Colors.dark.background : pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]} onPress={logIn}>
          <AlataLarge style={{ paddingBottom: 4, textAlign: 'center' }}>{loginMode ? 'Log in' : 'already have a acount'}</AlataLarge>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.button, { backgroundColor: loginMode ? Colors.dark.background : pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]} onPress={signUp}>
          <AlataLarge style={{ paddingBottom: 4 }}>{!loginMode ? 'create Account' : 'Sign up'}</AlataLarge>
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    backgroundColor: Colors.dark.mainColorDark,
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  input: {
    flexDirection: 'row',
    color: Colors.dark.text,
    backgroundColor: Colors.dark.mainColorLight,
    paddingHorizontal: 10,
    height: 45,
    borderRadius: 10,
    gap: 10,
  }
});


