// src/services/api.js
import { db, auth } from '../config/firebase';
import { FirestoreCache } from './cache';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.geotechlabguide.com/v1';

const ApiService = {
  /**
   * Configurações globais
   */
  config: {
    cacheEnabled: true,
    defaultCacheTTL: 15 * 60 * 1000, // 15 minutos
    maxRetries: 2
  },

  /**
   * Headers padrão para requisições
   */
  getHeaders(authRequired = true) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (authRequired && auth.currentUser) {
      headers['Authorization'] = `Bearer ${auth.currentUser.accessToken}`;
    }

    return headers;
  },

  /**
   * Tratamento de erros centralizado
   */
  handleError(error, context = '') {
    console.error(`[API Error] ${context}:`, error);
    
    const errorMap = {
      'permission-denied': 'Você não tem acesso a este recurso',
      'not-found': 'Recurso não encontrado',
      'unauthenticated': 'Autenticação necessária'
    };

    throw {
      code: error.code || 'api/unknown-error',
      message: errorMap[error.code] || error.message || 'Erro desconhecido',
      details: error.details || null,
      originalError: error
    };
  },

  /**
   * Requisições HTTP genéricas
   */
  async request(method, endpoint, data = null, options = {}) {
    const { authRequired = true, cacheKey = null } = options;
    const url = `${API_BASE_URL}${endpoint}`;

    // Verificar cache primeiro
    if (this.config.cacheEnabled && cacheKey && method === 'GET') {
      const cached = await FirestoreCache.get('api', cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(authRequired),
        body: data ? JSON.stringify(data) : null
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const result = await response.json();

      // Armazenar em cache se necessário
      if (this.config.cacheEnabled && cacheKey) {
        await FirestoreCache.set('api', cacheKey, result);
      }

      return result;
    } catch (error) {
      return this.handleError(error, `Endpoint: ${endpoint}`);
    }
  },

  /**
   * Métodos CRUD para Firestore
   */
  firestore: {
    async getDocument(collectionName, docId, options = {}) {
      try {
        const { cache = true } = options;
        const cacheKey = `fs_${collectionName}_${docId}`;

        if (cache) {
          const cached = await FirestoreCache.get('firestore', cacheKey);
          if (cached) return cached;
        }

        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw { code: 'not-found', message: 'Documento não encontrado' };
        }

        const data = { id: docSnap.id, ...docSnap.data() };

        if (cache) {
          await FirestoreCache.set('firestore', cacheKey, data);
        }

        return data;
      } catch (error) {
        throw ApiService.handleError(error, 'Firestore getDocument');
      }
    },

    async queryCollection(collectionName, conditions = [], options = {}) {
      try {
        const { cache = true, limit = null } = options;
        const cacheKey = `fs_query_${collectionName}_${JSON.stringify(conditions)}`;

        if (cache) {
          const cached = await FirestoreCache.get('firestore', cacheKey);
          if (cached) return cached;
        }

        const collectionRef = collection(db, collectionName);
        const queryConditions = conditions.map(c => where(c.field, c.operator, c.value));
        const q = query(collectionRef, ...queryConditions, ...(limit ? [limit(limit)] : []));
        const querySnapshot = await getDocs(q);

        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (cache) {
          await FirestoreCache.set('firestore', cacheKey, results);
        }

        return results;
      } catch (error) {
        throw ApiService.handleError(error, 'Firestore queryCollection');
      }
    }
  },

  /**
   * Métodos específicos do GeotechLabGuide
   */
  ensaios: {
    async getEnsaioDetails(ensaioId) {
      return ApiService.firestore.getDocument('ensaios', ensaioId, {
        cache: true
      });
    },

    async getEnsaiosByCategory(categoryId) {
      return ApiService.firestore.queryCollection('ensaios', [
        { field: 'category', operator: '==', value: categoryId }
      ], {
        cache: true,
        limit: 50
      });
    }
  },

  auth: {
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          token: await userCredential.user.getIdToken()
        };
      } catch (error) {
        throw ApiService.handleError(error, 'Auth login');
      }
    }
  }
};

// Extensão para desenvolvimento
if (process.env.NODE_ENV === 'development') {
  ApiService.mock = {
    // ... (mocks para testes)
  };
}

export default ApiService; 
