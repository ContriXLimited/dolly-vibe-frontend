"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import Image from "next/image"

interface VibePassPageProps {
  onNavigateToDetails?: () => void
}

export default function VibePassPage({ onNavigateToDetails }: VibePassPageProps) {
  const [holdingFilter, setHoldingFilter] = useState("all")

  // Generate random radar data for each collection
  const generateRadarData = () => [
    { skill: "Power", value: Math.floor(Math.random() * 40) + 60 },
    { skill: "Speed", value: Math.floor(Math.random() * 40) + 50 },
    { skill: "Skill", value: Math.floor(Math.random() * 40) + 70 },
    { skill: "Defense", value: Math.floor(Math.random() * 40) + 55 },
    { skill: "Magic", value: Math.floor(Math.random() * 40) + 65 },
  ]

  // User owned VibePasses
  const ownedPasses = [
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
  ]

  // Mintable projects
  const mintableProjects = [
    {
      id: 1,
      name: "0G",
      description: "Zero Gravity Protocol",
      totalSupply: "10,000",
      minted: "3,245",
      price: "0.05 ETH",
      logo: "/placeholder-logo.svg",
    },
  ]

  const handleCardClick = () => {
    if (onNavigateToDetails) {
      onNavigateToDetails()
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* My VibePasses Section */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-wider">My VibePasses</h2>
          <div className="flex items-center gap-2">
            <Select value={holdingFilter} onValueChange={setHoldingFilter}>
              <SelectTrigger className="w-40 bg-neutral-800 border-neutral-600 text-white">
                <SelectValue placeholder="Holding" />
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

        {/* Owned Passes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ownedPasses.map((pass) => (
            <Card
              key={pass.id}
              className={`bg-gradient-to-br ${pass.bgGradient} border border-neutral-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden`}
              onClick={handleCardClick}
            >
              <CardContent className="p-6">
                {/* Radar Chart */}
                <div className="flex justify-center mb-6">
                  <div className="w-40 h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={generateRadarData()}>
                        <PolarGrid
                          stroke="#525252"
                          strokeWidth={0.5}
                          radialLines={true}
                        />
                        <PolarAngleAxis
                          dataKey="skill"
                          tick={{ fill: '#737373', fontSize: 8 }}
                          className="text-xs"
                        />
                        <PolarRadiusAxis
                          domain={[0, 100]}
                          tick={false}
                          axisLine={false}
                        />
                        <Radar
                          name="Stats"
                          dataKey="value"
                          stroke="#f97316"
                          fill="#f97316"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{pass.name}</h3>
                    <p className="text-sm text-neutral-400">{pass.subtitle}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white">
                        VibePoints: <span className="font-mono">{pass.vibePoints}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-white">
                        Holders: <span className="font-mono">{pass.holders}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                      <span className="text-white">
                        Rank: <span className="font-mono">{pass.rank}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-700"></div>

      {/* Available to Mint Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-wider">Available to Mint</h2>

        {/* Mintable Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mintableProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-6">
                {/* Project Logo */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center">
                    <Image
                      src={project.logo}
                      alt={project.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                </div>

                {/* Project Info */}
                <div className="text-center space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
                    <p className="text-sm text-neutral-400">{project.description}</p>
                  </div>

                  {/* Mint Button */}
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Mint functionality to be implemented
                    }}
                  >
                    Mint Pass
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
