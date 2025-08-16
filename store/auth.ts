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
  // 状态
  walletAddress: string | null
  isWalletConnected: boolean
  isLoggedIn: boolean
  accessToken: string | null
  user: User | null
  userStatus: UserStatusResponse | null
  
  // 加载状态
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  
  // 操作方法
  initialize: () => Promise<void>
  login: (signMessageFn: (args: { message: string }) => Promise<string>) => Promise<void>
  logout: () => void
  updateUserStatus: (status: UserStatusResponse) => void
  refreshUserStatus: () => Promise<void>
  connectDiscord: () => Promise<void>
  connectTwitter: () => Promise<void>
  clearError: () => void
  
  // 内部方法
  _setWalletConnected: (address: string | null, connected: boolean) => void
  _setLoading: (loading: boolean) => void
  _setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      walletAddress: null,
      isWalletConnected: false,
      isLoggedIn: false,
      accessToken: null,
      user: null,
      userStatus: null,
      isInitialized: false,
      isLoading: false,
      error: null,

      // 初始化方法
      initialize: async () => {
        if (typeof window === 'undefined') {
          return
        }

        try {
          // 从 localStorage 恢复状态
          const token = getToken()
          const walletAddress = localStorage.getItem('wallet_address')
          const userData = localStorage.getItem('user_data')

          if (token && walletAddress && userData) {
            const user = JSON.parse(userData)
            
            // 重新计算 allConnected 状态
            const allConnected = user.walletConnected && 
                                user.discordConnected && user.isJoined && 
                                user.twitterConnected && user.isFollowed

            // 构造 UserStatusResponse
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
                  description: '加入 Discord 服务器',
                  completed: user.discordConnected && user.isJoined
                },
                {
                  platform: 'twitter',
                  action: 'follow_account',
                  description: '关注 Twitter 账号',
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
            error: '初始化失败',
            isInitialized: true
          })
        }
      },

      // 钱包登录
      login: async (signMessageFn: (args: { message: string }) => Promise<string>) => {
        const { walletAddress } = get()
        if (!walletAddress) {
          throw new Error('钱包未连接')
        }

        set({ isLoading: true, error: null })

        try {
          // 1. 获取 nonce
          const nonceResponse = await AuthService.getNonce(walletAddress)
          // 2. 签名消息
          const signature = await signMessageFn({
            message: nonceResponse.message
          })
          // 3. 验证签名
          const loginResponse = await AuthService.verifyWallet({
            walletAddress,
            nonce: nonceResponse.nonce,
            signature
          })
          // 4. 保存登录状态
          setToken(loginResponse.access_token)
          localStorage.setItem('wallet_address', walletAddress)
          localStorage.setItem('user_data', JSON.stringify(loginResponse.user))

          // 5. 重新计算 allConnected 状态
          const allConnected = loginResponse.user.walletConnected && 
                              loginResponse.user.discordConnected && loginResponse.user.isJoined && 
                              loginResponse.user.twitterConnected && loginResponse.user.isFollowed

          // 6. 构造 UserStatusResponse
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
                description: '加入 Discord 服务器',
                completed: loginResponse.user.discordConnected && loginResponse.user.isJoined
              },
              {
                platform: 'twitter',
                action: 'follow_account',
                description: '关注 Twitter 账号',
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
          const errorMessage = err.response?.data?.message || err.message || '登录失败'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw new Error(errorMessage)
        }
      },

      // 登出
      logout: () => {
        // 清除本地存储
        removeToken()
        localStorage.removeItem('wallet_address')
        localStorage.removeItem('user_data')

        // 重置状态
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

      // 更新用户状态
      updateUserStatus: (status: UserStatusResponse) => {
        // 重新计算 allConnected 状态
        const allConnected = status.walletConnected && 
                            status.discordConnected && status.isJoined && 
                            status.twitterConnected && status.isFollowed

        const updatedStatus = {
          ...status,
          allConnected: allConnected,
          completedAt: allConnected ? status.completedAt : null
        }

        set({ userStatus: updatedStatus })

        // 同时更新 localStorage 中的用户数据
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

      // 刷新用户状态
      refreshUserStatus: async () => {
        const { walletAddress } = get()
        if (!walletAddress) return

        set({ isLoading: true })

        try {
          const status = await UserService.getUserStatusByWallet(walletAddress)
          get().updateUserStatus(status)
        } catch (err: any) {
          set({ error: err.response?.data?.message || '刷新用户状态失败' })
        } finally {
          set({ isLoading: false })
        }
      },

      // 连接 Discord
      connectDiscord: async () => {
        const { walletAddress } = get()
        if (!walletAddress) {
          throw new Error('钱包地址不能为空')
        }

        set({ isLoading: true, error: null })

        try {
          const response = await SocialService.getDiscordOAuthUrl(walletAddress)
          window.open(response.oauthUrl, '_blank')
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Discord 授权链接获取失败'
          set({ error: errorMessage })
          throw new Error(errorMessage)
        } finally {
          set({ isLoading: false })
        }
      },

      // 连接 Twitter
      connectTwitter: async () => {
        const { walletAddress } = get()
        if (!walletAddress) {
          throw new Error('钱包地址不能为空')
        }

        set({ isLoading: true, error: null })

        try {
          const response = await SocialService.getTwitterOAuthUrl(walletAddress)
          window.open(response.oauthUrl, '_blank')
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Twitter 授权链接获取失败'
          set({ error: errorMessage })
          throw new Error(errorMessage)
        } finally {
          set({ isLoading: false })
        }
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },

      // 内部方法：设置钱包连接状态
      _setWalletConnected: (address: string | null, connected: boolean) => {
        set({
          walletAddress: address ? address.toLowerCase() : null,
          isWalletConnected: connected
        })
      },

      // 内部方法：设置加载状态
      _setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      // 内部方法：设置错误
      _setError: (error: string | null) => {
        set({ error })
      }
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      // 只持久化这些字段
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

// 钱包连接状态同步 hook
export const useWalletSync = () => {
  const { address, isConnected } = useAccount()
  const { _setWalletConnected } = useAuthStore()

  // 同步钱包连接状态到 store
  React.useEffect(() => {
    _setWalletConnected(address || null, isConnected)
  }, [address, isConnected, _setWalletConnected])
}