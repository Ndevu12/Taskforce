/**
 * Safe environment variable access utility
 * Prevents module initialization errors from crashing the app
 */

interface EnvConfig {
  VITE_BASE_URL: string;
  VITE_APP_NAME: string;
  NODE_ENV: string;
}

class EnvManager {
  private config: Partial<EnvConfig> = {};
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      this.config = {
        VITE_BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000',
        VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'Bendif',
        NODE_ENV: import.meta.env.NODE_ENV || 'development',
      };
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize environment variables:', error);
      // Fallback values
      this.config = {
        VITE_BASE_URL: 'http://localhost:3000',
        VITE_APP_NAME: 'Bendif',
        NODE_ENV: 'development',
      };
      this.initialized = true;
    }
  }

  public get(key: keyof EnvConfig): string {
    if (!this.initialized) {
      this.initialize();
    }
    
    const value = this.config[key];
    if (!value) {
      console.warn(`Environment variable ${key} is not defined, using fallback`);
    }
    
    return value || this.getFallback(key);
  }

  private getFallback(key: keyof EnvConfig): string {
    const fallbacks: Record<keyof EnvConfig, string> = {
      VITE_BASE_URL: 'http://localhost:3000',
      VITE_APP_NAME: 'Bendif',
      NODE_ENV: 'development',
    };
    
    return fallbacks[key];
  }

  public getApiUrl(): string {
    return this.get('VITE_BASE_URL');
  }

  public getAppName(): string {
    return this.get('VITE_APP_NAME');
  }

  public isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development';
  }

  public isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }
}

// Export singleton instance
export const env = new EnvManager();

// Export individual getters for convenience
export const getApiUrl = () => env.getApiUrl();
export const getAppName = () => env.getAppName();
export const isDevelopment = () => env.isDevelopment();
export const isProduction = () => env.isProduction();
