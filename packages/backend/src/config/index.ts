import { VaultConfig } from '../types/vault';

export const vaultConfig: VaultConfig = {
  apiVersion: process.env.VAULT_API_VERSION || 'v1',
  endpoint: process.env.VAULT_ENDPOINT || 'http://localhost:8200',
  token: process.env.VAULT_TOKEN || 'personal-dev-root-token-123'
};

export const appConfig = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:3002'
};
