"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, ExternalLink } from "lucide-react"
import { useAccount, useSignMessage, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
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
  const { writeContract, data: hash, error: contractError, isPending: isContractPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })
  
  const [steps, setSteps] = useState<MintStep[]>([
    {
      id: 1,
      title: "Upload Metadata to 0G Storage",
      description: "Uploading your profile data to decentralized storage",
      status: 'pending'
    },
    {
      id: 2,
      title: "Get Mint Parameters",
      description: "Retrieving contract parameters from backend",
      status: 'pending'
    },
    {
      id: 3,
      title: "Execute Mint Transaction",
      description: "Creating your unique INFT on the blockchain",
      status: 'pending'
    }
  ])
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [mintResult, setMintResult] = useState<MintResult | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [mintParams, setMintParams] = useState<{contractAddress: string, methodName: string, params: any[], abi: any[], to: string, data: string, metadata: any} | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [walletSignature, setWalletSignature] = useState<{nonce: string, signature: string} | null>(null)

  // Monitor transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log('🎉 Transaction confirmed:', hash)
      
      updateStepStatus(3, 'completed')
      // Note: We could extract tokenId from transaction receipt if needed
      setMintResult({
        mintTxHash: hash,
        mintedAt: new Date().toISOString()
      })
      setIsCompleted(true)
      
      toast.success("🎉 INFT minted successfully!", {
        description: "Your intelligent NFT is now on the blockchain!"
      })
      
      setIsProcessing(false)
    }
  }, [isConfirmed, hash])

  // Monitor transaction errors
  useEffect(() => {
    if (contractError) {
      console.error('❌ Contract execution failed:', contractError)
      
      updateStepStatus(3, 'failed')
      toast.error("Transaction failed", {
        description: contractError.message || "Failed to execute mint transaction"
      })
      
      setIsProcessing(false)
    }
  }, [contractError])

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
    const signature = await signMessageAsync({ 
      message: nonceData.message,
      account: address
    })

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

    console.log('🔄 Setting step 1 as in_progress...')
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

  // Step 2: Get Mint Parameters (internal function)
  const getMintParameters = async (metadataResult: UploadResult) => {
    if (!validateNetwork() || !address) {
      throw new Error("Network validation failed or wallet not connected")
    }
    
    if (!metadataResult?.rootHash) {
      throw new Error("No metadata found, please upload metadata first")
    }

    updateStepStatus(2, 'in_progress')
    setCurrentStep(2)
    
    toast.info("Getting mint parameters from backend...")
    
    const mintParams = await VibePassService.getMintParams(vibePass.id, address, metadataResult.rootHash)
    
    setMintParams(mintParams)
    updateStepStatus(2, 'completed')
    toast.success("Mint parameters retrieved successfully!")
    
    return mintParams
  }

  // Step 3: Execute Mint Transaction (internal function) 
  const executeMintTransaction = async (mintParams: {contractAddress: string, methodName: string, params: any[], abi: any[], to: string, data: string, metadata: any}) => {
    if (!validateNetwork() || !address) {
      throw new Error("Network validation failed or wallet not connected")
    }

    updateStepStatus(3, 'in_progress')
    setCurrentStep(3)
    
    toast.info("Executing mint transaction...")
    
    console.log('🚀 Calling writeContract with params:', {
      address: mintParams.contractAddress,
      abi: mintParams.abi,
      functionName: mintParams.methodName,
      args: mintParams.params
    })
    
    // Execute the contract write
    writeContract({
      address: mintParams.contractAddress as `0x${string}`,
      abi: mintParams.abi,
      functionName: mintParams.methodName,
      args: mintParams.params,
      account: address,
      chain: chain
    })
    
    // Note: We'll handle the success in the useEffect that monitors transaction status
  }

  // Main function: Start full minting process (upload + get params + mint)
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
      
      // Step 2: Get mint parameters
      console.log('🔍 Getting mint parameters...')
      setCurrentStep(2)
      const mintParams = await getMintParameters(metadataResult)
      console.log('✅ Mint parameters retrieved:', mintParams)
      
      // Step 3: Execute mint transaction
      console.log('🪙 Starting mint transaction...')
      setCurrentStep(3)
      await executeMintTransaction(mintParams)
      console.log('✅ Mint transaction initiated!')
      
      // Note: Transaction completion is handled by useEffect hooks

    } catch (error: any) {
      console.error('❌ Minting process failed:', error)
      console.error('Current step:', currentStep)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      })
      
      // Show appropriate error message based on current step
      if (currentStep === 1) {
        // Upload metadata failed
        updateStepStatus(1, 'failed')
        toast.error("Metadata upload failed", {
          description: error.response?.data?.message || error.message || "Failed to upload to 0G Storage"
        })
      } else if (currentStep === 2) {
        // Get mint parameters failed
        updateStepStatus(2, 'failed')
        toast.error("Failed to get mint parameters", {
          description: error.response?.data?.message || error.message || "Failed to retrieve contract parameters"
        })
      } else if (currentStep === 3) {
        // Execute mint transaction failed
        updateStepStatus(3, 'failed')
        toast.error("Transaction initiation failed", {
          description: error.response?.data?.message || error.message || "Failed to initiate mint transaction"
        })
      } else {
        // Error occurred before any step started (step 0) - likely during signature or upload
        // Since we're in the upload phase, mark step 1 as failed
        if (currentStep === 0) {
          setCurrentStep(1) // Set to step 1 so UI shows the right context
          updateStepStatus(1, 'failed')
        }
        toast.error("Process failed", {
          description: error.response?.data?.message || error.message || "Failed to start the minting process"
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
    setMintParams(null)
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
    if (!isProcessing && !isContractPending && !isConfirming) {
      setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))
      setCurrentStep(0)
      setIsCompleted(false)
      setMintResult(null)
      setUploadResult(null)
      setMintParams(null)
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
                  {step.id === 3 && isConfirming ? "Waiting for transaction confirmation..." : step.description}
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
                disabled={isProcessing || isContractPending || isConfirming}
                className="flex-1"
              >
                Cancel
              </Button>
              
              {/* Main Mint Button */}
              {(steps[0].status === 'failed' || steps[1].status === 'failed' || steps[2].status === 'failed') ? (
                <Button
                  onClick={resetAndRestart}
                  disabled={isProcessing || isContractPending || isConfirming}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  {(isProcessing || isContractPending) ? "Retrying..." : "Retry"}
                </Button>
              ) : (
                <Button
                  onClick={startMinting}
                  disabled={isProcessing || isContractPending || isConfirming}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {isProcessing || isContractPending || isConfirming ? (
                    currentStep === 1 ? "Uploading..." : 
                    currentStep === 2 ? "Getting Parameters..." : 
                    isContractPending ? "Confirm Transaction..." :
                    isConfirming ? "Confirming..." :
                    "Processing..."
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