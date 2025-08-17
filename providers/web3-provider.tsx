"use client"

import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'

// 0G Galileo Testnet configuration
const zeroGGalileoTestnet = {
  id: 16601,
  name: '0G-Galileo-Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OG',
    symbol: 'OG',
  },
  rpcUrls: {
    default: {
      http: ['https://evmrpc-testnet.0g.ai/'],
    },
    public: {
      http: ['https://evmrpc-testnet.0g.ai/'],
    },
  },
  blockExplorers: {
    default: {
      name: '0G Chain Explorer',
      url: 'https://chainscan-galileo.0g.ai/',
    },
  },
  testnet: true,
}
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css'

const config = getDefaultConfig({
  appName: 'Dolly Vibe',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '1f449d25c01a7ece08ce2ffeeaaac6c8', // 临时使用默认项目ID
  chains: [zeroGGalileoTestnet],
  ssr: true,
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#ea580c', // Orange-600 to match the existing theme
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}