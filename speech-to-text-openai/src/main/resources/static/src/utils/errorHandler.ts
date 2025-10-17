export class GlobalErrorHandler {
  static handleError(error: unknown, errorInfo?: any) {
    console.error('Application Error:', error);
    if (errorInfo) {
      console.error('Error Info:', errorInfo);
    }

    // In production, you might want to send errors to a logging service
    if (import.meta.env.PROD) {
      // Example: sendToLoggingService(error, errorInfo);
    }
  }

  static handlePromiseRejection(event: PromiseRejectionEvent) {
    console.error('Unhandled Promise Rejection:', event.reason);
    event.preventDefault();
  }
}

// Set up global error handlers
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', GlobalErrorHandler.handlePromiseRejection);
}