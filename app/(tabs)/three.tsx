import { StyleSheet, Text, View, SafeAreaView, SectionList, Button, Pressable, Modal } from 'react-native';
import React from 'react';
import { Plus } from 'lucide-react-native';
import Recipe from '../../components/RecipeFeedElement'
import { AlataLarge, AlataMedium } from '../../components/StyledText'
import Colors from '../../constants/Colors';
import { db } from '../../FirebaseConfig'
import { User } from 'firebase/auth';
import { useState, useEffect } from "react"
import { collection, onSnapshot, query, where, getDocs, doc } from 'firebase/firestore';
import ShowSharedRecipeInvitationModalScreen from '../modals/showSharedRecipeInvitation';
import LoginModalScreen from '../modals/logInModal';

interface RecipeData {
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
}

interface GroupedByCategory {
  [key: string]: RecipeData[];
}
export default function TabThreeScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInvitationModalVisible, setIsInvitationModalVisible] = useState(false);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [data, setData] = useState<Array<{ title: string, data: RecipeData[] }>>([]);
  const [averageRatings, setAverageRatings] = useState<Record<string, { average: number; totalRatings: number }>>({});



  useEffect(() => {
    const feedQuery = query(collection(db, "feed"));

    const unsubscribe = onSnapshot(feedQuery, (querySnapshot) => {
      const feedRecipes: RecipeData[] = [];
      querySnapshot.forEach((doc) => {
        const recipeData = doc.data() as Omit<RecipeData, 'id'>;
        feedRecipes.push({ id: doc.id, ...recipeData });
      });

      const groupedByCategory = feedRecipes.reduce((acc: GroupedByCategory, recipe) => {
        const { category } = recipe;
        acc[category] = acc[category] || [];
        acc[category].push(recipe);
        return acc;
      }, {});

      const sections = Object.keys(groupedByCategory).map(key => ({
        title: key,
        data: groupedByCategory[key],
      }));

      setData(sections);
    });

    return () => unsubscribe();
  }, []);

  const openInvitationModal = (invitation: string) => {
    setInvitationData(invitation);
    setIsInvitationModalVisible(true);
  };

  useEffect(() => {
    if (userID) {
      const q = query(collection(db, "invitations"), where("receiverId", "==", userID), where("status", "==", "pending"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const invitations: any[] = [];
        querySnapshot.forEach((doc) => {
          const invitationData = doc.data();
          invitations.push({ id: doc.id, ...invitationData });
        });

        invitations.forEach((invitation) => {
          openInvitationModal(invitation);
        });
      });

      return () => unsubscribe();
    }
  }, [userID]);

  const handleLoginSuccess = (user: User) => {
    setIsAuthenticated(true);
    setUserID(user.uid);
  };

  const toggleModal = () => {
    if (isAuthenticated) {
      setModalVisible(!isModalVisible);
    } else {
      setIsLoginModalVisible(!isLoginModalVisible);
    }
  };

  const calculateAverageRating = async (db: any, recipe: RecipeData) => {
    try {
        const ratingsCollectionRef = collection(db, 'feed', recipe.id, 'ratings');
        const ratingsSnapshot = await getDocs(ratingsCollectionRef);

        console.log('Recipe ID:', recipe.id);

        if (ratingsSnapshot.empty) {
            return { average: 0, totalRatings: 0 };
        }

        const ratingsData: number[] = [];

        ratingsSnapshot.forEach((doc) => {
          const rating = doc.data().rating || 0;
          console.log('Average Rating:', rating);
          ratingsData.push(rating);
      });

      const sum = ratingsData.reduce((acc, rating) => acc + (parseFloat(rating) || 0), 0);
      const average = sum / ratingsData.length;
      

        console.log('Average Rating:', average);
        return { average, totalRatings: ratingsData.length };
    } catch (error) {
        return { average: 0, totalRatings: 0 };
    }
};

useEffect(() => {
  const calculateAndSetAverageRating = async (recipe: RecipeData) => {
    const result = await calculateAverageRating(db, recipe);
    setAverageRatings(prevState => ({
      ...prevState,
      [recipe.id]: result,
    }));
  };

  data.forEach(section => {
    section.data.forEach(recipe => {
      calculateAndSetAverageRating(recipe);
    });
  });
}, [data]);

  return (
    <View style={styles.container}>
      <SectionList
        sections={data}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <Recipe item={item} averageRating={averageRatings[item.id] || { average: 0, totalRatings: 0 }} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text>{title}</Text>
        )}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isLoginModalVisible}
          onRequestClose={() => setIsLoginModalVisible(false)}
        >
          <LoginModalScreen onClose={() => setIsLoginModalVisible(false)} setUserID={setUserID}
            setIsAuthenticated={setIsAuthenticated} onLoginSuccess={handleLoginSuccess} />
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isInvitationModalVisible}
          onRequestClose={() => setIsInvitationModalVisible(false)}
        >
          <ShowSharedRecipeInvitationModalScreen onClose={() => setIsInvitationModalVisible(false)} invitationData={invitationData} />
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 30,
    alignContent: 'center',
    flexDirection: 'column',
  },
  item: {
    backgroundColor: Colors.dark.background,
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: Colors.dark.background,
  },
  button: {
    backgroundColor: Colors.dark.mainColorDark,
    height: 50,
    width: 50,
    borderRadius: 30,
    padding: 12,
    justifyContent: 'center',
    marginBottom: -15,
    marginTop: 10,
  }
});
