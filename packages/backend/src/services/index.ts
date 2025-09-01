import { VaultService } from './VaultService'
import { DatabaseService } from './DatabaseService'
import { vaultConfig } from '../config'

// Singleton instances
let vaultService: VaultService | null = null
let dbService: DatabaseService | null = null

export async function initializeServices(): Promise<{ vaultService: VaultService; dbService: DatabaseService }> {
  if (!vaultService) {
    vaultService = new VaultService(vaultConfig)
  }
  
  if (!dbService) {
    dbService = new DatabaseService(vaultService)
    await dbService.initialize()
  }
  
  return { vaultService, dbService }
}

export function getServices(): { vaultService: VaultService; dbService: DatabaseService } {
  if (!vaultService || !dbService) {
    // Initialize services synchronously if not already done
    vaultService = new VaultService(vaultConfig)
    dbService = new DatabaseService(vaultService)
    // Note: Database connection will be attempted on first query
  }
  return { vaultService, dbService }
}
