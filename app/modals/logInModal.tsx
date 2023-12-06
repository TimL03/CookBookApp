
import React, { useState } from 'react';
import { View, StyleSheet, Pressable} from 'react-native';
import { User2, Mail, KeyRound, Eye, EyeOff, AlignCenter } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { auth } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Alata20, Alata22 } from '../../components/StyledText';
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
    <Pressable style={gStyles.modalBackgroundContainer}>
      <View style={gStyles.modalContentContainer}>
        <Alata22 style={gStyles.alignCenter}>Welcome</Alata22>
        {
          !loginMode ?
            <View style={gStyles.cardInput}>
              <User2 color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
              <TextInput placeholder="Name" placeholderTextColor={Colors.dark.text} style={gStyles.textInput} />
            </View>
            : null
        }

        <View style={gStyles.cardInput}>
          <Mail color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
          <TextInput placeholder="Email" onChangeText={setEmail} value={email}
            placeholderTextColor={Colors.dark.text} style={gStyles.textInput} />
        </View>

        <View style={gStyles.cardInput}>
          <KeyRound color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
          <TextInput placeholder="Password" onChangeText={setPassword} value={password}
            placeholderTextColor={Colors.dark.text} style={gStyles.textInput} secureTextEntry={hidePassword} />
          {hidePassword ?
            <Pressable onPress={showPassword} style={gStyles.alignCenter}>
              <Eye color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
            </Pressable>
            :
            <Pressable onPress={dontShowPassword} style={gStyles.alignCenter}>
              <EyeOff color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
            </Pressable>
          }
        </View>

        {
          !loginMode ?
            <View style={gStyles.cardInput}>
              <KeyRound color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
              <TextInput placeholder="Repeat Password" placeholderTextColor={Colors.dark.text} style={gStyles.textInput} secureTextEntry={hidePassword} />
              {hidePassword ?
                <Pressable onPress={showPassword} style={gStyles.alignCenter}>
                  <Eye color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
                </Pressable>
                :
                <Pressable onPress={dontShowPassword} style={gStyles.alignCenter}>
                  <EyeOff color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
                </Pressable>
              }
            </View>
            : null
        }

        <Pressable style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: !loginMode ? Colors.dark.background : pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]} onPress={logIn}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>{loginMode ? 'Log in' : 'already have a acount'}</Alata20>
        </Pressable>

        <Pressable style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: loginMode ? Colors.dark.background : pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]} onPress={signUp}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>{!loginMode ? 'create Account' : 'Sign up'}</Alata20>
        </Pressable>
      </View>
    </Pressable>
  );
};
