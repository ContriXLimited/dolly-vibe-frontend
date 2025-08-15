"use client"

import { useState, useEffect } from "react"
import { useAccount, useDisconnect } from 'wagmi'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, CheckCircle, Loader2, AlertCircle, Unplug } from "lucide-react"
import { Logo } from "@/components/logo"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useAuthStore, useWalletSync } from '@/store/auth'

export default function LoginPage() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  
  // Use AuthStore
  const {
    walletAddress,
    isWalletConnected,
    isLoggedIn,
    userStatus,
    isLoading,
    error,
    login,
    connectDiscord,
    connectTwitter,
    refreshUserStatus,
    clearError,
    initialize
  } = useAuthStore()
  
  // Sync wallet state
  useWalletSync()
  
  const [currentStep, setCurrentStep] = useState<'wallet' | 'verify' | 'social' | 'complete'>('wallet')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize AuthStore
  useEffect(() => {
    initialize()
    
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [initialize])

  // Monitor wallet connection status changes
  useEffect(() => {
    if (!isInitialized) {
      return
    }
    
    // Use address existence as a more reliable connection indicator
    const hasWalletConnected = isConnected || isWalletConnected || !!address
    
    if (hasWalletConnected && !isLoggedIn) {
      setCurrentStep('verify')
    } else if (!hasWalletConnected && !isLoggedIn) {
      setCurrentStep('wallet')
    }
  }, [isInitialized, isConnected, address, isWalletConnected, walletAddress, isLoggedIn, currentStep])

  // Monitor login status changes
  useEffect(() => {
    if (isLoggedIn && userStatus) {
      if (userStatus.allConnected) {
        setCurrentStep('complete')
      } else {
        setCurrentStep('social')
      }
    }
  }, [isLoggedIn, userStatus])

  // Handle wallet signature verification
  const handleWalletLogin = async () => {
    clearError()
    try {
      await login()
    } catch (err) {
    }
  }

  // Handle wallet disconnect
  const handleDisconnect = () => {
    disconnect()
    setCurrentStep('wallet')
    clearError()
  }

  // Handle Discord connection
  const handleDiscordConnect = async () => {
    clearError()
    try {
      await connectDiscord()
      // Wait for user to complete authorization in new window, then refresh status
      setTimeout(() => {
        refreshUserStatus()
      }, 5000)
    } catch (err) {
    }
  }

  // Handle Twitter connection
  const handleTwitterConnect = async () => {
    clearError()
    
    // If connected but not following, redirect to Twitter page
    if (userStatus?.twitterConnected && !userStatus.isFollowed) {
      window.open('https://x.com/0G_labs', '_blank')
      // Refresh status after 5 seconds to check if following
      setTimeout(() => {
        refreshUserStatus()
      }, 5000)
      return
    }
    
    // If not connected, proceed with OAuth authorization
    try {
      await connectTwitter()
      // Wait for user to complete authorization in new window, then refresh status
      setTimeout(() => {
        refreshUserStatus()
      }, 5000)
    } catch (err) {
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-neutral-800/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neutral-700/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-neutral-600/10 rounded-full blur-2xl"></div>
      </div>

      {/* Dolly VIBE Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Logo />
      </div>

      {/* Login Modal */}
      <Card className="w-full max-w-md bg-neutral-800/95 border-neutral-600 backdrop-blur-sm relative z-20">
        <CardHeader className="relative">
          <div className="text-center pt-2">
            <h1 className="text-xl font-semibold text-white mb-2">
              {currentStep === 'wallet' ? 'Connect Your Wallet' :
               currentStep === 'verify' ? 'Verify Your Identity' :
               currentStep === 'social' ? 'Connect Social Accounts' :
               'Welcome to Dolly VIBE!'}
            </h1>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {/* Step 1: Wallet Connection */}
          {currentStep === 'wallet' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-neutral-300 text-sm">Step 1: Connect Your Wallet</p>
              </div>
              <div>
                <h2 className="text-white font-medium mb-3">Connect Wallet</h2>
                <WalletConnectButton />
              </div>
            </div>
          )}

          {/* Step 2: Wallet Signature Verification */}
          {currentStep === 'verify' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-neutral-300 text-sm">Step 2: Verify Wallet Identity</p>
                <p className="text-neutral-500 text-xs mt-1">
                  Wallet Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
                </p>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Button
                  onClick={handleWalletLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 text-lg"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</>
                  ) : (
                    'Sign to Verify Wallet'
                  )}
                </Button>
                
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  className="w-full border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-500"
                >
                  <Unplug className="w-4 h-4 mr-2" />
                  Disconnect Wallet
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Social Platform Connections */}
          {currentStep === 'social' && userStatus && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-neutral-300 text-sm">Step 3: Connect Social Platforms</p>
                <p className="text-neutral-400 text-xs mt-1">
                  Progress: {userStatus.nextSteps.filter(step => step.completed).length}/{userStatus.nextSteps.length}
                </p>
              </div>

              {isLoading && (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500" />
                  <p className="text-neutral-400 text-sm mt-2">Checking connection status...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Discord Connection Status */}
              <div>
                <h2 className="text-white font-medium mb-3 flex items-center gap-2">
                  Join OG Discord
                  {userStatus.discordConnected && userStatus.isJoined && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </h2>
                <button 
                  onClick={handleDiscordConnect}
                  disabled={isLoading || (userStatus.discordConnected && userStatus.isJoined)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors group ${
                    userStatus.discordConnected && userStatus.isJoined
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-neutral-700 hover:bg-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">D</span>
                    </div>
                    <span className={`${
                      userStatus.discordConnected && userStatus.isJoined 
                        ? 'text-green-300' 
                        : 'text-neutral-200'
                    }`}>
                      {userStatus.discordConnected && userStatus.isJoined
                        ? 'Discord connected and joined server'
                        : userStatus.discordConnected
                        ? 'Discord connected, need to join server'
                        : 'Connect Discord Account'
                      }
                    </span>
                  </div>
                  {!(userStatus.discordConnected && userStatus.isJoined) && (
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                  )}
                </button>
              </div>

              {/* Twitter Connection Status */}
              <div>
                <h2 className="text-white font-medium mb-3 flex items-center gap-2">
                  Follow us on X
                  {userStatus.twitterConnected && userStatus.isFollowed && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </h2>
                <button 
                  onClick={handleTwitterConnect}
                  disabled={isLoading || (userStatus.twitterConnected && userStatus.isFollowed)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors group ${
                    userStatus.twitterConnected && userStatus.isFollowed
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-neutral-700 hover:bg-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">X</span>
                    </div>
                    <span className={`${
                      userStatus.twitterConnected && userStatus.isFollowed 
                        ? 'text-green-300' 
                        : 'text-neutral-200'
                    }`}>
                      {userStatus.twitterConnected && userStatus.isFollowed
                        ? 'Twitter connected and following'
                        : userStatus.twitterConnected
                        ? 'Twitter connected, need to follow'
                        : 'Connect X Account'
                      }
                    </span>
                  </div>
                  {!(userStatus.twitterConnected && userStatus.isFollowed) && (
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                  )}
                </button>
              </div>

              {/* Refresh Status Button */}
              <div className="pt-2">
                <Button
                  onClick={refreshUserStatus}
                  variant="outline"
                  className="w-full border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                >
                  Refresh Connection Status
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 'complete' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h2 className="text-white font-medium text-xl mb-2">Authentication Complete!</h2>
                <p className="text-neutral-300 text-sm mb-4">
                  All verification steps completed, you can now enter the application
                </p>
                <Button
                  onClick={() => router.push('/')}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 text-lg"
                >
                  Let's Vibe! 🎉
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}