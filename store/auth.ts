import React from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useAccount, useSignMessage } from 'wagmi'
import { AuthService } from '@/services/auth'
import { SocialService } from '@/services/social'
import { UserService } from '@/services/user'
import { setToken, removeToken, getToken } from '@/lib/request'
import type { User, UserStatusResponse } from '@/types/auth'


interface AuthStore {
  // State
  walletAddress: string | null
  isWalletConnected: boolean
  isLoggedIn: boolean
  accessToken: string | null
  user: User | null
  userStatus: UserStatusResponse | null
  
  // Loading state
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  
  // Action methods
  initialize: () => Promise<void>
  login: (signMessageFn: (args: { message: string }) => Promise<string>) => Promise<void>
  logout: () => void
  updateUserStatus: (status: UserStatusResponse) => void
  refreshUserStatus: () => Promise<void>
  connectDiscord: () => Promise<void>
  connectTwitter: () => Promise<void>
  clearError: () => void
  
  // Internal methods
  _setWalletConnected: (address: string | null, connected: boolean) => void
  _setLoading: (loading: boolean) => void
  _setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      walletAddress: null,
      isWalletConnected: false,
      isLoggedIn: false,
      accessToken: null,
      user: null,
      userStatus: null,
      isInitialized: false,
      isLoading: false,
      error: null,

      // Initialize method
      initialize: async () => {
        if (typeof window === 'undefined') {
          return
        }

        try {
          // Restore state from localStorage
          const token = getToken()
          const walletAddress = localStorage.getItem('wallet_address')
          const userData = localStorage.getItem('user_data')

          if (token && walletAddress && userData) {
            const user = JSON.parse(userData)
            
            // Recalculate allConnected status
            const allConnected = user.walletConnected && 
                                user.discordConnected && user.isJoined && 
                                user.twitterConnected && user.isFollowed

            // Construct UserStatusResponse
            const userStatus: UserStatusResponse = {
              walletAddress: user.walletAddress,
              discordConnected: user.discordConnected,
              twitterConnected: user.twitterConnected,
              walletConnected: user.walletConnected,
              isJoined: user.isJoined,
              isFollowed: user.isFollowed,
              allConnected: allConnected,
              completedAt: allConnected ? user.completedAt : null,
              nextSteps: [
                {
                  platform: 'discord',
                  action: 'join_guild',
                  description: 'Join Discord Server',
                  completed: user.discordConnected && user.isJoined
                },
                {
                  platform: 'twitter',
                  action: 'follow_account',
                  description: 'Follow Twitter Account',
                  completed: user.twitterConnected && user.isFollowed
                }
              ]
            }

            set({
              walletAddress: walletAddress.toLowerCase(),
              isWalletConnected: true,
              isLoggedIn: true,
              accessToken: token,
              user,
              userStatus,
              isInitialized: true,
              error: null
            })
          } else {
            set({
              isInitialized: true
            })
          }
        } catch (err) {
          set({
            error: 'Initialization failed',
            isInitialized: true
          })
        }
      },

      // Wallet login
      login: async (signMessageFn: (args: { message: string }) => Promise<string>) => {
        const { walletAddress } = get()
        if (!walletAddress) {
          throw new Error('Wallet not connected')
        }

        set({ isLoading: true, error: null })

        try {
          // 1. Get nonce
          const nonceResponse = await AuthService.getNonce(walletAddress)
          // 2. Sign message
          const signature = await signMessageFn({
            message: nonceResponse.message
          })
          // 3. Verify signature
          const loginResponse = await AuthService.verifyWallet({
            walletAddress,
            nonce: nonceResponse.nonce,
            signature
          })
          // 4. Save login state
          setToken(loginResponse.access_token)
          localStorage.setItem('wallet_address', walletAddress)
          localStorage.setItem('user_data', JSON.stringify(loginResponse.user))

          // 5. Recalculate allConnected status
          const allConnected = loginResponse.user.walletConnected && 
                              loginResponse.user.discordConnected && loginResponse.user.isJoined && 
                              loginResponse.user.twitterConnected && loginResponse.user.isFollowed

          // 6. Construct UserStatusResponse
          const userStatus: UserStatusResponse = {
            walletAddress: loginResponse.user.walletAddress,
            discordConnected: loginResponse.user.discordConnected,
            twitterConnected: loginResponse.user.twitterConnected,
            walletConnected: loginResponse.user.walletConnected,
            isJoined: loginResponse.user.isJoined,
            isFollowed: loginResponse.user.isFollowed,
            allConnected: allConnected,
            completedAt: allConnected ? new Date().toISOString() : null,
            nextSteps: [
              {
                platform: 'discord',
                action: 'join_guild',
                description: 'Join Discord Server',
                completed: loginResponse.user.discordConnected && loginResponse.user.isJoined
              },
              {
                platform: 'twitter',
                action: 'follow_account',
                description: 'Follow Twitter Account',
                completed: loginResponse.user.twitterConnected && loginResponse.user.isFollowed
              }
            ]
          }

          set({
            isLoggedIn: true,
            accessToken: loginResponse.access_token,
            user: loginResponse.user,
            userStatus,
            isLoading: false,
            error: null
          })

        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Login failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw new Error(errorMessage)
        }
      },

      // Logout
      logout: () => {
        // Clear local storage
        removeToken()
        localStorage.removeItem('wallet_address')
        localStorage.removeItem('user_data')

        // Reset state
        set({
          walletAddress: null,
          isWalletConnected: false,
          isLoggedIn: false,
          accessToken: null,
          user: null,
          userStatus: null,
          error: null
        })
      },

      // Update user status
      updateUserStatus: (status: UserStatusResponse) => {
        // Recalculate allConnected status
        const allConnected = status.walletConnected && 
                            status.discordConnected && status.isJoined && 
                            status.twitterConnected && status.isFollowed

        const updatedStatus = {
          ...status,
          allConnected: allConnected,
          completedAt: allConnected ? status.completedAt : null
        }

        set({ userStatus: updatedStatus })

        // Update user data in localStorage
        if (get().user) {
          const updatedUser = {
            ...get().user!,
            discordConnected: updatedStatus.discordConnected,
            twitterConnected: updatedStatus.twitterConnected,
            walletConnected: updatedStatus.walletConnected,
            isJoined: updatedStatus.isJoined,
            isFollowed: updatedStatus.isFollowed,
            allConnected: updatedStatus.allConnected
          }
          localStorage.setItem('user_data', JSON.stringify(updatedUser))
          set({ user: updatedUser })
        }
      },

      // Refresh user status
      refreshUserStatus: async () => {
        const { walletAddress } = get()
        if (!walletAddress) return

        set({ isLoading: true })

        try {
          const status = await UserService.getUserStatusByWallet(walletAddress)
          get().updateUserStatus(status)
        } catch (err: any) {
          set({ error: err.response?.data?.message || 'Failed to refresh user status' })
        } finally {
          set({ isLoading: false })
        }
      },

      // Connect Discord
      connectDiscord: async () => {
        const { walletAddress } = get()
        if (!walletAddress) {
          throw new Error('Wallet address cannot be empty')
        }

        set({ isLoading: true, error: null })

        try {
          const response = await SocialService.getDiscordOAuthUrl(walletAddress)
          window.open(response.oauthUrl, '_blank')
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Failed to get Discord OAuth URL'
          set({ error: errorMessage })
          throw new Error(errorMessage)
        } finally {
          set({ isLoading: false })
        }
      },

      // Connect Twitter
      connectTwitter: async () => {
        const { walletAddress } = get()
        if (!walletAddress) {
          throw new Error('Wallet address cannot be empty')
        }

        set({ isLoading: true, error: null })

        try {
          const response = await SocialService.getTwitterOAuthUrl(walletAddress)
          window.open(response.oauthUrl, '_blank')
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Failed to get Twitter OAuth URL'
          set({ error: errorMessage })
          throw new Error(errorMessage)
        } finally {
          set({ isLoading: false })
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      },

      // Internal method: set wallet connection status
      _setWalletConnected: (address: string | null, connected: boolean) => {
        set({
          walletAddress: address ? address.toLowerCase() : null,
          isWalletConnected: connected
        })
      },

      // Internal method: set loading state
      _setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      // Internal method: set error
      _setError: (error: string | null) => {
        set({ error })
      }
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        walletAddress: state.walletAddress,
        isWalletConnected: state.isWalletConnected,
        isLoggedIn: state.isLoggedIn,
        accessToken: state.accessToken,
        user: state.user,
        userStatus: state.userStatus
      })
    }
  )
)

// Wallet connection state sync hook
export const useWalletSync = () => {
  const { address, isConnected } = useAccount()
  const { _setWalletConnected } = useAuthStore()

  // Sync wallet connection state to store
  React.useEffect(() => {
    _setWalletConnected(address || null, isConnected)
  }, [address, isConnected, _setWalletConnected])
}