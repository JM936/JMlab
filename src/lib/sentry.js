import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.2,
  beforeSend(event) {
    // Filtrar erros sensíveis
    if (event.exception?.values?.[0]?.type === 'FirebaseError') {
      const firebaseError = event.exception.values[0];
      firebaseError.value = '[Firebase] ' + firebaseError.value.split(':')[0];
    }
    return event;
  }
});

export const captureEnsaioError = (error, context) => {
  Sentry.captureException(error, {
    tags: { section: 'ensaios' },
    extra: context
  });
};