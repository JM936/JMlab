// src/services/analytics.js
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { auth } from '../config/firebase';
import ApiService from './api';

// Configuração avançada
const DEBUG_MODE = process.env.NODE_ENV !== 'production';
const TRACKING_CONSENT_KEY = 'analytics_consent';

class AnalyticsService {
  constructor() {
    this.analytics = null;
    this.queuedEvents = [];
    this.consentGranted = false;
    this.initComplete = false;
  }

  /**
   * Inicialização segura
   */
  init() {
    try {
      if (typeof window !== 'undefined' && !this.initComplete) {
        this.analytics = getAnalytics();
        this.checkConsent();
        this.initComplete = true;

        // Processar eventos enfileirados
        if (this.queuedEvents.length > 0) {
          this.queuedEvents.forEach(event => this.trackEvent(event.name, event.params));
          this.queuedEvents = [];
        }
      }
    } catch (error) {
      console.error('Analytics initialization error:', error);
    }
  }

  /**
   * Gerenciamento de consentimento
   */
  checkConsent() {
    const savedConsent = localStorage.getItem(TRACKING_CONSENT_KEY);
    this.consentGranted = savedConsent === 'true';
    
    if (DEBUG_MODE) {
      this.consentGranted = true;
      console.log('[Analytics] Running in debug mode');
    }
  }

  setConsent(granted) {
    this.consentGranted = granted;
    localStorage.setItem(TRACKING_CONSENT_KEY, String(granted));
    
    if (granted && !this.initComplete) {
      this.init();
    }
  }

  /**
   * Rastreamento de eventos
   */
  trackEvent(eventName, eventParams = {}) {
    if (!this.consentGranted) return;

    const enhancedParams = {
      ...eventParams,
      app_version: process.env.REACT_APP_VERSION || '1.0.0',
      page_path: window.location.pathname,
      user_id: auth.currentUser?.uid || 'anonymous',
      timestamp: new Date().toISOString()
    };

    // Se ainda não inicializado, enfileira o evento
    if (!this.initComplete) {
      this.queuedEvents.push({ name: eventName, params: enhancedParams });
      return;
    }

    try {
      logEvent(this.analytics, eventName, enhancedParams);
      
      if (DEBUG_MODE) {
        console.log(`[Analytics Event] ${eventName}`, enhancedParams);
      }

      // Log adicional para ensaios técnicos
      if (eventName.includes('ensaio_')) {
        ApiService.request('POST', '/analytics/ensaios', {
          event: eventName,
          ...enhancedParams
        }, { authRequired: true });
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Rastreamento de páginas
   */
  trackPageView(pageTitle, pagePath = window.location.pathname) {
    this.trackEvent('page_view', {
      page_title: pageTitle,
      page_path: pagePath,
      page_location: window.location.href
    });
  }

  /**
   * Métodos específicos para o GeotechLab
   */
  trackEnsaioView(ensaioId, ensaioName) {
    this.trackEvent('ensaio_view', {
      ensaio_id: ensaioId,
      ensaio_name: ensaioName,
      category: ensaioName.split('_')[0] // Ex: 'solos_compressao' -> 'solos'
    });
  }

  trackSearch(query, resultsCount) {
    this.trackEvent('search_performed', {
      search_term: query,
      results_count: resultsCount,
      search_type: query.length > 5 ? 'complex' : 'simple'
    });
  }

  /**
   * Métodos de usuário
   */
  setUserData(user) {
    if (!this.consentGranted || !user) return;

    try {
      setUserId(this.analytics, user.uid);
      
      setUserProperties(this.analytics, {
        user_type: user.isPro ? 'professional' : 'student',
        account_created: new Date(user.createdAt).getFullYear().toString(),
        lab_access: user.hasLabAccess ? 'yes' : 'no'
      });
    } catch (error) {
      console.error('User analytics error:', error);
    }
  }

  /**
   * Métodos para erros
   */
  trackError(error, context = '') {
    this.trackEvent('app_error', {
      error_name: error.name,
      error_message: error.message,
      error_stack: DEBUG_MODE ? error.stack : undefined,
      context
    });
  }
}

// Singleton pattern
const analyticsInstance = new AnalyticsService();

// Inicialização automática quando o usuário dá consentimento
if (typeof window !== 'undefined') {
  // Habilite para desenvolvimento ou se tiver consentimento prévio
  if (DEBUG_MODE || localStorage.getItem(TRACKING_CONSENT_KEY) === 'true') {
    analyticsInstance.init();
  }
}

export default analyticsInstance; 
