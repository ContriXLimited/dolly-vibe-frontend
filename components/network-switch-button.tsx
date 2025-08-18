"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Globe } from "lucide-react"

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
            title="Switch to 0G Network"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">
              {chain?.name || 'Switch Network'}
            </span>
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}