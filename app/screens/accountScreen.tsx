import { StatusBar } from 'expo-status-bar';
import { Modal, Platform, Pressable, StyleSheet, Alert, TextInput, Button } from 'react-native';
import { Text, View } from '../../components/Themed';
import React, { useEffect, useState } from 'react';
import { Link, Stack } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, KeyRound, UserCircle2Icon } from 'lucide-react-native'
import Colors from '../../constants/Colors';
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useSession } from '../../api/firebaseAuthentication/client';
import { db } from '../../FirebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Alata16, Alata20 } from '../../components/StyledText';
import gStyles from '../../constants/Global_Styles';

interface UserData {
  username: string;
}

interface AuthData {
  email: string;
  uid: string;
}

export default function aboutScreen() {
  const { session } = useSession();
  const userID = session;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [isPasswordChangeVisible, setIsPasswordChangeVisible] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  useEffect(() => {
    const fetchFirestoreData = async () => {
      const usersCollectionRef = collection(db, 'users');
      const q = query(usersCollectionRef, where('uid', '==', userID));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocData = querySnapshot.docs[0].data();

        if ('username' in userDocData) {
          const userDocument: UserData = {
            username: userDocData.username,
          };
          setUserData(userDocument);
          console.log('Username:', userDocument.username);
        } else {
          console.log('Benutzerdokument enthält nicht die erforderlichen Felder');
        }
      } else {
        console.log('Kein Benutzerdokument in Firestore gefunden');
      }
    };


    const fetchAuthData = () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const authInfo: AuthData = {
          email: currentUser.email || 'no saved email',
          uid: currentUser.uid,
        };
        setAuthData(authInfo);
      }
    };

    if (userID) {
      fetchFirestoreData();
      fetchAuthData();
    }
  }, [userID]);

  const handleChangePassword = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      if(newPassword === newPasswordRepeat) {
        updatePassword(user, newPassword).then(() => {
          setIsPasswordChangeVisible(false);
          Alert.alert('Success', 'successfully changed password');
        }).catch((error) => {
          Alert.alert('Fehler', error.message);
        });
      } else {
        Alert.alert('Fehler', 'passwords do not match');
      }
    } else {
      Alert.alert('Fehler', 'no user found');
    }
  };

  return (
    <>
      <Stack.Screen options={{
        title: 'Account',
        headerStyle: {
          backgroundColor: Colors.dark.mainColorDark,
        },
        headerTitleAlign: 'center',
        headerLeft: () =>
          <Link href="/">
            <ChevronLeft color={Colors.dark.text} size={28} />
          </Link>
      }}
      />
      <View style={styles.container}>
        <UserCircle2Icon size={80} strokeWidth={1.6} color={Colors.dark.text} />
        <Alata20>Currently logged in as {userData ? userData.username : 'Lädt...'}</Alata20>
        <Alata16>E-Mail: {authData ? authData.email : 'Lädt...'}</Alata16>
        <Alata16>UID: {authData ? authData.uid : 'Lädt...'}</Alata16>
      </View>
      <View style={styles.buttonContainer}>
        
        {isPasswordChangeVisible && (
          <>
            <View style={gStyles.cardInput}>
              <KeyRound color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
              <TextInput placeholder="new password" onChangeText={setNewPassword} value={newPassword}
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
            <View style={gStyles.cardInput}>
              <KeyRound color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
              <TextInput placeholder="repeat new password" onChangeText={setNewPasswordRepeat} value={newPasswordRepeat}
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
            <Pressable style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]} onPress={handleChangePassword}>
              <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>Update Password</Alata20>
            </Pressable>
          </>
        )}
        <Pressable style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, 
          { backgroundColor:  isPasswordChangeVisible ? (pressed ? Colors.dark.alertPressed : Colors.dark.alert) : (pressed ? Colors.dark.mainColorLight : Colors.dark.tint) }]} onPress={() => setIsPasswordChangeVisible(!isPasswordChangeVisible)}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>{isPasswordChangeVisible ? "Cancel" : "Change Password"}</Alata20>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'flex-end',
    gap: 15,
    paddingBottom: 50,
  },
});