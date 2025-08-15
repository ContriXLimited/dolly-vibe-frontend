import { request } from '@/lib/request'
import type { UserStatusResponse, NewUserStatusResponse } from '@/types/auth'

export class UserService {
  // 获取用户状态（新API）
  static async getUserStatusByWallet(walletAddress: string): Promise<UserStatusResponse> {
    console.log('🌐 API 调用: getUserStatusByWallet', { walletAddress, url: '/auth/user/status-by-wallet' })
    
    try {
      const response = await request<{data: NewUserStatusResponse}>({
        method: 'GET',
        url: '/auth/user/status-by-wallet',
        params: { walletAddress }
      })
      
      console.log('📡 API 响应:', response.data)
      const newFormat = response.data.data
      
      console.log('🔍 解析后的数据:', {
        vibeUserId: newFormat.vibeUserId,
        walletAddress: newFormat.walletAddress,
        walletConnected: newFormat.status.wallet.connected,
        discordConnected: newFormat.status.discord.connected,
        twitterConnected: newFormat.status.twitter.connected,
        allConnected: newFormat.status.overall.allConnected,
        canProceed: newFormat.status.overall.canProceed
      })
      
      // 将新格式转换为现有格式以保持兼容性
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
            description: '加入 Discord 服务器',
            completed: newFormat.status.discord.connected && newFormat.status.discord.isJoined
          },
          {
            platform: 'twitter',
            action: 'follow_account',
            description: '关注 Twitter 账号',
            completed: newFormat.status.twitter.connected && newFormat.status.twitter.isFollowed
          }
        ]
      }
      
      console.log('✅ 转换后的兼容格式:', compatibleFormat)
      return compatibleFormat
    } catch (error: any) {
      console.error('❌ API 错误:', error.response?.data || error.message)
      throw error
    }
  }
  // 检查 Discord 连接状态
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