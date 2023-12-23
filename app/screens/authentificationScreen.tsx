
import React, { useState } from 'react';
import { View, StyleSheet, Pressable} from 'react-native';
import { User2, Mail, KeyRound, Eye, EyeOff, AlignCenter } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { Alata20, Alata22 } from '../../components/StyledText';
import { TextInput } from 'react-native-gesture-handler';
import { useSession } from '../../api/firebaseAuthentication/client';
import { router } from 'expo-router';

export default function LoginModalScreen() {
  const [hidePassword, setHidePassword] = useState(true);
  const [loginMode, setLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, isLoading } = useSession();

  const logIn = async () => {
    console.log('Log In button clicked'); 
    if (loginMode) {
      await signIn(email, password);
      router.replace('/');
      console.log('Sign In successful'); 
    } else {
      setLoginMode(true);
    }
  };

  const handleSignUp = async () => {
    if (!loginMode) {
      await signUp(email, password); 
    } else {
      setLoginMode(false);
    }
  };

  return (
    <View style={gStyles.defaultContainer}>
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
            <Pressable onPress={() => setHidePassword(false)} style={gStyles.alignCenter}>
              <Eye color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
            </Pressable>
            :
            <Pressable onPress={() => setHidePassword(true)} style={gStyles.alignCenter}>
              <EyeOff color={Colors.dark.text} size={24} style={gStyles.alignCenter}/>
            </Pressable>
          }
        </View>

        {
          !loginMode ?
            <View style={gStyles.cardInput}>
              <KeyRound color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
              <TextInput placeholder="Repeat Password" placeholderTextColor={Colors.dark.text} style={gStyles.textInput} secureTextEntry={hidePassword} />
              {hidePassword ?
                <Pressable onPress={() => setHidePassword(false)} style={gStyles.alignCenter}>
                  <Eye color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
                </Pressable>
                :
                <Pressable onPress={() => setHidePassword(true)} style={gStyles.alignCenter}>
                  <EyeOff color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
                </Pressable>
              }
            </View>
            : null
        }

        <Pressable style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: !loginMode ? Colors.dark.background : pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]} onPress={logIn} disabled={isLoading}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>{loginMode ? 'Log in' : 'already have a acount'}</Alata20>
        </Pressable>

        <Pressable style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: loginMode ? Colors.dark.background : pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]} onPress={handleSignUp} disabled={isLoading}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>{!loginMode ? 'create Account' : 'Sign up'}</Alata20>
        </Pressable>
      </View>
    </View>
  );
};