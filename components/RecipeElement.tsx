import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Carrot, Soup, Vegan } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { DarkTheme } from '@react-navigation/native';
import { View } from './Themed';
import { AlataLarge, AlataMedium } from './StyledText';
import ViewRecipeScreen from '../app/modals/viewRecipeModal';

interface Ingredient {
    name: string;
    amount: string;
    unit: string;
}

interface RecipeProps {
    item: {
        id: string;
        category: string;
        name: string;
        cookHTime: string;
        cookMinTime: string;
        description: string;
        ingredients: Ingredient[];
        steps: string[];
        imageUrl: string;
        userID: string;
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
        default:
            return null;
    }
};
export default function Recipe({ item }: RecipeProps) {
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
                <AlataLarge numberOfLines={2}>{item.name}</AlataLarge>

                <AlataMedium>{(item.cookHTime == '0' || item.cookHTime == '') ? '' : item.cookHTime + ' h '}{(item.cookMinTime == '0' || item.cookMinTime == '') ? '' : (item.cookMinTime + ' min ')}</AlataMedium>
            </View>

            <View style={[styles.innerBox, {marginRight: 5}]}>
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
                <ViewRecipeScreen closeModal={toggleModal} recipe={item} />
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
        backgroundColor: Colors.dark.seeThrough,
        margin: 8,
        gap: 0,
    },
    logoSmall: {
        backgroundColor: Colors.dark.seeThrough,
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