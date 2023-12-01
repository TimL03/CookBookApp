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

