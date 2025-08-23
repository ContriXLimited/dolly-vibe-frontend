"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Send, MessageCircle, Target, Lightbulb, AlertTriangle } from "lucide-react"
import { agentService, UserAttributes, ConversationMessage, AdvertiserPitch } from "@/services/agent"

interface AgentChatProps {
  isOpen: boolean
  onClose: () => void
  userAttributes: UserAttributes
  userName?: string
}

type ChatMode = 'insights' | 'advertiser'

export function AgentChat({ isOpen, onClose, userAttributes, userName = "Anonymous User" }: AgentChatProps) {
  const [mode, setMode] = useState<ChatMode>('insights')
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<AdvertiserPitch | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      // Initialize with welcome message
      const welcomeMessage: ConversationMessage = {
        id: `welcome-${Date.now()}`,
        sender: 'agent',
        content: mode === 'insights' 
          ? `Hello! I'm the AI agent representing **${userName}**. I can share insights about their preferences, behavior patterns, and interests while protecting their privacy. What would you like to know?`
          : `Hi! I'm **${userName}'s** AI representative. I can help you understand if your product or service would be a good fit for this user. Please describe what you're offering.`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, mode, userName])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    await agentService.simulateTyping(1500)

    // Generate agent response
    let agentResponse
    if (mode === 'insights') {
      agentResponse = agentService.generateUserInsightResponse(userAttributes, inputValue)
    } else {
      // For advertiser mode, we need to parse the input or use selected scenario
      const scenario = selectedScenario || agentService.getAdvertiserScenarios()[0]
      agentResponse = agentService.generateAdvertiserResponse(userAttributes, scenario)
    }

    const agentMessage: ConversationMessage = {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      content: agentResponse.content,
      timestamp: new Date(),
      metadata: {
        matchScore: agentResponse.matchScore,
        actionable: true,
        warningFlags: agentResponse.warnings
      }
    }

    setMessages(prev => [...prev, agentMessage])
    setIsTyping(false)
  }

  const handleQuickQuestion = async (question: string) => {
    setInputValue("")
    
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      sender: 'user', 
      content: question,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    await agentService.simulateTyping(1200)

    const agentResponse = agentService.generateUserInsightResponse(userAttributes, question)
    
    const agentMessage: ConversationMessage = {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      content: agentResponse.content,
      timestamp: new Date(),
      metadata: {
        actionable: true
      }
    }

    setMessages(prev => [...prev, agentMessage])
    setIsTyping(false)
  }

  const handleScenarioTest = async (scenario: AdvertiserPitch) => {
    setSelectedScenario(scenario)
    
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: `I'm from ${scenario.projectName}. ${scenario.description}. Would this be a good fit for this user?`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    await agentService.simulateTyping(2000)

    const agentResponse = agentService.generateAdvertiserResponse(userAttributes, scenario)
    
    const agentMessage: ConversationMessage = {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      content: agentResponse.content,
      timestamp: new Date(),
      metadata: {
        matchScore: agentResponse.matchScore,
        actionable: true,
        warningFlags: agentResponse.warnings
      }
    }

    setMessages(prev => [...prev, agentMessage])
    setIsTyping(false)
  }

  const handleModeSwitch = (newMode: ChatMode) => {
    setMode(newMode)
    setMessages([])
    setSelectedScenario(null)
  }

  const quickQuestions = agentService.getQuickResponses()
  const advertiserScenarios = agentService.getAdvertiserScenarios()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-700 pb-3">
          <div className="flex items-center gap-4">
            <MessageCircle className="w-6 h-6 text-orange-500" />
            <div>
              <CardTitle className="text-lg font-bold text-white tracking-wider">
                Agent Chat - {userName}
              </CardTitle>
              <p className="text-sm text-neutral-400">AI Representative</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-neutral-700 flex flex-col">
            {/* Mode Switcher */}
            <div className="p-4 border-b border-neutral-700">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleModeSwitch('insights')}
                  className={mode === 'insights' 
                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                    : "bg-neutral-800 border border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white"}
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Insights
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleModeSwitch('advertiser')}
                  className={mode === 'advertiser' 
                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                    : "bg-neutral-800 border border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white"}
                >
                  <Target className="w-4 h-4 mr-1" />
                  Advertise
                </Button>
              </div>
            </div>

            {/* User Profile Summary */}
            <div className="p-4 border-b border-neutral-700">
              <h3 className="text-sm font-medium text-neutral-300 mb-3">USER PROFILE</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Engagement:</span>
                  <span className="text-white">{userAttributes.engagement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Expertise:</span>
                  <span className="text-white">{userAttributes.expertise}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Interaction:</span>
                  <span className="text-white">{userAttributes.interaction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Civility:</span>
                  <span className="text-white">{userAttributes.civility}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex-1 overflow-y-auto p-4">
              {mode === 'insights' ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-neutral-300 mb-3">QUICK QUESTIONS</h3>
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      size="sm"
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-xs bg-neutral-800 border border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white justify-start"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-neutral-300 mb-3">TEST SCENARIOS</h3>
                  {advertiserScenarios.map((scenario) => (
                    <div key={scenario.id} className="border border-neutral-700 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-white mb-1">{scenario.projectName}</h4>
                      <p className="text-xs text-neutral-400 mb-2">{scenario.description}</p>
                      <div className="flex gap-1 mb-2">
                        <Badge variant="outline" className={`text-xs ${
                          scenario.riskLevel === 'high' ? 'border-red-500 text-red-500' :
                          scenario.riskLevel === 'medium' ? 'border-orange-500 text-orange-500' :
                          'border-green-500 text-green-500'
                        }`}>
                          {scenario.riskLevel} risk
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleScenarioTest(scenario)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs"
                      >
                        Test Match
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-neutral-800 text-white border border-neutral-700'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    {message.metadata?.matchScore !== undefined && (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge 
                          className={`text-xs ${
                            message.metadata.matchScore >= 80 ? 'bg-green-500/20 text-green-500' :
                            message.metadata.matchScore >= 50 ? 'bg-orange-500/20 text-orange-500' :
                            'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {message.metadata.matchScore}% match
                        </Badge>
                        {message.metadata.warningFlags && message.metadata.warningFlags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-500">
                              {message.metadata.warningFlags.length} warning(s)
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-neutral-400 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-sm text-neutral-400 ml-2">Agent is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-neutral-700 p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={mode === 'insights' ? "Ask about user preferences..." : "Describe your product or service..."}
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
          </div>
        </div>
      </Card>
    </div>
  )
}