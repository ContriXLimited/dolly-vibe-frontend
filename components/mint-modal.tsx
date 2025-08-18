"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, ExternalLink } from "lucide-react"
import { useAccount, useSignMessage } from 'wagmi'
import { VibePassService, UserVibePass } from "@/services/vibepass"
import { AuthService } from "@/services/auth"
import { toast } from "sonner"

interface MintModalProps {
  isOpen: boolean
  onClose: () => void
  vibePass: UserVibePass
  onSuccess: () => void
}

interface MintStep {
  id: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
}

interface MintResult {
  tokenId?: string
  mintTxHash?: string
  mintedAt?: string
}

interface UploadResult {
  rootHash?: string
  sealedKey?: string
}

export function MintModal({ isOpen, onClose, vibePass, onSuccess }: MintModalProps) {
  const { address, chain } = useAccount()
  const { signMessageAsync } = useSignMessage()
  
  const [steps, setSteps] = useState<MintStep[]>([
    {
      id: 1,
      title: "Upload Metadata to 0G Storage",
      description: "Uploading your profile data to decentralized storage",
      status: 'pending'
    },
    {
      id: 2,
      title: "Mint Intelligent NFT",
      description: "Creating your unique INFT on the blockchain",
      status: 'pending'
    }
  ])
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [mintResult, setMintResult] = useState<MintResult | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [walletSignature, setWalletSignature] = useState<{nonce: string, signature: string} | null>(null)


  // Update step status
  const updateStepStatus = (stepId: number, status: MintStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ))
  }

  // Validate network (0G Galileo Testnet)
  const validateNetwork = () => {
    if (!chain || chain.id !== 16601) {
      toast.error("Please switch to 0G Galileo Testnet", {
        description: "You need to be connected to the correct network to mint your INFT"
      })
      return false
    }
    return true
  }

  // Generate wallet signature
  const getWalletSignature = async () => {
    if (!address) {
      throw new Error("Wallet not connected")
    }

    // Get nonce from backend using AuthService
    const nonceData = await AuthService.getNonce(address)
    
    // Sign message with wallet
    const signature = await signMessageAsync({ message: nonceData.message })

    return { nonce: nonceData.nonce, signature }
  }

  // Get and cache wallet signature
  const ensureWalletSignature = async () => {
    if (walletSignature) {
      console.log('🔄 Using cached wallet signature')
      return walletSignature
    }
    
    console.log('✍️ Getting new wallet signature...')
    toast.info("Please sign the message in your wallet")
    
    try {
      const signature = await getWalletSignature()
      console.log('✅ Wallet signature obtained')
      setWalletSignature(signature)
      return signature
    } catch (error: any) {
      console.error('❌ Failed to get wallet signature:', error)
      throw error
    }
  }

  // Step 1: Upload Metadata (internal function)
  const uploadMetadata = async (nonce: string, signature: string) => {
    if (!validateNetwork() || !address) {
      throw new Error("Network validation failed or wallet not connected")
    }

    updateStepStatus(1, 'in_progress')
    setCurrentStep(1)
    
    toast.info("Uploading metadata to 0G Storage...")
    
    const metadataResult = await VibePassService.uploadMetadata(vibePass.id, {
      walletAddress: address,
      nonce,
      signature,
      tokenMetadata: {
        name: `Dolly Vibe INFT #${Date.now()}`,
        description: "Intelligent NFT representing user profile in Dolly Vibe",
        attributes: []
      }
    })
    
    setUploadResult(metadataResult)
    updateStepStatus(1, 'completed')
    toast.success("Metadata uploaded successfully!")
    
    return metadataResult
  }

  // Step 2: Mint INFT (internal function) 
  const mintINFTOnly = async (metadataResult: UploadResult, nonce: string, signature: string) => {
    if (!validateNetwork() || !address) {
      throw new Error("Network validation failed or wallet not connected")
    }
    
    if (!metadataResult?.rootHash) {
      throw new Error("No metadata found, please upload metadata first")
    }

    updateStepStatus(2, 'in_progress')
    setCurrentStep(2)
    
    toast.info("Minting your INFT on the blockchain...")
    
    console.log('🚀 Calling VibePassService.mintINFT with params:', {
      vibePassId: vibePass.id,
      walletAddress: address,
      rootHash: metadataResult.rootHash,
      sealedKey: metadataResult.sealedKey,
      nonce
    })
    
    const mintResult = await VibePassService.mintINFT(vibePass.id, {
      walletAddress: address,
      rootHash: metadataResult.rootHash,
      sealedKey: metadataResult.sealedKey, // Optional
      nonce,
      signature,
      tokenMetadata: {
        name: `Dolly Vibe INFT #${Date.now()}`,
        description: "Intelligent NFT representing user profile in Dolly Vibe",
        attributes: []
      }
    })
    
    console.log('🎉 Mint API call successful:', mintResult)
    
    updateStepStatus(2, 'completed')
    // Extract the mint result data from the UserVibePass response
    setMintResult({
      tokenId: mintResult.tokenId || undefined,
      mintTxHash: mintResult.mintTxHash || undefined,
      mintedAt: mintResult.mintedAt || undefined
    })
    setIsCompleted(true)
    
    toast.success("🎉 INFT minted successfully!", {
      description: "Your intelligent NFT is now on the blockchain!"
    })

    return mintResult
  }

  // Main function: Start full minting process (upload + mint)
  const startMinting = async () => {
    if (!validateNetwork() || !address) return

    setIsProcessing(true)
    setCurrentStep(0)

    try {
      // Get wallet signature once at the beginning
      console.log('✍️ Getting wallet signature...')
      const { nonce, signature } = await ensureWalletSignature()
      console.log('✅ Wallet signature obtained, nonce:', nonce)
      
      // Step 1: Upload metadata using the signature
      console.log('📤 Starting metadata upload...')
      setCurrentStep(1)
      const metadataResult = await uploadMetadata(nonce, signature)
      console.log('✅ Upload completed:', metadataResult)
      
      // Step 2: Mint INFT using the same signature
      console.log('🪙 Starting mint process...')
      setCurrentStep(2)
      await mintINFTOnly(metadataResult, nonce, signature)
      console.log('✅ Mint completed successfully!')

    } catch (error: any) {
      console.error('❌ Minting process failed:', error)
      console.error('Current step:', currentStep)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      })
      
      // Show appropriate error message
      if (currentStep === 1) {
        updateStepStatus(1, 'failed')
        toast.error("Metadata upload failed", {
          description: error.response?.data?.message || error.message || "Failed to upload to 0G Storage"
        })
      } else if (currentStep === 2) {
        updateStepStatus(2, 'failed')
        toast.error("Minting failed", {
          description: error.response?.data?.message || error.message || "Failed to mint INFT"
        })
      } else {
        // Handle errors that occur before steps start (e.g., network validation, signature)
        toast.error("Process failed", {
          description: error.response?.data?.message || error.message || "An unexpected error occurred"
        })
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // Reset and restart the entire process (when failed)
  const resetAndRestart = async () => {
    // Reset all states
    setWalletSignature(null) // Clear cached signature to get new nonce
    setUploadResult(null)
    setMintResult(null)
    setIsCompleted(false)
    
    // Reset step statuses
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))
    setCurrentStep(0)
    
    // Start fresh process
    await startMinting()
  }

  // Handle complete and refresh
  const handleComplete = () => {
    onSuccess()
    onClose()
    // Refresh the page to update tokenId
    window.location.reload()
  }

  // Reset modal state when closed
  const handleClose = () => {
    if (!isProcessing) {
      setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))
      setCurrentStep(0)
      setIsCompleted(false)
      setMintResult(null)
      setUploadResult(null)
      setWalletSignature(null)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Mint Your INFT">
      <div className="space-y-6">

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-3 p-4 rounded-lg bg-neutral-800/50">
              <div className="mt-0.5">
                {step.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {step.status === 'in_progress' && (
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                )}
                {step.status === 'failed' && (
                  <Circle className="w-5 h-5 text-red-500" />
                )}
                {step.status === 'pending' && (
                  <Circle className="w-5 h-5 text-neutral-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${
                  step.status === 'completed' ? 'text-green-400' :
                  step.status === 'in_progress' ? 'text-orange-400' :
                  step.status === 'failed' ? 'text-red-400' :
                  'text-neutral-300'
                }`}>
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mint Result */}
        {isCompleted && mintResult && (
          <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg space-y-3">
            <h3 className="text-green-400 font-medium">🎉 Minting Successful!</h3>
            <div className="space-y-2 text-sm">
              {mintResult.tokenId && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Token ID:</span>
                  <span className="text-white font-mono">#{mintResult.tokenId}</span>
                </div>
              )}
              {mintResult.mintTxHash && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Transaction:</span>
                  <a
                    href={`https://chainscan-galileo.0g.ai/tx/${mintResult.mintTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono text-xs"
                  >
                    {mintResult.mintTxHash.slice(0, 8)}...{mintResult.mintTxHash.slice(-8)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {mintResult.mintedAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Minted At:</span>
                  <span className="text-white text-xs">
                    {new Date(mintResult.mintedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isCompleted ? (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              
              {/* Main Mint Button */}
              {(steps[0].status === 'failed' || steps[1].status === 'failed') ? (
                <Button
                  onClick={resetAndRestart}
                  disabled={isProcessing}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  {isProcessing ? "Retrying..." : "Retry"}
                </Button>
              ) : (
                <Button
                  onClick={startMinting}
                  disabled={isProcessing}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {isProcessing ? (
                    currentStep === 1 ? "Uploading..." : "Minting..."
                  ) : (
                    "Mint INFT"
                  )}
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Complete
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}