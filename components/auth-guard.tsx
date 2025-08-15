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
  
  // 使用 AuthStore
  const {
    walletAddress,
    isWalletConnected,
    isLoggedIn,
    userStatus,
    isInitialized,
    isLoading,
    error,
    initialize
  } = useAuthStore()
  
  // 同步钱包状态
  useWalletSync()
  
  const [isChecking, setIsChecking] = useState(true)
  const [hasAttemptedRedirect, setHasAttemptedRedirect] = useState(false)

  // 初始化 AuthStore
  useEffect(() => {
    if (!isInitialized) {
      console.log('🔄 AuthGuard: 初始化 AuthStore')
      initialize()
    }
  }, [isInitialized, initialize])

  useEffect(() => {
    const checkAuth = () => {
      console.log('🛡️ AuthGuard: 开始认证检查', {
        requireAuth,
        isConnected,
        isWalletConnected,
        isLoggedIn,
        walletAddress,
        isInitialized,
        isLoading,
        error,
        hasAttemptedRedirect,
        userStatus: userStatus ? {
          allConnected: userStatus.allConnected,
          discordConnected: userStatus.discordConnected,
          twitterConnected: userStatus.twitterConnected,
          walletConnected: userStatus.walletConnected,
          isJoined: userStatus.isJoined,
          isFollowed: userStatus.isFollowed
        } : null
      })

      if (!requireAuth) {
        console.log('✅ AuthGuard: 不需要认证，直接通过')
        setIsChecking(false)
        return
      }

      // 等待初始化完成
      if (!isInitialized) {
        console.log('⏳ AuthGuard: 等待初始化完成...')
        return
      }

      // 检查钱包连接
      if (!isConnected && !isWalletConnected) {
        console.log('❌ AuthGuard: 钱包未连接，跳转登录页')
        router.push('/login')
        return
      }

      // 检查钱包登录状态
      if (!isLoggedIn) {
        console.log('❌ AuthGuard: 用户未登录，跳转登录页')
        router.push('/login')
        return
      }

      // 检查用户状态加载
      if (isLoading) {
        console.log('⏳ AuthGuard: 用户状态加载中，等待...')
        return
      }

      // 检查 API 错误 - 如果是 401 错误，让 request.ts 处理，避免重复跳转
      if (error) {
        console.log('⚠️ AuthGuard: 检测到错误', { error })
        
        // 如果是认证相关错误，跳转到登录页
        if (error.includes('401') || error.includes('未授权') || error.includes('Unauthorized')) {
          console.log('🚨 AuthGuard: 检测到认证错误，跳转登录页')
          router.push('/login')
          return
        }
      }

      // 检查是否完成所有验证
      if (!userStatus?.allConnected) {
        // 避免重复跳转
        if (hasAttemptedRedirect) {
          console.log('⏭️ AuthGuard: 已尝试跳转，避免重复')
          return
        }
        
        console.log('❌ AuthGuard: 用户未完成所有验证，跳转登录页', {
          userStatus,
          allConnected: userStatus?.allConnected
        })
        
        setHasAttemptedRedirect(true)
        router.push('/login')
        return
      }

      console.log('✅ AuthGuard: 认证通过，允许访问')
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

  // 如果不需要认证，直接显示内容
  if (!requireAuth) {
    return <>{children}</>
  }

  // 如果正在检查认证状态，显示加载页面
  if (isChecking || isLoading || !isInitialized) {
    console.log('🔄 AuthGuard: 显示加载页面', {
      isChecking,
      isLoading,
      isInitialized
    })
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-300">验证身份中...</p>
        </div>
      </div>
    )
  }

  // 认证通过，显示内容
  console.log('✅ AuthGuard: 认证通过，显示主页内容')
  return <>{children}</>
}