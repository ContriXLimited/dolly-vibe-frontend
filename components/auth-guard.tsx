"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useAuthStore, useWalletSync } from '@/store/auth'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter()
  const { isConnected } = useAccount()
  
  // Use AuthStore
  const {
    isWalletConnected,
    isLoggedIn,
    userStatus,
    isInitialized,
    isLoading,
    error,
    initialize
  } = useAuthStore()
  
  // Sync wallet state
  useWalletSync()
  
  const [isChecking, setIsChecking] = useState(true)
  const [hasAttemptedRedirect, setHasAttemptedRedirect] = useState(false)

  // Initialize AuthStore
  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
  }, [isInitialized, initialize])

  useEffect(() => {
    const checkAuth = () => {
      if (!requireAuth) {
        setIsChecking(false)
        return
      }

      // Wait for initialization to complete
      if (!isInitialized) {
        return
      }

      // Check wallet connection
      if (!isConnected && !isWalletConnected) {
        router.push('/login')
        return
      }

      // Check wallet login status
      if (!isLoggedIn) {
        router.push('/login')
        return
      }

      // Check user status loading
      if (isLoading) {
        return
      }

      // Check API errors - if it's a 401 error, let request.ts handle it to avoid duplicate redirects
      if (error) {
        // If it's an authentication error, redirect to login page
        if (error.includes('401') || error.includes('Unauthorized')) {
          router.push('/login')
          return
        }
      }

      // Check if all verifications are completed
      if (!userStatus?.allConnected) {
        // Avoid duplicate redirects
        if (hasAttemptedRedirect) {
          return
        }
        
        setHasAttemptedRedirect(true)
        router.push('/login')
        return
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [
    requireAuth,
    isConnected,
    isWalletConnected,
    isLoggedIn,
    userStatus,
    isInitialized,
    isLoading,
    error,
    hasAttemptedRedirect,
    router
  ])

  // If no authentication required, show content directly
  if (!requireAuth) {
    return <>{children}</>
  }

  // If checking authentication status, show loading page
  if (isChecking || isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-300">Verifying identity...</p>
        </div>
      </div>
    )
  }

  // Authentication passed, show content
  return <>{children}</>
}