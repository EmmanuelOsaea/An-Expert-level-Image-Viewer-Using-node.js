/**
 * errorHandler.js
 * Centralized error handling module for the viewer application.
 * Handles client-side errors, logs them, and optionally reports to external monitoring services.
 */

class ErrorHandler {
  constructor(options = {}) {
    this.logErrors = options.logErrors ?? true; // Whether to log errors to console
    this.reportErrors = options.reportErrors ?? false; // Whether to send errors to a remote server
    this.reportUrl = options.reportUrl || null; // Endpoint for error reporting
    this.userContext = options.userContext || {}; // Additional context (e.g., user ID, session)
  }

  /**
   * Handle a generic error object
   * @param {Error} error - The error object caught
   * @param {Object} context - Additional context info (optional)
   */
  handleError(error, context = {}) {
    const errorInfo = this._formatError(error, context);

    if (this.logErrors) {
      this._logError(errorInfo);
    }

    if (this.reportErrors && this.reportUrl) {
      this._reportError(errorInfo);
    }

    // Optionally, show user-friendly message or UI feedback
    this._showUserNotification(error);
  }

  /**
   * Format error information into a consistent structure
   * @param {Error} error
   * @param {Object} context
   * @returns {Object}
   */
  _formatError(error, context) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
      time: new Date().toISOString(),
      userContext: this.userContext,
      additionalContext: context,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
  }

  /**
   * Log error to the console with styling for visibility
   * @param {Object} errorInfo
   */
  _logError(errorInfo) {
    console.groupCollapsed(`%c[Viewer Error] ${errorInfo.message}`, 'color: red; font-weight: bold;');
    console.error('Name:', errorInfo.name);
    console.error('Time:', errorInfo.time);
    console.error('URL:', errorInfo.url);
    console.error('User Agent:', errorInfo.userAgent);
    console.error('Stack Trace:', errorInfo.stack);
    if (Object.keys(errorInfo.additionalContext).length) {
      console.error('Additional Context:', errorInfo.additionalContext);
    }
    console.groupEnd();
  }

  /**
   * Send error details to a remote monitoring service
   * @param {Object} errorInfo
   */
  async _reportError(errorInfo) {
    try {
      await fetch(this.reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      });
    } catch (reportError) {
      // If reporting fails, log it silently to avoid infinite loops
      console.warn('Failed to report error:', reportError);
    }
  }

  /**
   * Show a user-friendly notification or fallback UI
   * Customize this method based on your UI framework or design system
   * @param {Error} error
   */
  _showUserNotification(error) {
    // Example: simple alert (replace with modal/toast in real app)
    toast(`An unexpected error occurred: ${error.message}. Please try again or contact support.`);
  }
}

// Singleton instance for app-wide use
const errorHandler = new ErrorHandler({
  logErrors: true,
  reportErrors: true,
  reportUrl: 'https://your-error-reporting-endpoint.com/api/errors',
  userContext: {
    userId: '12345', // dynamically set this from your auth/user system
    sessionId: 'abcde-xyz',
  },
});

export default errorHandler;


try {
  // Viewer logic that might throw
} catch (error) {
  errorHandler.handleError(error, { component: 'ImageViewer', action: 'loadImage', imageId: 'img123' });
}


      window.addEventListener('error', (event) => {
  errorHandler.handleError(event.error || new Error(event.message));
});

window.addEventListener('unhandledrejection', (event) => {
  errorHandler.handleError(event.reason || new Error('Unhandled promise rejection'));
});
