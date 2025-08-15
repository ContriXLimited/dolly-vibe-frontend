import { useState, useEffect, useCallback } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { signMessage, getAccount } from '@wagmi/core'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'
import { AuthService } from '@/services/auth'
import { setToken, removeToken, getToken } from '@/lib/request'
import type { UseWalletLoginReturn, AuthState } from '@/types/auth'

// 获取 wagmi config (与 web3-provider.tsx 中的保持一致)
const config = getDefaultConfig({
  appName: 'Dolly Vibe',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'c8fa2969f26b7ce7f9d1e9c10bb3de80',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
})

export function useWalletLogin(): UseWalletLoginReturn {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    walletAddress: null,
    user: null,
    accessToken: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 页面加载时恢复认证状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getToken()
      const walletAddress = localStorage.getItem('wallet_address')
      const userData = localStorage.getItem('user_data')
      
      console.log('🔄 useWalletLogin: 恢复认证状态', {
        hasToken: !!token,
        walletAddress,
        hasUserData: !!userData
      })
      
      if (token && walletAddress && userData) {
        console.log('✅ useWalletLogin: 从本地存储恢复登录状态')
        setAuthState({
          isLoggedIn: true,
          walletAddress,
          user: JSON.parse(userData),
          accessToken: token
        })
      } else {
        console.log('❌ useWalletLogin: 没有有效的本地认证状态')
      }
    }
  }, [])

  // 监听钱包连接变化
  useEffect(() => {
    console.log('👛 useWalletLogin: 钱包状态变化', {
      isConnected,
      address,
      currentWalletAddress: authState.walletAddress,
      isLoggedIn: authState.isLoggedIn
    })

    if (!isConnected || !address) {
      // 钱包断开连接时清除状态
      if (authState.isLoggedIn) {
        console.log('🔓 useWalletLogin: 钱包断开连接，清除登录状态')
        logout()
      }
    } else if (address !== authState.walletAddress && authState.isLoggedIn) {
      // 钱包地址变化时重新登录
      console.log('🔄 useWalletLogin: 钱包地址变化，重新登录')
      logout()
    }
  }, [isConnected, address, authState.walletAddress, authState.isLoggedIn])

  const login = useCallback(async () => {
    console.log('🎯 Login attempt:', {
      isConnected,
      address
    })

    if (!address) {
      setError('请先连接钱包')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 检查连接状态
      const account = getAccount(config)
      console.log('🔍 当前账户状态:', account)
      
      if (!account.isConnected) {
        console.log('🔌 钱包未连接，尝试重新连接...')
        // 尝试使用第一个可用的连接器（通常是 MetaMask）
        const injectedConnector = connectors.find(c => c.id === 'injected' || c.name.toLowerCase().includes('metamask'))
        if (injectedConnector) {
          connect({ connector: injectedConnector })
          // 等待连接完成
          await new Promise(resolve => setTimeout(resolve, 1000))
        } else {
          throw new Error('未找到钱包连接器')
        }
      }

      // 1. 获取 nonce
      console.log('📝 获取签名 nonce...')
      const nonceResponse = await AuthService.getNonce(address)
      console.log('✅ Nonce 获取成功:', nonceResponse)
      console.log('🔍 Nonce 字段检查:', {
        hasNonce: !!nonceResponse.nonce,
        hasMessage: !!nonceResponse.message,
        nonceValue: nonceResponse.nonce,
        messageValue: nonceResponse.message
      })
      
      // 2. 请求用户签名
      console.log('✍️ 请求用户签名...')
      const signature = await signMessage(config, {
        message: nonceResponse.message,
        account: address
      })
      console.log('✅ 签名成功:', signature.slice(0, 10) + '...')

      // 3. 验证签名并获取 JWT token
      console.log('🔐 验证签名...')
      const loginResponse = await AuthService.verifyWallet({
        walletAddress: address,
        nonce: nonceResponse.nonce,
        signature
      })
      console.log('✅ 验证成功:', loginResponse)

      if (loginResponse.verified) {
        // 4. 保存认证状态
        setToken(loginResponse.access_token)
        if (typeof window !== 'undefined') {
          localStorage.setItem('wallet_address', loginResponse.walletAddress)
          localStorage.setItem('user_data', JSON.stringify(loginResponse.user))
        }

        setAuthState({
          isLoggedIn: true,
          walletAddress: loginResponse.walletAddress,
          user: loginResponse.user,
          accessToken: loginResponse.access_token
        })
      } else {
        throw new Error('钱包验证失败')
      }
    } catch (err: any) {
      console.error('Wallet login failed:', err)
      
      // 处理不同类型的错误
      if (err.code === 4001) {
        setError('用户取消了签名')
      } else if (err.code === -32002) {
        setError('请检查您的钱包，可能有待处理的请求')
      } else {
        setError(err.response?.data?.message || err.message || '登录失败，请重试')
      }
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, address, connect, connectors])

  const logout = useCallback(() => {
    removeToken()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wallet_address')
      localStorage.removeItem('user_data')
    }
    setAuthState({
      isLoggedIn: false,
      walletAddress: null,
      user: null,
      accessToken: null
    })
    setError(null)
  }, [])

  return {
    login,
    logout,
    isLoading,
    error,
    authState
  }
}