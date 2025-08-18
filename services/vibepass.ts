import { request } from '@/lib/request'

export interface UserVibePass {
  id: string
  vibeUserId: string
  vibeProjectId: string
  userId: string
  msgCount: number
  inviteCount: number
  score: string
  params: string // JSON string like "[0,0,0,0,0]" representing [power, speed, skill, defense, magic]
  tags: string | null
  sealedKey: string | null
  rootHash: string | null
  tokenId: string | null
  mintTxHash: string | null
  status: string
  createdAt: string
  updatedAt: string
  mintedAt: string | null
}

export interface MyVibePassesResponse {
  data: {
    message: string
    data: UserVibePass[]
  }
  message: string
  statusCode: number
  timestamp: string
}

export class VibePassService {
  // 获取用户拥有的VibePasses
  static async getMyVibePasses(): Promise<UserVibePass[]> {
    console.log('🌐 API 调用: getMyVibePasses', { url: '/vibe-passes/my' })
    
    try {
      const response = await request<MyVibePassesResponse>({
        method: 'GET',
        url: '/vibe-passes/my',
      })
      
      console.log('📡 API 响应:', response.data)
      return response.data.data.data
    } catch (error: any) {
      console.error('❌ API 错误:', error.response?.data || error.message)
      throw error
    }
  }
}