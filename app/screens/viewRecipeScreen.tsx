import React, { useEffect, useState } from 'react'
import { View, Image, Pressable, Modal } from 'react-native'
import Colors from '../../constants/Colors'
import gStyles from '../../constants/Global_Styles'
import {
  Share2,
  PenSquare,
  Trash2,
  ArrowUpToLine,
  ChevronLeft,
  X,
  RefreshCcw,
} from 'lucide-react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  Alata20,
  Alata12,
  Alata24,
  Alata14,
  Alata16,
} from '../../components/StyledText'
import { db } from '../../FirebaseConfig'
import AddRecipeScreen from './addRecipeScreen'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import {
  deleteRecipe,
  getRecipeById,
  getRandomRecipeById,
} from '../../api/cookBookRecipesFirebase/client'
import { useSession } from '../../api/firebaseAuthentication/client'
import { Link, Stack, router, useLocalSearchParams } from 'expo-router'
import { RecipeData } from '../../api/cookBookRecipesFirebase/model'
import ConfirmationAlert from '../modals/alerts/confirmationAlert'

// Define and export the ViewRecipeScreen function
export default function ViewRecipeScreen() {
  // Initialize state variables
  const [recipe, setRecipe] = useState<RecipeData | null>(null)
  const [alertDeleteModalVisible, setAlertDeleteModalVisible] = useState(false)
  const [alertPublishModalVisible, setAlertPublishModalVisible] =
    useState(false)

  // Get recipe id from router params
  const params = useLocalSearchParams()

  // Get the User's ID
  const { session } = useSession()
  const userID = session

  // Effect to fetch and set the recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      if (params && params.recipeID && typeof params.recipeID === 'string') {
        let fetchedRecipe

        if (params.originScreen === 'index') {
          // Fetch a random recipe by its ID if the origin screen is 'index'
          fetchedRecipe = await getRandomRecipeById(params.recipeID)
        } else if (params.originScreen === 'two') {
          // Fetch a recipe by its ID if the origin screen is 'two'
          fetchedRecipe = await getRecipeById(
            userID.toString(),
            params.recipeID
          )
        }

        if (fetchedRecipe) {
          // Set the fetched recipe data in the state
          setRecipe(fetchedRecipe)
        } else {
          console.log('Rezept konnte nicht geladen werden.')
        }
      } else {
        console.log('Ungültige oder fehlende recipeID:', params.recipeID)
      }
    }

    // Call the fetchRecipe function when the component mounts or when userID or params change
    fetchRecipe()
  }, [userID, params])

  // If recipe is null (data is still loading), return a View with the same background color
  if (!recipe) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={{ flex: 1, backgroundColor: Colors.dark.mainColorDark }} />
      </>
    )
  }

  const handleDatabaseSave = async () => {
    try {
      const recipeRef = doc(db, 'feed', recipe.id)

      await setDoc(recipeRef, {
        name: recipe.name,
        categories: recipe.categories,
        cookHTime: recipe.cookHTime,
        cookMinTime: recipe.cookMinTime,
        imageUrl: recipe.imageUrl,
        ingredients: recipe.ingredients,
        ingredientNames: recipe.ingredientNames,
        steps: recipe.steps,
        userID: recipe.userID,
        timestamp: Timestamp.now(),
      })

      console.log('Rezept erfolgreich gespeichert!')
    } catch (error) {
      console.error('Fehler beim Speichern des Rezepts:', error)
    }
  }

  const handleDelete = async () => {
    deleteRecipe(recipe.id)
    router.back()
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title:
            params.originScreen === 'index'
              ? "What's for dinner?"
              : 'From your Cookbook',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.dark.mainColorDark,
          },
          headerRight: () => (
            <Pressable
              onPress={router.back}
              style={({ pressed }) => [
                {
                  padding: 5,
                  borderRadius: 20,
                  backgroundColor: pressed
                    ? Colors.dark.mainColorLight
                    : Colors.dark.seeThrough,
                },
              ]}
            >
              <X color={Colors.dark.text} size={28} />
            </Pressable>
          ),
          headerLeft: () => <></>,
        }}
      />
      <View
        style={[
          gStyles.defaultContainer,
          { backgroundColor: Colors.dark.mainColorDark },
        ]}
      >
        {/* Main content */}
        <ScrollView
          style={gStyles.fullScreenBackgroundContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Recipe image */}
          <Image
            style={gStyles.image}
            source={
              recipe.imageUrl == null
                ? require('../../assets/images/no-image.png')
                : { uri: recipe.imageUrl }
            }
          />

          {/* Recipe details */}
          <View style={gStyles.fullScreenContentContainer}>
            <View>
              {/* Recipe name and action buttons */}
              <View style={gStyles.HorizontalLayout}>
                <Alata24 style={gStyles.flex}>{recipe.name}</Alata24>
                {params.originScreen === 'index' ? (
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/(tabs)/',
                        params: { newRecipeFlag: '1' },
                      })
                    }
                    style={({ pressed }) => [
                      gStyles.iconButton,
                      {
                        backgroundColor: pressed
                          ? Colors.dark.mainColorLight
                          : Colors.dark.seeThrough,
                      },
                    ]}
                  >
                    <RefreshCcw color={Colors.dark.text} />
                  </Pressable>
                ) : (
                  <>
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/modals/shareRecipeModal',
                          params: { recipeID: recipe.id },
                        })
                      }
                      style={({ pressed }) => [
                        gStyles.iconButton,
                        {
                          backgroundColor: pressed
                            ? Colors.dark.mainColorLight
                            : Colors.dark.seeThrough,
                        },
                      ]}
                    >
                      <Share2 color={Colors.dark.text} size={24} />
                    </Pressable>

                    {/* publish recipe to feed button */}
                    <Pressable
                      onPress={() => setAlertPublishModalVisible(true)}
                      style={({ pressed }) => [
                        gStyles.iconButton,
                        {
                          backgroundColor: pressed
                            ? Colors.dark.mainColorLight
                            : Colors.dark.seeThrough,
                        },
                      ]}
                    >
                      <ArrowUpToLine color={Colors.dark.text} size={24} />
                    </Pressable>
                  </>
                )}

                {/* Delete button */}
                <Pressable
                  onPress={() => setAlertDeleteModalVisible(true)}
                  style={({ pressed }) => [
                    gStyles.iconButton,
                    {
                      backgroundColor: pressed
                        ? Colors.dark.mainColorLight
                        : Colors.dark.seeThrough,
                    },
                  ]}
                >
                  <Trash2 color={Colors.dark.text} size={24} />
                </Pressable>

                {/* Edit button */}
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/screens/addRecipeScreen',
                      params: { recipeID: recipe.id },
                    })
                  }
                  style={({ pressed }) => [
                    gStyles.iconButton,
                    {
                      backgroundColor: pressed
                        ? Colors.dark.mainColorLight
                        : Colors.dark.seeThrough,
                    },
                  ]}
                >
                  <PenSquare color={Colors.dark.text} size={24} />
                </Pressable>
              </View>

              {/* Cook time */}
              <Alata14>
                {recipe.cookHTime == '0' || recipe.cookHTime == ''
                  ? ''
                  : recipe.cookHTime == '1'
                    ? recipe.cookHTime + ' hour '
                    : recipe.cookHTime + ' hours '}
                {recipe.cookHTime == '0' ||
                recipe.cookHTime == '' ||
                recipe.cookMinTime == '0' ||
                recipe.cookMinTime == ''
                  ? ''
                  : 'and '}
                {recipe.cookMinTime == '0' || recipe.cookMinTime == ''
                  ? ''
                  : recipe.cookMinTime == '1'
                    ? recipe.cookMinTime + ' minute '
                    : recipe.cookMinTime + ' minutes '}
              </Alata14>
            </View>

            {/* Categories */}
            <View style={gStyles.mapHorizontal}>
              {recipe.categories.map((category, index) => (
                <View key={index} style={gStyles.switchButton}>
                  <Alata12>{category}</Alata12>
                </View>
              ))}
            </View>

            {/* Ingredients */}
            <View style={gStyles.card}>
              <Alata20>Ingredients:</Alata20>
              <View style={gStyles.VerticalLayout}>
                {recipe.ingredients.map((ingredient, index) => (
                  <View key={index} style={gStyles.IngredientLayout}>
                    <Alata16 style={gStyles.flex}>
                      {index + 1}. {ingredient.name}
                    </Alata16>
                    <Alata16>
                      {ingredient.amount} {ingredient.unit}
                    </Alata16>
                  </View>
                ))}
              </View>
            </View>

            {/* Steps */}
            <View style={gStyles.card}>
              <Alata20>Steps:</Alata20>
              <View style={gStyles.VerticalLayout}>
                {recipe.steps.map((step, index) => (
                  <View key={index} style={gStyles.IngredientLayout}>
                    <Alata16>
                      {index + 1}. {step}
                    </Alata16>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <ConfirmationAlert
          title="Warning"
          message={
            'Do you really want to delete the ' + recipe.name + ' Recipe?'
          }
          cancelText="cancel"
          confirmText="proceed"
          cardColor={Colors.dark.background}
          buttonColor={Colors.dark.alert}
          alertModalVisible={alertDeleteModalVisible}
          setAlertModalVisible={setAlertDeleteModalVisible}
          onConfirm={handleDelete}
        />

        <ConfirmationAlert
          title="Info"
          message={
            'You are about to Publish ' +
            recipe.name +
            ' to the Feed where everyone can see it. Do you want to proceed?'
          }
          cancelText="cancel"
          confirmText="proceed"
          cardColor={Colors.dark.background}
          buttonColor={Colors.dark.tint}
          alertModalVisible={alertPublishModalVisible}
          setAlertModalVisible={setAlertPublishModalVisible}
          onConfirm={handleDatabaseSave}
        />
      </View>
    </>
  )
}
