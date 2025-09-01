export interface DatabaseConfig {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  connection_string: string;
  ssl_mode: string;
}

export interface VaultSecretResponse {
  data: {
    data: DatabaseConfig;
  };
}

export interface VaultConfig {
  apiVersion: string;
  endpoint: string;
  token: string;
}

export interface AdminCredentials {
  admin_email: string;
  admin_password: string;
}

export interface JWTConfig {
  jwt_secret: string;
}
