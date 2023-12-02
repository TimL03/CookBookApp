import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Carrot, Soup } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { DarkTheme } from '@react-navigation/native';
import { View } from './Themed';
import { AlataLarge, AlataMedium } from './StyledText';
import ViewFeedRecipeScreen from '../app/modals/viewFeedRecipeModal';

interface RecipeProps {
    item: {
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
    averageRating: {
      average: number;
      totalRatings: number;
    };
  }

export default function Recipe({ item, averageRating }: RecipeProps) {
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    return (
        <TouchableOpacity onPress={toggleModal} style={styles.outerBox} activeOpacity={0.2}>
            <Image
                style={styles.logoSmall}
                source={item.imageUrl == '' ? require("../assets/images/no-image.png") : { uri: item.imageUrl }}
            />
            <View style={styles.innerBox}>
                <AlataLarge>{item.name}</AlataLarge>
                <AlataMedium>{(item.cookHTime == '0' || item.cookHTime == '') ? '' : item.cookHTime + ' h '}{(item.cookMinTime == '0' || item.cookMinTime == '') ? '' : (item.cookMinTime + ' min ')}</AlataMedium>
            </View>
            <AlataMedium>
                {averageRating.average !== undefined ? `${averageRating.average}/5` : '4.5'}
            </AlataMedium>
            <AlataMedium>
                {averageRating.totalRatings !== undefined ? `(${averageRating.totalRatings} ratings)` : ''}
            </AlataMedium>
            <View style={styles.icons}>
                <Soup color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />
                <Carrot color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <ViewFeedRecipeScreen closeModal={toggleModal} recipe={item} />
            </Modal>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    outerBox: {
        backgroundColor: Colors.dark.mainColorDark,
        borderRadius: 10,
        height: 96,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 5,
        marginVertical: 8,
    },
    innerBox: {
        backgroundColor: Colors.dark.mainColorDark,
        margin: 8,
        gap: 0,
    },
    logoSmall: {
        alignContent: 'flex-start',
        width: 96,
        height: 96,
        borderRadius: 10,
    },
    icons: {
        backgroundColor: Colors.dark.mainColorDark,
        flex: 2,
        margin: 8,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'flex-end',
        flexWrap: 'wrap-reverse',
        borderRadius: 10,
    }
});