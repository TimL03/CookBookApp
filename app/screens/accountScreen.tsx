import { StatusBar } from 'expo-status-bar';
import { Modal, Platform, Pressable, StyleSheet, Alert, TextInput, Button } from 'react-native';
import { Text, View } from '../../components/Themed';
import React, { useEffect, useState } from 'react';
import { Link, Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native'
import Colors from '../../constants/Colors';
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useSession } from '../../api/firebaseAuthentication/client';
import { db } from '../../FirebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

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
  const [isPasswordChangeVisible, setIsPasswordChangeVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');

  useEffect(() => {
    const fetchFirestoreData = async () => {
      const usersCollectionRef = collection(db, 'users');
      const q = query(usersCollectionRef, where('uid', '==', userID));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocData = querySnapshot.docs[0].data();

        // Typüberprüfung
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
          email: currentUser.email || 'Keine E-Mail vorhanden',
          uid: currentUser.uid,
          // andere benötigte Felder
        };
        setAuthData(authInfo);
        console.log('Firebase Auth-Benutzerdaten:', authInfo);
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
      updatePassword(user, newPassword).then(() => {
        Alert.alert('Erfolg', 'Passwort erfolgreich geändert');
      }).catch((error) => {
        Alert.alert('Fehler', error.message);
      });
    } else {
      Alert.alert('Fehler', 'Kein Benutzer angemeldet');
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
        <Text style={styles.title}>Account</Text>
        <Text style={styles.infoText}>Username: {userData ? userData.username : 'Lädt...'}</Text>
        <Text style={styles.infoText}>E-Mail: {authData ? authData.email : 'Lädt...'}</Text>
        <Text style={styles.infoText}>UID: {authData ? authData.uid : 'Lädt...'}</Text>
        <Link href="/">
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
      <View>
        <Button
          title={isPasswordChangeVisible ? "Passwort ändern verbergen" : "Passwort ändern"}
          onPress={() => setIsPasswordChangeVisible(!isPasswordChangeVisible)}
        />
        {isPasswordChangeVisible && (
          <>
            <TextInput
              placeholder="Neues Passwort"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Button title="Passwort aktualisieren" onPress={handleChangePassword} />
          </>
        )}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  infoText: {
    fontSize: 18,
    margin: 5,
  },
});