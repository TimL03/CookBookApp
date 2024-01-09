import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut, deleteUser, setPersistence, browserLocalPersistence, indexedDBLocalPersistence } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from '../../FirebaseConfig';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  session: any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  signIn: async () => {
    return new Promise<void>((resolve) => resolve());
  },
  signUp: async () => {
    return new Promise<void>((resolve) => resolve());
  },
  signOut: () => { },
  deleteAccount: () => { },
  isLoading: false,
});

export const useSession = () => useContext(AuthContext);

const isUsernameUnique = async (username: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty; 
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkPreviousSession = async () => {
      setIsLoading(true);
      const userID = await AsyncStorage.getItem('userID');
      if (userID) {
        setSession(userID);
        setIsLoading(false);
        console.log("checked Previous session and set loading false");
      }
    };

    checkPreviousSession();

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if(session === null){
      console.log("unsubscribe");
      if (user) {
        setSession(user.uid);
      } else {
        setSession(null);
      }
      setIsLoading(false);
    }
  });

  return () => unsubscribe(); 
}, []);


  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userID = userCredential.user.uid;
      setSession(userID);
      await AsyncStorage.setItem('userID', userID);
    } catch (error) {
      alert("E-Mail or password is wrong");
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {

    if (!await isUsernameUnique(username)) {
      alert("Username is already in use.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userID = userCredential.user.uid;

      await addDoc(collection(db, 'users'), {
        uid: userID,
        username: username
      });
      
      setSession(userID);
    } catch (error) {
      alert("Error with registration");
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem('userID');
    } catch (error) {
      alert("Error while sign out");
    } finally {
      setSession(null);
      setIsLoading(false);
      router.push("/");
    }
  };

  const deleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteUser(user);
        setSession(null);
        router.push("/");
        alert("Account deleted");
      } catch (error) {
        alert("Fehler beim Löschen des Accounts");
      }
    } 
  };


  return (
    <AuthContext.Provider value={{ session, signIn, signUp, signOut, deleteAccount, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};