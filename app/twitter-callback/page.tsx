"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Logo } from "@/components/logo"
import { SocialService } from '@/services/social'

export default function TwitterCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [userInfo, setUserInfo] = useState<{
    username: string
    isFollowing: boolean
  } | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const oauth_token = searchParams.get('oauth_token')
        const oauth_verifier = searchParams.get('oauth_verifier')
        const denied = searchParams.get('denied')

        if (denied) {
          setStatus('error')
          setMessage('用户取消了 Twitter 授权')
          return
        }

        if (!oauth_token || !oauth_verifier) {
          setStatus('error')
          setMessage('回调参数缺失')
          return
        }

        console.log('📞 处理 Twitter 回调:', { oauth_token, oauth_verifier })

        // 调用后端处理回调
        const result = await SocialService.handleTwitterCallback(oauth_token, oauth_verifier)
        
        console.log('✅ Twitter 回调处理结果:', result)

        if (result.success) {
          setStatus('success')
          setMessage(result.message || 'Twitter 连接成功！')
          setUserInfo({
            username: result.username,
            isFollowing: result.isFollowing
          })
          
          // 3秒后跳转回登录页面
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(result.message || 'Twitter 连接失败')
        }
      } catch (err: any) {
        console.error('Twitter 回调处理失败:', err)
        setStatus('error')
        setMessage(err.response?.data?.message || '处理 Twitter 回调时发生错误')
      }
    }

    handleCallback()
  }, [searchParams, router])

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

      {/* Callback Result */}
      <Card className="w-full max-w-md bg-neutral-800/95 border-neutral-600 backdrop-blur-sm relative z-20">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white mb-2">
              Twitter 授权结果
            </h1>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          <div className="text-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 animate-spin mx-auto text-orange-500" />
                <p className="text-neutral-300">正在处理 Twitter 授权...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h2 className="text-white font-medium text-lg mb-2">连接成功！</h2>
                  <p className="text-neutral-300 text-sm mb-4">{message}</p>
                  
                  {userInfo && (
                    <div className="bg-neutral-700 rounded-lg p-4 text-left">
                      <p className="text-white text-sm">
                        <span className="text-neutral-400">用户名:</span> @{userInfo.username}
                      </p>
                      <p className="text-white text-sm mt-1">
                        <span className="text-neutral-400">关注状态:</span>{' '}
                        <span className={userInfo.isFollowing ? 'text-green-400' : 'text-orange-400'}>
                          {userInfo.isFollowing ? '已关注账号' : '需要关注账号'}
                        </span>
                      </p>
                    </div>
                  )}
                  
                  <p className="text-neutral-400 text-xs mt-4">
                    3秒后自动跳转回登录页面...
                  </p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                <div>
                  <h2 className="text-white font-medium text-lg mb-2">连接失败</h2>
                  <p className="text-red-400 text-sm mb-4">{message}</p>
                  <button
                    onClick={() => router.push('/login')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    返回登录页面
                  </button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}