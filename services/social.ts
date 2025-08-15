import { request } from '@/lib/request'

export class SocialService {
  // 获取 Discord OAuth URL
  static async getDiscordOAuthUrl(walletAddress: string): Promise<{
    oauthUrl: string
    walletAddress: string
  }> {
    const response = await request<{
      oauthUrl: string
      walletAddress: string
    }>({
      method: 'GET',
      url: '/auth/discord/oauth-url',
      params: { walletAddress }
    })
    return response.data
  }

  // 获取 Twitter OAuth URL  
  static async getTwitterOAuthUrl(walletAddress: string): Promise<{
    oauthUrl: string
    walletAddress: string
  }> {
    const response = await request<{
      oauthUrl: string
      walletAddress: string
    }>({
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