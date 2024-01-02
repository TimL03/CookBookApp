import { useState, useEffect } from 'react';
import { db } from '../../FirebaseConfig';
import { collection, getDocs, where, query, onSnapshot, doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { GroupedByCategory, RecipeData } from './model';
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
export function useCookBookRecipes() {
  const [data, setData] = useState<Array<{ title: string, data: RecipeData[] }>>([]);
  const { session } = useSession();
  const userID = session;

  useEffect(() => {
    const q = query(collection(db, "recipes"), where("userID", "==", userID));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes: RecipeData[] = [];
      querySnapshot.forEach((doc) => {
        const recipeData = doc.data() as Omit<RecipeData, 'id'>;
        recipes.push({ id: doc.id, ...recipeData });
      });

      const groupedByCategory = recipes.reduce((acc: GroupedByCategory, recipe) => {
        const category = recipe.categories[0];
        if (category) {
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(recipe);
        }
        return acc;
      }, {});

      const sections = Object.keys(groupedByCategory).map(key => ({
        title: key,
        data: groupedByCategory[key],
      }));

      setData(sections);
    });

    return () => unsubscribe();
}, []);

return data;
}

//Returns a recipe by id from the database (CookBook)
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

// Fetching feed recipes
export const useFeedRecipes = () => {
  const [data, setData] = useState<Array<{ title: string, data: RecipeData[] }>>([]);

  useEffect(() => {
      const feedQuery = query(collection(db, "feed"));
      const unsubscribe = onSnapshot(feedQuery, (querySnapshot) => {
          const feedRecipes: RecipeData[] = [];
          querySnapshot.forEach((doc) => {
              const recipeData = doc.data() as Omit<RecipeData, 'id'>;
              feedRecipes.push({ id: doc.id, ...recipeData });
          });

          const groupedByCategory = feedRecipes.reduce((acc, recipe) => {
              const category = recipe.categories[0];
              if (category) {
                  if (!acc[category]) {
                      acc[category] = [];
                  }
                  acc[category].push(recipe);
              }
              return acc;
          }, {} as GroupedByCategory);

          const sections = Object.keys(groupedByCategory).map(key => ({
              title: key,
              data: groupedByCategory[key],
          }));

          setData(sections);
      });

      return () => unsubscribe();
  }, []);

  return data;
};


// Fetching recipe by ID for feed
export const getRecipeByIdForFeed = async (recipeID: string) => {
  try {
      const docRef = doc(db, "feed", recipeID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
          return docSnap.data() as RecipeData;
      } else {
          console.log("No such document!");
          return null;
      }
  } catch (error) {
      console.error("Error fetching recipe:", error);
      return null;
  }
};

// Delete a recipe from the database
export const deleteRecipe = async (recipeID: string) => {
  try {
    const docRef = doc(db, "recipes", recipeID);
    await deleteDoc(docRef);
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error removing document: ", error);
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

//Calculates average rating from each feed recipe 
export const calculateAverageRating = async (recipe: RecipeData) => {
  try {
    const ratingsCollectionRef = collection(db, 'feed', recipe.id, 'ratings');
    const ratingsSnapshot = await getDocs(ratingsCollectionRef);

    if (ratingsSnapshot.empty) {
      return { average: 0, totalRatings: 0 };
    }

    const ratingsData: number[] = [];
    ratingsSnapshot.forEach((doc) => {
      const rating = doc.data().rating || 0;
      ratingsData.push(rating);
    });

    const sum = ratingsData.reduce((acc, rating) => acc + (parseFloat(rating) || 0), 0);
    const average = sum / ratingsData.length;

    return { average, totalRatings: ratingsData.length };
  } catch (error) {
    return { average: 0, totalRatings: 0 };
  }
};


