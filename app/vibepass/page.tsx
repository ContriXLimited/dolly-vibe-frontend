"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"

interface VibePassPageProps {
  onNavigateToDetails?: () => void
}

export default function VibePassPage({ onNavigateToDetails }: VibePassPageProps) {
  const [holdingFilter, setHoldingFilter] = useState("all")

  const collections = [
    {
      id: 1,
      name: "BattleOfAgents",
      subtitle: "0x1a2b...cd3e",
      vibePoints: "234,454",
      holders: "223,322",
      rank: "454",
      gradient: "from-orange-400 via-orange-500 to-red-500",
      bgGradient: "from-neutral-900 to-neutral-800",
    },
    {
      id: 2,
      name: "BattleOfAgents",
      subtitle: "0x4f5a...b6c7",
      vibePoints: "234,454",
      holders: "223,322",
      rank: "454",
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-neutral-900 to-neutral-800",
    },
    {
      id: 3,
      name: "BattleOfAgents",
      subtitle: "0x8d9e...f012",
      vibePoints: "234,454",
      holders: "223,322",
      rank: "454",
      gradient: "from-red-400 via-red-500 to-orange-500",
      bgGradient: "from-neutral-900 to-neutral-800",
    },
    {
      id: 4,
      name: "BattleOfAgents",
      subtitle: "0x3456...789a",
      vibePoints: "234,454",
      holders: "223,322",
      rank: "454",
      gradient: "from-neutral-600 via-neutral-700 to-neutral-800",
      bgGradient: "from-neutral-900 to-neutral-800",
    },
    {
      id: 5,
      name: "BattleOfAgents",
      subtitle: "0xbcde...f123",
      vibePoints: "234,454",
      holders: "223,322",
      rank: "454",
      gradient: "from-orange-400 via-orange-500 to-red-500",
      bgGradient: "from-neutral-900 to-neutral-800",
    },
    {
      id: 6,
      name: "BattleOfAgents",
      subtitle: "0x4567...890b",
      vibePoints: "234,454",
      holders: "223,322",
      rank: "454",
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-neutral-900 to-neutral-800",
    },
    {
      id: 7,
      name: "BattleOfAgents",
      subtitle: "0xcdef...2345",
      vibePoints: "234,454",
      holders: "223,322",
      rank: "454",
      gradient: "from-red-400 via-red-500 to-orange-500",
      bgGradient: "from-neutral-900 to-neutral-800",
    },
    {
      id: 8,
      name: "BattleOfAgents",
      subtitle: "0x6789...abcd",
      vibePoints: "234,454",
      holders: "223,322",
      rank: "454",
      gradient: "from-neutral-600 via-neutral-700 to-neutral-800",
      bgGradient: "from-neutral-900 to-neutral-800",
    },
  ]

  const handleCardClick = () => {
    if (onNavigateToDetails) {
      onNavigateToDetails()
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-wider">VibePass</h1>
        <div className="flex items-center gap-2">
          <Select value={holdingFilter} onValueChange={setHoldingFilter}>
            <SelectTrigger className="w-32 bg-neutral-800 border-neutral-600 text-white">
              <SelectValue placeholder="Holding" />
              <ChevronDown className="w-4 h-4 ml-2" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-600">
              <SelectItem value="all" className="text-white">
                All Holdings
              </SelectItem>
              <SelectItem value="active" className="text-white">
                Active Only
              </SelectItem>
              <SelectItem value="staked" className="text-white">
                Staked
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            className={`bg-gradient-to-br ${collection.bgGradient} border border-neutral-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden`}
            onClick={handleCardClick}
          >
            <CardContent className="p-6">
              {/* 3D Orb */}
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24">
                  {/* Main orb */}
                  <div
                    className={`w-full h-full rounded-full bg-gradient-to-br ${collection.gradient} shadow-2xl`}
                    style={{
                      boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`,
                    }}
                  >
                    {/* Highlight */}
                    <div
                      className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/30 blur-sm"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 70%)`,
                      }}
                    ></div>
                  </div>

                  {/* Reflection */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{collection.name}</h3>
                  <p className="text-sm text-neutral-400">{collection.subtitle}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-white">
                      VibePoints: <span className="font-mono">{collection.vibePoints}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-white">
                      Holders: <span className="font-mono">{collection.holders}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                    <span className="text-white">
                      Rank: <span className="font-mono">{collection.rank}</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
