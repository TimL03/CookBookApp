import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native'
import {
  Carrot,
  EggOff,
  Fish,
  MilkOff,
  Soup,
  Star,
  Vegan,
} from 'lucide-react-native'
import Colors from '../constants/Colors'
import gStyles from '../constants/Global_Styles'
import { View } from './Themed'
import { Alata20, Alata12 } from './StyledText'
import {
  RecipeProps,
  CategoryIconProps,
} from '../api/cookBookRecipesFirebase/model'
import { router } from 'expo-router'

// Category icon's based on categories of a recipe
const CategoryIcon: React.FC<CategoryIconProps> = ({ categories }) => {
  return (
    <View
      style={{ flexDirection: 'row', backgroundColor: 'transparent', gap: 2 }}
    >
      {categories.map((category: any, index: React.Key | null | undefined) => {
        switch (category) {
          case 'Soup':
            return (
              <Soup
                color={Colors.dark.text}
                key={index}
                size={20}
                style={{ marginBottom: 5 }}
              />
            )
          case 'Vegetarian':
            return (
              <Carrot
                color={Colors.dark.text}
                key={index}
                size={20}
                style={{ marginBottom: 5 }}
              />
            )
          case 'Vegan':
            return (
              <Vegan
                color={Colors.dark.text}
                key={index}
                size={20}
                style={{ marginBottom: 5 }}
              />
            )
          case 'Fish':
            return (
              <Fish
                color={Colors.dark.text}
                key={index}
                size={20}
                style={{ marginBottom: 5 }}
              />
            )
          case 'No-Egg':
            return (
              <EggOff
                color={Colors.dark.text}
                key={index}
                size={20}
                style={{ marginBottom: 5 }}
              />
            )
          case 'No-Milk':
            return (
              <MilkOff
                color={Colors.dark.text}
                key={index}
                size={20}
                style={{ marginBottom: 5 }}
              />
            )
          default:
            return null
        }
      })}
    </View>
  )
}

// Recipe element in the section list
export default function Recipe({ item, averageRating }: RecipeProps) {
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/modals/viewFeedRecipeModal',
          params: { recipeID: item.id },
        })
      }
      style={styles.outerBox}
      activeOpacity={0.2}
    >
      <Image
        style={gStyles.imageSmall}
        source={
          item.imageUrl == null
            ? require('../assets/images/no-image.png')
            : { uri: item.imageUrl }
        }
      />

      <View style={[styles.innerBox, { flex: 2 }]}>
        <Alata20 numberOfLines={2}>{item.name}</Alata20>

        <Alata12>
          {item.cookHTime == '0' || item.cookHTime == ''
            ? ''
            : item.cookHTime + ' h '}
          {item.cookMinTime == '0' || item.cookMinTime == ''
            ? ''
            : item.cookMinTime + ' min '}
        </Alata12>
      </View>

      <View
        style={[
          styles.innerBox,
          {
            justifyContent: 'space-between',
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 8,
          },
        ]}
      >
        <View style={{ backgroundColor: 'transparent', marginRight: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              justifyContent: 'flex-end',
              backgroundColor: Colors.dark.seeThrough,
            }}
          >
            <Alata12 style={{ textAlign: 'right' }}>
              {averageRating.average !== undefined
                ? `${averageRating.average}/5`
                : '-'}
            </Alata12>
            <Star
              name="star"
              style={{ alignSelf: 'center' }}
              size={16}
              color={Colors.dark.text}
            />
          </View>
          <Alata12 style={{ textAlign: 'right' }}>
            {averageRating.totalRatings !== undefined
              ? `(${averageRating.totalRatings} ratings)`
              : ''}
          </Alata12>
        </View>

        <View style={[styles.innerBox, styles.marginRight]}>
          <View style={styles.icons}>
            <CategoryIcon categories={item.categories} />
          </View>
        </View>
      </View>
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
    flex: 1,
    gap: 0,
  },
  innerBox2: {
    backgroundColor: Colors.dark.seeThrough,
    padding: 8,
    justifyContent: 'space-between',
  },
  icons: {
    backgroundColor: Colors.dark.seeThrough,
    flex: 1,
    gap: 10,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap-reverse',
    borderRadius: 10,
  },
  marginRight: {
    marginRight: 10,
  },
})
