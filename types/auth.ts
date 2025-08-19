export interface NonceResponse {
  nonce: string
  message: string
  expiresAt: string
}

export interface WalletVerifyRequest {
  walletAddress: string
  nonce: string
  signature: string
}

export interface User {
  id: string
  walletAddress: string
  discordConnected: boolean
  twitterConnected: boolean
  walletConnected: boolean
  isJoined: boolean
  isFollowed: boolean
  allConnected: boolean
  status: string
  discordId?: string
  discordUsername?: string
  twitterId?: string
  twitterUsername?: string
  completedAt?: string
}

export interface LoginResponse {
  verified: boolean
  walletAddress: string
  access_token: string
  user: User
}

export interface NextStep {
  platform: 'discord' | 'twitter'
  action: string
  description: string
  completed: boolean
}

export interface UserStatusResponse {
  walletAddress: string
  discordConnected: boolean
  twitterConnected: boolean
  walletConnected: boolean
  isJoined: boolean
  isFollowed: boolean
  allConnected: boolean
  completedAt: string | null
  nextSteps: NextStep[]
}

export interface OAuthUrlResponse {
  oauthUrl: string
  walletAddress: string
}

export interface DiscordCallbackResponse {
  success: boolean
  discordId: string
  username: string
  isInGuild: boolean
  walletAddress: string
  message: string
  note: string
}

export interface TwitterCallbackResponse {
  success: boolean
  twitterId: string
  username: string
  isFollowing: boolean
  walletAddress: string
  message: string
  note: string
}

export interface DiscordStatusResponse {
  connected: boolean
  username: string
  userId: string
  verified: boolean
  connectedAt: string
}

export interface AuthState {
  isLoggedIn: boolean
  walletAddress: string | null
  user: User | null
  accessToken: string | null
}

export interface UseWalletLoginReturn {
  login: () => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
  authState: AuthState
  isInitialized: boolean
}

export interface UseUserStatusReturn {
  userStatus: UserStatusResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  isInitialized: boolean
}

export interface UseOAuthReturn {
  getDiscordOAuthUrl: () => Promise<string>
  getTwitterOAuthUrl: () => Promise<string>
  connectDiscord: () => Promise<void>
  connectTwitter: () => Promise<void>
  isLoading: boolean
  error: string | null
}

// New user status query API response type
export interface NewUserStatusResponse {
  vibeUserId: string
  walletAddress: string
  status: {
    discord: {
      connected: boolean
      username: string
      userId: string
      verified: boolean
      isJoined: boolean
      connectedAt: string
    }
    twitter: {
      connected: boolean
      username: string
      userId: string
      verified: boolean
      isFollowed: boolean
      connectedAt: string
    }
    wallet: {
      connected: boolean
      walletAddress: string
      verifiedAt: string
    }
    overall: {
      allConnected: boolean
      completedAt: string | null
      canProceed: boolean
    }
  }
}