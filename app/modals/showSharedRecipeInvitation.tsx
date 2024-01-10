import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Pressable, Image } from 'react-native'
import Colors from '../../constants/Colors'
import gStyles from '../../constants/Global_Styles'
import { db } from '../../FirebaseConfig'
import {
  collection,
  addDoc,
  updateDoc,
  getDoc,
  doc,
  query,
  where,
  getDocs,
  average,
} from 'firebase/firestore'
import { Alata16, Alata20 } from '../../components/StyledText'
import RecipeElement from '../../components/RecipeElement'
import { InvitationContext } from '../../api/firebaseRecipeInvitations/client'
import {
  RecipeData,
  RecipeProps,
} from '../../api/cookBookRecipesFirebase/model'
import { router } from 'expo-router'

// Function to get the username by user ID from the database
const getUsernameByUserId = async (userId: string) => {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('uid', '==', userId))
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    // If the query result is not empty, return the username of the user
    return querySnapshot.docs[0].data().username
  }
}

// Define the ShowSharedRecipeInvitationModalScreen component
export default function ShowSharedRecipeInvitationModalScreen() {
  // State variables to store recipe data, sender username, and invitation data
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null)
  const [senderUsername, setSenderUsername] = useState('')
  const { invitationData, processNextInvitation } =
    useContext(InvitationContext)

  // useEffect to fetch recipe and sender data when the component mounts
  useEffect(() => {
    async function getRecipeAndSenderData() {
      try {
        if (invitationData.recipeId) {
          // Fetch the recipe data based on the recipe ID
          const recipeDocRef = doc(db, 'recipes', invitationData.recipeId)
          const recipeDocSnapshot = await getDoc(recipeDocRef)
          if (recipeDocSnapshot.exists()) {
            setRecipeData(recipeDocSnapshot.data() as RecipeData)
          } else {
            console.log('The recipe was not found.')
          }
        }

        if (invitationData.senderId) {
          // Fetch the sender's username based on the sender's user ID
          const username = await getUsernameByUserId(invitationData.senderId)
          setSenderUsername(username)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    getRecipeAndSenderData()
  }, [invitationData.recipeId, invitationData.senderId])

  // Function to handle accepting the invitation
  const handleAccept = async () => {
    try {
      // Update the invitation status to 'accepted' in the database
      await updateDoc(doc(db, 'invitations', invitationData.id), {
        status: 'accepted',
      })

      if (recipeData) {
        // If recipe data exists, create a new recipe with the receiver's ID
        const newRecipeData = {
          ...recipeData,
          userID: invitationData.receiverId,
        }

        // Add the new recipe to the database and get the new recipe's ID
        const newRecipeRef = await addDoc(
          collection(db, 'recipes'),
          newRecipeData
        )
      }

      // Process the next invitation in the queue
      processNextInvitation()
    } catch (error) {
      console.error('Error accepting the invitation:', error)
    }
  }

  // Function to handle declining the invitation
  const handleDecline = async () => {
    try {
      // Update the invitation status to 'declined' in the database
      await updateDoc(doc(db, 'invitations', invitationData.id), {
        status: 'declined',
      })
      // Process the next invitation in the queue
      processNextInvitation()
    } catch (error) {
      console.error('Error declining the invitation:', error)
    }
  }

  return (
    <Pressable style={gStyles.modalBackgroundContainer}>
      <View
        style={[
          gStyles.modalContentContainer,
          { backgroundColor: Colors.dark.background },
        ]}
      >
        <Alata20 style={gStyles.alignCenter}>
          {senderUsername} shared a recipe with you!
        </Alata20>
        {recipeData && (
          <RecipeElement
            item={recipeData}
            averageRating={{
              average: 0,
              totalRatings: 0,
            }}
          />
        )}
        <View
          style={[
            gStyles.cardHorizontal,
            { backgroundColor: Colors.dark.mainColorDark },
          ]}
        >
          <Alata16>message: {invitationData.message}</Alata16>
        </View>
        <Pressable
          style={({ pressed }) => [
            gStyles.cardHorizontal,
            gStyles.justifyCenter,
            {
              backgroundColor: pressed
                ? Colors.dark.mainColorLight
                : Colors.dark.tint,
            },
          ]}
          onPress={handleAccept}
        >
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>
            Accept Shared Recipe
          </Alata20>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            gStyles.cardHorizontal,
            gStyles.justifyCenter,
            {
              backgroundColor: pressed
                ? Colors.dark.alertPressed
                : Colors.dark.alert,
            },
          ]}
          onPress={handleDecline}
        >
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>
            Decline Shared Recipe
          </Alata20>
        </Pressable>
      </View>
    </Pressable>
  )
}
