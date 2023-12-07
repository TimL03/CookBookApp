import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../FirebaseConfig';
import { collection, getDocs, where, query } from 'firebase/firestore';

const getCurrentUserId = (): Promise<string | null> => {
  return new Promise<string | null>((resolve, reject) => {
    const auth = getAuth();

    const unsubscribe: () => void = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid);
      } else {
        resolve(null);
      }
      unsubscribe();
    }, (error) => {
      reject(error);
    });
  });
};

const searchRecipesByIngredients = async (selectedCookBookIngredients: string[], userId:  string) => {
  const recipesCollection = collection(db, 'recipes');
  let ingredientQuery = query(
    recipesCollection,
    where('userID', '==', userId),
    where('ingredientNames', 'array-contains-any', selectedCookBookIngredients)
  );

  const querySnapshot = await getDocs(ingredientQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const searchRecipesByCategories = async (selectedCookBookCategories: string[], userId: string) => {
  const recipesCollection = collection(db, 'recipes');
  let categoryQuery = query(
    recipesCollection,
    where('userID', '==', userId),
    where('categories', 'array-contains-any', selectedCookBookCategories)
  );

  const querySnapshot = await getDocs(categoryQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export { searchRecipesByIngredients, searchRecipesByCategories, getCurrentUserId };




