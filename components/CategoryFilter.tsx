import React, { useState } from 'react'
import { Pressable, View, StyleSheet, ScrollView, Text } from 'react-native'
import gStyles from '../constants/Global_Styles'
import Colors from '../constants/Colors'
import { Alata12 } from './StyledText'

export default function CategoryFilter({
  categories,
  selectedCategories,
  onSelectCategory,
}: {
  categories: any[]
  selectedCategories: any[]
  onSelectCategory: (category: any) => void
}) {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      style={[gStyles.mapHorizontal, styles.scrollView]}
      horizontal
    >
      {categories.map((category) => (
        <Pressable
          key={category}
          onPress={() => onSelectCategory(category)}
          style={[
            styles.switchButton,
            {
              backgroundColor: selectedCategories.includes(category)
                ? Colors.dark.tint
                : Colors.dark.mainColorDark,
            },
          ]}
        >
          <Alata12 style={[gStyles.alignCenter, gStyles.marginBottom]}>
            {category}
          </Alata12>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    height: 50,
  },
  switchButton: {
    borderRadius: 120,
    height: 45,
    padding: 10,
    paddingHorizontal: 20,
    elevation: 2,
    marginRight: 10,
    marginBottom: 5,
  },
})
