import React from 'react'
import { useMaintenanceMode } from '../hooks/useMaintenanceMode'
import MaintenancePage from './MaintenancePage'

interface MaintenanceWrapperProps {
  children: React.ReactNode
}

const MaintenanceWrapper: React.FC<MaintenanceWrapperProps> = ({ children }) => {
  const { isMaintenanceMode, isLoading, error } = useMaintenanceMode()

  // Show loading state briefly while checking maintenance mode
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // If there's an error checking maintenance mode, show the normal site
  // (fail-safe approach - don't block users if we can't check the flag)
  if (error) {
    console.warn('Failed to check maintenance mode, showing normal site:', error)
    return <>{children}</>
  }

  // Show maintenance page if maintenance mode is enabled
  if (isMaintenanceMode) {
    return (
      <MaintenancePage 
        estimatedTime="a few hours"
        message="We're currently performing scheduled maintenance to improve your experience. We'll be back soon!"
      />
    )
  }

  // Show normal site
  return <>{children}</>
}

export default MaintenanceWrapper
