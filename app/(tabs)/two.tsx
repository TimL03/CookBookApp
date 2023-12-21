import { StyleSheet, Text, View, SafeAreaView, SectionList, Button, Pressable, Modal } from 'react-native';
import React from 'react';
import { Plus } from 'lucide-react-native';
import Recipe from '../../components/RecipeElement'
import { Alata20 } from '../../components/StyledText'
import LoginModalScreen from '../modals/logInModal';
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { db } from '../../FirebaseConfig'
import { User } from 'firebase/auth';
import { useState, useEffect } from "react"
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import AddRecipeScreen from '../screens/addRecipeScreen';
import ShowSharedRecipeInvitationModalScreen from '../modals/showSharedRecipeInvitation';
import { RecipeData } from '../../api/cookBookRecipesFirebase/model';


interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}


interface GroupedByCategory {
  [key: string]: RecipeData[];
}
export default function TabTwoScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInvitationModalVisible, setIsInvitationModalVisible] = useState(false);
  const [invitationData, setInvitationData] = useState<any>(null); 
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);

  
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

  const [data, setData] = useState<Array<{ title: string, data: RecipeData[] }>>([]);

  useEffect(() => {
    if (userID) {
      const q = query(collection(db, "recipes"), where("userID", "==", userID));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const recipes: RecipeData[] = [];
        querySnapshot.forEach((doc) => {
          const recipeData = doc.data() as Omit<RecipeData, 'id'>;
          console.log("Fetched recipe data:", recipeData); // Fügen Sie dies hinzu
          recipes.push({ id: doc.id, ...recipeData });
        });

        const groupedByCategory = recipes.reduce((acc: GroupedByCategory, recipe) => {
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
    }
  }, [userID]);

  return (
    <View style={gStyles.screenContainer}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={data}
        keyExtractor={(item, index) => item.category + index}
        renderItem={({ item }) => (
          <Recipe item={item} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Alata20>{title}</Alata20>
        )}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Pressable onPress={toggleModal} style={({ pressed }) => [gStyles.roundButtonIcon, gStyles.negativeMarginBottom, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
          <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <AddRecipeScreen closeModal={toggleModal} userID={userID}/>
        </Modal>
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
          <ShowSharedRecipeInvitationModalScreen onClose={() => setIsInvitationModalVisible(false)} invitationData={invitationData}/>
        </Modal>
      </View>
    </View>
  )
}

