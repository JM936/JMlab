// src/services/cache.js
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const CACHE_VERSION = 'v1';
const CACHE_EXPIRY_TIME = 15 * 60 * 1000; // 15 minutos

const MemoryCache = {
  data: new Map(),
  timestamps: new Map(),

  get(key) {
    const item = this.data.get(key);
    if (!item) return null;

    const isExpired = (Date.now() - this.timestamps.get(key)) > CACHE_EXPIRY_TIME;
    return isExpired ? null : item;
  },

  set(key, value) {
    this.data.set(key, value);
    this.timestamps.set(key, Date.now());
  },

  clear() {
    this.data.clear();
    this.timestamps.clear();
  }
};

export const FirestoreCache = {
  async get(collection, id) {
    try {
      // Verifica cache em memória primeiro
      const memoryKey = `${collection}_${id}`;
      const cached = MemoryCache.get(memoryKey);
      if (cached) return cached;

      // Busca no Firestore com fallback
      const docRef = doc(db, `cache/${collection}_${id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Verifica expiração
        if (Date.now() - data.timestamp < CACHE_EXPIRY_TIME) {
          MemoryCache.set(memoryKey, data.value);
          return data.value;
        }
      }
      return null;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  },

  async set(collection, id, value) {
    try {
      const memoryKey = `${collection}_${id}`;
      MemoryCache.set(memoryKey, value);

      // Persiste no Firestore
      const docRef = doc(db, `cache/${collection}_${id}`);
      await setDoc(docRef, {
        value,
        timestamp: Date.now(),
        version: CACHE_VERSION
      }, { merge: true });
    } catch (error) {
      console.error('Cache write error:', error);
    }
  },

  async preload(collection, ids) {
    const results = {};
    await Promise.all(ids.map(async id => {
      results[id] = await this.get(collection, id);
    }));
    return results;
  },

  async clear(collection = null) {
    if (collection) {
      // Limpeza seletiva (avançado - requer índice no Firestore)
      console.warn('Selective cache clearing not fully implemented');
    } else {
      MemoryCache.clear();
    }
  }
};

// Helper para componentes React
export const useCache = () => {
  const get = async (key, fetchFn, options = {}) => {
    const { skipCache = false, ttl = CACHE_EXPIRY_TIME } = options;
    
    if (!skipCache) {
      const cached = await FirestoreCache.get('app', key);
      if (cached) return cached;
    }

    const freshData = await fetchFn();
    await FirestoreCache.set('app', key, freshData);
    return freshData;
  };

  return { get };
};

// Exemplo de uso:
/*
const { get } = useCache();
const ensaios = await get('ensaios_list', async () => {
  const response = await fetch('/api/ensaios');
  return response.json();
}, { ttl: 5 * 60 * 1000 });
*/
