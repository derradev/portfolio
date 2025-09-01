import { Pool, PoolConfig, PoolClient } from 'pg';
import { VaultService } from './VaultService';
import { DatabaseConfig } from '../types/vault';

export class DatabaseService {
  private pool: Pool | null = null;
  private vaultService: VaultService;

  constructor(vaultService: VaultService) {
    this.vaultService = vaultService;
  }

  async initialize(): Promise<void> {
    try {
      const dbConfig = await this.vaultService.getDatabaseConfig();
      
      const poolConfig: PoolConfig = {
        connectionString: dbConfig.connection_string,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };

      this.pool = new Pool(poolConfig);
      
      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      
      console.log('✅ Database connection established successfully');
    } catch (error) {
      throw new Error(`Failed to initialize database: ${error}`);
    }
  }

  getPool(): Pool {
    if (!this.pool) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.pool;
  }

  async query(text: string, params?: any[]): Promise<any> {
    if (!this.pool) {
      await this.initialize();
    }
    const pool = this.getPool();
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async queryOne(text: string, params?: any[]): Promise<any> {
    if (!this.pool) {
      await this.initialize();
    }
    const pool = this.getPool();
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async queryMany(text: string, params?: any[]): Promise<any[]> {
    return await this.query(text, params);
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const pool = this.getPool();
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('✅ Database connection closed');
    }
  }
}
