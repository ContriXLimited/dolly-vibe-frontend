"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Crown, Medal, Award, ChevronDown } from "lucide-react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

export default function VibePassDetailsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("daily")
  const [expandedOpportunity, setExpandedOpportunity] = useState<number | null>(null)

  // Radar chart data
  const radarData = [
    { skill: "Engagement", value: 85 },
    { skill: "Activity", value: 70 },
    { skill: "Influence", value: 90 },
    { skill: "Consistency", value: 75 },
    { skill: "Growth", value: 80 },
    { skill: "Community", value: 65 },
  ]

  const leaderboardData = [
    { rank: 1, name: "Jackie4853", referral: 460000, points: 190082, trend: "up" },
    { rank: 2, name: "Whiskey236", referral: 440000, points: 170082, trend: "up" },
    { rank: 3, name: "Summer", referral: 350000, points: 155082, trend: "up" },
    { rank: 4, name: "JXlong", referral: 330240, points: 153082, trend: "down" },
    { rank: 5, name: "GuruMusk", referral: 150000, points: 124082, trend: "up" },
    { rank: 6, name: "Hardman", referral: 340000, points: 116082, trend: "up" },
    { rank: 7, name: "Asakar", referral: 330240, points: 113082, trend: "down" },
    { rank: 8, name: "Arster", referral: 330240, points: 113082, trend: "down" },
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">MY VIBEPASS</h1>
          <p className="text-sm text-neutral-400">Agent performance and community engagement</p>
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
                    <h3 className="text-white font-bold text-base mb-3">BattleOfAgents</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400">💎</span>
                          <span className="text-neutral-400 text-sm">VibePoints:</span>
                        </div>
                        <span className="text-white font-mono text-sm">234,454</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">👥</span>
                          <span className="text-neutral-400 text-sm">Holders:</span>
                        </div>
                        <span className="text-white font-mono text-sm">223,322</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400">🏆</span>
                          <span className="text-neutral-400 text-sm">Rank:</span>
                        </div>
                        <span className="text-white font-mono text-sm">454</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Description and Details */}
                <div className="space-y-4">
                  <p className="text-sm text-neutral-300">
                    Battle of Agents INFT represents the power of the BOA discord's Vibe event.{" "}
                    <span className="text-orange-500 underline cursor-pointer">Know more about this event.</span>
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-neutral-400">Mega 24h</div>
                        <div className="text-sm text-white font-mono">22</div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400">Referral Score</div>
                        <div className="text-sm text-white font-mono">5,520</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-neutral-400">Engagement Score</div>
                        <div className="text-sm text-white font-mono">22,344</div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400">Merkle Root</div>
                        <div className="text-sm text-white font-mono">0x0f0...2d22</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-neutral-400 mb-1">Grindstone GID</div>
                    <div className="text-sm text-white font-mono">score.json/proofs.json</div>
                  </div>

                  <div className="flex gap-2">
                    <Badge className="bg-neutral-800 text-neutral-300 text-xs">Doji</Badge>
                    <Badge className="bg-neutral-800 text-neutral-300 text-xs">Agents</Badge>
                    <Badge className="bg-neutral-800 text-neutral-300 text-xs">BOA</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BattleOfAgents Card */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-white tracking-wider">BATTLEOFAGENTS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-xs text-neutral-400">VibePoints:</span>
                  </div>
                  <div className="text-xl font-bold text-white font-mono">234,454</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-neutral-400">Referrals:</span>
                  </div>
                  <div className="text-xl font-bold text-white font-mono">293,392</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-neutral-400">Rank:</span>
                  </div>
                  <div className="text-xl font-bold text-white font-mono">454</div>
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
                      className={`w-4 h-4 text-orange-500 transition-transform ${
                        expandedOpportunity === index ? 'rotate-180' : ''
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
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs text-neutral-400 font-medium pb-2 border-b border-neutral-700">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Name</div>
                  <div className="col-span-3">Referral</div>
                  <div className="col-span-4">Points</div>
                </div>

                {/* Leaderboard Entries */}
                {leaderboardData.map((entry) => (
                  <div
                    key={entry.rank}
                    className="grid grid-cols-12 gap-2 text-xs py-2 hover:bg-neutral-800 rounded transition-colors"
                  >
                    <div className="col-span-1 flex items-center">{getRankIcon(entry.rank)}</div>
                    <div className="col-span-4 text-white font-medium truncate">{entry.name}</div>
                    <div className="col-span-3 text-orange-500 font-mono">{entry.referral.toLocaleString()}</div>
                    <div className="col-span-4 flex items-center gap-1">
                      <span className="text-white font-mono">{entry.points.toLocaleString()}</span>
                      <div className={`w-1 h-1 rounded-full ${entry.trend === "up" ? "bg-white" : "bg-red-500"}`}></div>
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
