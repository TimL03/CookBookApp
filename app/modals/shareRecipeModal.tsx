import React, { useState } from 'react';
import { TextInput, StyleSheet, ScrollView, View, Image, Pressable, Text, Modal } from 'react-native';
import Colors from '../../constants/Colors';
import { db } from '../../FirebaseConfig'
import { collection, addDoc } from 'firebase/firestore';
import { Alata20, Alata12, AlataText } from '../../components/StyledText';
import TopModalBar from '../../components/topModalBar';
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
    <Pressable style={styles.modalContainer} onPress={closeModal}>
      <View style={styles.modalContent}>
        <AlataText style={{ textAlign: 'center', fontSize: 24, marginBottom: 15 }}>Share {recipe.name} Recipe</AlataText>
        <AlataText style={{fontSize: 20, marginBottom: 10 }}>Message:</AlataText>
        <View style={styles.inputContainer}>
        <TextInput
          multiline
          numberOfLines={3}
          style={styles.input}
          placeholder="Optional message"
          value={message}
          onChangeText={text => setMessage(text)}
          placeholderTextColor={Colors.dark.text}
          />
        </View>

        <AlataText style={{fontSize: 20, marginBottom: 10 }}>Share with:</AlataText>
        <View style={{flexDirection:'row', gap: 15}}>
          <View style={[styles.inputContainer, {flex: 1}]}>
            <TextInput
              placeholder="Recipient (UserID or E-Mail)"
              value={recipient}
              onChangeText={text => setRecipient(text)}
              style={styles.input}
              placeholderTextColor={Colors.dark.text}
            />
          </View>
          
          <Pressable onPress={saveInvitation} style={styles.button}>
            <Send color={Colors.dark.text} size={24} style={{ alignSelf: 'center', alignItems: 'center' }} />
          </Pressable>
        </View>
        
      </View>
    </Pressable>
  )
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
    backgroundColor: Colors.dark.background,
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.mainColorLight,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontFamily: 'Alata',
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  }, 
  scrollView: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: Colors.dark.mainColorDark,
    flexDirection: 'column',
    gap: 20,
  },
  button: {
    borderRadius: 30,
    backgroundColor: Colors.dark.tint,
    padding: 15,
    marginBottom: 15,
  }
});