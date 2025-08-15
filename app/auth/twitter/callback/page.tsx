"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { SocialService } from '@/services/social'
import { Logo } from '@/components/logo'

export default function TwitterCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<{
    username?: string
    isFollowing?: boolean
    walletAddress?: string
  }>({})

  useEffect(() => {
    const handleCallback = async () => {
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
        setMessage('Twitter 授权参数错误')
        return
      }

      try {
        const result = await SocialService.handleTwitterCallback(oauth_token, oauth_verifier)
        
        if (result.success) {
          setStatus('success')
          setMessage(result.message)
          setDetails({
            username: result.username,
            isFollowing: result.isFollowing,
            walletAddress: result.walletAddress
          })

          // 3秒后关闭窗口
          setTimeout(() => {
            window.close()
          }, 3000)
        } else {
          setStatus('error')
          setMessage('Twitter 连接失败')
        }
      } catch (err: any) {
        console.error('Twitter callback error:', err)
        setStatus('error')
        setMessage(err.response?.data?.message || 'Twitter 连接过程中发生错误')
      }
    }

    handleCallback()
  }, [searchParams])

  const handleClose = () => {
    window.close()
  }

  const handleRetry = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-neutral-800/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neutral-700/20 rounded-full blur-3xl"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Logo />
      </div>

      {/* Callback Result */}
      <Card className="w-full max-w-md bg-neutral-800/95 border-neutral-600 backdrop-blur-sm relative z-20">
        <CardHeader className="text-center">
          <h1 className="text-xl font-semibold text-white mb-2">Twitter 授权</h1>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
              <p className="text-neutral-300">正在处理 Twitter 授权...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div className="space-y-2">
                <p className="text-green-400 font-medium">Twitter 连接成功！</p>
                <p className="text-neutral-300 text-sm">{message}</p>
                
                {details.username && (
                  <div className="bg-neutral-700/50 rounded-lg p-3 space-y-2">
                    <p className="text-neutral-200 text-sm">
                      <span className="text-neutral-400">用户名: </span>
                      @{details.username}
                    </p>
                    <p className="text-neutral-200 text-sm">
                      <span className="text-neutral-400">关注状态: </span>
                      <span className={details.isFollowing ? 'text-green-400' : 'text-orange-400'}>
                        {details.isFollowing ? '已关注官方账号' : '需要关注官方账号'}
                      </span>
                    </p>
                  </div>
                )}
                
                <p className="text-neutral-400 text-xs">窗口将在 3 秒后自动关闭</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <XCircle className="w-12 h-12 text-red-500 mx-auto" />
              <div className="space-y-2">
                <p className="text-red-400 font-medium">Twitter 连接失败</p>
                <p className="text-neutral-300 text-sm">{message}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleRetry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  重新尝试
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                >
                  关闭
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}