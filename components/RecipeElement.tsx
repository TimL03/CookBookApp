import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Carrot, EggOff, Fish, MilkOff, Soup, Vegan } from 'lucide-react-native';
import Colors from '../constants/Colors';
import gStyles from '../constants/Global_Styles'
import { View } from './Themed';
import { Alata20, Alata12 } from './StyledText';
import { router } from 'expo-router';
import { RecipeProps, CategoryIconProps } from '../api/cookBookRecipesFirebase/model';


const CategoryIcon: React.FC<CategoryIconProps> = ({ categories }) => {
    return (
        <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
            {categories.map((category, index) => {
                switch (category) {
                    case 'Soup':
                        return <Soup color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
                    case 'Vegetarian':
                        return <Carrot color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
                    case 'Vegan':
                        return <Vegan color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
                    case 'Fish':
                        return <Fish color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
                    case 'No-Egg':
                        return <EggOff color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
                    case 'No-Milk':
                        return <MilkOff color={Colors.dark.text} size={20} style={{ marginBottom: 5 }} />;
                    default:
                        return null;
                }
            })}
        </View>
    );
};

export default function Recipe({ item }: RecipeProps) {

    return (
        <TouchableOpacity onPress={() => router.push({ pathname: "/screens/viewRecipeScreen", params: { recipeID: item.id } })} style={styles.outerBox} activeOpacity={0.2}>
            <Image
                style={gStyles.imageSmall}
                source={item.imageUrl == '' ? require("../assets/images/no-image.png") : { uri: item.imageUrl }}
            />

            <View style={[styles.innerBox, styles.flex]}>
                <Alata20 numberOfLines={2}>{item.name}</Alata20>

                <Alata12>{(item.cookHTime == '0' || item.cookHTime == '') ? '' : item.cookHTime + ' h '}{(item.cookMinTime == '0' || item.cookMinTime == '') ? '' : (item.cookMinTime + ' min ')}</Alata12>
            </View>

            <View style={[styles.innerBox, styles.marginRight]}>
                <View style={styles.icons}>
                    <CategoryIcon categories={item.categories} />
                </View>
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 2,
    },
    marginRight: {
        marginRight: 5,
    },
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