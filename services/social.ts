import { request } from '@/lib/request'

export class SocialService {
  // 获取 Discord OAuth URL
  static async getDiscordOAuthUrl(walletAddress: string): Promise<{
    oauthUrl: string
    walletAddress: string
  }> {
    console.log('🌐 API 调用: getDiscordOAuthUrl', { walletAddress, url: '/auth/discord/oauth-url' })
    
    try {
      const response = await request<{data: {
        oauthUrl: string
        walletAddress: string
      }}>({
        method: 'GET',
        url: '/auth/discord/oauth-url',
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

  // 获取 Twitter OAuth URL  
  static async getTwitterOAuthUrl(walletAddress: string): Promise<{
    oauthUrl: string
    walletAddress: string
  }> {
    console.log('🌐 API 调用: getTwitterOAuthUrl', { walletAddress, url: '/auth/twitter/oauth-url' })
    
    try {
      const response = await request<{data: {
        oauthUrl: string
        walletAddress: string
      }}>({
        method: 'GET',
        url: '/auth/twitter/oauth-url',
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
    console.log('🌐 API 调用: handleDiscordCallback', { code, state, url: '/auth/discord/callback' })
    
    try {
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
        params: { code, state }
      })
      
      console.log('📡 API 响应:', response.data)
      // 后端返回的数据包装在 data 字段中
      return response.data.data
    } catch (error: any) {
      console.error('❌ API 错误:', error.response?.data || error.message)
      throw error
    }
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
    console.log('🌐 API 调用: handleTwitterCallback', { oauth_token, oauth_verifier, url: '/auth/twitter/callback' })
    
    try {
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
        params: { oauth_token, oauth_verifier }
      })
      
      console.log('📡 API 响应:', response.data)
      // 后端返回的数据包装在 data 字段中
      return response.data.data
    } catch (error: any) {
      console.error('❌ API 错误:', error.response?.data || error.message)
      throw error
    }
  }
}