import { useState, useCallback } from 'react'
import { SocialService } from '@/services/social'
import type { UseOAuthReturn } from '@/types/auth'

export function useOAuth(walletAddress: string | null): UseOAuthReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getDiscordOAuthUrl = useCallback(async (): Promise<string> => {
    if (!walletAddress) {
      throw new Error('钱包地址不能为空')
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await SocialService.getDiscordOAuthUrl(walletAddress)
      return response.oauthUrl
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Discord 授权链接获取失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress])

  const getTwitterOAuthUrl = useCallback(async (): Promise<string> => {
    if (!walletAddress) {
      throw new Error('钱包地址不能为空')
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await SocialService.getTwitterOAuthUrl(walletAddress)
      return response.oauthUrl
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Twitter 授权链接获取失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress])

  const connectDiscord = useCallback(async () => {
    try {
      const oauthUrl = await getDiscordOAuthUrl()
      // 在新窗口中打开 OAuth 页面
      window.open(oauthUrl, '_blank', 'width=500,height=600')
    } catch (err) {
      console.error('Discord OAuth failed:', err)
    }
  }, [getDiscordOAuthUrl])

  const connectTwitter = useCallback(async () => {
    try {
      const oauthUrl = await getTwitterOAuthUrl()
      // 在新窗口中打开 OAuth 页面
      window.open(oauthUrl, '_blank', 'width=500,height=600')
    } catch (err) {
      console.error('Twitter OAuth failed:', err)
    }
  }, [getTwitterOAuthUrl])

  return {
    getDiscordOAuthUrl,
    getTwitterOAuthUrl,
    connectDiscord,
    connectTwitter,
    isLoading,
    error
  }
}