import { request } from '@/lib/request'
import type { UserStatusResponse, NewUserStatusResponse } from '@/types/auth'

export class UserService {
  // Get user status (new API)
  static async getUserStatusByWallet(walletAddress: string): Promise<UserStatusResponse> {
    console.log('🌐 API Call: getUserStatusByWallet', { walletAddress, url: '/auth/user/status-by-wallet' })
    
    try {
      const response = await request<{data: NewUserStatusResponse}>({
        method: 'GET',
        url: '/auth/user/status-by-wallet',
        params: { walletAddress }
      })
      
      console.log('📡 API Response:', response.data)
      const newFormat = response.data.data
      
      console.log('🔍 Parsed data:', {
        vibeUserId: newFormat.vibeUserId,
        walletAddress: newFormat.walletAddress,
        walletConnected: newFormat.status.wallet.connected,
        discordConnected: newFormat.status.discord.connected,
        twitterConnected: newFormat.status.twitter.connected,
        allConnected: newFormat.status.overall.allConnected,
        canProceed: newFormat.status.overall.canProceed
      })
      
      // Convert new format to existing format for compatibility
      const compatibleFormat: UserStatusResponse = {
        walletAddress: newFormat.walletAddress,
        discordConnected: newFormat.status.discord.connected,
        twitterConnected: newFormat.status.twitter.connected,
        walletConnected: newFormat.status.wallet.connected,
        isJoined: newFormat.status.discord.isJoined,
        isFollowed: newFormat.status.twitter.isFollowed,
        allConnected: newFormat.status.overall.allConnected,
        completedAt: newFormat.status.overall.completedAt,
        nextSteps: [
          {
            platform: 'discord',
            action: 'join_guild',
            description: 'Join Discord server',
            completed: newFormat.status.discord.connected && newFormat.status.discord.isJoined
          },
          {
            platform: 'twitter',
            action: 'follow_account',
            description: 'Follow Twitter account',
            completed: newFormat.status.twitter.connected && newFormat.status.twitter.isFollowed
          }
        ]
      }
      
      console.log('✅ Converted compatible format:', compatibleFormat)
      return compatibleFormat
    } catch (error: any) {
      console.error('❌ API Error:', error.response?.data || error.message)
      throw error
    }
  }
  // Check Discord connection status
  static async getDiscordStatus(discordId: string): Promise<{
    connected: boolean
    username: string
    userId: string
    verified: boolean
    connectedAt: string
  }> {
    const response = await request<{
      connected: boolean
      username: string
      userId: string
      verified: boolean
      connectedAt: string
    }>({
      method: 'GET',
      url: '/auth/discord/status',
      params: { discordId }
    })
    return response.data
  }
}