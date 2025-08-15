"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ChevronRight } from "lucide-react"
import { Logo } from "@/components/logo"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
        >
          Login
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-neutral-800/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neutral-700/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-neutral-600/10 rounded-full blur-2xl"></div>
      </div>

      {/* Dolly VIBE Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Logo />
      </div>

      {/* Login Modal */}
      <Card className="w-full max-w-md bg-neutral-800/95 border-neutral-600 backdrop-blur-sm relative z-20">
        <CardHeader className="relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center pt-2">
            <h1 className="text-xl font-semibold text-white mb-2">Log in or sign up</h1>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {/* Connect Wallet Section */}
          <div>
            <h2 className="text-white font-medium mb-3">Connect Wallet</h2>
            <WalletConnectButton />
          </div>

          {/* Join OG Discord Section */}
          <div>
            <h2 className="text-white font-medium mb-3">Join OG Discord</h2>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="text-neutral-200">Connect Discord Account</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Follow us on X Section */}
          <div>
            <h2 className="text-white font-medium mb-3">Follow us on X</h2>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">X</span>
                </div>
                <span className="text-neutral-200">Connect X Account</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Let's Vibe Button */}
          <div className="pt-4">
            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 text-lg"
              onClick={() => {
                // Handle login logic here
                console.log("Let's Vibe!")
              }}
            >
              Let's Vibe!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}