import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Pressable} from "react-native";
import TopModalBar from "../../components/topModalBar";
import Colors from '../../constants/Colors';
import { Share2, PenSquare, Trash2} from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AlataLarge, AlataMedium } from '../../components/StyledText';



interface AddRecipeScreenProps {
    closeModal: () => void;
  }
  
  export default function ViewRecipeScreen({ closeModal }: AddRecipeScreenProps) {
    return(
        <View style={styles.container}>
            <TopModalBar title="From your Cookbook" onClose={closeModal} />
            <ScrollView style={styles.scrollView}>
              <Image
                style={styles.image}
                source={require('../../assets/images/ramenImage.png')}
              />  
            <View style={{padding: 30}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{ fontFamily: 'Alata', fontSize: 25, color: Colors.dark.text }}>Recipe Name</Text>
                    <View style={{flexDirection: 'row', gap: 12}}>
                        <Pressable style={{alignSelf: 'center'}}>
                            <Share2 color={Colors.dark.text} size={24} style={{marginBottom: -5}}/>
                        </Pressable>
                        <Pressable style={{alignSelf: 'center'}}>
                            <Trash2 color={Colors.dark.text} size={24} style={{marginBottom: -5}}/>
                        </Pressable>
                        <Pressable style={{alignSelf: 'center'}}>
                            <PenSquare color={Colors.dark.text} size={24} style={{marginBottom: -5}}/>
                        </Pressable>
                    </View>
                </View>
                <AlataMedium>30 min</AlataMedium>
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
        backgroundColor: Colors.dark.background, 
        flexDirection: 'column',
        gap: 20,
      },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        borderRadius: 20,
      },
  });