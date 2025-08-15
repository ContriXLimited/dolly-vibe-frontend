"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight, Monitor, Settings, Shield, Target, Users, Trophy, Globe, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { AuthGuard } from "@/components/auth-guard"
import { useAuthStore } from "@/store/auth"
import CommandCenterPage from "./command-center/page"
import AgentNetworkPage from "./agent-network/page"
import OperationsPage from "./operations/page"
import IntelligencePage from "./intelligence/page"
import SystemsPage from "./systems/page"
import VibePassPage from "./vibepass/page"
import VibePassDetailsPage from "./vibepass-details/page"
import SpacePage from "./space/page"

export default function TacticalDashboard() {
  const [activeSection, setActiveSection] = useState("vibepass")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [vibepassView, setVibepassView] = useState("collections") // "collections" or "details"
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { logout } = useAuthStore()

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

  const handleVibePassClick = () => {
    setActiveSection("vibepass")
    setVibepassView("collections") // Always start with collections view
  }

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
                <Logo size="sm" className="mb-2" />
                {/* <p className="text-neutral-500 text-xs ml-9">v2.1.7 COMMUNITY</p> */}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-neutral-400 hover:text-orange-500"
              >
                <ChevronRight
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
                />
              </Button>
            </div>

            <nav className="space-y-2">
              {[
                /* { id: "overview", icon: Monitor, label: "COMMAND CENTER", onClick: () => setActiveSection("overview") },
                { id: "agents", icon: Users, label: "AGENT NETWORK", onClick: () => setActiveSection("agents") },
                { id: "operations", icon: Target, label: "OPERATIONS", onClick: () => setActiveSection("operations") },
                {
                  id: "intelligence",
                  icon: Shield,
                  label: "INTELLIGENCE",
                  onClick: () => setActiveSection("intelligence"),
                }, */
                { id: "vibepass", icon: Trophy, label: "VIBEPASS", onClick: handleVibePassClick },
                /* { id: "systems", icon: Settings, label: "SYSTEMS", onClick: () => setActiveSection("systems") }, */
                { id: "space", icon: Globe, label: "SPACE", onClick: () => setActiveSection("space") },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                >
                  <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              ))}
            </nav>
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
              DOLLY VIBE / <span className="text-orange-500">{activeSection.toUpperCase()}</span>
              {activeSection === "vibepass" && vibepassView === "details" && (
                <span>
                  {" "}
                  / <span className="text-orange-500">DETAIL</span>
                </span>
              )}
            </div>
          </div>
          {/* <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-500">LAST UPDATE: 05/06/2025 20:00 UTC</div>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div> */}
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          {/* {activeSection === "overview" && <CommandCenterPage />}
          {activeSection === "agents" && <AgentNetworkPage />}
          {activeSection === "operations" && <OperationsPage />}
          {activeSection === "intelligence" && <IntelligencePage />} */}
          {activeSection === "vibepass" && vibepassView === "collections" && (
            <VibePassPage onNavigateToDetails={() => setVibepassView("details")} />
          )}
          {activeSection === "vibepass" && vibepassView === "details" && <VibePassDetailsPage />}
          {/* {activeSection === "systems" && <SystemsPage />} */}
          {activeSection === "space" && <SpacePage />}
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
