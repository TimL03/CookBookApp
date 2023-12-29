import { useState, useEffect } from 'react';
import { db } from '../../FirebaseConfig';
import { collection, getDocs, where, query, onSnapshot, doc, getDoc, addDoc } from 'firebase/firestore';
import { GroupedByCategory, RecipeData } from './model';
import Recipe from '../../components/RecipeFeedElement';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { useSession } from '../../api/firebaseAuthentication/client';

export const useFirebaseIngredients = () => {
  const [currentList, setCurrentList] = useState<{ key: string; value: string; selected: boolean; }[]>([]);
  const { session } = useSession();
  const userID = session;

  useEffect(() => {
    const fetchIngredientsFromFirebase = async () => {
      try {
        const q = query(collection(db, 'recipes'), where('userID', '==', userID));
        const recipesSnapshot = await getDocs(q);
        const recipes = recipesSnapshot.docs.map((doc) => doc.data());

        const FirebaseIngredientsList = new Set();
        recipes.forEach((recipe) => {
          recipe.ingredients.forEach((ingredient: any) => {
            FirebaseIngredientsList.add(ingredient.name);
          });
        });

        const FirebaseIngredients = Array.from(FirebaseIngredientsList).map((ingredient, index): { key: string; value: string; selected: boolean } => ({
          key: index.toString(),
          value: ingredient as string,
          selected: false,
        }));


        setCurrentList(FirebaseIngredients);
      } catch (error) {
        console.error('Error fetching user recipes:', error);
      }
    };

    fetchIngredientsFromFirebase();
  }, [userID]);

  return currentList;
};

export const useFirebaseCategories = () => {
  const [currentList, setCurrentList] = useState<{ key: string; value: string; selected: boolean; }[]>([]);
  const { session } = useSession();
  const userID = session;

  useEffect(() => {
    const fetchCategoriesFromFirebase = async () => {
      try {
        const q = query(collection(db, 'recipes'), where('userID', '==', userID));
        const recipesSnapshot = await getDocs(q);
        const recipes = recipesSnapshot.docs.map((doc) => doc.data());

        const firebaseCategoriesSet = new Set();
        recipes.forEach((recipe) => {
          if (recipe.categories) {
            recipe.categories.forEach((category: string) => {
              firebaseCategoriesSet.add(category);
            });
          }
        });

        const firebaseCategories = Array.from(firebaseCategoriesSet).map((category, index) => ({
          key: index.toString(),
          value: category as string,
          selected: false,
        }));

        setCurrentList(firebaseCategories);
      } catch (error) {
        console.error('Error fetching categories from user recipes:', error);
      }
    };

    fetchCategoriesFromFirebase();
  }, [userID]);

  return currentList;
};

export const searchRecipesInFirebase = async (selectedIngredients: string[], selectedCategories: string[], userID: string) => {
  try {
    const recipesCollection = collection(db, 'recipes');
    let queries = [];

    if (selectedIngredients.length > 0) {
      queries.push(query(recipesCollection, where('ingredientNames', 'array-contains-any', selectedIngredients), where('userID', '==', userID)));
    }
    if (selectedCategories.length > 0) {
      queries.push(query(recipesCollection, where('categories', 'array-contains-any', selectedCategories), where('userID', '==', userID)));
    }

    if (queries.length === 0) {
      queries.push(query(recipesCollection, where('userID', '==', userID)));
    }

    const querySnapshots = await Promise.all(queries.map(q => getDocs(q)));
    const combinedRecipes = new Map();
    querySnapshots.forEach(snapshot => {
      snapshot.docs.forEach(doc => {
        combinedRecipes.set(doc.id, doc.data());
      });
    });

    const allRecipes = Array.from(combinedRecipes.values());
    if (allRecipes.length === 0) {
      return null; 
    }
    const randomIndex = Math.floor(Math.random() * allRecipes.length);
    return allRecipes[randomIndex];
  } catch (error) {
    console.error('Fehler bei der Suche nach Rezepten in Firebase:', error);
    return null;
  }
};


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
        recipe.categories.forEach((category) => {
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(recipe);
        });
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





