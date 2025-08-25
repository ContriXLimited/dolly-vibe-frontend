"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, MessageSquare, Trophy, ArrowLeft, Crown, Zap, Target } from "lucide-react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface CommunityMember {
  rank: number
  name: string
  discriminator: string
  avatar: string
  totalScore: number
  attributes: {
    engagement: number
    relevance: number
    expertise: number
    interaction: number
    civility: number
  }
  trend: "up" | "down"
  recentActivity: string
}

interface LeaderboardStats {
  totalMembers: number
  activeMembers: number
  avgScore: number
  growthRate: number
}

// Mock leaderboard member data
const MOCK_MEMBERS: CommunityMember[] = [
  {
    rank: 1,
    name: "CommunityChad",
    discriminator: "1234",
    avatar: "🔥",
    totalScore: 94,
    attributes: { engagement: 0.98, relevance: 0.95, expertise: 0.92, interaction: 0.97, civility: 0.89 },
    trend: "up",
    recentActivity: "Organized 3 community events this week"
  },
  {
    rank: 2,
    name: "DeFiDegen",
    discriminator: "8888", 
    avatar: "⚡",
    totalScore: 89,
    attributes: { engagement: 0.85, relevance: 0.91, expertise: 0.88, interaction: 0.87, civility: 0.93 },
    trend: "up",
    recentActivity: "Helped 15+ users with technical questions"
  },
  {
    rank: 3,
    name: "0xWhale",
    discriminator: "1337",
    avatar: "🐋",
    totalScore: 86,
    attributes: { engagement: 0.78, relevance: 0.95, expertise: 0.96, interaction: 0.82, civility: 0.85 },
    trend: "down",
    recentActivity: "Published comprehensive DeFi guide"
  },
  {
    rank: 4,
    name: "vibes_only",
    discriminator: "6969",
    avatar: "✨",
    totalScore: 82,
    attributes: { engagement: 0.96, relevance: 0.74, expertise: 0.65, interaction: 0.98, civility: 0.91 },
    trend: "up",
    recentActivity: "Maintained positive community atmosphere"
  },
  {
    rank: 5,
    name: "anon_builder",
    discriminator: "0000",
    avatar: "🛠️",
    totalScore: 78,
    attributes: { engagement: 0.72, relevance: 0.88, expertise: 0.94, interaction: 0.73, civility: 0.85 },
    trend: "up",
    recentActivity: "Contributed to open source projects"
  },
  {
    rank: 6,
    name: "TokenMaster",
    discriminator: "2024",
    avatar: "💎",
    totalScore: 75,
    attributes: { engagement: 0.75, relevance: 0.82, expertise: 0.78, interaction: 0.71, civility: 0.89 },
    trend: "up",
    recentActivity: "Created tokenomics analysis tools"
  },
  {
    rank: 7,
    name: "CryptoSage", 
    discriminator: "1111",
    avatar: "🧙",
    totalScore: 73,
    attributes: { engagement: 0.69, relevance: 0.85, expertise: 0.91, interaction: 0.68, civility: 0.92 },
    trend: "down",
    recentActivity: "Shared market insights and predictions"
  },
  {
    rank: 8,
    name: "NodeRunner",
    discriminator: "3333",
    avatar: "🖥️",
    totalScore: 72,
    attributes: { engagement: 0.76, relevance: 0.79, expertise: 0.89, interaction: 0.65, civility: 0.81 },
    trend: "up",
    recentActivity: "Maintained network infrastructure"
  },
  {
    rank: 9,
    name: "GamingGuru",
    discriminator: "7777",
    avatar: "🎮",
    totalScore: 70,
    attributes: { engagement: 0.88, relevance: 0.71, expertise: 0.63, interaction: 0.91, civility: 0.87 },
    trend: "up",
    recentActivity: "Organized gaming tournaments"
  },
  {
    rank: 10,
    name: "MetaExplorer",
    discriminator: "4200",
    avatar: "🌐",
    totalScore: 69,
    attributes: { engagement: 0.73, relevance: 0.76, expertise: 0.68, interaction: 0.79, civility: 0.84 },
    trend: "down",
    recentActivity: "Explored new metaverse projects"
  },
  {
    rank: 11,
    name: "NFTCollector",
    discriminator: "5555",
    avatar: "🖼️",
    totalScore: 67,
    attributes: { engagement: 0.71, relevance: 0.73, expertise: 0.72, interaction: 0.75, civility: 0.86 },
    trend: "up",
    recentActivity: "Curated NFT collections"
  },
  {
    rank: 12,
    name: "DAOVoter",
    discriminator: "2222",
    avatar: "🗳️",
    totalScore: 66,
    attributes: { engagement: 0.68, relevance: 0.78, expertise: 0.69, interaction: 0.72, civility: 0.93 },
    trend: "up",
    recentActivity: "Active in governance voting"
  },
  {
    rank: 13,
    name: "YieldHunter",
    discriminator: "9999",
    avatar: "📈",
    totalScore: 64,
    attributes: { engagement: 0.65, relevance: 0.81, expertise: 0.77, interaction: 0.63, civility: 0.79 },
    trend: "down",
    recentActivity: "Found new yield farming opportunities"
  },
  {
    rank: 14,
    name: "BugBounty",
    discriminator: "0101",
    avatar: "🐛",
    totalScore: 63,
    attributes: { engagement: 0.62, relevance: 0.75, expertise: 0.88, interaction: 0.59, civility: 0.82 },
    trend: "up",
    recentActivity: "Discovered security vulnerabilities"
  },
  {
    rank: 15,
    name: "MemeKing",
    discriminator: "6666",
    avatar: "😄",
    totalScore: 62,
    attributes: { engagement: 0.89, relevance: 0.58, expertise: 0.47, interaction: 0.94, civility: 0.82 },
    trend: "up",
    recentActivity: "Created viral crypto memes"
  },
  {
    rank: 16,
    name: "StakingPro",
    discriminator: "1212",
    avatar: "🥩",
    totalScore: 61,
    attributes: { engagement: 0.64, relevance: 0.72, expertise: 0.74, interaction: 0.66, civility: 0.83 },
    trend: "down",
    recentActivity: "Optimized staking strategies"
  },
  {
    rank: 17,
    name: "ChainAnalyst",
    discriminator: "8080",
    avatar: "🔍",
    totalScore: 60,
    attributes: { engagement: 0.58, relevance: 0.77, expertise: 0.85, interaction: 0.55, civility: 0.88 },
    trend: "up",
    recentActivity: "Analyzed on-chain data patterns"
  },
  {
    rank: 18,
    name: "DexTrader",
    discriminator: "4444",
    avatar: "💱",
    totalScore: 59,
    attributes: { engagement: 0.61, relevance: 0.74, expertise: 0.71, interaction: 0.63, civility: 0.81 },
    trend: "down",
    recentActivity: "Provided trading insights"
  },
  {
    rank: 19,
    name: "BridgeBuilder",
    discriminator: "1010",
    avatar: "🌉",
    totalScore: 58,
    attributes: { engagement: 0.63, relevance: 0.69, expertise: 0.76, interaction: 0.61, civility: 0.85 },
    trend: "up",
    recentActivity: "Developed cross-chain solutions"
  },
  {
    rank: 20,
    name: "AIEnthusiast",
    discriminator: "2030",
    avatar: "🤖",
    totalScore: 57,
    attributes: { engagement: 0.66, relevance: 0.71, expertise: 0.68, interaction: 0.67, civility: 0.86 },
    trend: "up",
    recentActivity: "Discussed AI and crypto integration"
  },
  {
    rank: 21,
    name: "LayerZero",
    discriminator: "0000",
    avatar: "🔗",
    totalScore: 56,
    attributes: { engagement: 0.59, relevance: 0.73, expertise: 0.72, interaction: 0.58, civility: 0.82 },
    trend: "down",
    recentActivity: "Worked on Layer 2 solutions"
  },
  {
    rank: 22,
    name: "FlashLoan",
    discriminator: "1234",
    avatar: "⚡",
    totalScore: 55,
    attributes: { engagement: 0.57, relevance: 0.75, expertise: 0.78, interaction: 0.54, civility: 0.81 },
    trend: "up",
    recentActivity: "Executed complex flash loan strategies"
  },
  {
    rank: 23,
    name: "OraculumBot",
    discriminator: "7890",
    avatar: "🔮",
    totalScore: 54,
    attributes: { engagement: 0.55, relevance: 0.69, expertise: 0.79, interaction: 0.56, civility: 0.84 },
    trend: "up",
    recentActivity: "Provided oracle data solutions"
  },
  {
    rank: 24,
    name: "PrivacyCoin",
    discriminator: "9876",
    avatar: "🕶️",
    totalScore: 53,
    attributes: { engagement: 0.53, relevance: 0.67, expertise: 0.77, interaction: 0.52, civility: 0.87 },
    trend: "down",
    recentActivity: "Advocated for privacy technologies"
  },
  {
    rank: 25,
    name: "RektDetector",
    discriminator: "5432",
    avatar: "⚠️",
    totalScore: 52,
    attributes: { engagement: 0.58, relevance: 0.65, expertise: 0.74, interaction: 0.59, civility: 0.79 },
    trend: "up",
    recentActivity: "Warned community about risky projects"
  }
]

const MOCK_STATS: LeaderboardStats = {
  totalMembers: 247,
  activeMembers: 189,
  avgScore: 76.4,
  growthRate: 12.3
}

export default function LeaderboardDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [selectedPeriod, setSelectedPeriod] = useState("weekly")
  const [leaderboardName, setLeaderboardName] = useState("Active Community Members")
  const [showAllMembers, setShowAllMembers] = useState(false)

  useEffect(() => {
    const nameParam = searchParams.get('name')
    if (nameParam) {
      setLeaderboardName(decodeURIComponent(nameParam))
    }
  }, [searchParams])

  const getColorClasses = (rank: number) => {
    if (rank === 1) {
      return "bg-gradient-to-br from-yellow-600 to-yellow-500 border-yellow-500/50 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
    } else if (rank === 2) {
      return "bg-gradient-to-br from-gray-500 to-gray-400 border-gray-400/50 shadow-[0_0_20px_rgba(192,192,192,0.4)]"  
    } else if (rank === 3) {
      return "bg-gradient-to-br from-orange-700 to-orange-600 border-orange-600/50 shadow-[0_0_20px_rgba(205,127,50,0.4)]"
    } else if (rank <= 5) {
      return "bg-gradient-to-br from-teal-700 to-teal-600 border-teal-500/50"
    }
    return "bg-gradient-to-br from-neutral-700 to-neutral-600 border-neutral-500/50"
  }

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    if (rank <= 5) return "⭐"
    return null
  }

  const generateRadarChart = (attributes: any, memberId?: string) => {
    const radarData = [
      { skill: "Eng", value: Math.round(attributes.engagement * 100) },
      { skill: "Rel", value: Math.round(attributes.relevance * 100) },
      { skill: "Exp", value: Math.round(attributes.expertise * 100) },
      { skill: "Int", value: Math.round(attributes.interaction * 100) },
      { skill: "Civ", value: Math.round(attributes.civility * 100) },
    ]

    return (
      <div className="w-full h-24 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <PolarGrid
              stroke="#737373"
              strokeWidth={0.8}
              radialLines={true}
            />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: '#d4d4d8', fontSize: 10, fontWeight: 500 }}
              className="text-xs font-medium"
            />
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Stats"
              dataKey="value"
              stroke="#ea580c"
              fill="#ea580c"
              fillOpacity={0.2}
              strokeWidth={2.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const generateMiniChart = (trend: string, attributes: any) => {
    // Generate chart based on user attributes for variation
    const avgScore = Object.values(attributes).reduce((sum: number, val: any) => sum + val, 0) / 5
    const points = Array.from({ length: 20 }, (_, i) => {
      const base = avgScore * 60
      const variation = trend === "up" ? i * 0.8 : -i * 0.5
      const noise = (Math.sin(i * 0.7) * 5) + (Math.random() * 3)
      return Math.max(10, Math.min(50, base + variation + noise))
    })

    const pathData = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${(index / 19) * 100} ${60 - point}`)
      .join(" ")

    return (
      <svg className="w-full h-12 mt-2" viewBox="0 0 100 60">
        <defs>
          <linearGradient id={`gradient-${trend}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={trend === "up" ? "#5eead4" : "#fca5a5"} stopOpacity="0.6" />
            <stop offset="100%" stopColor={trend === "up" ? "#5eead4" : "#fca5a5"} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d={`${pathData} L 100 60 L 0 60 Z`} fill={`url(#gradient-${trend})`} />
        <path d={pathData} stroke={trend === "up" ? "#5eead4" : "#fca5a5"} strokeWidth="2" fill="none" />
      </svg>
    )
  }

  const getAttributeColor = (value: number) => {
    if (value >= 0.9) return "text-green-500"
    if (value >= 0.8) return "text-teal-500"
    if (value >= 0.7) return "text-orange-500"
    return "text-red-500"
  }

  const statsData = [
    {
      title: "Total Members",
      value: MOCK_STATS.totalMembers.toLocaleString(),
      change: `+${MOCK_STATS.growthRate}%`,
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Members",
      value: MOCK_STATS.activeMembers.toLocaleString(), 
      change: "+15%",
      trend: "up",
      icon: Zap,
    },
    {
      title: "Average Score",
      value: MOCK_STATS.avgScore.toFixed(1),
      change: "+3.2",
      trend: "up", 
      icon: Target,
    },
    {
      title: "Engagement Rate",
      value: "87.3%",
      change: "+5.1%",
      trend: "up",
      icon: MessageSquare,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/leaderboard">
            <Button size="sm" className="bg-neutral-800 border border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">{leaderboardName.toUpperCase()}</h1>
            <p className="text-sm text-neutral-400">Community member rankings and analytics</p>
          </div>
        </div>
        
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32 h-8 bg-neutral-800 border-neutral-600 text-white text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-600">
            <SelectItem value="daily" className="text-white">Daily</SelectItem>
            <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
            <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
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
                  <TrendingUp className="w-4 h-4 text-teal-500" />
                  <span className="text-sm font-medium px-2 py-1 rounded text-teal-500 bg-teal-500/20">
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Members - Large Cards */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white tracking-wider">TOP MEMBERS</h2>
          </div>

          {/* Top 3 members - 1/3 each */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {MOCK_MEMBERS.slice(0, 3).map((member) => (
              <Card
                key={member.rank}
                className={`${getColorClasses(member.rank)} hover:scale-105 transition-transform cursor-pointer relative`}
              >
                {/* Medal icon */}
                <div className="absolute top-2 right-2">
                  {getMedalIcon(member.rank) && (
                    <span className="text-xl">{getMedalIcon(member.rank)}</span>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <div className="text-2xl mb-1">{member.avatar}</div>
                    <div className="text-lg font-bold text-white mb-1">
                      {member.name}
                      <span className="text-neutral-300 text-sm">#{member.discriminator}</span>
                    </div>
                    <div className="text-sm text-neutral-300 mb-2">{member.totalScore}% score</div>
                  </div>
                  
                  {/* Radar Chart */}
                  {generateRadarChart(member.attributes, `member-${member.rank}`)}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Members 4-5 - 1/2 each */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {MOCK_MEMBERS.slice(3, 5).map((member) => (
              <Card
                key={member.rank}
                className={`${getColorClasses(member.rank)} hover:scale-105 transition-transform cursor-pointer relative`}
              >
                <div className="absolute top-2 right-2">
                  {getMedalIcon(member.rank) && (
                    <span className="text-lg">{getMedalIcon(member.rank)}</span>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-xl">{member.avatar}</div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {member.name}
                        <span className="text-neutral-300 text-sm">#{member.discriminator}</span>
                      </div>
                      <div className="text-sm text-neutral-300">{member.totalScore}% score</div>
                    </div>
                  </div>
                  
                  {/* Radar Chart */}
                  {generateRadarChart(member.attributes, `member-${member.rank}`)}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View More Button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => setShowAllMembers(!showAllMembers)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 font-semibold tracking-wider"
            >
              {showAllMembers ? "View Less" : "View More Members"}
              <span className="ml-2">({MOCK_MEMBERS.length - 5} more)</span>
            </Button>
          </div>

          {/* Full Members Table */}
          {showAllMembers && (
            <Card className="bg-neutral-900 border-neutral-700 mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white tracking-wider">
                  ALL MEMBERS ({MOCK_MEMBERS.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left p-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">#</th>
                        <th className="text-left p-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Member</th>
                        <th className="text-center p-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Eng</th>
                        <th className="text-center p-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Rel</th>
                        <th className="text-center p-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Exp</th>
                        <th className="text-center p-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Int</th>
                        <th className="text-center p-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Civ</th>
                        <th className="text-center p-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Score</th>
                        <th className="text-center p-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Trend</th>
                        <th className="text-left p-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_MEMBERS.map((member, index) => (
                        <tr
                          key={member.rank}
                          className={`border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors ${
                            index < 5 ? "bg-neutral-800/30" : ""
                          }`}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-400 font-mono text-sm">{member.rank}</span>
                              {member.rank <= 3 && (
                                <span className="text-lg">{getMedalIcon(member.rank)}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{member.avatar}</span>
                              <div>
                                <div className="text-white font-medium">{member.name}</div>
                                <div className="text-xs text-neutral-500">#{member.discriminator}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`font-mono text-sm ${getAttributeColor(member.attributes.engagement)}`}>
                              {(member.attributes.engagement * 100).toFixed(0)}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`font-mono text-sm ${getAttributeColor(member.attributes.relevance)}`}>
                              {(member.attributes.relevance * 100).toFixed(0)}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`font-mono text-sm ${getAttributeColor(member.attributes.expertise)}`}>
                              {(member.attributes.expertise * 100).toFixed(0)}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`font-mono text-sm ${getAttributeColor(member.attributes.interaction)}`}>
                              {(member.attributes.interaction * 100).toFixed(0)}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`font-mono text-sm ${getAttributeColor(member.attributes.civility)}`}>
                              {(member.attributes.civility * 100).toFixed(0)}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <Badge className="bg-teal-500/20 text-teal-500 border-teal-500/30 font-mono">
                              {member.totalScore}%
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            {member.trend === "up" ? (
                              <TrendingUp className="w-4 h-4 text-teal-500 mx-auto" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />
                            )}
                          </td>
                          <td className="p-3">
                            <div className="text-xs text-neutral-400 max-w-48 truncate">
                              {member.recentActivity}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Full Leaderboard Ranking */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white tracking-wider">RANKINGS</h2>
            <button
              onClick={() => setShowAllMembers(!showAllMembers)}
              className="text-xs text-orange-500 hover:text-orange-400 transition-colors"
            >
              {showAllMembers ? "Hide All" : "See All"}
            </button>
          </div>

          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-4">
              <div className="space-y-1">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs text-neutral-400 font-medium pb-2 border-b border-neutral-700">
                  <div className="col-span-1">#</div>
                  <div className="col-span-6">Member</div>
                  <div className="col-span-3">Score</div>
                  <div className="col-span-2">Trend</div>
                </div>

                {/* Rankings */}
                {MOCK_MEMBERS.slice(0, showAllMembers ? MOCK_MEMBERS.length : 10).map((member) => (
                  <div
                    key={member.rank}
                    className="grid grid-cols-12 gap-2 text-xs py-2 hover:bg-neutral-800 rounded transition-colors"
                  >
                    <div className="col-span-1 text-neutral-400 font-mono">{member.rank}</div>
                    <div className="col-span-6 flex items-center gap-2">
                      <span className="text-sm">{member.avatar}</span>
                      <div>
                        <div className="text-white font-medium truncate">
                          {member.name}
                        </div>
                        <div className="text-xs text-neutral-500">
                          #{member.discriminator}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <span className="text-teal-500 font-mono font-semibold">{member.totalScore}%</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      {member.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 text-teal-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Show More Indicator */}
                {!showAllMembers && MOCK_MEMBERS.length > 10 && (
                  <div className="text-center py-3 border-t border-neutral-700">
                    <button
                      onClick={() => setShowAllMembers(true)}
                      className="text-xs text-orange-500 hover:text-orange-400 transition-colors"
                    >
                      +{MOCK_MEMBERS.length - 10} more members
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}