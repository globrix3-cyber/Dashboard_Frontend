// Error monitoring (Sentry). Inert unless VITE_SENTRY_DSN is set at build time.
// The SDK is loaded with a dynamic import so visitors of DSN-less builds never download it.

let sentry = null;
let initPromise = null;

export function initMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return Promise.resolve(null);
  if (initPromise) return initPromise;

  initPromise = import('@sentry/react')
    .then(({ init, browserTracingIntegration, captureException: capture }) => {
      init({
        dsn,
        environment: import.meta.env.MODE,
        integrations: [browserTracingIntegration()],
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
        sendDefaultPii: false,
        beforeSend(event) {
          if (event.request) {
            delete event.request.data;
            delete event.request.cookies;
            delete event.request.headers;
          }
          return event;
        },
      });
      sentry = { captureException: capture };
      return sentry;
    })
    .catch(() => null); // monitoring must never break the app

  return initPromise;
}

export function captureException(error, context) {
  try {
    if (sentry) {
      sentry.captureException(error, context);
    } else if (initPromise) {
      initPromise.then((s) => s?.captureException(error, context)).catch(() => {});
    }
  } catch {
    // ignore
  }
}
