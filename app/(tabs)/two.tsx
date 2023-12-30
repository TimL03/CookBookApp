import { View, SectionList, Pressable } from 'react-native';
import React from 'react';
import { Plus } from 'lucide-react-native';
import Recipe from '../../components/RecipeElement'
import { Alata20 } from '../../components/StyledText'
import Colors from '../../constants/Colors';
import gStyles from '../../constants/Global_Styles';
import { useState } from "react"
import { useSession } from '../../api/firebaseAuthentication/client';
import { useRecipes } from '../../api/cookBookRecipesFirebase/client';
import { router } from 'expo-router';
import SearchBarCookBook from '../../components/searchBarCookBook'
import CategoryFilter from '../../components/CategoryFilter';

export default function TabTwoScreen() {
  const { session } = useSession();
  const [searchCriteria, setSearchCriteria] = useState('');
  const userID = session;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const data = useRecipes(userID);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };  
  
  // Filter the sections based on selected categories
  const filteredSections = data
    .filter((section) =>
      selectedCategories.length === 0 || selectedCategories.includes(section.title)
    )
    .map((section) => ({
      ...section,
      data: section.data.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchCriteria.toLowerCase())
      ),
    }))
    .filter((section) => section.data.length > 0);

  return (
    <View style={gStyles.screenContainer}>
      <SearchBarCookBook setSearchCriteria={setSearchCriteria} />
      <CategoryFilter
        categories={data.map((section) => section.title)}
        selectedCategories={selectedCategories}
        onSelectCategory={toggleCategory}
      />
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={filteredSections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Recipe item={item} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Alata20>{title}</Alata20>
        )}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Pressable onPress={() => router.push("/screens/addRecipeScreen")} style={({ pressed }) => [gStyles.roundButtonIcon, gStyles.negativeMarginBottom, { backgroundColor: pressed ? Colors.dark.mainColorLight : Colors.dark.tint },]}>
          <Plus color={Colors.dark.text} size={28} strokeWidth='2.5' style={{ alignSelf: 'center' }} />
        </Pressable>
      </View>
    </View>
  )
}

