import { useState, useEffect } from 'react';
import { db } from '../../FirebaseConfig';
import { getCurrentUserId } from '../firebaseAuthentication/client';
import { collection, getDocs, where, query, onSnapshot, doc, getDoc, addDoc } from 'firebase/firestore';
import { GroupedByCategory, RecipeData } from './model';
import Recipe from '../../components/RecipeFeedElement';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';

//Returns all recipes from the database that belong to the current user
export function useRecipes(userID: string | null) {
  const [data, setData] = useState<Array<{ title: string, data: RecipeData[] }>>([]);

  useEffect(() => {
    if (userID) {
      const q = query(collection(db, "recipes"), where("userID", "==", userID));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const recipes: RecipeData[] = [];
        querySnapshot.forEach((doc) => {
          const recipeData = doc.data() as Omit<RecipeData, 'id'>;
          console.log("Fetched recipe data:", recipeData); 
          recipes.push({ id: doc.id, ...recipeData });
        });

        const groupedByCategory = recipes.reduce((acc: GroupedByCategory, recipe) => {
          const { category } = recipe;
          acc[category] = acc[category] || [];
          acc[category].push(recipe);
          return acc;
        }, {});

        const sections = Object.keys(groupedByCategory).map(key => ({
          title: key,
          data: groupedByCategory[key],
        }));

        setData(sections);
      });

      return () => unsubscribe();
    }
  }, [userID]);

  return data;
}

//Returns a recipe by id from the database
export async function getRecipeById(userId: string, recipeId: string): Promise<RecipeData | null> {
  const recipeRef = doc(db, 'recipes', recipeId);
  const recipeSnap = await getDoc(recipeRef);

  console.log("RecipeSnap: ", recipeSnap.data());

  if (recipeSnap.exists() && recipeSnap.data()?.userID === userId) {
    const recipeData = recipeSnap.data() as Omit<RecipeData, 'id'>;

    console.log("RecipeData: ", recipeData);

    return { id: recipeSnap.id, ...recipeData };
  } else {
    console.log('No such recipe!');
    return null;
  }
}

//function to upload an image
export const uploadImage = async (uri: string, recipeName: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storage = getStorage();
  const imagePath = `images/${recipeName}/${Date.now()}.jpg`;
  const storageRef = ref(storage, imagePath);

  const snapshot = await uploadBytes(storageRef, blob);
  return await getDownloadURL(snapshot.ref);
};

const searchRecipesInFirebase = async (selectedIngredients: string[], selectedCategory: string) => {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      console.error('Benutzer ist nicht angemeldet.');
      return null;
    }

    const recipesCollection = collection(db, 'recipes');

    const q = query(
      recipesCollection,
      where('category', '==', selectedCategory),
      where('userID', '==', userId),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('Kein passendes Rezept gefunden.');
      return null;
    }

    const matchingRecipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
    const matchingRecipe = matchingRecipes[randomIndex];

    return matchingRecipe;
  } catch (error) {
    console.error('Fehler bei der Suche nach Rezepten in Firebase:', error);
    return null;
  }
};

export { searchRecipesInFirebase };




