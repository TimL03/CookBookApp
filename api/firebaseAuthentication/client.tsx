import React, { createContext, useContext, useState, ReactNode } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from '../../FirebaseConfig';

interface AuthContextType {
  session: any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
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
  isLoading: false,
});

export const useSession = () => useContext(AuthContext);

const isUsernameUnique = async (username: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty; // Gibt true zurück, wenn kein Dokument gefunden wurde
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userID = userCredential.user.uid;
      setSession(userID);
    } catch (error) {
      console.error("Fehler bei der Anmeldung: ", error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {

    if (!await isUsernameUnique(username)) {
      console.error("Benutzername ist bereits vergeben.");
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
      console.error("Fehler bei der Registrierung: ", error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setIsLoading(true);
    // Implementiere die Abmelde-Logik hier
    setSession(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};