import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  deleteUser,
} from 'firebase/auth'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../../FirebaseConfig'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Define the interface for the authentication context
interface AuthContextType {
  session: any
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  signOut: () => void
  isLoading: boolean
  deleteAccount: () => void
}

// Create an authentication context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  signIn: async () => {
    return new Promise<void>((resolve) => resolve())
  },
  signUp: async () => {
    return new Promise<void>((resolve) => resolve())
  },
  signOut: () => {},
  deleteAccount: () => {},
  isLoading: false,
})

// Custom hook to use the authentication context
export const useSession = () => useContext(AuthContext)

// Function to check if a username is unique in the database
const isUsernameUnique = async (username: string) => {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('username', '==', username))
  const querySnapshot = await getDocs(q)
  return querySnapshot.empty
}

// Define props for the SessionProvider component
interface SessionProviderProps {
  children: ReactNode
}

// Create a SessionProvider component to manage authentication state
export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  // State variables to store the current session and loading status
  const [session, setSession] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Function to check for a previous session stored in AsyncStorage
    const checkPreviousSession = async () => {
      setIsLoading(true)
      const userID = await AsyncStorage.getItem('userID')
      if (userID) {
        setSession(userID)
        setIsLoading(false)
        console.log('Checked previous session and set loading to false')
      }
    }

    checkPreviousSession()

    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (session === null) {
        console.log('Unsubscribed from authentication state changes')
        if (user) {
          setSession(user.uid)
        } else {
          setSession(null)
        }
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Function to sign in a user with email and password
  const signIn = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const userID = userCredential.user.uid
      setSession(userID)
      await AsyncStorage.setItem('userID', userID)
    } catch (error) {
      alert('E-Mail or password is wrong')
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to sign up a new user with email, password, and username
  const signUp = async (email: string, password: string, username: string) => {
    if (!(await isUsernameUnique(username))) {
      alert('Username is already in use.')
      setIsLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const userID = userCredential.user.uid

      await addDoc(collection(db, 'users'), {
        uid: userID,
        username: username,
      })

      setSession(userID)
    } catch (error) {
      alert('Error with registration')
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to sign out the current user
  const signOut = async () => {
    setIsLoading(true)
    try {
      await firebaseSignOut(auth)
      await AsyncStorage.removeItem('userID')
    } catch (error) {
      alert('Error while signing out')
    } finally {
      setSession(null)
      setIsLoading(false)
      router.push('/')
    }
  }

  // Function to delete the current user's account
  const deleteAccount = async () => {
    const user = auth.currentUser
    if (user) {
      try {
        await deleteUser(user)
        setSession(null)
        router.push('/')
        alert('Account deleted')
      } catch (error) {
        alert('Error deleting the account')
      }
    }
  }

  return (
    // Provide the authentication context to the app's components
    <AuthContext.Provider
      value={{ session, signIn, signUp, signOut, deleteAccount, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
