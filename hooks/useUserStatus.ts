import { useState, useEffect, useCallback } from 'react'
import { UserService } from '@/services/user'
import type { UseUserStatusReturn, UserStatusResponse } from '@/types/auth'

export function useUserStatus(walletAddress: string | null): UseUserStatusReturn {
  const [userStatus, setUserStatus] = useState<UserStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserStatus = useCallback(async () => {
    if (!walletAddress) {
      setUserStatus(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const status = await UserService.getUserStatus(walletAddress)
      setUserStatus(status)
    } catch (err: any) {
      console.error('Failed to fetch user status:', err)
      setError(err.response?.data?.message || '获取用户状态失败')
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress])

  const refetch = useCallback(async () => {
    await fetchUserStatus()
  }, [fetchUserStatus])

  useEffect(() => {
    fetchUserStatus()
  }, [fetchUserStatus])

  return {
    userStatus,
    isLoading,
    error,
    refetch
  }
}