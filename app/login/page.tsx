"use client"

import { useState, useEffect } from "react"
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ChevronRight, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Logo } from "@/components/logo"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useAuthStore, useWalletSync } from '@/store/auth'

export default function LoginPage() {
  const { isConnected, address } = useAccount()
  const router = useRouter()
  
  // 使用 AuthStore
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
  
  // 同步钱包状态
  useWalletSync()
  
  const [isOpen, setIsOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState<'wallet' | 'verify' | 'social' | 'complete'>('wallet')
  const [isInitialized, setIsInitialized] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  // 初始化 AuthStore
  useEffect(() => {
    console.log('🔧 Login Page: 初始化 AuthStore')
    initialize()
    
    const timer = setTimeout(() => {
      console.log('✅ Login Page: 初始化完成')
      setIsInitialized(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [initialize])

  // 监听钱包连接状态变化
  useEffect(() => {
    if (!isInitialized) {
      console.log('⏳ Login Page: 等待初始化完成...')
      return
    }
    
    console.log('🔍 Login Page: 检查钱包状态', {
      isConnected,
      address,
      isWalletConnected,
      walletAddress,
      isLoggedIn,
      currentStep
    })
    
    // 使用 address 存在作为更可靠的连接指标
    const hasWalletConnected = isConnected || isWalletConnected || !!address
    
    if (hasWalletConnected && !isLoggedIn) {
      console.log('🔄 Login Page: 钱包已连接但未登录，跳转到验证步骤')
      setCurrentStep('verify')
    } else if (!hasWalletConnected && !isLoggedIn) {
      console.log('🔄 Login Page: 钱包未连接，显示连接步骤')
      setCurrentStep('wallet')
    }
  }, [isInitialized, isConnected, address, isWalletConnected, walletAddress, isLoggedIn, currentStep])

  // 监听登录状态变化
  useEffect(() => {
    console.log('👤 Login Page: 登录状态变化', {
      isLoggedIn,
      userStatus: userStatus ? {
        allConnected: userStatus.allConnected,
        discordConnected: userStatus.discordConnected,
        twitterConnected: userStatus.twitterConnected,
        isJoined: userStatus.isJoined,
        isFollowed: userStatus.isFollowed
      } : null
    })

    if (isLoggedIn && userStatus) {
      if (userStatus.allConnected) {
        console.log('🎉 Login Page: 所有验证完成，显示完成页面')
        setCurrentStep('complete')
      } else {
        console.log('🔗 Login Page: 需要完成社交平台连接')
        setCurrentStep('social')
      }
    }
  }, [isLoggedIn, userStatus])

  // 处理钱包签名验证
  const handleWalletLogin = async () => {
    clearError()
    try {
      await login()
    } catch (err) {
      console.error('Wallet login failed:', err)
    }
  }

  // 处理 Discord 连接
  const handleDiscordConnect = async () => {
    clearError()
    try {
      await connectDiscord()
      // 等待用户在新窗口完成授权后刷新状态
      setTimeout(() => {
        refreshUserStatus()
      }, 5000)
    } catch (err) {
      console.error('Discord connect failed:', err)
    }
  }

  // 处理 Twitter 连接
  const handleTwitterConnect = async () => {
    clearError()
    
    // 如果已经连接但未关注，直接跳转到 Twitter 页面
    if (userStatus?.twitterConnected && !userStatus.isFollowed) {
      window.open('https://x.com/0G_labs', '_blank')
      // 5秒后刷新状态检查是否已关注
      setTimeout(() => {
        refreshUserStatus()
      }, 5000)
      return
    }
    
    // 如果未连接，则进行 OAuth 授权
    try {
      await connectTwitter()
      // 等待用户在新窗口完成授权后刷新状态
      setTimeout(() => {
        refreshUserStatus()
      }, 5000)
    } catch (err) {
      console.error('Twitter connect failed:', err)
    }
  }

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
        >
          Login
        </Button>
      </div>
    )
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
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
          {/* 步骤1: 钱包连接 */}
          {currentStep === 'wallet' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-neutral-300 text-sm">第 1 步：连接您的钱包</p>
              </div>
              <div>
                <h2 className="text-white font-medium mb-3">Connect Wallet</h2>
                <WalletConnectButton />
              </div>
            </div>
          )}

          {/* 步骤2: 钱包签名验证 */}
          {currentStep === 'verify' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-neutral-300 text-sm">第 2 步：验证钱包身份</p>
                <p className="text-neutral-500 text-xs mt-1">
                  钱包地址: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '未连接'}
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
              
              <div className="text-center">
                <Button
                  onClick={handleWalletLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 text-lg"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />验证中...</>
                  ) : (
                    '签名验证钱包'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* 步骤3: 社交平台连接 */}
          {currentStep === 'social' && userStatus && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-neutral-300 text-sm">第 3 步：连接社交平台</p>
                <p className="text-neutral-400 text-xs mt-1">
                  完成度: {userStatus.nextSteps.filter(step => step.completed).length}/{userStatus.nextSteps.length}
                </p>
              </div>

              {isLoading && (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500" />
                  <p className="text-neutral-400 text-sm mt-2">检查连接状态...</p>
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

              {/* Discord 连接状态 */}
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
                        ? 'Discord 已连接并加入服务器'
                        : userStatus.discordConnected
                        ? 'Discord 已连接，需加入服务器'
                        : 'Connect Discord Account'
                      }
                    </span>
                  </div>
                  {!(userStatus.discordConnected && userStatus.isJoined) && (
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                  )}
                </button>
              </div>

              {/* Twitter 连接状态 */}
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
                        ? 'Twitter 已连接并关注账号'
                        : userStatus.twitterConnected
                        ? 'Twitter 已连接，需关注账号'
                        : 'Connect X Account'
                      }
                    </span>
                  </div>
                  {!(userStatus.twitterConnected && userStatus.isFollowed) && (
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                  )}
                </button>
              </div>

              {/* 刷新状态按钮 */}
              <div className="pt-2">
                <Button
                  onClick={refreshUserStatus}
                  variant="outline"
                  className="w-full border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                >
                  刷新连接状态
                </Button>
              </div>
            </div>
          )}

          {/* 步骤4: 完成 */}
          {currentStep === 'complete' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h2 className="text-white font-medium text-xl mb-2">认证完成！</h2>
                <p className="text-neutral-300 text-sm mb-4">
                  所有验证步骤已完成，现在可以进入应用主页了
                </p>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 mb-4">
                  <p className="text-white font-semibold text-lg">Let's Vibe! 🎉</p>
                </div>
                <Button
                  onClick={() => router.push('/')}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 text-lg"
                >
                  进入主页
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}