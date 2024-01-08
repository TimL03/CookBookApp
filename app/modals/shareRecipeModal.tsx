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

const getUserIdByUsername = async (username: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data().uid;
  } else {
    return null;
  }
};


export default function ShareRecipeScreen() {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const [recipe, setRecipe] = useState<RecipeData | null>(null);

  const [alertNoUserModalVisible, setAlertNoUserModalVisible] = useState(false);
  const [alertErrorUpdatingModalVisible, setAlertErrorUpdatingModalVisible] = useState(false);

  // Get recipe id from router params
  const params = useLocalSearchParams();
  
  // Get user id from session
  const { session } = useSession();
  const userID = session;

  // Fetch recipe from database
  useEffect(() => {
    const fetchRecipe = async () => {
      const fetchedRecipe = await getRecipeById(userID.toString(), params.recipeID.toString());
      setRecipe(fetchedRecipe);
    };

    fetchRecipe();
  }, [userID, params.recipeID]);

  if(!recipe) {
    return null;
  }

  const saveInvitation = async () => {
    try {
      const recipientUserId = await getUserIdByUsername(recipient);
      if (!recipientUserId) {
        setAlertNoUserModalVisible(true);
        return;
      }

      const invitationsCollection = collection(db, 'invitations');
      const invitationData = {
        message,
        receiverId: recipientUserId,
        recipeId: recipe.id,
        senderId: recipe.userID,
        status: 'pending',
      };
      router.back();
      await addDoc(invitationsCollection, invitationData);
    } catch (error) {
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