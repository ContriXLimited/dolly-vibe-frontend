"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { SocialService } from '@/services/social'
import { Logo } from '@/components/logo'

function TwitterCallbackContent() {
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
      const callbackUrl = searchParams.get('callbackUrl')

      if (denied) {
        setStatus('error')
        setMessage('User cancelled Twitter authorization')
        return
      }

      if (!oauth_token || !oauth_verifier) {
        setStatus('error')
        setMessage('Twitter authorization parameters are invalid')
        return
      }

      try {
        const result = await SocialService.handleTwitterCallback(oauth_token, oauth_verifier, callbackUrl || undefined)

        if (result.success) {
          setStatus('success')
          setMessage(result.message)
          setDetails({
            username: result.username,
            isFollowing: result.isFollowing,
            walletAddress: result.walletAddress
          })

          setTimeout(() => {
            window.close()
          }, 3000)
        } else {
          setStatus('error')
          setMessage('Twitter connection failed')
        }
      } catch (err: any) {
        console.error('Twitter callback error:', err)
        setStatus('error')
        setMessage(err.response?.data?.message || 'Error occurred during Twitter connection')
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
          <h1 className="text-xl font-semibold text-white mb-2">Twitter Authorization</h1>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
              <p className="text-neutral-300">Processing Twitter authorization...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div className="space-y-2">
                <p className="text-green-400 font-medium">Twitter connected successfully!</p>
                <p className="text-neutral-300 text-sm">{message}</p>

                {details.username && (
                  <div className="bg-neutral-700/50 rounded-lg p-3 space-y-2">
                    <p className="text-neutral-200 text-sm">
                      <span className="text-neutral-400">Username: </span>
                      @{details.username}
                    </p>
                    <p className="text-neutral-200 text-sm">
                      <span className="text-neutral-400">Follow Status: </span>
                      <span className={details.isFollowing ? 'text-green-400' : 'text-orange-400'}>
                        {details.isFollowing ? 'Following official account' : 'Need to follow official account'}
                      </span>
                    </p>
                  </div>
                )}

                <p className="text-neutral-400 text-xs">Window will close automatically in 3 seconds</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <XCircle className="w-12 h-12 text-red-500 mx-auto" />
              <div className="space-y-2">
                <p className="text-red-400 font-medium">Twitter connection failed</p>
                <p className="text-neutral-300 text-sm">{message}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleRetry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Retry
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
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

export default function TwitterCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TwitterCallbackContent />
    </Suspense>
  )
}