"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Logo } from "@/components/logo"
import { SocialService } from '@/services/social'

function DiscordCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [userInfo, setUserInfo] = useState<{
    username: string
    isInGuild: boolean
  } | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        const callbackUrl = searchParams.get('callbackUrl')

        if (error) {
          setStatus('error')
          setMessage('User cancelled Discord authorization')
          return
        }

        if (!code || !state) {
          setStatus('error')
          setMessage('Callback parameters missing')
          return
        }

        console.log('📞 Processing Discord callback:', { code, state, callbackUrl })

        // 调用后端处理回调
        const result = await SocialService.handleDiscordCallback(code, state, callbackUrl || undefined)
        
        console.log('✅ Discord callback processing result:', result)

        if (result.success) {
          setStatus('success')
          setMessage(result.message || 'Discord connected successfully!')
          setUserInfo({
            username: result.username,
            isInGuild: result.isInGuild
          })
          
          // 3秒后跳转回登录页面
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(result.message || 'Discord connection failed')
        }
      } catch (err: any) {
        console.error('Discord callback processing failed:', err)
        setStatus('error')
        setMessage(err.response?.data?.message || 'Error occurred while processing Discord callback')
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
              Discord Authorization Result
            </h1>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          <div className="text-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 animate-spin mx-auto text-orange-500" />
                <p className="text-neutral-300">Processing Discord authorization...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h2 className="text-white font-medium text-lg mb-2">Connected successfully!</h2>
                  <p className="text-neutral-300 text-sm mb-4">{message}</p>
                  
                  {userInfo && (
                    <div className="bg-neutral-700 rounded-lg p-4 text-left">
                      <p className="text-white text-sm">
                        <span className="text-neutral-400">Username:</span> {userInfo.username}
                      </p>
                      <p className="text-white text-sm mt-1">
                        <span className="text-neutral-400">Server Status:</span>{' '}
                        <span className={userInfo.isInGuild ? 'text-green-400' : 'text-orange-400'}>
                          {userInfo.isInGuild ? 'Joined server' : 'Need to join server'}
                        </span>
                      </p>
                    </div>
                  )}
                  
                  <p className="text-neutral-400 text-xs mt-4">
                    Redirecting to login page in 3 seconds...
                  </p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                <div>
                  <h2 className="text-white font-medium text-lg mb-2">Connection failed</h2>
                  <p className="text-red-400 text-sm mb-4">{message}</p>
                  <button
                    onClick={() => router.push('/login')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Return to login page
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

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-neutral-300">Loading...</p>
      </div>
    </div>
  )
}

export default function DiscordCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DiscordCallbackContent />
    </Suspense>
  )
}