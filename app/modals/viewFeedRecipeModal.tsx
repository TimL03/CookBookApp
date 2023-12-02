import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Pressable, Modal } from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import { Share2, PenSquare, Trash2, ArrowDownToLine } from 'lucide-react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { AlataLarge, AlataMedium, AlataText } from '../../components/StyledText';
import ItemSelectorSwitch from '../../components/ItemSelectorSwitch';
import ShareRecipeScreen from './shareRecipeModal';
import { db } from '../../FirebaseConfig'
import { doc, setDoc, Timestamp, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import RatingModal from './RatingModal';


interface FeedRecipeScreenProps {
  closeModal: () => void;
  recipe: {
    id: string;
    name: string;
    cookHTime: string;
    cookMinTime: string;
    imageUrl: string;
    ingredients: string[];
    steps: string[];
    userID: string;
    ratings: string[];
    category: string;
  };
}

const auth = getAuth();

export default function ViewFeedRecipeScreen({ closeModal, recipe }: FeedRecipeScreenProps) {
  const [isShareRecipeModalVisible, setIsShareRecipeModalVisible] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [sortedRatings, setSortedRatings] = useState<Array<{ id: string; userID: string; rating: number; comment: string; timestamp: Timestamp }>>([]);

  const sortRatingsByTimestamp = (ratings: Array<{ id: string, userID: string, rating: number, comment: string, timestamp: Timestamp }>) => {
    return ratings.sort((a, b) => b.timestamp - a.timestamp);
  };

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const recipeRef = doc(db, 'feed', recipe.id);
        const ratingsCollectionRef = collection(recipeRef, 'ratings');

        const ratingsSnapshot = await getDocs(ratingsCollectionRef);
        const ratingsData: Array<{ id: string, userID: string, rating: number, comment: string, timestamp: Timestamp }> = [];

        ratingsSnapshot.forEach((ratingDoc) => {
          ratingsData.push({ id: ratingDoc.id, ...ratingDoc.data() as { userID: string, rating: number, comment: string, timestamp: Timestamp } });
        });

        const sortedRatings = sortRatingsByTimestamp(ratingsData);
        setSortedRatings(sortedRatings);
      } catch (error) {
        console.error('Fehler beim Abrufen der Bewertungen:', error);
      }
    };

    fetchRatings();
  }, []);

  const handleRatingSubmit = async (ratingData: { rating: number; comment: string }) => {
    try {
      const user = auth.currentUser;
      const userID = user ? user.uid : null;

      if (!userID) {
        console.error('Benutzer nicht angemeldet.');
        return;
      }

      const recipeRef = doc(db, 'feed', recipe.id);
      const ratingsCollectionRef = collection(recipeRef, 'ratings');

      const ratingsSnapshot = await getDocs(ratingsCollectionRef);
      const ratingCount = ratingsSnapshot.size;

      const ratingID = `rating${ratingCount + 1}`;

      const ratingDocRef = doc(ratingsCollectionRef, ratingID);

      await setDoc(ratingDocRef, {
        userID,
        timestamp: Timestamp.now(),
        ...ratingData,
      });

      console.log('Bewertung erfolgreich hinzugefügt!');
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Bewertung:', error);
    }
  };

  const toggleModal = () => {
    setIsShareRecipeModalVisible(!isShareRecipeModalVisible);
  };

  const saveRecipeToDatabase = async () => {
    try {
      const user = auth.currentUser;
      const userID = user ? user.uid : null;

      if (!userID) {
        console.error('Benutzer nicht angemeldet.');
        return;
      }

      const recipeRef = doc(db, 'recipes', recipe.id);

      await setDoc(recipeRef, {
        name: recipe.name,
        cookHTime: recipe.cookHTime,
        cookMinTime: recipe.cookMinTime,
        imageUrl: recipe.imageUrl,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        userID: userID,
        category: recipe.category,
      });

      console.log('Rezept erfolgreich gespeichert!');
    } catch (error) {
      console.error('Fehler beim Speichern des Rezepts:', error);
    }
  };


  const currentCategories = [
    { key: '1', value: 'Breakfast', selected: null },
    { key: '2', value: 'Snacks', selected: null },
    { key: '3', value: 'Desert', selected: null },
  ]
  return (
    <View style={styles.container}>
      <TopModalBar title="From your Cookbook" onClose={closeModal} />
      <ScrollView style={styles.scrollView}>
        <Image
          style={styles.image}
          source={recipe.imageUrl == '' ? require("../../assets/images/no-image.png") : { uri: recipe.imageUrl }}
        />
        <View style={{ padding: 30, marginTop: -20, backgroundColor: Colors.dark.mainColorDark, borderRadius: 15, flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'Alata', fontSize: 25, color: Colors.dark.text }}>{recipe.name}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable onPress={toggleModal} style={{ alignSelf: 'center' }}>
                <Share2 color={Colors.dark.text} size={24} style={{ marginBottom: -5 }} />
              </Pressable>
              <Pressable onPress={saveRecipeToDatabase} style={{ alignSelf: 'center' }}>
                <ArrowDownToLine color={Colors.dark.text} size={24} style={{ marginBottom: -5 }} />
              </Pressable>
            </View>
          </View>
          <AlataMedium>{(recipe.cookHTime == '0' || recipe.cookHTime == '') ? '' : (recipe.cookHTime == '1') ? (recipe.cookHTime + ' hour ') : (recipe.cookHTime + ' hours ')}{(recipe.cookHTime == '0' || recipe.cookHTime == '' || recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : 'and '}{(recipe.cookMinTime == '0' || recipe.cookMinTime == '') ? '' : (recipe.cookMinTime == '1') ? (recipe.cookMinTime + ' minute ') : (recipe.cookMinTime + ' minutes ')}</AlataMedium>

          <View style={{ justifyContent: 'flex-start', flexDirection: 'row', paddingTop: 20, marginBottom: 20, flexWrap: 'wrap' }}>
            {
              currentCategories?.map((item, index) => {
                return (
                  <View key={item.key} style={{ backgroundColor: Colors.dark.tint, padding: 10, borderRadius: 20, marginRight: 5 }}>
                    <AlataText style={{ fontSize: 12 }}>{item.value}</AlataText>
                  </View>
                )
              })
            }
          </View>

          <View style={styles.contentBox}>
            <AlataText style={{ fontSize: 20 }}>Ingredients:</AlataText>
            <View style={{ flexDirection: 'column', flexWrap: 'wrap', paddingHorizontal: 10, paddingTop: 5 }}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={{ paddingVertical: 2, justifyContent: 'space-between', flexDirection: 'row' }}>
                  <AlataText style={{ flex: 1, fontSize: 16 }}>{index + 1}. {ingredient}</AlataText>
                  <AlataText style={{ fontSize: 16 }}>1x</AlataText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.contentBox}>
            <AlataText style={{ fontSize: 20 }}>Steps:</AlataText>
            <View style={{ flexDirection: 'column', flexWrap: 'wrap', paddingLeft: 10, paddingTop: 5 }}>
              {recipe.steps.map((step, index) => (
                <View key={index} style={{ paddingVertical: 10, justifyContent: 'space-between' }}>
                  <AlataText style={{ fontSize: 16 }}>{index + 1}. {step}</AlataText>
                </View>
              ))}
            </View>
          </View>
          <View>
            <AlataLarge style={{ color: Colors.dark.text }}>Latest Ratings:</AlataLarge>
            {sortedRatings.map((rating, index) => (
              <View key={index}>
                <AlataText>{`${rating.userID} rated ${rating.rating} stars: ${rating.comment} ${rating.timestamp.toDate().toLocaleString()}`} </AlataText>
              </View>
            ))}
          </View>
        </View>
        <View>
          <Pressable onPress={() => setIsRatingModalVisible(true)}>
            <AlataLarge style={{ color: Colors.dark.text }}>Your opionion counts!</AlataLarge>
          </Pressable>
          <RatingModal
            isVisible={isRatingModalVisible}
            onClose={() => setIsRatingModalVisible(false)}
            onSubmit={handleRatingSubmit}
          />
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShareRecipeModalVisible}
        onRequestClose={() => setIsShareRecipeModalVisible(false)}
      >
        <ShareRecipeScreen closeModal={() => setIsShareRecipeModalVisible(false)}
          recipe={recipe} />
      </Modal>
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