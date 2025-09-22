import { useState, useEffect } from 'react'

interface FeatureFlag {
  id: number
  name: string
  description: string
  enabled: boolean
  created_at: string
  updated_at: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
  : 'https://api.demitaylornimmo.com/api'

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE_URL}/feature-flags/maintenance`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch maintenance mode')
        }

        const data = await response.json()
        setIsMaintenanceMode(data.maintenance_mode || false)
      } catch (err) {
        console.error('Error checking maintenance mode:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Default to false if we can't check the flag
        setIsMaintenanceMode(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkMaintenanceMode()

    // Check every 30 seconds for maintenance mode changes
    const interval = setInterval(checkMaintenanceMode, 30000)

    return () => clearInterval(interval)
  }, [])

  return {
    isMaintenanceMode,
    isLoading,
    error
  }
}
