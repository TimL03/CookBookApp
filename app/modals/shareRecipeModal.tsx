import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet, View, Pressable } from 'react-native';
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { db } from '../../FirebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Alata20, Alata24 } from '../../components/StyledText';
import { Send } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getRecipeById } from '../../api/cookBookRecipesFirebase/client';
import { RecipeData } from '../../api/cookBookRecipesFirebase/model';
import { useSession } from '../../api/firebaseAuthentication/client';
import InfoAlert from '../modals/alerts/infoAlert';

// Function to get the user ID by username from the database
const getUserIdByUsername = async (username: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // If the query result is not empty, return the first user's UID
    return querySnapshot.docs[0].data().uid;
  } else {
    // If no matching user is found, return null
    return null;
  }
};

// Define the ShareRecipeScreen component
export default function ShareRecipeScreen() {
  // State variables to manage recipient and message input
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  // State variable to store the fetched recipe data
  const [recipe, setRecipe] = useState<RecipeData | null>(null);

  // State variables to manage alert modals for different scenarios
  const [alertNoUserModalVisible, setAlertNoUserModalVisible] = useState(false);
  const [alertErrorUpdatingModalVisible, setAlertErrorUpdatingModalVisible] = useState(false);

  // Get recipe id from router params
  const params = useLocalSearchParams();
  
  // Get user id from the user session
  const { session } = useSession();
  const userID = session;

  // Fetch recipe data from the database based on the user ID and recipe ID
  useEffect(() => {
    const fetchRecipe = async () => {
      const fetchedRecipe = await getRecipeById(userID.toString(), params.recipeID.toString());
      setRecipe(fetchedRecipe);
    };

    fetchRecipe();
  }, [userID, params.recipeID]);

  // If recipe data is not available, return null
  if (!recipe) {
    return null;
  }

  // Function to save an invitation to share the recipe
  const saveInvitation = async () => {
    try {
      // Get the recipient's user ID by their username
      const recipientUserId = await getUserIdByUsername(recipient);
      
      if (!recipientUserId) {
        // If no user is found with the recipient's username, show an alert modal
        setAlertNoUserModalVisible(true);
        return;
      }

      // Create an invitation data object
      const invitationsCollection = collection(db, 'invitations');
      const invitationData = {
        message,
        receiverId: recipientUserId,
        recipeId: recipe.id,
        senderId: recipe.userID,
        status: 'pending',
      };

      // Navigate back to the previous screen and add the invitation to the database
      router.back();
      await addDoc(invitationsCollection, invitationData);
    } catch (error) {
      // If there is an error while saving the invitation, show an error alert modal
      setAlertErrorUpdatingModalVisible(true);
    }
  };

  return (
    <>
    <Pressable onPress={router.back} style={gStyles.modalBackgroundContainer}>
      <View style={[gStyles.modalContentContainer,{backgroundColor: Colors.dark.background}]}>
        <Alata24 style={gStyles.alignCenter}>Share {recipe.name} Recipe</Alata24>
        <Alata20>Message:</Alata20>
        <View style={[gStyles.cardInput, gStyles.cardInputMultiline]}>
          <TextInput
            multiline
            numberOfLines={3}
            style={[gStyles.textInput, gStyles.textAlignVerticalTop]}
            placeholder="Optional message"
            value={message}
            onChangeText={text => setMessage(text)}
            placeholderTextColor={Colors.dark.text}
            />
        </View>

        <Alata20>Share with:</Alata20>
        <View style={gStyles.HorizontalLayout}>
          <View style={[gStyles.cardInput,gStyles.flex]}>
            <TextInput
              placeholder="Recipient (Username)"
              value={recipient}
              onChangeText={text => setRecipient(text)}
              style={gStyles.textInput}
              placeholderTextColor={Colors.dark.text}
            />
          </View>
          
          <Pressable onPress={saveInvitation} style={({ pressed }) => [gStyles.roundButtonIcon, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
            <Send color={Colors.dark.text} size={24} style={gStyles.alignCenter} />
          </Pressable>
        </View>
        
      </View>
      
    </Pressable>
    <InfoAlert
        title='Error'
        message='User not found'
        buttonText='retry'
        alertModalVisible={alertNoUserModalVisible}
        setAlertModalVisible={setAlertNoUserModalVisible}
    />
    <InfoAlert
        title='Error'
        message='Error updating the recipe'
        buttonText='retry'
        alertModalVisible={alertErrorUpdatingModalVisible}
        setAlertModalVisible={setAlertErrorUpdatingModalVisible}
    />

    </>
  )
  
}