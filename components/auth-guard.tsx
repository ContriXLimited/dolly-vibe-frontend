"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useWalletLogin } from '@/hooks/useWalletLogin'
import { useUserStatus } from '@/hooks/useUserStatus'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { authState } = useWalletLogin()
  const { userStatus, isLoading } = useUserStatus(authState.walletAddress)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (!requireAuth) {
        setIsChecking(false)
        return
      }

      // 检查钱包连接
      if (!isConnected) {
        router.push('/login')
        return
      }

      // 检查钱包登录状态
      if (!authState.isLoggedIn) {
        router.push('/login')
        return
      }

      // 检查用户状态加载
      if (isLoading) {
        return
      }

      // 检查是否完成所有验证
      if (!userStatus?.allConnected) {
        router.push('/login')
        return
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [isConnected, authState.isLoggedIn, userStatus, isLoading, requireAuth, router])

  // 如果不需要认证，直接显示内容
  if (!requireAuth) {
    return <>{children}</>
  }

  // 如果正在检查认证状态，显示加载页面
  if (isChecking || isLoading) {
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
  return <>{children}</>
}