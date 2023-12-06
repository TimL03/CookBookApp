import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Pressable } from 'react-native';
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { db } from '../../FirebaseConfig'
import { collection, addDoc } from 'firebase/firestore';
import { Alata20, Alata24 } from '../../components/StyledText';
import { Send } from 'lucide-react-native';

interface ShareRecipeScreenProps {
  closeModal: () => void;
  recipe: {
    id: string; 
    name: string;
    category: string;
    cookHTime: string;
    cookMinTime: string;
    description: string;
    ingredients: string[];
    steps: string[];
    imageUrl: string;
    userID: string;
  };
}

export default function ShareRecipeScreen({ closeModal, recipe }: ShareRecipeScreenProps) {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const saveInvitation = async () => {
    try {
      const invitationsCollection = collection(db, 'recipes');

      const invitationData = {
        message,
        receiverId: recipient,
        recipeId: recipe.id,
        senderId: recipe.userID,
        status: 'pending',
      };

      await addDoc(invitationsCollection, invitationData);

      closeModal();
    } catch (error) {
      console.error('Fehler beim Speichern der Einladung:', error);
    }
  };

  return (
    <Pressable style={gStyles.modalBackgroundContainer} onPress={closeModal}>
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
              placeholder="Recipient (UserID or E-Mail)"
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
  )
}