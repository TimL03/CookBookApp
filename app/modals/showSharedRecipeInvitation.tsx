import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { db } from '../../FirebaseConfig'
import { collection, addDoc, updateDoc, getDoc, doc } from 'firebase/firestore';
import { Alata20, } from '../../components/StyledText';


interface ShowSharedRecipeProps {
  invitationData: any;
  onClose: () => void;
}

interface RecipeData {
  imageUrl: string;
  name: string;
}

export default function ShowSharedRecipeInvitationModalScreen({ invitationData, onClose }: ShowSharedRecipeProps) {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);

  useEffect(() => {
    async function getRecipeData(recipeId: string) {
      try {
        const docRef = doc(db, 'recipes', recipeId);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const recipeData = docSnapshot.data() as RecipeData;
          setRecipeData(recipeData);
        } else {
          console.log('Das Rezept wurde nicht gefunden.');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen des Rezepts:', error);
      }
    }

    if (invitationData.recipeId) {
      getRecipeData(invitationData.recipeId);
    }
  }, [invitationData.recipeId]);

  const handleAccept = async () => {
    try {
      await updateDoc(doc(db, 'invitations', invitationData.id), {
        status: 'accepted',
      });

      if (recipeData) {
        const recipeToDuplicate = await getDoc(doc(db, 'recipes', invitationData.recipeId));
        if (recipeToDuplicate.exists()) {
          const recipeData = recipeToDuplicate.data();

          const duplicatedRecipeData = { ...recipeData, userID: invitationData.receiverId };

          const newRecipeRef = await addDoc(collection(db, 'recipes'), duplicatedRecipeData);

          console.log('Duplicated Recipe ID:', newRecipeRef.id);
        }
      }

      onClose();
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleDecline = async () => {
    try {
      await updateDoc(doc(db, 'invitations', invitationData.id), {
        status: 'declined',
      });

      onClose();
    } catch (error) {
      console.error('Error declining invitation:', error);
    }
  };

  return (
    <Pressable style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Alata20 style={gStyles.alignCenter}>Somebody shared a recipe with you!</Alata20>
        {recipeData && (
          <View>
            <Image source={{ uri: recipeData.imageUrl }} style={{ width: 100, height: 100 }} />
            <Alata20>{recipeData.name}</Alata20>
          </View>
        )}
        <Pressable onPress={handleAccept}>
          <Alata20>Accept</Alata20>
        </Pressable>

        <Pressable onPress={handleDecline}>
          <Alata20 style={{ paddingBottom: 4 }}>Decline</Alata20>
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