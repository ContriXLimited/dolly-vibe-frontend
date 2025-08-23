"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Crown, Medal, Award, ChevronDown, ArrowLeft, MessageCircle } from "lucide-react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { VibePassService, UserVibePass, LeaderboardEntry } from "@/services/vibepass"
import { AgentChat } from "@/components/agent-chat"
import { Button } from "@/components/ui/button"

export default function VibePassDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const vibePassId = params.id as string
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [expandedOpportunity, setExpandedOpportunity] = useState<number | null>(null)
  const [vibePass, setVibePass] = useState<UserVibePass | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAgentChatOpen, setIsAgentChatOpen] = useState(false)

  // Contract address constant
  const CONTRACT_ADDRESS = "0x1B1594813C197a9dFD163d76C6EcA9F829e5a4fa"

  // Open blockchain explorer - 0G testnet
  const openBlockchainExplorer = (type: 'contract' | 'transaction', value: string) => {
    const baseUrl = "https://chainscan-newton.0g.ai"
    let url = ""

    if (type === 'contract') {
      url = `${baseUrl}/address/${value}`
    } else if (type === 'transaction') {
      url = `${baseUrl}/tx/${value}`
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  // Fetch VibePass data on mount
  useEffect(() => {
    const fetchVibePass = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await VibePassService.getVibePassById(vibePassId)
        setVibePass(data)

        // Fetch leaderboard data for the project
        if (data.vibeProjectId) {
          await fetchLeaderboard(data.vibeProjectId, selectedPeriod)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch VibePass details')
        console.error('Error fetching VibePass:', err)
      } finally {
        setLoading(false)
      }
    }

    if (vibePassId) {
      fetchVibePass()
    }
  }, [vibePassId])

  // Fetch leaderboard data
  const fetchLeaderboard = async (vibeProjectId: string, timeWindow: string) => {
    try {
      setLeaderboardLoading(true)
      const data = await VibePassService.getLeaderboard(vibeProjectId, timeWindow)
      setLeaderboard(data)
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err)
      // Don't set error state for leaderboard failures, just log them
    } finally {
      setLeaderboardLoading(false)
    }
  }

  // Handle period change
  const handlePeriodChange = async (newPeriod: string) => {
    setSelectedPeriod(newPeriod)
    if (vibePass?.vibeProjectId) {
      await fetchLeaderboard(vibePass.vibeProjectId, newPeriod)
    }
  }

  // Parse params array to get attributes
  const parsePassAttributes = (params: number[]) => {
    return {
      engagement: params[0] || 0,
      relevance: params[1] || 0,
      expertise: params[2] || 0,
      interaction: params[3] || 0,
      civility: params[4] || 0,
    }
  }

  // Parse tags array (already an array in the new API)
  const parseTags = (tags: string[]): string[] => {
    return tags || []
  }

  // Generate radar chart data from vibePass params
  const radarData = vibePass ? (() => {
    const attributes = parsePassAttributes(vibePass.params)
    return [
      { skill: "Engagement", value: attributes.engagement },
      { skill: "Relevance", value: attributes.relevance },
      { skill: "Expertise", value: attributes.expertise },
      { skill: "Interaction", value: attributes.interaction },
      { skill: "Civility", value: attributes.civility },
    ]
  })() : [
    { skill: "Engagement", value: 0 },
    { skill: "Relevance", value: 0 },
    { skill: "Expertise", value: 0 },
    { skill: "Interaction", value: 0 },
    { skill: "Civility", value: 0 },
  ]


  const opportunities = [
    {
      title: "Unlock special channel in OG Discord",
      description: "Gain access to the exclusive OG Discord channel where top agents coordinate missions and share intel.",
      benefits: ["Direct communication with elite agents", "Priority mission notifications", "Weekly strategy sessions"],
      requirements: "Minimum 100,000 VibePoints required"
    },
    {
      title: "Access exclusive agent briefings",
      description: "Receive classified briefings on upcoming operations and strategic initiatives before public release.",
      benefits: ["48-hour early access to missions", "Detailed tactical analysis", "Agent performance metrics"],
      requirements: "Rank within top 500 holders"
    },
    {
      title: "Premium mission assignments",
      description: "Get assigned to high-value missions with greater rewards and exclusive NFT drops.",
      benefits: ["3x VibePoint multiplier", "Exclusive NFT airdrops", "Custom agent badge"],
      requirements: "Complete 10 standard missions first"
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-4 h-4 text-yellow-500" />
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />
      case 3:
        return <Award className="w-4 h-4 text-orange-600" />
      default:
        return <span className="text-neutral-400 font-mono text-sm">{rank}</span>
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-white text-lg">Loading VibePass details...</div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    )
  }

  // Show empty state if no vibePass data
  if (!vibePass) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-neutral-400 text-lg">No VibePass data found</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="mt-1 p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors border border-neutral-700 hover:border-neutral-600"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">MY VIBEPASS</h1>
            <p className="text-sm text-neutral-400">Agent performance and community engagement</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats and BattleOfAgents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Card */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">STATS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Radar Chart and Stats */}
                <div className="space-y-4">
                  {/* Radar Chart */}
                  <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid
                          stroke="#525252"
                          strokeWidth={0.5}
                          radialLines={true}
                        />
                        <PolarAngleAxis
                          dataKey="skill"
                          tick={{ fill: '#737373', fontSize: 10 }}
                          className="text-xs"
                        />
                        <PolarRadiusAxis
                          angle={90}
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

                  {/* BattleOfAgents Stats Card */}
                  <div className="p-4 bg-black rounded-lg border border-neutral-800">
                    <h3 className="text-white font-bold text-base mb-3">VibePass Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400">💎</span>
                          <span className="text-neutral-400 text-sm">Score:</span>
                        </div>
                        <span className="text-white font-mono text-sm">{vibePass.score}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">💬</span>
                          <span className="text-neutral-400 text-sm">Messages:</span>
                        </div>
                        <span className="text-white font-mono text-sm">{vibePass.msgCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400">🎯</span>
                          <span className="text-neutral-400 text-sm">Invites:</span>
                        </div>
                        <span className="text-white font-mono text-sm">{vibePass.inviteCount}</span>
                      </div>
                      {vibePass.tokenId && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-green-500">🏷️</span>
                            <span className="text-neutral-400 text-sm">Token ID:</span>
                          </div>
                          <span className="text-white font-mono text-sm">#{vibePass.tokenId}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Agent Chat Button */}
                    <div className="mt-4 pt-3 border-t border-neutral-700">
                      <Button
                        onClick={() => setIsAgentChatOpen(true)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat with Agent
                      </Button>
                      <p className="text-xs text-neutral-400 mt-2 text-center">
                        Interact with this user's AI representative
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Description and Details */}
                <div className="space-y-4">
                  <p className="text-sm text-neutral-300">
                    VibePass INFT represents your engagement and activity in the community.{" "}
                    <span className="text-orange-500 underline cursor-pointer">Learn more about scoring.</span>
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-neutral-400">Status</div>
                        <div className="text-sm text-white font-mono">{vibePass.status}</div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400">Created</div>
                        <div className="text-sm text-white font-mono">
                          {new Date(vibePass.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-neutral-400">Contract Address</div>
                        <div
                          className="text-sm text-orange-500 font-mono cursor-pointer hover:text-orange-400 transition-colors underline"
                          onClick={() => openBlockchainExplorer('contract', CONTRACT_ADDRESS)}
                          title="Click to view on 0G Explorer"
                        >
                          {CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-8)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400">Root Hash</div>
                        <div className="text-sm text-white font-mono">
                          {vibePass.rootHash ? `${vibePass.rootHash.slice(0, 8)}...${vibePass.rootHash.slice(-8)}` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {vibePass.mintTxHash && (
                    <div>
                      <div className="text-xs text-neutral-400 mb-1">Mint Transaction</div>
                      <div
                        className="text-sm text-orange-500 font-mono cursor-pointer hover:text-orange-400 transition-colors underline"
                        onClick={() => openBlockchainExplorer('transaction', vibePass.mintTxHash!)}
                        title="Click to view on 0G Explorer"
                      >
                        {vibePass.mintTxHash.slice(0, 10)}...{vibePass.mintTxHash.slice(-10)}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {/* Dynamic tags from API */}
                    {parseTags(vibePass.tags).map((tag, index) => (
                      <Badge key={index} className="bg-neutral-700 text-orange-400 text-xs border border-orange-500/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities Card */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-white tracking-wider">OPPORTUNITIES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {opportunities.map((opportunity, index) => (
                <div key={index} className="border border-neutral-700 rounded-lg overflow-hidden">
                  {/* Clickable header */}
                  <div
                    className="flex items-center justify-between p-3 bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer"
                    onClick={() => setExpandedOpportunity(expandedOpportunity === index ? null : index)}
                  >
                    <span className="text-sm text-white font-medium">{opportunity.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-orange-500 transition-transform ${expandedOpportunity === index ? 'rotate-180' : ''
                        }`}
                    />
                  </div>

                  {/* Expandable content */}
                  {expandedOpportunity === index && (
                    <div className="p-4 bg-neutral-900 border-t border-neutral-700 space-y-4">
                      <div>
                        <h4 className="text-xs font-medium text-neutral-400 mb-2">DESCRIPTION</h4>
                        <p className="text-sm text-neutral-300">{opportunity.description}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-neutral-400 mb-2">BENEFITS</h4>
                        <div className="space-y-1">
                          {opportunity.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-orange-500 mt-0.5 text-xs">▸</span>
                              <span className="text-xs text-neutral-300">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-neutral-400 mb-2">REQUIREMENTS</h4>
                        <div className="p-2 bg-neutral-800 rounded text-xs text-neutral-300">
                          {opportunity.requirements}
                        </div>
                      </div>

                      <button className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm transition-colors font-medium">
                        ACTIVATE
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Leaderboard */}
        <div className="lg:col-span-1">
          <Card className="bg-neutral-900 border-neutral-700 h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-white tracking-wider">LEADERBOARD</CardTitle>
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-20 h-8 bg-neutral-800 border-neutral-600 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-600">
                    <SelectItem value="all" className="text-white">
                      All
                    </SelectItem>
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
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs text-neutral-400 font-medium pb-2 border-b border-neutral-700">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Name</div>
                  <div className="col-span-3">Score</div>
                  <div className="col-span-4">Change</div>
                </div>

                {/* Loading state */}
                {leaderboardLoading && (
                  <div className="text-center py-8">
                    <div className="text-neutral-400 text-sm">Loading leaderboard...</div>
                  </div>
                )}

                {/* Empty state */}
                {!leaderboardLoading && leaderboard.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-neutral-400 text-sm">No leaderboard data available</div>
                  </div>
                )}

                {/* Leaderboard Entries */}
                {!leaderboardLoading && leaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-12 gap-2 text-xs py-2 hover:bg-neutral-800 rounded transition-colors"
                  >
                    <div className="col-span-1 flex items-center">{getRankIcon(entry.rank)}</div>
                    <div className="col-span-4 text-white font-medium truncate">{entry.userName}</div>
                    <div className="col-span-3 text-orange-500 font-mono">{entry.score}</div>
                    <div className="col-span-4 flex items-center gap-1">
                      <span className="text-white font-mono">+{entry.yesterdayChange}</span>
                      <div className={`w-1 h-1 rounded-full ${entry.yesterdayChange >= 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agent Chat Modal */}
      <AgentChat
        isOpen={isAgentChatOpen}
        onClose={() => setIsAgentChatOpen(false)}
        userAttributes={parsePassAttributes(vibePass?.params || [0, 0, 0, 0, 0])}
        userName={`User ${vibePass?.id ? vibePass.id.slice(0, 8) : 'Anonymous'}`}
      />
    </div>
  )
}