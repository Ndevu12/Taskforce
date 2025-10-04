/**
 * Simple Environment-aware Logger
 * - Development: Logs everything
 * - Production: Silent (no logs)
 */

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.NODE_ENV === 'development';
  }

  private shouldLog(): boolean {
    return this.isDevelopment;
  }

  error(message: string, error?: Error | any): void {
    if (!this.shouldLog()) return;
    
    if (error instanceof Error) {
      console.error(`[ERROR] ${message}`, {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    } else if (error) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }

  warn(message: string, data?: any): void {
    if (!this.shouldLog()) return;
    
    if (data) {
      console.warn(`[WARN] ${message}`, data);
    } else {
      console.warn(`[WARN] ${message}`);
    }
  }

  info(message: string, data?: any): void {
    if (!this.shouldLog()) return;
    
    if (data) {
      console.info(`[INFO] ${message}`, data);
    } else {
      console.info(`[INFO] ${message}`);
    }
  }

  debug(message: string, data?: any): void {
    if (!this.shouldLog()) return;
    
    if (data) {
      console.debug(`[DEBUG] ${message}`, data);
    } else {
      console.debug(`[DEBUG] ${message}`);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
export default logger;
