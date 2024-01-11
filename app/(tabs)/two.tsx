import { View, SectionList, Pressable } from 'react-native'
import React from 'react'
import { Plus } from 'lucide-react-native'
import Recipe from '../../components/RecipeElement'
import { Alata20 } from '../../components/StyledText'
import Colors from '../../constants/Colors'
import gStyles from '../../constants/Global_Styles'
import { useState } from 'react'
import { useCookBookRecipes } from '../../api/cookBookRecipesFirebase/client'
import { router } from 'expo-router'
import SearchBarCookBook from '../../components/searchBarCookBook'
import CategoryFilter from '../../components/CategoryFilter'

export default function TabTwoScreen() {
  // Initialize state for search criteria and selected categories
  const [searchCriteria, setSearchCriteria] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Fetch cookBook recipes data
  const data = useCookBookRecipes()

  // Function to toggle selected categories
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  // Filter the sections based on selected categories and search criteria
  const filteredSections = data
    .filter(
      (section) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(section.title)
    )
    .map((section) => ({
      ...section,
      data: section.data.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchCriteria.toLowerCase())
      ),
    }))
    .filter((section) => section.data.length > 0)

  return (
    <View style={gStyles.screenContainer}>
      <View
        style={{ flexDirection: 'column', justifyContent: 'center', gap: 15 }}
      >
        <SearchBarCookBook setSearchCriteria={setSearchCriteria} />
        <CategoryFilter
          categories={data.map((section) => section.title)}
          selectedCategories={selectedCategories}
          onSelectCategory={toggleCategory}
        />
      </View>
      <SectionList
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        sections={filteredSections}
        keyExtractor={(item, index) => item.id.toString() + index.toString()}
        renderItem={({ item }) => <Recipe item={item} averageRating={{
          average: 0,
          totalRatings: 0
        }} />}
        renderSectionHeader={({ section: { title } }) => (
          <Alata20>{title}</Alata20>
        )}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Pressable
          onPress={() => router.push('/screens/addRecipeScreen')}
          style={({ pressed }) => [
            gStyles.roundButtonIcon,
            gStyles.negativeMarginBottom,
            {
              backgroundColor: pressed
                ? Colors.dark.mainColorLight
                : Colors.dark.tint,
            },
          ]}
        >
          <Plus
            color={Colors.dark.text}
            size={28}
            strokeWidth="2.5"
            style={{ alignSelf: 'center' }}
          />
        </Pressable>
      </View>
    </View>
  )
}
