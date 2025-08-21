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



}