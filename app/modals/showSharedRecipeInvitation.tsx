import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { db } from '../../FirebaseConfig'
import { collection, addDoc, updateDoc, getDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { Alata16, Alata20, } from '../../components/StyledText';
import RecipeElement from '../../components/RecipeElement';
import { InvitationContext } from '../../api/firebaseRecipeInvitations/client';
import { router } from 'expo-router';

const getUsernameByUserId = async (userId: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where("uid", "==", userId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data().username;
  } 
};

interface RecipeData {
  imageUrl: string;
  name: string;
}

export default function ShowSharedRecipeInvitationModalScreen() {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [senderUsername, setSenderUsername] = useState('');
  const { invitationData } = useContext(InvitationContext);

  useEffect(() => {
    async function getRecipeAndSenderData() {
      try {
        if (invitationData.recipeId) {
          const recipeDocRef = doc(db, 'recipes', invitationData.recipeId);
          const recipeDocSnapshot = await getDoc(recipeDocRef);
          if (recipeDocSnapshot.exists()) {
            setRecipeData(recipeDocSnapshot.data() as RecipeData);
          } else {
            console.log('Das Rezept wurde nicht gefunden.');
          }
        }

        if (invitationData.senderId) {
          const username = await getUsernameByUserId(invitationData.senderId);
          setSenderUsername(username);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
      }
    }

    getRecipeAndSenderData();
  }, [invitationData.recipeId, invitationData.senderId]);

  const handleAccept = async () => {
    try {
        await updateDoc(doc(db, 'invitations', invitationData.id), {
            status: 'accepted',
        });

        if (recipeData) {
            const newRecipeData = {
                ...recipeData,
                userID: invitationData.receiverId 
            };

            const newRecipeRef = await addDoc(collection(db, 'recipes'), newRecipeData);

            console.log('Neue Rezept-ID:', newRecipeRef.id);
        }

        router.back();
          } catch (error) {
        console.error('Fehler beim Akzeptieren der Einladung:', error);
    }
};

  const handleDecline = async () => {
    try {
      await updateDoc(doc(db, 'invitations', invitationData.id), {
        status: 'declined',
      });

      router.back();
        } catch (error) {
      console.error('Error declining invitation:', error);
    }
  };

  return (
    <Pressable style={gStyles.modalBackgroundContainer}>
      <View style={[gStyles.modalContentContainer,{backgroundColor: Colors.dark.background}]}>
        <Alata20 style={gStyles.alignCenter}>{senderUsername} shared a recipe with you!</Alata20>
        {recipeData && (
          <RecipeElement item={recipeData} />
        )}
        <View style={[gStyles.cardHorizontal, {backgroundColor: Colors.dark.mainColorDark}]}>
          <Alata16>message: {invitationData.message}</Alata16>
        </View>
        <Pressable style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint }]} onPress={handleAccept}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>Accept Shared Recipe</Alata20>
        </Pressable>
        <Pressable style={({ pressed }) => [gStyles.cardHorizontal, gStyles.justifyCenter, { backgroundColor: pressed ? Colors.dark.alertPressed : Colors.dark.alert }]} onPress={handleDecline}>
          <Alata20 style={[gStyles.alignCenter, gStyles.marginBottom]}>Decline Shared Recipe</Alata20>
        </Pressable>
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    backgroundColor: Colors.dark.mainColorDark,
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  input: {
    flexDirection: 'row',
    color: Colors.dark.text,
    backgroundColor: Colors.dark.mainColorLight,
    paddingHorizontal: 10,
    height: 45,
    borderRadius: 10,
    gap: 10,
  }
});