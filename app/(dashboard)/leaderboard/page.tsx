"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Calendar, Target, ChevronRight } from "lucide-react"

interface Leaderboard {
  id: string
  name: string
  description: string
  memberCount: number
  createdAt: Date
  status: "active" | "archived"
  type: "community" | "offer"
}

// Mock leaderboard data
const MOCK_LEADERBOARDS: Leaderboard[] = [
  {
    id: "1",
    name: "Active Community Members",
    description: "Top community contributors based on engagement and activity levels",
    memberCount: 247,
    createdAt: new Date('2025-01-20'),
    status: "active",
    type: "community"
  },
  {
    id: "2", 
    name: "0G Ecosystem Contributors",
    description: "Users with high 0G points eligible for special offers",
    memberCount: 156,
    createdAt: new Date('2025-01-18'),
    status: "active",
    type: "offer"
  },
  {
    id: "3",
    name: "Technical Experts",
    description: "Community members with high expertise ratings",
    memberCount: 89,
    createdAt: new Date('2025-01-15'),
    status: "archived",
    type: "community"
  }
]

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all")

  const filteredLeaderboards = MOCK_LEADERBOARDS.filter(board => {
    if (filter === "all") return true
    return board.status === filter
  })

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-500/20 text-green-500 border-green-500/30"
      : "bg-neutral-500/20 text-neutral-500 border-neutral-500/30"
  }

  const getTypeIcon = (type: string) => {
    return type === "community" ? <Users className="w-4 h-4" /> : <Target className="w-4 h-4" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">LEADERBOARDS</h1>
          <p className="text-sm text-neutral-400">Manage and view all community leaderboards</p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {["all", "active", "archived"].map((status) => (
            <Button
              key={status}
              size="sm"
              onClick={() => setFilter(status as any)}
              className={filter === status 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "bg-neutral-800 border border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white"}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-orange-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Trophy className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300">TOTAL LEADERBOARDS</CardTitle>
                <div className="text-2xl font-bold text-white font-mono">{MOCK_LEADERBOARDS.length}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-green-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300">ACTIVE BOARDS</CardTitle>
                <div className="text-2xl font-bold text-white font-mono">
                  {MOCK_LEADERBOARDS.filter(b => b.status === "active").length}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-blue-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300">TOTAL MEMBERS</CardTitle>
                <div className="text-2xl font-bold text-white font-mono">
                  {MOCK_LEADERBOARDS.reduce((sum, board) => sum + board.memberCount, 0)}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Leaderboards List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-wider">ALL LEADERBOARDS</h2>
        
        {filteredLeaderboards.length === 0 ? (
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-12 text-center">
              <Trophy className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-400 mb-2">No leaderboards found</h3>
              <p className="text-sm text-neutral-500">
                {filter === "all" 
                  ? "Create your first leaderboard from the chat interface" 
                  : `No ${filter} leaderboards available`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredLeaderboards.map((leaderboard) => (
              <Link key={leaderboard.id} href={`/leaderboard/${leaderboard.id}`}>
                <Card className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-orange-500/20 rounded-lg">
                          {getTypeIcon(leaderboard.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">{leaderboard.name}</h3>
                            <Badge className={`text-xs ${getStatusColor(leaderboard.status)}`}>
                              {leaderboard.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-neutral-400 mb-3">
                            {leaderboard.description}
                          </p>
                          
                          <div className="flex items-center gap-6 text-xs text-neutral-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{leaderboard.memberCount} members</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Created {leaderboard.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}