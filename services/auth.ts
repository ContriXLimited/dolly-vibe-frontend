import { request } from '@/lib/request'
import type { 
  NonceResponse, 
  WalletVerifyRequest, 
  LoginResponse 
} from '@/types/auth'

export class AuthService {
  // 获取签名 nonce
  static async getNonce(walletAddress: string): Promise<NonceResponse> {
    console.log('🌐 API 调用: getNonce', { walletAddress, url: '/auth/wallet/nonce' })
    
    try {
      const response = await request<{data: NonceResponse}>({
        method: 'GET',
        url: '/auth/wallet/nonce',
        params: { walletAddress }
      })
      
      console.log('📡 API 响应:', response.data)
      // 后端返回的数据包装在 data 字段中
      return response.data.data
    } catch (error: any) {
      console.error('❌ API 错误:', error.response?.data || error.message)
      throw error
    }
  }

  // 验证钱包签名并登录
  static async verifyWallet(data: WalletVerifyRequest): Promise<LoginResponse> {
    console.log('🌐 API 调用: verifyWallet', { url: '/auth/wallet/verify', data })
    
    try {
      const response = await request<{data: LoginResponse}>({
        method: 'POST',
        url: '/auth/wallet/verify',
        data
      })
      
      console.log('📡 API 响应:', response.data)
      // 后端返回的数据包装在 data 字段中
      return response.data.data
    } catch (error: any) {
      console.error('❌ API 错误:', error.response?.data || error.message)
      throw error
    }
  }

  // 获取 Discord OAuth URL
  static async getDiscordOAuthUrl(walletAddress: string): Promise<{ oauthUrl: string; walletAddress: string }> {
    const response = await request<{ oauthUrl: string; walletAddress: string }>({
      method: 'GET',
      url: '/auth/discord/oauth-url',
      params: { walletAddress }
    })
    return response.data
  }

  // 获取 Twitter OAuth URL  
  static async getTwitterOAuthUrl(walletAddress: string): Promise<{ oauthUrl: string; walletAddress: string }> {
    const response = await request<{ oauthUrl: string; walletAddress: string }>({
      method: 'GET',
      url: '/auth/twitter/oauth-url',
      params: { walletAddress }
    })
    return response.data
  }

  // 处理 Discord OAuth 回调
  static async handleDiscordCallback(code: string, state: string): Promise<{
    success: boolean
    discordId: string
    username: string
    isInGuild: boolean
    walletAddress: string
    message: string
    note: string
  }> {
    const response = await request<{
      success: boolean
      discordId: string
      username: string
      isInGuild: boolean
      walletAddress: string
      message: string
      note: string
    }>({
      method: 'GET',
      url: '/auth/discord/callback',
      params: { code, state }
    })
    return response.data
  }

  // 处理 Twitter OAuth 回调
  static async handleTwitterCallback(oauth_token: string, oauth_verifier: string): Promise<{
    success: boolean
    twitterId: string
    username: string
    isFollowing: boolean
    walletAddress: string
    message: string
    note: string
  }> {
    const response = await request<{
      success: boolean
      twitterId: string
      username: string
      isFollowing: boolean
      walletAddress: string
      message: string
      note: string
    }>({
      method: 'GET',
      url: '/auth/twitter/callback',
      params: { oauth_token, oauth_verifier }
    })
    return response.data
  }
}