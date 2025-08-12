"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, MessageSquare, FolderOpen, Zap } from "lucide-react"

export default function SpacePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("daily")
  const [communityPeriod, setCommunityPeriod] = useState("weekly")

  const statsData = [
    {
      title: "Messages",
      value: "39,098,000",
      change: "+30%",
      trend: "up",
      icon: MessageSquare,
    },
    {
      title: "Projects",
      value: "39",
      change: "+2",
      trend: "up",
      icon: FolderOpen,
    },
    {
      title: "Members",
      value: "198,000",
      change: "+2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Vibes",
      value: "498K",
      change: "+2%",
      trend: "up",
      icon: Zap,
    },
  ]

  const popularCommunities = [
    { name: "BATTLEOF..", percentage: 18.45, color: "teal", trend: "up" },
    { name: "JAINE", percentage: 15.54, color: "red", trend: "down" },
    { name: "EUCLID", percentage: 13.45, color: "teal", trend: "up" },
    { name: "ZIA", percentage: 10.45, color: "teal", trend: "up" },
    { name: "GIMO", percentage: 9.05, color: "teal", trend: "up" },
    { name: "ZERR..", percentage: 8.95, color: "red", trend: "down" },
    { name: "OGRE..", percentage: 8.65, color: "teal", trend: "up" },
  ]

  const leaderboardData = [
    { rank: 1, name: "BattleOf..", members: 460000, vibePoints: 190082, trend: "up" },
    { rank: 2, name: "Jaine", members: 440000, vibePoints: 170082, trend: "down" },
    { rank: 3, name: "Euclid", members: 350000, vibePoints: 135082, trend: "down" },
    { rank: 4, name: "Zia", members: 330240, vibePoints: 133082, trend: "down" },
    { rank: 5, name: "GimoFina..", members: 350000, vibePoints: 124082, trend: "up" },
    { rank: 6, name: "Zerrow", members: 290000, vibePoints: 110082, trend: "up" },
    { rank: 7, name: "OGResea..", members: 93400, vibePoints: 90082, trend: "up" },
  ]

  const getColorClasses = (color, trend) => {
    if (color === "teal") {
      return "bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-teal-500/30"
    } else if (color === "red") {
      return "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30"
    }
    return "bg-gradient-to-br from-neutral-600/20 to-neutral-500/20 border-neutral-500/30"
  }

  const generateMiniChart = (trend) => {
    const points = Array.from({ length: 20 }, (_, i) => {
      const base = 30 + Math.sin(i * 0.3) * 10
      const variation = trend === "up" ? i * 0.5 : -i * 0.3
      return Math.max(10, Math.min(50, base + variation + Math.random() * 5))
    })

    const pathData = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${(index / 19) * 100} ${60 - point}`)
      .join(" ")

    return (
      <svg className="w-full h-12 mt-2" viewBox="0 0 100 60">
        <defs>
          <linearGradient id={`gradient-${trend}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={trend === "up" ? "#14b8a6" : "#ef4444"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={trend === "up" ? "#14b8a6" : "#ef4444"} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d={`${pathData} L 100 60 L 0 60 Z`} fill={`url(#gradient-${trend})`} />
        <path d={pathData} stroke={trend === "up" ? "#14b8a6" : "#ef4444"} strokeWidth="2" fill="none" />
      </svg>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">VIBE SPACE</h1>
          <p className="text-sm text-neutral-400">Community analytics and engagement metrics</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="bg-neutral-900 border-orange-500/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                  {stat.title.toUpperCase()}
                </CardTitle>
                <stat.icon className="w-5 h-5 text-neutral-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-teal-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium text-teal-500 bg-teal-500/20 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Communities */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white tracking-wider">POPULAR COMMUNITIES</h2>
            <Select value={communityPeriod} onValueChange={setCommunityPeriod}>
              <SelectTrigger className="w-24 h-8 bg-neutral-800 border-neutral-600 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-600">
                <SelectItem value="weekly" className="text-white">
                  Weekly
                </SelectItem>
                <SelectItem value="daily" className="text-white">
                  Daily
                </SelectItem>
                <SelectItem value="monthly" className="text-white">
                  Monthly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {popularCommunities.map((community, index) => (
              <Card
                key={index}
                className={`${getColorClasses(community.color, community.trend)} hover:scale-105 transition-transform cursor-pointer`}
              >
                <CardContent className="p-4">
                  <div className="text-lg font-bold text-white mb-1">{community.name}</div>
                  <div className="text-sm text-neutral-300 mb-2">{community.percentage}%</div>
                  {generateMiniChart(community.trend)}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Others Card */}
          <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">Others</div>
                <div className="text-lg text-neutral-300">15.55%</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white tracking-wider">LEADERBOARD</h2>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-20 h-8 bg-neutral-800 border-neutral-600 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-600">
                <SelectItem value="daily" className="text-white">
                  Daily
                </SelectItem>
                <SelectItem value="weekly" className="text-white">
                  Weekly
                </SelectItem>
                <SelectItem value="monthly" className="text-white">
                  Monthly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-4">
              <div className="space-y-1">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs text-neutral-400 font-medium pb-2 border-b border-neutral-700">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Name</div>
                  <div className="col-span-3">Members</div>
                  <div className="col-span-4">Vibe Points</div>
                </div>

                {/* Leaderboard Entries */}
                {leaderboardData.map((entry) => (
                  <div
                    key={entry.rank}
                    className="grid grid-cols-12 gap-2 text-xs py-2 hover:bg-neutral-800 rounded transition-colors"
                  >
                    <div className="col-span-1 text-neutral-400 font-mono">{entry.rank}</div>
                    <div className="col-span-4 text-white font-medium truncate">{entry.name}</div>
                    <div className="col-span-3 flex items-center gap-1">
                      {entry.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 text-teal-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`font-mono ${entry.trend === "up" ? "text-teal-500" : "text-red-500"}`}>
                        {entry.members.toLocaleString()}
                      </span>
                    </div>
                    <div className="col-span-4 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-teal-500" />
                      <span className="text-teal-500 font-mono">{entry.vibePoints.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
