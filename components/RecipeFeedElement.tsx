import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { Carrot, EggOff, Fish, MilkOff, Soup, Star, Vegan,  } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { DarkTheme } from '@react-navigation/native';
import { View } from './Themed';
import { Alata20, Alata12 } from './StyledText';
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

interface CategoryIconProps {
    category: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
    switch (category) {
        case 'Soup':
            return <Soup color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
        case 'Vegetarian':
            return <Carrot color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
        case 'Vegan':
            return <Vegan color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
        case 'Fish':
            return <Fish color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
        case 'No Egg':
            return <EggOff color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
        case 'No Milk':
            return <MilkOff color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
        default:
            return null;
    }
};

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

            <View style={[styles.innerBox, {flex: 2}]}>
                <Alata20 numberOfLines={2}>{item.name}</Alata20>

                <Alata12>{(item.cookHTime == '0' || item.cookHTime == '') ? '' : item.cookHTime + ' h '}{(item.cookMinTime == '0' || item.cookMinTime == '') ? '' : (item.cookMinTime + ' min ')}</Alata12>
            </View>

            <View style={[styles.innerBox, {marginRight: 5}]}>
                <View style={{flexDirection: 'row', gap: 5, justifyContent: 'flex-end', backgroundColor: Colors.dark.seeThrough}}>
                    <Alata12 style={{textAlign: 'right'}}>{averageRating.average !== undefined ? `${averageRating.average}/5` : '-'}</Alata12>
                    <Star name="star" style={{alignSelf: 'center'}} size={16} color={Colors.dark.text} />
                </View>
                <Alata12>{averageRating.totalRatings !== undefined ? `(${averageRating.totalRatings} ratings)` : ''}</Alata12>
                <View style={styles.icons}>
                    <CategoryIcon category={item.category} />
                </View>
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
        justifyContent: 'space-between',
        gap: 5,
        marginVertical: 8,
    },
    innerBox: {
        backgroundColor: Colors.dark.seeThrough,
        padding: 8,
        gap: 0,
    },
    innerBox2: {
        backgroundColor: Colors.dark.seeThrough,
        padding: 8,
        justifyContent: 'space-between',
    },
    logoSmall: {
        alignContent: 'flex-start',
        width: 96,
        height: 96,
        borderRadius: 10,
    },
    icons: {
        backgroundColor: Colors.dark.seeThrough,
        flex: 2,
        margin: 8,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'flex-end',
        flexWrap: 'wrap-reverse',
        borderRadius: 10,
    }
});