import { request } from '@/lib/request'
import type { UserStatusResponse } from '@/types/auth'

export class UserService {
  // 获取用户状态
  static async getUserStatus(walletAddress: string): Promise<UserStatusResponse> {
    const response = await request<UserStatusResponse>({
      method: 'GET',
      url: '/social/user-status',
      params: { walletAddress }
    })
    return response.data
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