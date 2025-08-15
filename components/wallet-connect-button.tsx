"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ChevronRight } from "lucide-react"

export function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="w-full flex items-center justify-between px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">W</span>
                      </div>
                      <span className="text-neutral-200">Connect Wallet</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="w-full flex items-center justify-between px-4 py-3 bg-red-700 hover:bg-red-600 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <span className="text-neutral-200">Wrong network</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                  </button>
                )
              }

              return (
                <div className="flex gap-2">
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 20, height: 20 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="text-neutral-200 text-sm">{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    className="flex-1 flex items-center justify-between px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                      <span className="text-neutral-200">{account.displayName}</span>
                    </div>
                    <span className="text-neutral-400 text-sm">{account.displayBalance}</span>
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}