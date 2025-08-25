"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Trophy, Globe, LogOut, ChevronDown, Target, User, Building, MessageSquare } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Logo } from "@/components/logo"
import { AuthGuard } from "@/components/auth-guard"
import { NetworkSwitchButton } from "@/components/network-switch-button"
import { useAuthStore } from "@/store/auth"
import { useAppModeStore } from "@/store/app-mode"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { logout } = useAuthStore()
  const { mode, toggleMode } = useAppModeStore()

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Helper function to get active section from pathname
  const getActiveSection = () => {
    if (pathname.startsWith('/vibepass')) return 'vibepass'
    if (pathname.startsWith('/space')) return 'space'
    if (pathname.startsWith('/advertise')) return 'advertise'
    if (pathname.startsWith('/chat')) return 'chat'
    return 'vibepass' // default
  }

  // Helper function to get breadcrumb
  const getBreadcrumb = () => {
    const activeSection = getActiveSection()
    if (activeSection === 'vibepass' && pathname.includes('/vibepass/') && pathname !== '/vibepass') {
      return `DOLLY VIBE / ${activeSection.toUpperCase()} / DETAIL`
    }
    return `DOLLY VIBE / ${activeSection.toUpperCase()}`
  }

  const activeSection = getActiveSection()

  return (
    <AuthGuard>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""} flex flex-col`}
        >
          <div className="p-4 flex-1 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
                  <div className="flex items-center gap-3">
                    <Logo size="sm" />
                    <div className="flex items-center justify-center w-8 h-8 bg-neutral-800 rounded">
                      {mode === 'b2c' ? (
                        <User className="w-4 h-4 text-orange-500" />
                      ) : (
                        <Building className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <nav className="space-y-2">
                {(() => {
                  const consumerItems = [
                    { id: "vibepass", icon: Trophy, label: "VIBEPASS", href: "/vibepass" },
                    { id: "space", icon: Globe, label: "SPACE", href: "/space" },
                  ]
                  
                  const businessItems = [
                    { id: "advertise", icon: Target, label: "ADVERTISE", href: "/advertise" },
                    { id: "chat", icon: MessageSquare, label: "CHAT", href: "/chat" },
                  ]
                  
                  const menuItems = mode === 'b2b' ? businessItems : consumerItems
                  
                  return menuItems.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <button
                      className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${activeSection === item.id
                        ? "bg-orange-500 text-white"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        }`}
                    >
                      <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                      {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </button>
                  </Link>
                  ))
                })()}
              </nav>
              
              {/* Network Switch Button */}
              {!sidebarCollapsed && (
                <div className="mt-4 pt-4 border-t border-neutral-700">
                  <NetworkSwitchButton />
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <div className="mt-4 relative" ref={userMenuRef}>
                <div 
                  className="p-4 bg-neutral-800 border border-neutral-700 rounded cursor-pointer hover:bg-neutral-750 transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {(() => {
                          const { user, walletAddress } = useAuthStore()
                          if (user?.discordUsername) {
                            return user.discordUsername.slice(0, 2).toUpperCase()
                          }
                          if (user?.twitterUsername) {
                            return user.twitterUsername.slice(0, 2).toUpperCase()
                          }
                          if (walletAddress) {
                            return walletAddress.slice(2, 4).toUpperCase()
                          }
                          return 'AG'
                        })()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium truncate">
                        {(() => {
                          const { user, walletAddress } = useAuthStore()
                          if (user?.discordUsername) {
                            return user.discordUsername.replace('#0', '')
                          }
                          if (user?.twitterUsername) {
                            return `@${user.twitterUsername}`
                          }
                          if (walletAddress) {
                            return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                          }
                          return 'User'
                        })()}
                      </div>
                      <div className="text-xs text-neutral-400 truncate mt-1">
                        {(() => {
                          const { walletAddress } = useAuthStore()
                          return walletAddress 
                            ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`
                            : 'No wallet connected'
                        })()}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {/* Mode Toggle Switch */}
            {!sidebarCollapsed && (
              <div className="mt-4 pt-4 border-t border-neutral-700">
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Mode</h4>
                  <div className="flex items-center justify-center gap-3 p-3 rounded-lg">
                    <User className={`w-4 h-4 transition-colors ${mode === 'b2c' ? 'text-orange-500' : 'text-neutral-400'}`} />
                    <Switch
                      checked={mode === 'b2b'}
                      onCheckedChange={toggleMode}
                      className="data-[state=checked]:bg-orange-500"
                    />
                    <Building className={`w-4 h-4 transition-colors ${mode === 'b2b' ? 'text-orange-500' : 'text-neutral-400'}`} />
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-neutral-400">
                      {mode === 'b2c' ? 'Consumer Mode' : 'Business Mode'}
                    </span>
                  </div>
                </div>
              </div>
            )}
                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-neutral-800 border border-neutral-700 rounded shadow-lg">
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-neutral-700 transition-colors text-red-400 hover:text-red-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Overlay */}
        {!sidebarCollapsed && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
        )}

        {/* Main Content */}
        <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
          {/* Top Toolbar */}
          <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="text-sm text-neutral-400">
                {getBreadcrumb()}
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}