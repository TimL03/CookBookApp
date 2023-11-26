import React, { useState } from 'react';
import { TextInput, StyleSheet, ScrollView, View, Image, Pressable, Text, Modal } from 'react-native';
import Colors from '../../constants/Colors';
import { db } from '../../FirebaseConfig'
import { collection, addDoc } from 'firebase/firestore';
import { AlataLarge, AlataMedium, AlataText } from '../../components/StyledText';
import TopModalBar from '../../components/topModalBar';

interface ShareRecipeScreenProps {
  closeModal: () => void;
  recipe: {
    id: string;
    name: string;
    cookHTime: string;
    cookMinTime: string;
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
    <View style={styles.container}>
      <TopModalBar title="Share Recipe" onClose={closeModal} />
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
        <Image
          style={styles.image}
          source={{ uri: recipe.imageUrl }}
        />
        <View style={{ padding: 30, marginTop: -20, backgroundColor: Colors.dark.mainColorDark, borderRadius: 15, flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'Alata', fontSize: 25, color: Colors.dark.text }}>{recipe.name}</Text>
          </View>
          <AlataMedium>{(recipe.cookHTime == '0' || recipe.cookHTime == '') ? '' : (recipe.cookHTime == '1') ? (recipe.cookHTime + ' hour ') : (recipe.cookHTime + ' hours ')}{(recipe.cookHTime == '0' || recipe.cookHTime == '' || recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : 'and '}{(recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : (recipe.cookMinTime == '1') ? (recipe.cookMinTime + ' minute ') : (recipe.cookMinTime + ' minutes ')}</AlataMedium>


          <AlataLarge>Recipient:</AlataLarge>
          <TextInput
            placeholder="Recipient (UserID or E-Mail)"
            value={recipient}
            onChangeText={text => setRecipient(text)}
          />
          <AlataLarge>Message: (optional)</AlataLarge>
          <TextInput
            multiline
            placeholder="Optional message"
            value={message}
            onChangeText={text => setMessage(text)}
            placeholderTextColor={Colors.dark.text}
          />
          <Pressable onPress={saveInvitation}>
            <AlataLarge style={{ marginBottom: 5, textAlign: 'center' }}>Share Recipe</AlataLarge>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.mainColorDark,
  },
  scrollView: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: Colors.dark.mainColorDark,
    flexDirection: 'column',
    gap: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  contentBox: {
    backgroundColor: Colors.dark.background,
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
    marginBottom: 15,
  },
});