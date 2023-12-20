import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function getCurrentUserId(): Promise<string | null> {
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
}