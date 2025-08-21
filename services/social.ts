import { request } from '@/lib/request'

export class SocialService {
  // Get Discord OAuth URL
  static async getDiscordOAuthUrl(walletAddress: string, callbackUrl: string): Promise<{
    oauthUrl: string
    walletAddress: string
  }> {
    console.log('🌐 API Call: getDiscordOAuthUrl', { walletAddress, callbackUrl, url: '/auth/discord/oauth-url' })
    
    try {
      const response = await request<{data: {
        oauthUrl: string
        walletAddress: string
      }}>({
        method: 'GET',
        url: '/auth/discord/oauth-url',
        params: { walletAddress, callbackUrl }
      })
      
      console.log('📡 API Response:', response.data)
      // Backend response wrapped in data field
      return response.data.data
    } catch (error: any) {
      console.error('❌ API Error:', error.response?.data || error.message)
      throw error
    }
  }

  // Get Twitter OAuth URL  
  static async getTwitterOAuthUrl(walletAddress: string): Promise<{
    oauthUrl: string
    walletAddress: string
  }> {
    console.log('🌐 API Call: getTwitterOAuthUrl', { walletAddress, url: '/auth/twitter/oauth-url' })
    
    try {
      const response = await request<{data: {
        oauthUrl: string
        walletAddress: string
      }}>({
        method: 'GET',
        url: '/auth/twitter/oauth-url',
        params: { walletAddress }
      })
      
      console.log('📡 API Response:', response.data)
      // Backend response wrapped in data field
      return response.data.data
    } catch (error: any) {
      console.error('❌ API Error:', error.response?.data || error.message)
      throw error
    }
  }

  // Handle Discord OAuth callback
  static async handleDiscordCallback(code: string, state: string, callbackUrl?: string): Promise<{
    success: boolean
    discordId: string
    username: string
    isInGuild: boolean
    walletAddress: string
    message: string
    note: string
  }> {
    console.log('🌐 API Call: handleDiscordCallback', { code, state, callbackUrl, url: '/auth/discord/callback' })
    
    try {
      const params: any = { code, state }

      params.callbackUrl = `${window.location.protocol}//${window.location.host}/discord-callback`
      
      const response = await request<{data: {
        success: boolean
        discordId: string
        username: string
        isInGuild: boolean
        walletAddress: string
        message: string
        note: string
      }}>({
        method: 'GET',
        url: '/auth/discord/callback',
        params
      })
      
      console.log('📡 API Response:', response.data)
      // Backend response wrapped in data field
      return response.data.data
    } catch (error: any) {
      console.error('❌ API Error:', error.response?.data || error.message)
      throw error
    }
  }

  // Handle Twitter OAuth callback
  static async handleTwitterCallback(oauth_token: string, oauth_verifier: string, callbackUrl?: string): Promise<{
    success: boolean
    twitterId: string
    username: string
    isFollowing: boolean
    walletAddress: string
    message: string
    note: string
  }> {
    console.log('🌐 API Call: handleTwitterCallback', { oauth_token, oauth_verifier, callbackUrl, url: '/auth/twitter/callback' })
    
    try {
      const params: any = { oauth_token, oauth_verifier }
      if (callbackUrl) {
        params.callbackUrl = callbackUrl
      }
      
      const response = await request<{data: {
        success: boolean
        twitterId: string
        username: string
        isFollowing: boolean
        walletAddress: string
        message: string
        note: string
      }}>({
        method: 'GET',
        url: '/auth/twitter/callback',
        params
      })
      
      console.log('📡 API Response:', response.data)
      // Backend response wrapped in data field
      return response.data.data
    } catch (error: any) {
      console.error('❌ API Error:', error.response?.data || error.message)
      throw error
    }
  }
}