import { request } from '@/lib/request'
import type { 
  NonceResponse, 
  WalletVerifyRequest, 
  LoginResponse 
} from '@/types/auth'

export class AuthService {
  // Get signing nonce
  static async getNonce(walletAddress: string): Promise<NonceResponse> {
    console.log('🌐 API Call: getNonce', { walletAddress, url: '/auth/wallet/nonce' })
    
    try {
      const response = await request<{data: NonceResponse}>({
        method: 'GET',
        url: '/auth/wallet/nonce',
        params: { walletAddress }
      })
      
      console.log('📡 API Response:', response.data)
      // Backend data wrapped in data field
      return response.data.data
    } catch (error: any) {
      console.error('❌ API Error:', error.response?.data || error.message)
      throw error
    }
  }

  // Verify wallet signature and login
  static async verifyWallet(data: WalletVerifyRequest): Promise<LoginResponse> {
    console.log('🌐 API Call: verifyWallet', { url: '/auth/wallet/verify', data })
    
    try {
      const response = await request<{data: LoginResponse}>({
        method: 'POST',
        url: '/auth/wallet/verify',
        data
      })
      
      console.log('📡 API Response:', response.data)
      // Backend data wrapped in data field
      return response.data.data
    } catch (error: any) {
      console.error('❌ API Error:', error.response?.data || error.message)
      throw error
    }
  }


  // Get Twitter OAuth URL  
  static async getTwitterOAuthUrl(walletAddress: string): Promise<{ oauthUrl: string; walletAddress: string }> {
    const response = await request<{ oauthUrl: string; walletAddress: string }>({
      method: 'GET',
      url: '/auth/twitter/oauth-url',
      params: { walletAddress }
    })
    return response.data
  }

  // Handle Discord OAuth callback
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
      params: { code, state, callbackUrl: `${window.location.protocol}//${window.location.host}/discord-callback` }
    })
    return response.data
  }

  // Handle Twitter OAuth callback
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