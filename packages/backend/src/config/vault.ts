import vault from 'node-vault';

interface DatabaseConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
} 
interface VaultConfig {
  apiVersion: string;
  endpoint: string;
  token: string;
}

class VaultService {
  private vaultClient: any;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.VAULT_ENABLED === 'true';
    
    if (this.isEnabled) {
      const config: VaultConfig = {
        apiVersion: process.env.VAULT_API_VERSION || 'v1',
        endpoint: process.env.VAULT_ENDPOINT || 'http://localhost:8200',
        token: process.env.VAULT_TOKEN || 'personal-dev-root-token-123'
      };

      this.vaultClient = vault(config);
    }
  }

  async getDatabaseConfig(): Promise<DatabaseConfig> {
    if (!this.isEnabled) {
      // Fallback to environment variables if Vault is disabled
      return {
        connectionString: process.env.DATABASE_CONNECTION_STRING || process.env.DATABASE_URL,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        database: process.env.DB_NAME || 'portfolio',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password'
      };
    }

    try {
      const result = await this.vaultClient.read('secret/data/portfolio/database');
      const secrets = result.data.data;
      
      return {
        connectionString: secrets.connection_string,
        host: secrets.host,
        port: secrets.port ? parseInt(secrets.port) : undefined,
        database: secrets.database,
        username: secrets.username,
        password: secrets.password,
      };
    } catch (error) {
      console.error('Failed to retrieve database secrets from Vault:', error);
      console.log('Falling back to environment variables...');
      
      // Fallback to environment variables
      return {
        connectionString: process.env.DATABASE_CONNECTION_STRING || process.env.DATABASE_URL,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        database: process.env.DB_NAME || 'portfolio',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password'
      };
    }
  }

  async getJWTSecret(): Promise<string> {
    if (!this.isEnabled) {
      return process.env.JWT_SECRET || 'fallback-jwt-secret-key';
    }

    try {
      const result = await this.vaultClient.read('secret/data/portfolio/auth');
      return result.data.data.jwt_secret;
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
      const result = await this.vaultClient.read('secret/data/portfolio/admin');
      const secrets = result.data.data;
      
      return {
        email: secrets.admin_email,
        password: secrets.admin_password
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

export const vaultService = new VaultService();
export { DatabaseConfig };
