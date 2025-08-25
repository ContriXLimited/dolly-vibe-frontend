"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Star, TrendingUp, Clock, ExternalLink, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface SpecialOffer {
  sent: boolean
  timestamp: string
  offerType: string
  percentage: number
  protocol: string
}

interface Opportunity {
  id: string
  title: string
  description: string
  benefits: string[]
  requirements: string
  type: "default" | "special"
  badge?: string
  action: string
  link?: string
}

export default function OpportunityPage() {
  const [specialOffer, setSpecialOffer] = useState<SpecialOffer | null>(null)

  useEffect(() => {
    // Check for special offer in localStorage
    const storedOffer = localStorage.getItem('specialOfferSent')
    console.log('Special offer:', storedOffer)
    if (storedOffer) {
      try {
        const offer = JSON.parse(storedOffer)
        if (offer.sent) {
          setSpecialOffer(offer)
        }
      } catch (error) {
        console.error('Error parsing special offer:', error)
      }
    }
  }, [])

  // Default opportunities (always available)
  const defaultOpportunities: Opportunity[] = [
    {
      id: "1",
      title: "Daily Check-in Rewards",
      description: "Earn daily rewards by maintaining consistent community engagement",
      benefits: ["50 VibePoints daily", "Streak bonuses up to 5x", "Exclusive badges"],
      requirements: "Login daily and engage with community",
      type: "default",
      action: "Start Check-in"
    },
    {
      id: "2",
      title: "Referral Program",
      description: "Invite friends to join the community and earn rewards for successful referrals",
      benefits: ["500 VibePoints per referral", "Bonus rewards for active referrals", "Exclusive referrer badge"],
      requirements: "Must have active VibePass",
      type: "default",
      action: "Get Referral Link"
    },
    {
      id: "3",
      title: "Content Creator Program",
      description: "Share quality content about the ecosystem and earn creator rewards",
      benefits: ["1000+ VibePoints monthly", "Creator verification badge", "Early access to features"],
      requirements: "Minimum 100 followers on social media",
      type: "default",
      action: "Apply Now"
    }
  ]

  const handleAcceptSpecialOffer = () => {
    toast.success("Redirecting to staking platform...", {
      description: "You will be taken to the partner protocol to complete your staking."
    })
    // Simulate redirect to external staking platform
    window.open("https://example-staking-protocol.com", "_blank")

    // Mark offer as accepted
    const updatedOffer = { ...specialOffer, accepted: true }
    localStorage.setItem('specialOfferSent', JSON.stringify(updatedOffer))
  }

  const handleDefaultAction = (opportunity: Opportunity) => {
    toast.info(`${opportunity.action} feature coming soon!`, {
      description: "This feature is under development and will be available in the next update."
    })
  }

  // Calculate stats
  const totalOpportunities = defaultOpportunities.length + (specialOffer ? 1 : 0)
  const activeOffers = specialOffer ? 1 : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider">OPPORTUNITIES</h1>
        <p className="text-sm text-neutral-400">Discover exclusive offers and rewards</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-orange-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Gift className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300">TOTAL OPPORTUNITIES</CardTitle>
                <div className="text-2xl font-bold text-white font-mono">{totalOpportunities}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-green-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Star className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300">ACTIVE OFFERS</CardTitle>
                <div className="text-2xl font-bold text-white font-mono">{activeOffers}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-blue-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-neutral-300">POINTS AVAILABLE</CardTitle>
                <div className="text-2xl font-bold text-white font-mono">5,000+</div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Special Offers Section */}
      {specialOffer && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-wider">SPECIAL OFFERS</h2>

          <Card className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border-2 border-gradient-to-r from-green-500 to-blue-500 relative overflow-hidden">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>

            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
                    <Sparkles className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">🎯 {specialOffer.percentage}% Points Boost - Stake in {specialOffer.protocol}</h3>
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-bold animate-pulse">
                        LIMITED TIME
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-300">Exclusive offer for selected community members</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-neutral-400">
                  <Clock className="w-3 h-3" />
                  <span>Expires in 7 days</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-400 mb-2">EXCLUSIVE BENEFITS</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5 text-sm">▸</span>
                      <span className="text-sm text-neutral-300">{specialOffer.percentage}% extra VibePoints on all staking</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5 text-sm">▸</span>
                      <span className="text-sm text-neutral-300">Priority access to new pools</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5 text-sm">▸</span>
                      <span className="text-sm text-neutral-300">Reduced minimum stake requirements</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-400 mb-2">REQUIREMENTS</h4>
                  <div className="p-3 bg-neutral-800/50 rounded-lg">
                    <span className="text-sm text-neutral-300">Available for selected community members with active VibePass</span>
                  </div>
                </div>

                <Button
                  onClick={handleAcceptSpecialOffer}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 font-bold tracking-wider"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ACCEPT OFFER & START STAKING
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Regular Opportunities Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-wider">GENERAL OPPORTUNITIES</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Gift className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{opportunity.title}</h3>
                    <p className="text-sm text-neutral-400">{opportunity.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
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

                  <Button
                    onClick={() => handleDefaultAction(opportunity)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 font-medium"
                  >
                    {opportunity.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty state when no special offers */}
      {!specialOffer && (
        <div className="mt-8">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-8 text-center">
              <Gift className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-400 mb-2">No special offers available</h3>
              <p className="text-sm text-neutral-500">
                Special offers will appear here when available. Keep engaging with the community!
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}