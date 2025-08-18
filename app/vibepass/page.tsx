"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowDown, Sparkles } from "lucide-react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import Image from "next/image"
import { VibePassService, UserVibePass } from "@/services/vibepass"
import { MintModal } from "@/components/mint-modal"
import { toast } from "sonner"

interface VibePassPageProps {
  onNavigateToDetails?: (vibePassId: string) => void
}

export default function VibePassPage({ onNavigateToDetails }: VibePassPageProps) {
  const [holdingFilter, setHoldingFilter] = useState("all")
  const [ownedPasses, setOwnedPasses] = useState<UserVibePass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMintModalOpen, setIsMintModalOpen] = useState(false)
  const [selectedVibePass, setSelectedVibePass] = useState<UserVibePass | null>(null)
  const [isJoiningProject, setIsJoiningProject] = useState(false)


  // Fetch user's VibePasses on component mount
  useEffect(() => {
    fetchMyVibePasses()
  }, [])

  const fetchMyVibePasses = async () => {
    try {
      setLoading(true)
      setError(null)
      const passes = await VibePassService.getMyVibePasses()
      setOwnedPasses(passes)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch VibePasses')
      console.error('Error fetching VibePasses:', err)
    } finally {
      setLoading(false)
    }
  }

  // Mintable projects
  const mintableProjects = [
    {
      id: 'zb65xnx71crjpftbzuliuqha',
      name: "0G",
      description: "Zero Gravity Protocol",
      totalSupply: "10,000",
      minted: "3,245",
      price: "0.05 ETH",
      logo: "/placeholder-logo.svg",
    },
  ]


  // Parse params string to get attributes
  const parsePassAttributes = (params: string) => {
    try {
      const values = JSON.parse(params) as number[]
      return {
        engagement: values[0] || 0,
        relevance: values[1] || 0,
        expertise: values[2] || 0,
        interaction: values[3] || 0,
        civility: values[4] || 0,
      }
    } catch {
      return {
        engagement: 0,
        relevance: 0,
        expertise: 0,
        interaction: 0,
        civility: 0,
      }
    }
  }

  // Handle join project
  const handleJoinProject = async (projectId: string) => {
    if (isJoiningProject) return // Prevent multiple calls
    
    try {
      setIsJoiningProject(true)
      setError(null)
      
      // Call the join project API using service
      await VibePassService.joinProject({})

      // Refresh the owned passes
      await fetchMyVibePasses()
    } catch (err: any) {
      setError(err.message || 'Failed to join project')
    } finally {
      setIsJoiningProject(false)
    }
  }

  // Handle mint pass
  const handleMintPass = async () => {
    // Find the first owned pass to mint (since user has passes but no minted tokens)
    if (ownedPasses.length > 0) {
      const passToMint = ownedPasses.find(pass => !pass.tokenId) || ownedPasses[0]
      setSelectedVibePass(passToMint)
      setIsMintModalOpen(true)
    }
  }

  // Handle mint success
  const handleMintSuccess = () => {
    fetchMyVibePasses() // Refresh the passes
  }

  const handleCardClick = (vibePassId: string) => {
    if (onNavigateToDetails) {
      onNavigateToDetails(vibePassId)
    }
  }

  // Handle unminted card click
  const handleUnmintedCardClick = () => {
    toast.info("Mint your INFT first!", {
      description: "Please use the 'Mint' button in the Available to Mint section below to create your INFT.",
      action: {
        label: "Scroll to Mint",
        onClick: () => {
          const mintSection = document.querySelector('[data-mint-section]')
          if (mintSection) {
            mintSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }
    })
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

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-white">Loading your VibePasses...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-500">Error: {error}</div>
          </div>
        ) : ownedPasses.length === 0 ? (
          // Empty State
          <div className="relative">
            <div className="border-2 border-dashed border-neutral-600 rounded-lg p-12 flex flex-col items-center justify-center space-y-4 bg-neutral-900/50">
              <Sparkles className="w-12 h-12 text-neutral-500" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-white">No VibePasses Yet</h3>
                <p className="text-sm text-neutral-400 max-w-sm">
                  Start your collection by minting your first VibePass from the available projects below
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 mt-4">
                <ArrowDown className="w-6 h-6 text-orange-500 animate-bounce" />
                <span className="text-xs text-orange-500 font-medium">Mint your first pass below</span>
              </div>
            </div>
          </div>
        ) : (
          // Passes Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ownedPasses.map((pass) => {
              const attributes = parsePassAttributes(pass.params)
              const radarData = [
                { skill: "Engagement", value: attributes.engagement },
                { skill: "Relevance", value: attributes.relevance },
                { skill: "Expertise", value: attributes.expertise },
                { skill: "Interaction", value: attributes.interaction },
                { skill: "Civility", value: attributes.civility },
              ]

              return (
                <Card
                  key={pass.id}
                  className={`bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 transition-all duration-300 overflow-hidden ${
                    pass.tokenId 
                      ? "hover:border-orange-500/50 hover:scale-105 cursor-pointer" 
                      : "cursor-pointer opacity-75 hover:opacity-90"
                  }`}
                  onClick={pass.tokenId ? () => handleCardClick(pass.id) : handleUnmintedCardClick}
                >
                  <CardContent className="p-6">
                    {/* Radar Chart */}
                    <div className="flex justify-center mb-6">
                      <div className="w-40 h-28">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
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
                        <h3 className="text-lg font-bold text-white mb-1">VibePass</h3>
                        <p className="text-sm text-neutral-400">{pass.vibeProjectId.slice(0, 8)}...{pass.vibeProjectId.slice(-8)}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-white">
                            Score: <span className="font-mono">{pass.score}</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-white">
                            Messages: <span className="font-mono">{pass.msgCount}</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                          <span className="text-white">
                            Status: <span className="font-mono">{pass.status}</span>
                          </span>
                        </div>

                        {pass.tokenId && (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-white">
                              Token: <span className="font-mono">#{pass.tokenId}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-700"></div>

      {/* Available to Mint Section */}
      <div className="space-y-6" data-mint-section>
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

                  {/* Dynamic Button */}
                  {(() => {
                    // Check if user has a vibepass (any vibepass means they've joined projects)
                    const hasAnyPass = ownedPasses.length > 0
                    // Check if user has a minted pass (tokenId exists)
                    const hasMintedPass = ownedPasses.some(pass => pass.tokenId !== null)

                    if (hasMintedPass) {
                      return (
                        <Button
                          className="w-full bg-neutral-600 text-neutral-400 font-bold cursor-not-allowed"
                          disabled
                        >
                          Already Minted
                        </Button>
                      )
                    } else if (hasAnyPass) {
                      return (
                        <Button
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMintPass()
                          }}
                        >
                          Mint
                        </Button>
                      )
                    } else {
                      return (
                        <Button
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleJoinProject(project.id)
                          }}
                          disabled={isJoiningProject}
                        >
                          {isJoiningProject ? "Joining..." : "Join Project"}
                        </Button>
                      )
                    }
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mint Modal */}
      {selectedVibePass && (
        <MintModal
          isOpen={isMintModalOpen}
          onClose={() => {
            setIsMintModalOpen(false)
            setSelectedVibePass(null)
          }}
          vibePass={selectedVibePass}
          onSuccess={handleMintSuccess}
        />
      )}
    </div>
  )
}
