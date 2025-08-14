import { logEvent } from 'firebase/analytics';
import { analytics } from '../config/firebase';

export const useAnalytics = () => {
  const trackEvent = (eventName, eventParams = {}) => {
    if (process.env.NODE_ENV === 'production') {
      logEvent(analytics, eventName, eventParams);
    }
    console.log(`[Analytics] ${eventName}`, eventParams);
  };

  return { trackEvent };
};