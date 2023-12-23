import React, { createContext, useContext, useState, ReactNode } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../FirebaseConfig';

interface AuthContextType {
  session: any; 
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
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
  signOut: () => {},
  isLoading: false,
});

export const useSession = () => useContext(AuthContext);

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
      // Hier kannst du weitere Aktionen nach der Anmeldung durchführen
      setSession(userID);
    } catch (error) {
      console.error("Fehler bei der Anmeldung: ", error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userID = userCredential.user.uid; 
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