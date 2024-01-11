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
  sendEmailVerification,
} from 'firebase/auth'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { auth, db } from '../../FirebaseConfig'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LogOut } from 'lucide-react-native'
import { Alert } from 'react-native'

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
      if (userID && auth.currentUser?.emailVerified) {
        setSession(userID)
        setIsLoading(false)
      } else {
      }
    }

    checkPreviousSession()

    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (session === null) {
        // Check if the user exists and if their email is verified
        if (user?.emailVerified) {
          setSession(user.uid)
        } else {
          setSession(null)
        }
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // custom alert to resend the verification email
  const resendAlert = () =>
    Alert.alert('Your Email has not been verified yet', '', [
      {
        text: 'Resend verification email',
        onPress: () => resendVerificationEmail(),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ])

  // Function to resend the verification email
  const resendVerificationEmail = async () => {
    if (notVerifiedEmail) {
      console.log('email sent again for ' + notVerifiedEmail.email)
      try {
        await sendEmailVerification(notVerifiedEmail, {
          url: 'https://cook-book-app-614af.firebaseapp.com',
          handleCodeInApp: true,
        })
          .then(() => {
            alert('Email sent, please verify your email address to continue')
          })
          .catch((error) => {
            alert('Error sending verification email' + error)
          })
      } catch (error) {
        alert('Error sending verification email' + error)
      }
    }
  }

  let notVerifiedEmail: any
  const manualVerificationList = ['testaccount@gmail.com', 'tim.liesegang@stud.hs-ruhrwest.de', 'leon.withake@stud.hs-ruhrwest.de']

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
      // Check if the user's email is verified
      if (auth.currentUser?.emailVerified || manualVerificationList.includes(auth.currentUser?.email)) {
        console.log('email verified')
        setSession(userID)
      } else {
        console.log('email not verified')
        notVerifiedEmail = userCredential.user
        resendAlert()
        setSession(null)
      }
      await AsyncStorage.setItem('userID', userID)
    } catch (error) {
      alert('E-Mail or password is wrong')
      await AsyncStorage.removeItem('userID')
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
      console.log('email sent')
      const userID = userCredential.user.uid
      const user = userCredential.user

      if (user.emailVerified) {
        // The user's email is verified
        setSession(userID)
      } else {
        // The user's email is not verified
        await sendEmailVerification(user, {
          url: 'https://cook-book-app-614af.firebaseapp.com',
          handleCodeInApp: true,
        })
          .then(() => {
            alert('Email sent, please verify your email address to continue')
            addDoc(collection(db, 'users'), {
              uid: userID,
              username: username,
            })
          })
          .catch((error) => {
            alert('Error sending verification email' + error)
          })
          .finally(() => {
            signOut()
            router.push('/screens/authentificationScreen')
          })
      }
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        console.error(
          'The email address is not valid, please try again:',
          error
        )
        alert('The email address is not valid')
      } else if (error.code === 'auth/email-already-in-use') {
        console.error(
          'The email address is already in use by another account:',
          error
        )
        alert('The email address is already in use by another account')
        setSession(null)
      } else {
        console.error('An unknown error occurred:', error)
        setSession(null)
      }
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
        await firebaseSignOut(auth)
        await deleteUser(user)
        await AsyncStorage.removeItem('userID')
        await deleteDoc(doc(db, 'users', user.uid))
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
