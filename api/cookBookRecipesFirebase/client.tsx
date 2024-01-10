import { useState, useEffect } from 'react'
import { db } from '../../FirebaseConfig'
import {
  collection,
  getDocs,
  where,
  query,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore'
import { GroupedByCategory, RecipeData } from './model'
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage'
import { useSession } from '../../api/firebaseAuthentication/client'

// Fetch ingredients from User's Recipes for the Search bar
export const useFirebaseIngredients = () => {
  // State variable to store the list of ingredients
  const [currentList, setCurrentList] = useState<
    { key: string; value: string; selected: boolean }[]
  >([])

  // Get the user's ID
  const { session } = useSession()
  const userID = session

  useEffect(() => {
    // Function to fetch ingredients from Firebase
    const fetchIngredientsFromFirebase = async () => {
      try {
        // Define a query for the "recipes" collection with the userID condition
        const q = query(
          collection(db, 'recipes'),
          where('userID', '==', userID)
        )

        // Get the documents that match the query
        const recipesSnapshot = await getDocs(q)
        // Convert the documents into an array of recipes (Recipe objects)
        const recipes = recipesSnapshot.docs.map((doc) => doc.data())

        // Create a set to store unique ingredients
        const FirebaseIngredientsList = new Set()
        // Iterate through recipes and add ingredients to the set
        recipes.forEach((recipe) => {
          recipe.ingredients.forEach((ingredient: any) => {
            FirebaseIngredientsList.add(ingredient.name)
          })
        })

        // Convert the set into an array of objects to be used in the component
        const FirebaseIngredients = Array.from(FirebaseIngredientsList).map(
          (
            ingredient,
            index
          ): { key: string; value: string; selected: boolean } => ({
            key: index.toString(),
            value: ingredient as string,
            selected: false,
          })
        )

        // Update the state with the list of ingredients from Firebase
        setCurrentList(FirebaseIngredients)
      } catch (error) {
        console.error('Error fetching user recipes:', error)
      }
    }

    // Call the function to fetch ingredients from Firebase when the userID changes
    fetchIngredientsFromFirebase()
  }, [userID])

  // Return the current list of ingredients
  return currentList
}

// Fetch categories from User's Recipes
export const useFirebaseCategories = () => {
  // State variable to store the list of categories
  const [currentList, setCurrentList] = useState<
    { key: string; value: string; selected: boolean }[]
  >([])

  // Get the user's ID
  const { session } = useSession()
  const userID = session

  useEffect(() => {
    // Function to fetch categories from Firebase
    const fetchCategoriesFromFirebase = async () => {
      try {
        // Define a query for the "recipes" collection with the userID condition
        const q = query(
          collection(db, 'recipes'),
          where('userID', '==', userID)
        )

        // Get the documents that match the query
        const recipesSnapshot = await getDocs(q)
        // Convert the documents into an array of recipes (Recipe objects)
        const recipes = recipesSnapshot.docs.map((doc) => doc.data())

        // Create a set to store unique categories
        const firebaseCategoriesSet = new Set()
        // Iterate through recipes and add categories to the set
        recipes.forEach((recipe) => {
          if (recipe.categories) {
            recipe.categories.forEach((category: string) => {
              firebaseCategoriesSet.add(category)
            })
          }
        })

        // Convert the set into an array of objects to be used in the component
        const firebaseCategories = Array.from(firebaseCategoriesSet).map(
          (category, index) => ({
            key: index.toString(),
            value: category as string,
            selected: false,
          })
        )

        // Update the state with the list of categories from Firebase
        setCurrentList(firebaseCategories)
      } catch (error) {
        console.error('Error fetching categories from user recipes:', error)
      }
    }

    // Call the function to fetch categories from Firebase when the userID changes
    fetchCategoriesFromFirebase()
  }, [userID])

  // Return the current list of categories
  return currentList
}

// Function to search for recipes in Firebase based on selected ingredients and categories
export const searchRecipesInFirebase = async (
  selectedIngredients: string[],
  selectedCategories: string[],
  userID: string
) => {
  try {
    // Get a reference to the "recipes" collection
    const recipesCollection = collection(db, 'recipes')
    let queries = []

    // Create a query to find recipes containing selected ingredients, if any are selected
    if (selectedIngredients.length > 0) {
      queries.push(
        query(
          recipesCollection,
          where('ingredientNames', 'array-contains-any', selectedIngredients),
          where('userID', '==', userID)
        )
      )
    }

    // Create a query to find recipes belonging to selected categories, if any are selected
    if (selectedCategories.length > 0) {
      queries.push(
        query(
          recipesCollection,
          where('categories', 'array-contains-any', selectedCategories),
          where('userID', '==', userID)
        )
      )
    }

    // If no specific ingredients or categories are selected, use a default query to fetch all recipes for the user
    if (queries.length === 0) {
      queries.push(query(recipesCollection, where('userID', '==', userID)))
    }

    // Fetch the snapshots for all the queries in parallel
    const querySnapshots = await Promise.all(queries.map((q) => getDocs(q)))
    const recipeIds = []

    // Extract the document IDs from the query snapshots
    querySnapshots.forEach((snapshot) => {
      snapshot.docs.forEach((doc) => {
        recipeIds.push(doc.id)
      })
    })

    // If no matching recipes are found, return null
    if (recipeIds.length === 0) {
      return null
    }

    // Generate a random index to select a recipe ID from the list
    const randomIndex = Math.floor(Math.random() * recipeIds.length)
    return recipeIds[randomIndex]
  } catch (error) {
    console.error('Error searching for recipes in Firebase:', error)
    return null
  }
}

// Returns all recipes from the database that belong to the current user
export function useCookBookRecipes() {
  // State variable to store the data in sections (grouped by category)
  const [data, setData] = useState<
    Array<{ title: string; data: RecipeData[] }>
  >([])

  // Get the current user's session
  const { session } = useSession()
  const userID = session

  useEffect(() => {
    // Define a query to fetch recipes from the "recipes" collection where userID matches the current user
    const q = query(collection(db, 'recipes'), where('userID', '==', userID))

    // Subscribe to changes in the query and update the state when changes occur
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes: RecipeData[] = []

      // Iterate through the query snapshot and extract recipe data
      querySnapshot.forEach((doc) => {
        const recipeData = doc.data() as Omit<RecipeData, 'id'>
        recipes.push({ id: doc.id, ...recipeData })
      })

      // Group recipes by category
      const groupedByCategory = recipes.reduce(
        (acc: GroupedByCategory, recipe) => {
          const category = recipe.categories[0]
          if (category) {
            if (!acc[category]) {
              acc[category] = []
            }
            acc[category].push(recipe)
          }
          return acc
        },
        {}
      )

      // Create sections with titles and data based on grouped categories
      const sections = Object.keys(groupedByCategory).map((key) => ({
        title: key,
        data: groupedByCategory[key],
      }))

      // Update the state with the grouped data
      setData(sections)
    })

    // Unsubscribe from the query when the component unmounts
    return () => unsubscribe()
  }, [])

  // Return the grouped recipe data
  return data
}

// Returns a recipe by id from the database (CookBook)
export async function getRecipeById(
  userId: string,
  recipeId: string
): Promise<RecipeData | null> {
  // Get a reference to the specific recipe document in the "recipes" collection
  const recipeRef = doc(db, 'recipes', recipeId)

  // Fetch the document snapshot for the specified recipe
  const recipeSnap = await getDoc(recipeRef)

  // Check if the recipe document exists and belongs to the specified user
  if (recipeSnap.exists() && recipeSnap.data()?.userID === userId) {
    // Extract the recipe data, excluding the 'id' field, and add the 'id' back
    const recipeData = recipeSnap.data() as Omit<RecipeData, 'id'>

    // Return the recipe data with the 'id' field
    return { id: recipeSnap.id, ...recipeData }
  } else {
    // Log a message if the recipe document doesn't exist or doesn't belong to the user
    console.log('No such recipe!')
    return null
  }
}

// Fetches a recipe by its ID from the database (CookBook)
export async function getRandomRecipeById(
  recipeId: string
): Promise<RecipeData | null> {
  try {
    // Get a reference to the specific recipe document in the "recipes" collection
    const recipeRef = doc(db, 'recipes', recipeId)

    // Fetch the document snapshot for the specified recipe
    const recipeSnap = await getDoc(recipeRef)

    // Check if the recipe document exists
    if (recipeSnap.exists()) {
      // Extract the recipe data, excluding the 'id' field, and add the 'id' back
      const recipeData = recipeSnap.data() as Omit<RecipeData, 'id'>

      // Return the recipe data with the 'id' field
      return { id: recipeSnap.id, ...recipeData }
    } else {
      // Log a message if no recipe is found with the specified ID
      console.log('No recipe found with ID:', recipeId)
      return null
    }
  } catch (error) {
    // Log an error message if there's an issue while fetching the recipe
    console.error('Error fetching the recipe: ', error)
    return null
  }
}

// Fetching feed recipes
export const useFeedRecipes = () => {
  // State variable to store the data in sections (grouped by category)
  const [data, setData] = useState<
    Array<{ title: string; data: RecipeData[] }>
  >([])

  useEffect(() => {
    // Define a query to fetch recipes from the "feed" collection
    const feedQuery = query(collection(db, 'feed'))

    // Subscribe to changes in the query and update the state when changes occur
    const unsubscribe = onSnapshot(feedQuery, (querySnapshot) => {
      const feedRecipes: RecipeData[] = []

      // Iterate through the query snapshot and extract recipe data
      querySnapshot.forEach((doc) => {
        const recipeData = doc.data() as Omit<RecipeData, 'id'>
        feedRecipes.push({ id: doc.id, ...recipeData })
      })

      // Group recipes by category
      const groupedByCategory = feedRecipes.reduce((acc, recipe) => {
        const category = recipe.categories[0]
        if (category) {
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(recipe)
        }
        return acc
      }, {} as GroupedByCategory)

      // Create sections with titles and data based on grouped categories
      const sections = Object.keys(groupedByCategory).map((key) => ({
        title: key,
        data: groupedByCategory[key],
      }))

      // Update the state with the grouped data
      setData(sections)
    })

    // Unsubscribe from the query when the component unmounts
    return () => unsubscribe()
  }, [])

  // Return the grouped feed recipe data
  return data
}

// Fetching a recipe by ID from the "feed" collection
export const getRecipeByIdForFeed = async (recipeID: string) => {
  try {
    // Get a reference to the specific recipe document in the "feed" collection
    const docRef = doc(db, 'feed', recipeID)

    // Fetch the document snapshot for the specified recipe
    const docSnap = await getDoc(docRef)

    // Check if the document snapshot exists
    if (docSnap.exists()) {
      // Extract the recipe data from the document and return it as a RecipeData object
      return docSnap.data() as RecipeData
    } else {
      // Log a message if no document exists with the specified ID
      console.log('No such document!')
      return null
    }
  } catch (error) {
    // Log an error message if there's an issue while fetching the recipe
    console.error('Error fetching recipe:', error)
    return null
  }
}

// Function to sort ratings by timestamp
const sortRatingsByTimestamp = (
  ratings: Array<{
    id: string
    username: string
    rating: number
    comment: string
    timestamp: Timestamp
  }>
) => {
  return ratings.sort((a, b) => b.timestamp - a.timestamp)
}

// Fetch ratings for a recipe from the "feed" collection
export const fetchRatings = async (
  recipeID: { toString: () => string },
  setSortedRatings: (arg0: any) => void
) => {
  try {
    // Fetch user data from the "users" collection
    const usersSnapshot = await getDocs(collection(db, 'users'))
    const usersMap = new Map()

    // Create a map to store user data with user IDs as keys
    usersSnapshot.forEach((doc) => {
      const userData = doc.data()
      usersMap.set(userData.uid, userData.username)
    })

    // Check if a recipe ID is provided
    if (recipeID) {
      // Get a reference to the specific recipe document in the "feed" collection
      const recipeRef = doc(db, 'feed', recipeID.toString())
      const ratingsCollectionRef = collection(recipeRef, 'ratings')

      // Fetch ratings data from the "ratings" subcollection of the recipe
      const ratingsSnapshot = await getDocs(ratingsCollectionRef)

      let ratingsData: {
        id: string
        username: any
        rating: any
        comment: any
        timestamp: any
      }[] = []

      // Iterate through the ratings documents and extract rating data
      ratingsSnapshot.forEach((ratingDoc) => {
        const ratingData = ratingDoc.data()
        // Retrieve the username associated with the user ID from the users map or use 'Unknown' if not found
        const username = usersMap.get(ratingData.userID) || 'Unknown'
        ratingsData.push({
          id: ratingDoc.id,
          username,
          rating: ratingData.rating,
          comment: ratingData.comment,
          timestamp: ratingData.timestamp,
        })
      })

      // Sort the ratings data by timestamp
      ratingsData = sortRatingsByTimestamp(ratingsData)

      // Update the state with the sorted ratings data
      setSortedRatings(ratingsData)
    }
  } catch (error) {
    // Log an error message if there's an issue while fetching ratings
    console.error('Error fetching ratings:', error)
  }
}

// Delete a recipe from the database
export const deleteRecipe = async (recipeID: string) => {
  try {
    // Get a reference to the specific recipe document in the "recipes" collection
    const docRef = doc(db, 'recipes', recipeID)

    // Delete the recipe document
    await deleteDoc(docRef)

    // Log a success message after deleting the document
    console.log('Document successfully deleted!')
  } catch (error) {
    // Log an error message if there's an issue while removing the document
    console.error('Error removing document: ', error)
  }
}

// Function to upload an image to storage
export const uploadImage = async (uri: string, recipeName: string) => {
  // Fetch the image from the provided URI
  const response = await fetch(uri)
  const blob = await response.blob()

  // Get a reference to the Firebase Storage
  const storage = getStorage()

  // Define the image path including the recipe name and a unique timestamp
  const imagePath = `images/${recipeName}/${Date.now()}.jpg`
  const storageRef = ref(storage, imagePath)

  // Upload the image blob to the specified storage reference
  const snapshot = await uploadBytes(storageRef, blob)

  // Get the download URL for the uploaded image
  return await getDownloadURL(snapshot.ref)
}

// Calculate the average rating from each feed recipe's ratings
export const calculateAverageRating = async (recipe: RecipeData) => {
  try {
    // Get a reference to the "ratings" subcollection of the specific feed recipe
    const ratingsCollectionRef = collection(db, 'feed', recipe.id, 'ratings')
    const ratingsSnapshot = await getDocs(ratingsCollectionRef)

    // If there are no ratings, return an average of 0 and total ratings of 0
    if (ratingsSnapshot.empty) {
      return { average: 0, totalRatings: 0 }
    }

    // Extract the ratings data from the documents in the subcollection
    const ratingsData: number[] = []
    ratingsSnapshot.forEach((doc) => {
      const rating = doc.data().rating || 0
      ratingsData.push(rating)
    })

    // Calculate the sum of all ratings
    const sum = ratingsData.reduce(
      (acc, rating) => acc + (parseFloat(rating) || 0),
      0
    )

    // Calculate the average rating by dividing the sum by the number of ratings
    const average = sum / ratingsData.length

    // Round the average to two decimal places
    const roundedAverage = parseFloat(average.toFixed(2))

    // Return the rounded average rating and the total number of ratings
    return { average: roundedAverage, totalRatings: ratingsData.length }
  } catch (error) {
    // If there's an error, return an average of 0 and total ratings of 0
    return { average: 0, totalRatings: 0 }
  }
}
