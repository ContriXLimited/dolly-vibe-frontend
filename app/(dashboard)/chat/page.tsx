"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { MessageCircle, Send, Bot, User, Target, TrendingUp, RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  content: string | React.ReactElement
  timestamp: Date
}

interface UserProfile {
  id: string
  name: string
  discriminator: string
  matchPercentage: number
  stats: string
  avatar: string
  attributes: {
    engagement: number
    relevance: number
    expertise: number
    interaction: number
    civility: number
  }
}

interface OfferRecipient {
  id: string
  name: string
  discriminator: string
  avatar: string
  ogPoints: number
  stats: string
}

interface DimensionWeight {
  name: string
  value: number
  description: string
}

const MOCK_USERS: UserProfile[] = [
  {
    id: "1",
    name: "moonboy.eth",
    discriminator: "4242",
    matchPercentage: 95,
    stats: "Active in 15+ servers, 2K+ messages/month",
    avatar: "🌙",
    attributes: { engagement: 0.92, relevance: 0.88, expertise: 0.75, interaction: 0.94, civility: 0.89 }
  },
  {
    id: "2",
    name: "DeFiDegen",
    discriminator: "8888",
    matchPercentage: 89,
    stats: "Governance contributor, helps newbies",
    avatar: "⚡",
    attributes: { engagement: 0.85, relevance: 0.91, expertise: 0.88, interaction: 0.87, civility: 0.93 }
  },
  {
    id: "3",
    name: "0xWhale",
    discriminator: "1337",
    matchPercentage: 86,
    stats: "Technical expert, writes tutorials",
    avatar: "🐋",
    attributes: { engagement: 0.78, relevance: 0.95, expertise: 0.96, interaction: 0.82, civility: 0.85 }
  },
  {
    id: "4",
    name: "vibes_only",
    discriminator: "6969",
    matchPercentage: 82,
    stats: "Community organizer, event planner",
    avatar: "✨",
    attributes: { engagement: 0.96, relevance: 0.74, expertise: 0.65, interaction: 0.98, civility: 0.91 }
  },
  {
    id: "5",
    name: "anon_builder",
    discriminator: "0001",
    matchPercentage: 78,
    stats: "Developer, answers technical questions",
    avatar: "🔨",
    attributes: { engagement: 0.72, relevance: 0.89, expertise: 0.94, interaction: 0.76, civility: 0.88 }
  }
]

const MOCK_OFFER_RECIPIENTS: OfferRecipient[] = [
  {
    id: "1",
    name: "0g_validator",
    discriminator: "0001",
    avatar: "⚡",
    ogPoints: 347,
    stats: "Running validator node, early adopter"
  },
  {
    id: "2",
    name: "ZeroGMiner",
    discriminator: "2023",
    avatar: "⛏️",
    ogPoints: 289,
    stats: "Storage provider, 99.8% uptime"
  },
  {
    id: "3",
    name: "0g_whale.eth",
    discriminator: "7777",
    avatar: "🐋",
    ogPoints: 456,
    stats: "Major token holder, governance voter"
  },
  {
    id: "4",
    name: "galileo_dev",
    discriminator: "1337",
    avatar: "👨‍💻",
    ogPoints: 203,
    stats: "dApp developer, active contributor"
  },
  {
    id: "5",
    name: "0g_community",
    discriminator: "9999",
    avatar: "🌍",
    ogPoints: 178,
    stats: "Community moderator, education focused"
  },
  {
    id: "6",
    name: "storage_king",
    discriminator: "5555",
    avatar: "💾",
    ogPoints: 324,
    stats: "Large storage provider, testnet veteran"
  }
]

const DIMENSION_WEIGHTS: DimensionWeight[] = [
  { name: "Engagement", value: 0.85, description: "Active participation and consistency" },
  { name: "Relevance", value: 0.72, description: "On-topic contributions and value" },
  { name: "Expertise", value: 0.68, description: "Domain knowledge and credibility" },
  { name: "Interaction", value: 0.90, description: "Social engagement and helpfulness" },
  { name: "Civility", value: 0.75, description: "Professional communication style" }
]

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [analysisCompleted, setAnalysisCompleted] = useState(false)
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false)
  const [leaderboardName, setLeaderboardName] = useState("Active Community Members")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const addMessage = (sender: 'user' | 'bot', content: string | React.ReactElement) => {
    const message: ChatMessage = {
      id: `${sender}-${Date.now()}`,
      sender,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
  }

  const WeightsDisplay = () => (
    <div className="bg-neutral-800/50 border border-neutral-600 rounded-lg p-4 mt-3">
      <h4 className="text-orange-500 font-semibold mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Dimensional Analysis Results
      </h4>
      <div className="grid grid-cols-1 gap-3">
        {DIMENSION_WEIGHTS.map((weight, index) => (
          <div key={weight.name} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white text-sm font-medium">{weight.name}</span>
                <span className={`text-xs font-mono px-2 py-1 rounded ${getWeightColor(weight.value)}`}>
                  {weight.value.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-1000 ${weight.value >= 0.8 ? 'bg-green-500' :
                      weight.value >= 0.5 ? 'bg-orange-500' :
                        'bg-red-500'
                    }`}
                  style={{ width: `${weight.value * 100}%` }}
                />
              </div>
              <p className="text-xs text-neutral-400 mt-1">{weight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const UsersDisplay = () => (
    <div className="bg-neutral-800/50 border border-neutral-600 rounded-lg p-4 mt-3">
      <h4 className="text-orange-500 font-semibold mb-3 flex items-center gap-2">
        <Target className="w-4 h-4" />
        Top Matching Community Members
      </h4>
      <div className="space-y-3">
        {MOCK_USERS.map((user) => (
          <div key={user.id} className="border border-neutral-700 rounded-lg p-3 bg-neutral-900/50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm">
                  {user.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    {user.name}<span className="text-neutral-400">#{user.discriminator}</span>
                  </div>
                  <div className="text-xs text-neutral-400">{user.stats}</div>
                </div>
              </div>
              <Badge className={`${getWeightColor(user.matchPercentage / 100)} border-0 text-xs`}>
                {user.matchPercentage}%
              </Badge>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Object.entries(user.attributes).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-xs text-neutral-400 capitalize">
                    {key.slice(0, 3)}
                  </div>
                  <div className={`text-xs font-mono ${getWeightColor(value).split(' ')[0]}`}>
                    {(value * 100).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const OfferRecipientsDisplay = () => (
    <div className="bg-neutral-800/50 border border-neutral-600 rounded-lg p-4 mt-3">
      <h4 className="text-orange-500 font-semibold mb-3 flex items-center gap-2">
        <Target className="w-4 h-4" />
        Eligible Users (100+ 0G Points)
      </h4>
      <div className="space-y-3">
        {MOCK_OFFER_RECIPIENTS.map((user) => (
          <div key={user.id} className="border border-neutral-700 rounded-lg p-3 bg-neutral-900/50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-sm">
                  {user.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    {user.name}<span className="text-neutral-400">#{user.discriminator}</span>
                  </div>
                  <div className="text-xs text-neutral-400">{user.stats}</div>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-500 border-0 text-xs">
                {user.ogPoints} pts
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const SendOfferButton = () => (
    <div className="mt-4 flex justify-center">
      <Button
        onClick={() => {
          // Set localStorage flag for special offer
          const offerData = {
            sent: true,
            timestamp: new Date().toISOString(),
            offerType: 'staking_boost',
            percentage: 10,
            protocol: 'Partner Protocol'
          }
          localStorage.setItem('specialOfferSent', JSON.stringify(offerData))
          
          // Show success notification
          toast.success("Offer sent successfully!", {
            description: "Eligible users will see the special staking offer in their Opportunity page."
          })
        }}
        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 font-semibold tracking-wider"
      >
        <Send className="w-4 h-4 mr-2" />
        SEND OFFER
      </Button>
    </div>
  )

  const LeaderboardButton = () => (
    <div className="mt-4 flex justify-center">
      <Button
        onClick={() => setShowLeaderboardModal(true)}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 font-semibold tracking-wider"
      >
        <Target className="w-4 h-4 mr-2" />
        CREATE LEADERBOARD
      </Button>
    </div>
  )

  const handleCreateLeaderboard = () => {
    // Generate a simple ID based on timestamp
    const leaderboardId = Date.now().toString()
    
    // Navigate to the leaderboard detail page
    router.push(`/leaderboard/${leaderboardId}?name=${encodeURIComponent(leaderboardName)}`)
    setShowLeaderboardModal(false)
  }

  const startAnalysisSequence = async () => {
    setIsTyping(true)
    await sleep(2000)
    setIsTyping(false)

    addMessage('bot', "I understand you're looking for active community members. Let me analyze your requirements...")

    await sleep(1500)
    setIsTyping(true)
    await sleep(2000)
    setIsTyping(false)

    addMessage('bot', "Analyzing community engagement patterns and user behaviors...")

    await sleep(1500)
    setIsTyping(true)
    await sleep(2500)
    setIsTyping(false)

    addMessage('bot', <div>
      <p className="mb-2">Based on your requirements, I've identified the optimal user profile weights:</p>
      <WeightsDisplay />
    </div>)

    await sleep(3000)
    addMessage('bot', <div>
      <p className="mb-2">Here are the top 5 community members matching your criteria:</p>
      <UsersDisplay />
      <LeaderboardButton />
    </div>)

    setAnalysisCompleted(true)
  }

  const startOfferSequence = async () => {
    setIsTyping(true)
    await sleep(2000)
    setIsTyping(false)

    addMessage('bot', "I understand you want to distribute an offer based on 0G ecosystem points. Let me find eligible users...")

    await sleep(1500)
    setIsTyping(true)
    await sleep(2500)
    setIsTyping(false)

    addMessage('bot', "Scanning the 0G ecosystem database for users with 100+ points...")

    await sleep(2000)
    setIsTyping(true)
    await sleep(2000)
    setIsTyping(false)

    addMessage('bot', <div>
      <p className="mb-2">Found {MOCK_OFFER_RECIPIENTS.length} eligible users for your 10% points boost offer:</p>
      <OfferRecipientsDisplay />
      <SendOfferButton />
    </div>)

    setAnalysisCompleted(true)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userInput = inputValue.toLowerCase()
    let messageToDisplay = inputValue
    let sequence = null

    // Check for keywords and determine flow
    if (userInput.includes('offer')) {
      messageToDisplay = "I want to give users with over 100 points in the 0g ecosystem a special offer to get 10% points boost"
      sequence = startOfferSequence
    } else if (userInput.includes('active')) {
      messageToDisplay = "I want users to be active in the community, engage in meaningful conversations, help Mods answer community member questions, comfort users who encounter problems, actively participate in community activities, and share their profit situations"
      sequence = startAnalysisSequence
    }

    // Add user message
    addMessage('user', messageToDisplay)
    setInputValue("")

    // If no keyword detected, provide a prompt
    if (!sequence) {
      setIsTyping(true)
      await sleep(1500)
      setIsTyping(false)

      addMessage('bot', "I can help you with two types of analysis:\n\n• Use the word 'active' to find active community members\n• Use the word 'offer' to distribute offers to qualified users\n\nPlease describe your requirements using one of these keywords.")
      return
    }

    // Run the appropriate analysis sequence
    await sequence()
  }

  const handleReset = () => {
    setMessages([])
    setInputValue("")
    setIsTyping(false)
    setAnalysisCompleted(false)
    
    // Clear special offer flag from localStorage
    localStorage.removeItem('specialOfferSent')
    
    // Show notification that offer flag was cleared
    toast.info("Chat reset complete", {
      description: "All messages and special offers have been cleared."
    })
  }

  const getWeightColor = (value: number) => {
    if (value >= 0.8) return "text-green-500 bg-green-500/20"
    if (value >= 0.5) return "text-orange-500 bg-orange-500/20"
    return "text-red-500 bg-red-500/20"
  }

  return (
    <div className="h-full p-6">
      {/* Chat Interface - Full Height within Layout */}
      <Card className="bg-neutral-900 border-neutral-700 h-full flex flex-col">
        <CardHeader className="border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              What vibe do you want in your commnunity
            </CardTitle>
            {messages.length > 0 && (
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Chat
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <div className="text-center">
                  <Bot className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <p className="text-neutral-400 text-sm">Describe your community requirements to start the analysis</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start gap-3 max-w-[80%]">
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-orange-500" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 ${message.sender === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-neutral-800 text-white border border-neutral-700'
                      }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-sm text-neutral-400 ml-2">Bot is analyzing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="border-t border-neutral-700 p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  messages.length === 0
                    ? "Describe your ideal community member requirements..."
                    : "Continue the conversation..."
                }
                className="flex-1 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Naming Modal */}
      <Modal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        title="Create Leaderboard"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Leaderboard Name
            </label>
            <Input
              value={leaderboardName}
              onChange={(e) => setLeaderboardName(e.target.value)}
              placeholder="Enter leaderboard name..."
              className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowLeaderboardModal(false)}
              className="bg-neutral-700 hover:bg-neutral-600 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateLeaderboard}
              disabled={!leaderboardName.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Create Leaderboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}