import vault from 'node-vault';
import { DatabaseConfig, VaultConfig, VaultSecretResponse, AdminCredentials, JWTConfig } from '../types/vault';

export class VaultService {
  private client: any;
  private isEnabled: boolean;

  constructor(config: VaultConfig) {
    this.isEnabled = process.env.VAULT_ENABLED === 'true';
    
    if (this.isEnabled) {
      this.client = vault({
        apiVersion: config.apiVersion,
        endpoint: config.endpoint,
        token: config.token
      });
    }
  }

  async getDatabaseConfig(): Promise<DatabaseConfig> {
    if (!this.isEnabled) {
      // Fallback to environment variables if Vault is disabled
      return {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        database: process.env.DB_NAME || 'portfolio',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        connection_string: process.env.DATABASE_CONNECTION_STRING || 
          `postgresql://${process.env.DB_USER || 'postgres'}:${encodeURIComponent(process.env.DB_PASSWORD || 'password')}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'portfolio'}`,
        ssl_mode: process.env.DB_SSL_MODE || 'disable'
      };
    }

    try {
      const result: VaultSecretResponse = await this.client.read('secret/data/portfolio/database');
      return result.data.data;
    } catch (error) {
      console.error('Failed to retrieve database config from Vault:', error);
      console.log('Falling back to environment variables...');
      
      // Fallback to environment variables
      return {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        database: process.env.DB_NAME || 'portfolio',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        connection_string: process.env.DATABASE_CONNECTION_STRING || 
          `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'portfolio'}`,
        ssl_mode: process.env.DB_SSL_MODE || 'disable'
      };
    }
  }

  async getConnectionString(): Promise<string> {
    const config = await this.getDatabaseConfig();
    return config.connection_string;
  }

  async getJWTSecret(): Promise<string> {
    if (!this.isEnabled) {
      return process.env.JWT_SECRET || 'fallback-jwt-secret-key';
    }

    try {
      const result = await this.client.read('secret/data/portfolio/auth');
      const jwtConfig: JWTConfig = result.data.data;
      return jwtConfig.jwt_secret;
    } catch (error) {
      console.error('Failed to retrieve JWT secret from Vault:', error);
      return process.env.JWT_SECRET || 'fallback-jwt-secret-key';
    }
  }

  async getAdminCredentials(): Promise<{ email: string; password: string }> {
    if (!this.isEnabled) {
      return {
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      };
    }

    try {
      const result = await this.client.read('secret/data/portfolio/admin');
      const adminCreds: AdminCredentials = result.data.data;
      
      return {
        email: adminCreds.admin_email,
        password: adminCreds.admin_password
      };
    } catch (error) {
      console.error('Failed to retrieve admin credentials from Vault:', error);
      return {
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      };
    }
  }
}
