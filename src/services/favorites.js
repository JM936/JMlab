import { db } from '../config/firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export const FavoritesService = {
  async addFavorite(userId, ensaioId) {
    const favRef = doc(db, `users/${userId}/favorites`, ensaioId);
    await setDoc(favRef, { 
      ensaioId,
      createdAt: new Date().toISOString() 
    });
  },

  async removeFavorite(userId, ensaioId) {
    const favRef = doc(db, `users/${userId}/favorites`, ensaioId);
    await deleteDoc(favRef);
  },

  async getFavorites(userId) {
    const snapshot = await getDocs(collection(db, `users/${userId}/favorites`));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async isFavorite(userId, ensaioId) {
    const favRef = doc(db, `users/${userId}/favorites`, ensaioId);
    const docSnap = await getDoc(favRef);
    return docSnap.exists();
  }
};