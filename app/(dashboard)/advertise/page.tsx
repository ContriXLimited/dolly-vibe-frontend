"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Users, TrendingUp, MessageCircle, Lightbulb } from "lucide-react"
import { AgentChat } from "@/components/agent-chat"
import { UserAttributes } from "@/services/agent"

// Mock user profiles for demonstration
const DEMO_USERS = [
  {
    id: "user_001",
    name: "CryptoMaximalist",
    description: "DeFi whale with $500k+ portfolio",
    attributes: { engagement: 92, relevance: 88, expertise: 95, interaction: 75, civility: 82 },
    riskProfile: "Medium",
    interests: ["DeFi", "Yield Farming", "Governance"]
  },
  {
    id: "user_002", 
    name: "ArtCollector",
    description: "NFT enthusiast, 20+ Discord communities",
    attributes: { engagement: 85, relevance: 78, expertise: 65, interaction: 94, civility: 88 },
    riskProfile: "High",
    interests: ["NFT", "Art", "Community", "Gaming"]
  },
  {
    id: "user_003",
    name: "GovernanceGuru", 
    description: "DAO contributor, long-term focused",
    attributes: { engagement: 78, relevance: 85, expertise: 72, interaction: 88, civility: 95 },
    riskProfile: "Low",
    interests: ["DAO", "Governance", "Voting", "Decentralization"]
  },
  {
    id: "user_004",
    name: "CuriousLearner",
    description: "Crypto newcomer, learning basics", 
    attributes: { engagement: 65, relevance: 58, expertise: 35, interaction: 82, civility: 90 },
    riskProfile: "Low",
    interests: ["Education", "Safety", "Basics", "Staking"]
  }
]

export default function AdvertisePage() {
  const [selectedUser, setSelectedUser] = useState<typeof DEMO_USERS[0] | null>(null)
  const [isAgentChatOpen, setIsAgentChatOpen] = useState(false)

  const handleChatWithUser = (user: typeof DEMO_USERS[0]) => {
    setSelectedUser(user)
    setIsAgentChatOpen(true)
  }

  const getRiskColor = (riskProfile: string) => {
    switch (riskProfile) {
      case 'High': return 'bg-red-500/20 text-red-500'
      case 'Medium': return 'bg-orange-500/20 text-orange-500'
      case 'Low': return 'bg-green-500/20 text-green-500'
      default: return 'bg-neutral-500/20 text-neutral-300'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">ADVERTISER DASHBOARD</h1>
          <p className="text-sm text-neutral-400">Test your product-market fit with iNFT users</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">AVAILABLE USERS</p>
                <p className="text-2xl font-bold text-white font-mono">{DEMO_USERS.length}</p>
              </div>
              <Users className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">AVG MATCH RATE</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">67%</p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">ACTIVE AGENTS</p>
                <p className="text-2xl font-bold text-white font-mono">{DEMO_USERS.length}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">SUCCESS RATE</p>
                <p className="text-2xl font-bold text-green-500 font-mono">84%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-500" />
            HOW IT WORKS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/30 border border-orange-500/50 flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-500 font-bold text-lg">1</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Select Target User</h3>
              <p className="text-sm text-neutral-300">Browse user profiles and their agent characteristics</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/30 border border-orange-500/50 flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-500 font-bold text-lg">2</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Chat with Agent</h3>
              <p className="text-sm text-neutral-300">Describe your product to the user's AI representative</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/30 border border-orange-500/50 flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-500 font-bold text-lg">3</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Get Match Score</h3>
              <p className="text-sm text-neutral-300">Receive compatibility analysis and customized recommendations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Profiles */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white tracking-wider">USER PROFILES</CardTitle>
          <p className="text-sm text-neutral-400">Click "Chat with Agent" to test your product fit</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DEMO_USERS.map((user) => (
              <div key={user.id} className="border border-neutral-700 rounded-lg p-4">
                {/* User Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{user.name}</h3>
                    <p className="text-sm text-neutral-400">{user.description}</p>
                  </div>
                  <Badge className={getRiskColor(user.riskProfile)}>
                    {user.riskProfile} Risk
                  </Badge>
                </div>

                {/* Attributes */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {Object.entries(user.attributes).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-neutral-400 mb-1 capitalize">
                        {key.slice(0, 3)}
                      </div>
                      <div className={`text-sm font-mono ${
                        value >= 90 ? 'text-green-500' :
                        value >= 70 ? 'text-orange-500' : 
                        'text-neutral-300'
                      }`}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interests */}
                <div className="mb-4">
                  <p className="text-xs text-neutral-400 mb-2">INTERESTS</p>
                  <div className="flex flex-wrap gap-1">
                    {user.interests.map((interest) => (
                      <Badge 
                        key={interest} 
                        className="bg-neutral-800 text-neutral-300 text-xs"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleChatWithUser(user)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Agent
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Chat Modal */}
      {selectedUser && (
        <AgentChat
          isOpen={isAgentChatOpen}
          onClose={() => setIsAgentChatOpen(false)}
          userAttributes={selectedUser.attributes}
          userName={selectedUser.name}
        />
      )}
    </div>
  )
}