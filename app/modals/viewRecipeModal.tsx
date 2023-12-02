import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Pressable, Modal } from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import { Share2, PenSquare, Trash2 } from 'lucide-react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { AlataLarge, AlataMedium, AlataText } from '../../components/StyledText';
import ItemSelectorSwitch from '../../components/ItemSelectorSwitch';
import ShareRecipeScreen from './shareRecipeModal';

interface AddRecipeScreenProps {
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
  };
}



export default function ViewRecipeScreen({ closeModal, recipe }: AddRecipeScreenProps) {
  const [isShareRecipeModalVisible, setIsShareRecipeModalVisible] = useState(false);

  const toggleModal = () => {
    setIsShareRecipeModalVisible(!isShareRecipeModalVisible);
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
            <AlataText style={{ fontSize: 25, color: Colors.dark.text,  wordWrap: 'break-word', flex: 2}}>{recipe.name}</AlataText>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flex: 1 }}>
              <Pressable onPress={toggleModal} style={({ pressed }) => [{alignSelf: 'center', padding: 5, borderRadius: 20, backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough}]}>
                <Share2 color={Colors.dark.text} size={24}/>
              </Pressable>
              <Pressable style={({ pressed }) => [{ alignSelf: 'center', padding: 5, borderRadius: 20, backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough}]}>
                <Trash2 color={Colors.dark.text} size={24}/>
              </Pressable>
              <Pressable style={({ pressed }) => [{ alignSelf: 'center', padding: 5, borderRadius: 20, backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.seeThrough}]}>
                <PenSquare color={Colors.dark.text} size={24}/>
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