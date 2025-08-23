export interface UserAttributes {
  engagement: number
  relevance: number
  expertise: number
  interaction: number
  civility: number
}

export interface UserPersona {
  id: string
  name: string
  attributes: UserAttributes
  agentPersonality: string
  backgroundStory: string
  preferences: {
    riskLevel: 'low' | 'medium' | 'high'
    investmentRange: [number, number]
    interests: string[]
    activeHours: string
    avgLockPeriod: number
    favoriteProtocols: string[]
  }
}

export interface ConversationMessage {
  id: string
  sender: 'user' | 'agent'
  content: string
  timestamp: Date
  metadata?: {
    matchScore?: number
    actionable?: boolean
    warningFlags?: string[]
  }
}

export interface AdvertiserPitch {
  id: string
  projectName: string
  description: string
  targetAttributes: string[]
  riskLevel: 'low' | 'medium' | 'high'
  commitment: string
  returns: string
}

export interface AgentResponse {
  content: string
  matchScore?: number
  confidence: number
  suggestions?: string[]
  warnings?: string[]
}

// Mock user personas
const USER_PERSONAS: UserPersona[] = [
  {
    id: "defi_whale",
    name: "CryptoMaximalist",
    attributes: {
      engagement: 92,
      relevance: 88,
      expertise: 95,
      interaction: 75,
      civility: 82
    },
    agentPersonality: "Analytical, risk-aware, ROI-focused",
    backgroundStory: "5+ years in DeFi, manages $500k+ portfolio, active in 10+ protocols",
    preferences: {
      riskLevel: 'medium',
      investmentRange: [20000, 50000],
      interests: ['defi', 'yield-farming', 'governance', 'cross-chain'],
      activeHours: '14:00-16:00 UTC',
      avgLockPeriod: 60,
      favoriteProtocols: ['Aave', 'Compound', 'Uniswap', 'Curve', 'Lido']
    }
  },
  {
    id: "nft_enthusiast",
    name: "ArtCollector",
    attributes: {
      engagement: 85,
      relevance: 78,
      expertise: 65,
      interaction: 94,
      civility: 88
    },
    agentPersonality: "Community-driven, aesthetic-focused, trend-aware",
    backgroundStory: "Collects digital art, participates in 20+ Discord servers, early adopter",
    preferences: {
      riskLevel: 'high',
      investmentRange: [1000, 10000],
      interests: ['nft', 'art', 'gaming', 'community', 'pfp-collections'],
      activeHours: '20:00-23:00 UTC',
      avgLockPeriod: 14,
      favoriteProtocols: ['OpenSea', 'Foundation', 'SuperRare', 'Async Art']
    }
  },
  {
    id: "dao_contributor",
    name: "GovernanceGuru",
    attributes: {
      engagement: 78,
      relevance: 85,
      expertise: 72,
      interaction: 88,
      civility: 95
    },
    agentPersonality: "Thoughtful, collaborative, long-term focused",
    backgroundStory: "Active governance participant in 8 DAOs, values decentralization",
    preferences: {
      riskLevel: 'low',
      investmentRange: [5000, 25000],
      interests: ['governance', 'dao', 'voting', 'community', 'decentralization'],
      activeHours: '18:00-21:00 UTC',
      avgLockPeriod: 120,
      favoriteProtocols: ['Compound', 'MakerDAO', 'Uniswap', 'GitcoinDAO', 'ENS']
    }
  },
  {
    id: "crypto_newbie",
    name: "CuriousLearner",
    attributes: {
      engagement: 65,
      relevance: 58,
      expertise: 35,
      interaction: 82,
      civility: 90
    },
    agentPersonality: "Eager to learn, cautious, question-oriented",
    backgroundStory: "New to crypto, learning basics, small investments only",
    preferences: {
      riskLevel: 'low',
      investmentRange: [100, 2000],
      interests: ['education', 'staking', 'basics', 'safety', 'tutorials'],
      activeHours: '19:00-22:00 UTC',
      avgLockPeriod: 30,
      favoriteProtocols: ['Coinbase', 'Ethereum 2.0', 'Polygon']
    }
  }
]

// Mock conversation templates for user insights
const USER_INSIGHT_TEMPLATES = {
  interests: [
    "What are this user's main interests?",
    "What topics does this user engage with most?",
    "What type of content does this user prefer?"
  ],
  painPoints: [
    "What are this user's main pain points?",
    "What challenges does this user face?",
    "What problems is this user trying to solve?"
  ],
  investment: [
    "What investment range should I consider for this user?",
    "How much does this user typically invest?",
    "What's this user's spending behavior?"
  ],
  timing: [
    "When is the best time to reach this user?",
    "What are this user's active hours?",
    "When is this user most responsive?"
  ],
  preferences: [
    "What are this user's preferences?",
    "What does this user value most?",
    "What motivates this user's decisions?"
  ]
}

// Mock advertiser scenarios
const ADVERTISER_SCENARIOS: AdvertiserPitch[] = [
  {
    id: "stablecoin_vault",
    projectName: "StableVault Protocol",
    description: "12% APY on USDC with no impermanent loss, daily compounding",
    targetAttributes: ['defi', 'yield-farming', 'staking'],
    riskLevel: 'low',
    commitment: "No lock period, withdraw anytime",
    returns: "12% APY guaranteed"
  },
  {
    id: "gamefi_project",
    projectName: "CryptoClash",
    description: "P2E game requiring 40 hours/week commitment with potential 1000% returns",
    targetAttributes: ['gaming', 'nft', 'high-risk'],
    riskLevel: 'high',
    commitment: "40 hours/week gameplay",
    returns: "Up to 1000% potential returns"
  },
  {
    id: "dao_governance",
    projectName: "MetaDAO Aggregator",
    description: "Governance tokens for new DeFi aggregator with fee-sharing",
    targetAttributes: ['governance', 'dao', 'defi'],
    riskLevel: 'medium',
    commitment: "Participate in weekly governance votes",
    returns: "Fee sharing + voting rewards"
  },
  {
    id: "nft_launch",
    projectName: "Cyber Punks Genesis",
    description: "10,000 unique PFP collection with exclusive community access",
    targetAttributes: ['nft', 'art', 'community', 'pfp'],
    riskLevel: 'high',
    commitment: "0.1 ETH mint price",
    returns: "Community access + potential appreciation"
  }
]

class AgentService {
  private getUserPersonaFromAttributes(attributes: UserAttributes): UserPersona {
    // Simple matching logic based on highest attributes
    if (attributes.expertise > 90) return USER_PERSONAS[0] // DeFi Whale
    if (attributes.interaction > 90) return USER_PERSONAS[1] // NFT Enthusiast  
    if (attributes.civility > 90) return USER_PERSONAS[2] // DAO Contributor
    return USER_PERSONAS[3] // Crypto Newbie
  }

  private calculateMatchScore(persona: UserPersona, pitch: AdvertiserPitch): number {
    let score = 0
    
    // Risk level match (40% weight)
    if (persona.preferences.riskLevel === pitch.riskLevel) {
      score += 40
    } else if (
      (persona.preferences.riskLevel === 'medium' && pitch.riskLevel !== 'high') ||
      (persona.preferences.riskLevel === 'high' && pitch.riskLevel !== 'low')
    ) {
      score += 20
    }
    
    // Interest match (40% weight)
    const interestMatches = pitch.targetAttributes.filter(attr => 
      persona.preferences.interests.some(interest => 
        interest.includes(attr.toLowerCase()) || attr.toLowerCase().includes(interest)
      )
    )
    score += Math.min(40, interestMatches.length * 13)
    
    // Investment range consideration (20% weight)
    const pitchValue = this.extractPitchValue(pitch)
    if (pitchValue && pitchValue >= persona.preferences.investmentRange[0] && 
        pitchValue <= persona.preferences.investmentRange[1]) {
      score += 20
    } else if (pitchValue && pitchValue < persona.preferences.investmentRange[1] * 2) {
      score += 10
    }
    
    return Math.min(100, score)
  }

  private extractPitchValue(pitch: AdvertiserPitch): number | null {
    // Simple extraction logic for demo
    if (pitch.id === 'nft_launch') return 300 // ~0.1 ETH
    if (pitch.id === 'stablecoin_vault') return 10000
    if (pitch.id === 'dao_governance') return 5000
    if (pitch.id === 'gamefi_project') return 2000
    return null
  }

  generateUserInsightResponse(attributes: UserAttributes, question: string): AgentResponse {
    const persona = this.getUserPersonaFromAttributes(attributes)
    const lowerQuestion = question.toLowerCase()
    
    let content = ""
    
    if (lowerQuestion.includes('interest') || lowerQuestion.includes('engage')) {
      content = `Based on behavioral analysis (Engagement: ${attributes.engagement}, Interaction: ${attributes.interaction}), this user is primarily focused on:\n\n` +
        persona.preferences.interests.map((interest, i) => 
          `${i + 1}. **${interest.charAt(0).toUpperCase() + interest.slice(1).replace('-', ' ')}**`
        ).join('\n') + 
        `\n\n*Agent Personality: ${persona.agentPersonality}*\n*Background: ${persona.backgroundStory}*`
    } 
    else if (lowerQuestion.includes('pain') || lowerQuestion.includes('challenge') || lowerQuestion.includes('problem')) {
      if (persona.id === 'defi_whale') {
        content = "Based on behavioral analysis (Expertise: 95, Engagement: 92), the user faces three key challenges:\n\n" +
          "1. **Yield Optimization Complexity** - Managing positions across 10+ protocols is time-consuming\n" +
          "2. **Risk Assessment Fatigue** - Evaluating new protocols requires extensive due diligence\n" +
          "3. **Gas Fee Optimization** - High transaction costs on Ethereum mainnet impact returns\n\n" +
          "They're particularly interested in automated solutions and cross-chain opportunities."
      } else if (persona.id === 'nft_enthusiast') {
        content = "Key challenges for this community-focused user:\n\n" +
          "1. **Discovery Fatigue** - Too many new projects, hard to filter quality\n" +
          "2. **Community Fragmentation** - Managing 20+ Discord servers\n" +
          "3. **Flip vs Hold Decisions** - Balancing quick profits with long-term collection\n\n" +
          "They value authentic communities over pure speculation."
      } else {
        content = `Primary challenges based on ${persona.name}'s profile:\n\n` +
          "1. **Information Overload** - Difficulty separating signal from noise\n" +
          "2. **Risk Assessment** - Understanding true risks vs potential rewards\n" +
          "3. **Time Management** - Balancing learning with other commitments"
      }
    }
    else if (lowerQuestion.includes('invest') || lowerQuestion.includes('spend') || lowerQuestion.includes('range')) {
      content = `Investment profile analysis:\n\n` +
        `• **Typical position size**: $${persona.preferences.investmentRange[0].toLocaleString()} - $${persona.preferences.investmentRange[1].toLocaleString()}\n` +
        `• **Risk tolerance**: ${persona.preferences.riskLevel.charAt(0).toUpperCase() + persona.preferences.riskLevel.slice(1)}\n` +
        `• **Average lock period**: ${persona.preferences.avgLockPeriod} days\n` +
        `• **Test investment range**: $${Math.round(persona.preferences.investmentRange[0] * 0.1).toLocaleString()} - $${Math.round(persona.preferences.investmentRange[0] * 0.2).toLocaleString()}\n\n` +
        `*Note: User values liquidity and rarely commits to locks beyond ${persona.preferences.avgLockPeriod * 2} days.*`
    }
    else if (lowerQuestion.includes('time') || lowerQuestion.includes('when') || lowerQuestion.includes('active')) {
      content = `Optimal engagement timing:\n\n` +
        `• **Peak activity**: ${persona.preferences.activeHours}\n` +
        `• **Response rate**: Highest during weekday evenings\n` +
        `• **Decision making**: Typically researches for 24-48 hours before committing\n` +
        `• **Community activity**: Most engaged during ${persona.preferences.activeHours}\n\n` +
        `*Recommendation: Initial contact during active hours, follow-up within 48 hours.*`
    }
    else {
      content = `General user profile summary:\n\n` +
        `**Attributes**: Engagement (${attributes.engagement}), Expertise (${attributes.expertise}), Civility (${attributes.civility})\n\n` +
        `**Personality**: ${persona.agentPersonality}\n\n` +
        `**Background**: ${persona.backgroundStory}\n\n` +
        `**Key Interests**: ${persona.preferences.interests.join(', ')}\n\n` +
        `**Investment Profile**: ${persona.preferences.riskLevel} risk, $${persona.preferences.investmentRange[0].toLocaleString()}-$${persona.preferences.investmentRange[1].toLocaleString()} range`
    }
    
    return {
      content,
      confidence: 85 + Math.random() * 10,
      suggestions: [
        "Ask about specific protocols they use",
        "Inquire about their biggest wins/losses",
        "Explore their decision-making process"
      ]
    }
  }

  generateAdvertiserResponse(attributes: UserAttributes, pitch: AdvertiserPitch): AgentResponse {
    const persona = this.getUserPersonaFromAttributes(attributes)
    const matchScore = this.calculateMatchScore(persona, pitch)
    
    let content = ""
    let warnings: string[] = []
    let suggestions: string[] = []
    
    if (matchScore >= 80) {
      content = `✅ **High compatibility detected!** (${matchScore}% match)\n\n**Matching factors:**\n`
      
      if (persona.preferences.riskLevel === pitch.riskLevel) {
        content += `• Risk profile: Your ${pitch.riskLevel}-risk offering aligns perfectly\n`
      }
      
      const interestMatches = pitch.targetAttributes.filter(attr => 
        persona.preferences.interests.some(interest => 
          interest.includes(attr.toLowerCase()) || attr.toLowerCase().includes(interest)
        )
      )
      if (interestMatches.length > 0) {
        content += `• Interest alignment: Strong match in ${interestMatches.join(', ')}\n`
      }
      
      content += `• User background: ${persona.backgroundStory}\n\n`
      
      // Generate customized pitch
      content += `**🎯 Customized Approach:**\n\n`
      
      if (persona.id === 'defi_whale') {
        content += `**Key Selling Points:**\n` +
          `• Emphasize audit reports and security measures\n` +
          `• Compare yields to established protocols (Aave, Compound)\n` +
          `• Highlight gas optimization features\n` +
          `• Show historical performance data\n\n` +
          `**Recommended Opening:**\n` +
          `"As someone managing significant DeFi positions, you might appreciate ${pitch.projectName} - ${pitch.description.toLowerCase()}. We've been audited by leading firms and offer competitive rates."\n\n` +
          `**Quick Win Opportunity:**\n` +
          `Offer a trial period with boosted returns for deposits over $25k\n\n` +
          `**Best Contact Time:** ${persona.preferences.activeHours}`
      } else if (persona.id === 'nft_enthusiast') {
        content += `**Key Selling Points:**\n` +
          `• Community exclusivity and early access benefits\n` +
          `• Artist/creator background and vision\n` +
          `• Roadmap for future drops and utilities\n` +
          `• Discord community size and engagement\n\n` +
          `**Recommended Opening:**\n` +
          `"We're building an exclusive community around ${pitch.projectName} - ${pitch.description}. Early supporters get access to our private Discord and future collaborations."\n\n` +
          `**Quick Win Opportunity:**\n` +
          `Whitelist spot for active community members\n\n` +
          `**Best Contact Time:** ${persona.preferences.activeHours}`
      } else {
        content += `**Key Selling Points:**\n` +
          `• Educational resources and community support\n` +
          `• Transparent team and clear documentation\n` +
          `• Start small and scale up approach\n` +
          `• Strong safety measures and risk management\n\n` +
          `**Recommended Opening:**\n` +
          `"${pitch.projectName} is designed for thoughtful investors - ${pitch.description}. We provide extensive documentation and community support."\n\n` +
          `**Best Contact Time:** ${persona.preferences.activeHours}`
      }
      
      suggestions = [
        "Offer a trial or small test investment",
        "Provide detailed documentation",
        "Highlight relevant security measures",
        "Connect with similar users who've succeeded"
      ]
    } 
    else if (matchScore >= 50) {
      content = `🔄 **Moderate compatibility** (${matchScore}% match)\n\n**Partial alignment:**\n`
      
      const interestMatches = pitch.targetAttributes.filter(attr => 
        persona.preferences.interests.some(interest => 
          interest.includes(attr.toLowerCase()) || attr.toLowerCase().includes(interest)
        )
      )
      
      if (interestMatches.length > 0) {
        content += `• Shared interests: ${interestMatches.join(', ')}\n`
      }
      
      content += `• User type: ${persona.name} with ${persona.agentPersonality.toLowerCase()} approach\n\n`
      
      if (persona.preferences.riskLevel !== pitch.riskLevel) {
        content += `**⚠️ Risk mismatch**: User prefers ${persona.preferences.riskLevel}-risk, you're offering ${pitch.riskLevel}-risk\n\n`
        warnings.push(`Risk tolerance mismatch`)
      }
      
      content += `**💡 To improve compatibility:**\n\n`
      
      if (pitch.riskLevel === 'high' && persona.preferences.riskLevel !== 'high') {
        content += `1. **Reduce perceived risk**\n   • Offer smaller entry points\n   • Provide risk management tools\n   • Share success stories from similar users\n\n`
      }
      
      content += `2. **Customize messaging**\n   • Focus on ${persona.preferences.interests[0]} aspects\n   • Address ${persona.name}'s typical concerns\n   • Use ${persona.agentPersonality.toLowerCase()} communication style\n\n` +
        `3. **Timing optimization**\n   • Contact during ${persona.preferences.activeHours}\n   • Allow ${persona.preferences.avgLockPeriod / 2} days for decision-making`
      
      suggestions = [
        "Address the risk mismatch directly",
        "Provide more educational content",
        "Offer flexible terms or guarantees",
        "Show social proof from similar users"
      ]
    }
    else {
      content = `⚠️ **Low compatibility** (${matchScore}% match)\n\n**Major mismatches:**\n`
      
      if (persona.preferences.riskLevel === 'low' && pitch.riskLevel === 'high') {
        content += `• Risk tolerance: User is risk-averse, your offering is high-risk\n`
        warnings.push("Major risk mismatch")
      }
      
      if (persona.id === 'crypto_newbie' && pitch.commitment.includes('40 hours')) {
        content += `• Time commitment: User is casual, you require intensive participation\n`
        warnings.push("Time commitment too high")
      }
      
      const interestMatches = pitch.targetAttributes.filter(attr => 
        persona.preferences.interests.some(interest => 
          interest.includes(attr.toLowerCase()) || attr.toLowerCase().includes(interest)
        )
      )
      
      if (interestMatches.length === 0) {
        content += `• Interest mismatch: No overlap between user interests (${persona.preferences.interests.join(', ')}) and your offering\n`
        warnings.push("No interest alignment")
      }
      
      content += `\n❌ **Recommendation**: This user is unlikely to engage with your current offering.\n\n` +
        `**Alternative suggestions:**\n` +
        `• Consider targeting ${this.getSuggestedUserTypes(pitch)} instead\n` +
        `• Modify your offering to reduce barriers\n` +
        `• Create educational content to bridge the gap\n\n` +
        `**If you must proceed:**\n` +
        `• Start with very small commitment requests\n` +
        `• Provide extensive education and support\n` +
        `• Offer money-back guarantees or trial periods`
      
      suggestions = [
        "Target different user segments",
        "Redesign offering to reduce barriers",
        "Create educational content first",
        "Consider partnership with user's trusted protocols"
      ]
    }
    
    return {
      content,
      matchScore,
      confidence: matchScore,
      suggestions,
      warnings
    }
  }

  private getSuggestedUserTypes(pitch: AdvertiserPitch): string {
    if (pitch.riskLevel === 'high') return "gaming-focused communities or high-risk investors"
    if (pitch.targetAttributes.includes('governance')) return "DAO-active users or governance enthusiasts" 
    if (pitch.targetAttributes.includes('nft')) return "art collectors or PFP enthusiasts"
    return "more suitable user segments"
  }

  getQuickResponses(): string[] {
    return [
      "What's this user interested in?",
      "How much do they typically invest?", 
      "What's their risk tolerance?",
      "When are they most active?",
      "What protocols do they use?",
      "What are their main pain points?",
      "What motivates their decisions?"
    ]
  }

  getAdvertiserScenarios(): AdvertiserPitch[] {
    return ADVERTISER_SCENARIOS
  }

  // Simulate typing delay for realistic chat experience
  async simulateTyping(baseDelay: number = 1000): Promise<void> {
    const delay = baseDelay + Math.random() * 1000
    return new Promise(resolve => setTimeout(resolve, delay))
  }
}

export const agentService = new AgentService()
export default agentService