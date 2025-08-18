"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Globe } from "lucide-react"
import Image from "next/image"

export function NetworkSwitchButton() {
  return (
    <ConnectButton.Custom>
      {({
        chain,
        openChainModal,
        mounted,
      }) => {
        if (!mounted) {
          return null
        }

        return (
          <button
            onClick={openChainModal}
            className="w-full flex items-center gap-3 p-3 rounded transition-colors text-neutral-400 hover:text-white hover:bg-neutral-800"
            title={chain?.name === '0G-Galileo-Testnet' ? 'Connected to 0G Network' : 'Switch to 0G Network'}
          >
            {chain?.name === '0G-Galileo-Testnet' ? (
              <Image
                src="/0g.png"
                alt="0G Network"
                width={20}
                height={20}
                className="rounded-sm"
              />
            ) : (
              <Globe className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {chain?.name === '0G-Galileo-Testnet' ? '0G Testnet' : (chain?.name || 'Switch to 0G Network')}
            </span>
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}