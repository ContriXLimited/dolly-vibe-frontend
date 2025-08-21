"use client"

import { useState, useEffect, useMemo } from "react"
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
  vibePass: UserVibePass | null
  onSuccess: () => void
  needsJoin?: boolean
  onJoinSuccess?: (vibePass: UserVibePass) => void
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

export function MintModal({ isOpen, onClose, vibePass, onSuccess, onJoinSuccess }: MintModalProps) {
  const { address, chain } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const needsJoin = useMemo(() => vibePass == null, [vibePass])
  const { writeContract, data: hash, error: contractError, isPending: isContractPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    confirmations: 3, // Wait for 3 block confirmations
  })

  const [steps, setSteps] = useState<MintStep[]>([
    {
      id: 1,
      title: "Join Project",
      description: "Join the project to generate your VibePass",
      status: needsJoin ? 'pending' : 'completed'
    },
    {
      id: 2,
      title: "Upload Metadata to 0G Storage",
      description: "Uploading your profile data to decentralized storage",
      status: 'pending'
    },
    {
      id: 3,
      title: "Mint Intelligent NFT",
      description: "Creating your unique INFT on the blockchain",
      status: 'pending'
    }
  ])

  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(needsJoin ? 0 : 1)
  const [isJoining, setIsJoining] = useState(false)
  const [mintResult, setMintResult] = useState<MintResult | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [mintParams, setMintParams] = useState<{ contractAddress: string, methodName: string, params: any[], abi: any[], to: string, data: string, metadata: any } | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [walletSignature, setWalletSignature] = useState<{ nonce: string, signature: string } | null>(null)
  const [localVibePass, setLocalVibePass] = useState<UserVibePass | null>(vibePass)

  // Sync steps state when modal opens or needsJoin changes
  useEffect(() => {
    if (isOpen) {
      setSteps(prev => prev.map(step => ({
        ...step,
        status: step.id === 1 ? (needsJoin ? 'pending' : 'completed') : 'pending'
      })))
      setCurrentStep(needsJoin ? 0 : 1)
      // Reset other states when modal opens
      setIsCompleted(false)
      setMintResult(null)
      setUploadResult(null)
      setMintParams(null)
      setWalletSignature(null)
      // Sync local VibePass with prop
      setLocalVibePass(vibePass)
    }
  }, [isOpen, needsJoin, vibePass])

  // Monitor transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash && mintParams && uploadResult && localVibePass) {
      console.log('🎉 Transaction confirmed:', hash)

      // Call confirmMint API to notify server
      const notifyServer = async () => {
        try {
          console.log('📡 Notifying server about successful mint...')
          await VibePassService.confirmMint(localVibePass.id, {
            txHash: hash,
            rootHash: mintParams.metadata.rootHash,
            sealedKey: mintParams.metadata.sealedKey
          })
          console.log('✅ Server notified successfully')

          updateStepStatus(3, 'completed')
          setMintResult({
            mintTxHash: hash,
            mintedAt: new Date().toISOString()
          })
          setIsCompleted(true)

          toast.success("🎉 INFT minted successfully!", {
            description: "Your intelligent NFT is now on the blockchain!"
          })
          
          // Immediately refresh the parent component's data
          onSuccess()
        } catch (error: any) {
          console.error('❌ Failed to notify server:', error)
          // Still mark as completed since the mint was successful on-chain
          updateStepStatus(3, 'completed')
          setMintResult({
            mintTxHash: hash,
            mintedAt: new Date().toISOString()
          })
          setIsCompleted(true)

          toast.success("🎉 INFT minted successfully!", {
            description: "Your NFT is on-chain, but server notification failed"
          })
          
          // Immediately refresh the parent component's data
          onSuccess()
        } finally {
          setIsProcessing(false)
        }
      }

      notifyServer()
    }
  }, [isConfirmed, hash, mintParams, uploadResult, localVibePass])

  // Monitor transaction errors
  useEffect(() => {
    if (contractError) {
      console.error('❌ Contract execution failed:', contractError)

      updateStepStatus(3, 'failed')
      toast.error("Transaction failed", {
        description:  "Failed to execute mint transaction"
      })

      console.error('❌ Contract execution failed:', contractError)

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

  // Step 1: Join Project
  const joinProject = async () => {
    if (!needsJoin) return null

    setIsJoining(true)
    updateStepStatus(1, 'in_progress')
    setCurrentStep(1)

    try {
      toast.info("Joining project...")
      const joinedVibePass = await VibePassService.joinProject({})
      console.log('✅ Successfully joined project:', joinedVibePass)

      updateStepStatus(1, 'completed')
      toast.success("Successfully joined project!")

      // Update local state with joined VibePass
      setLocalVibePass(joinedVibePass)
      
      // Call onJoinSuccess to update parent component
      if (onJoinSuccess) {
        onJoinSuccess(joinedVibePass)
      }

      return joinedVibePass
    } catch (error: any) {
      console.error('❌ Failed to join project:', error)
      updateStepStatus(1, 'failed')
      throw error
    } finally {
      setIsJoining(false)
    }
  }

  // Step 2: Upload Metadata (internal function)
  const uploadMetadata = async (nonce: string, signature: string) => {
    if (!validateNetwork() || !address || !localVibePass) {
      throw new Error("Network validation failed, wallet not connected, or no VibePass available")
    }

    console.log('🔄 Setting step 2 as in_progress...')
    updateStepStatus(2, 'in_progress')
    setCurrentStep(2)

    toast.info("Uploading metadata to 0G Storage...")

    const metadataResult = await VibePassService.uploadMetadata(localVibePass.id, {
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
    updateStepStatus(2, 'completed')
    toast.success("Metadata uploaded successfully!")

    return metadataResult
  }

  // Step 3: Mint INFT (includes getting parameters + executing transaction)
  const mintINFTWithParams = async (metadataResult: UploadResult) => {
    if (!validateNetwork() || !address || !localVibePass) {
      throw new Error("Network validation failed, wallet not connected, or no VibePass available")
    }

    if (!metadataResult?.rootHash) {
      throw new Error("No metadata found, please upload metadata first")
    }

    updateStepStatus(3, 'in_progress')
    setCurrentStep(3)

    toast.info("Preparing mint transaction...")

    // Get mint parameters (hidden from user)
    console.log('🔍 Getting mint parameters...')
    const mintParams = await VibePassService.getMintParams(localVibePass.id, address, metadataResult.rootHash)
    console.log('✅ Mint parameters retrieved:', mintParams)
    setMintParams(mintParams)

    // Execute mint transaction
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

  // Handle join step
  const handleJoin = async () => {
    if (!needsJoin) return

    try {
      await joinProject()
    } catch (error: any) {
      toast.error("Join failed", {
        description: error.response?.data?.message || error.message || "Failed to join project"
      })
    }
  }

  // Main function: Start full minting process (upload + mint)
  const startMinting = async () => {
    if (!validateNetwork() || !address || !localVibePass) {
      toast.error("Cannot start minting", {
        description: "Please ensure wallet is connected and you have joined the project"
      })
      return
    }

    setIsProcessing(true)
    setCurrentStep(needsJoin ? 1 : 2)

    try {
      // Get wallet signature once at the beginning
      console.log('✍️ Getting wallet signature...')
      const { nonce, signature } = await ensureWalletSignature()
      console.log('✅ Wallet signature obtained, nonce:', nonce)

      // Step 2: Upload metadata using the signature
      console.log('📤 Starting metadata upload...')
      setCurrentStep(2)
      const metadataResult = await uploadMetadata(nonce, signature)
      console.log('✅ Upload completed:', metadataResult)

      // Step 3: Mint INFT (includes getting params + executing transaction)
      console.log('🪙 Starting mint process...')
      setCurrentStep(3)
      await mintINFTWithParams(metadataResult)
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
      if (currentStep === 2) {
        // Upload metadata failed
        updateStepStatus(2, 'failed')
        toast.error("Metadata upload failed", {
          description: error.response?.data?.message || error.message || "Failed to upload to 0G Storage"
        })
      } else if (currentStep === 3) {
        // Mint process failed (could be getting params or executing transaction)
        updateStepStatus(3, 'failed')
        toast.error("Minting failed", {
          description: error.response?.data?.message || error.message || "Failed to mint INFT"
        })
      } else {
        // Error occurred during signature step
        if (currentStep <= 2) {
          setCurrentStep(2) // Set to step 2 so UI shows the right context
          updateStepStatus(2, 'failed')
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

    // Reset step statuses (skip join step if already completed)
    setSteps(prev => prev.map(step => ({
      ...step,
      status: step.id === 1 && !needsJoin ? 'completed' : 'pending'
    })))
    setCurrentStep(needsJoin ? 0 : 1)

    // Start fresh process
    await startMinting()
  }

  // Handle complete and close modal
  const handleComplete = () => {
    onClose()
  }

  // Reset modal state when closed
  const handleClose = () => {
    if (!isProcessing && !isContractPending && !isConfirming && !isJoining) {
      setSteps(prev => prev.map(step => ({
        ...step,
        status: step.id === 1 && !needsJoin ? 'completed' : 'pending'
      })))
      setCurrentStep(needsJoin ? 0 : 1)
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
          {/* Step 1: Join Project */}
          <div className="flex items-start justify-between p-4 rounded-lg bg-neutral-800/50">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {steps[0].status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {steps[0].status === 'in_progress' && (
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                )}
                {steps[0].status === 'failed' && (
                  <Circle className="w-5 h-5 text-red-500" />
                )}
                {steps[0].status === 'pending' && (
                  <Circle className="w-5 h-5 text-neutral-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${steps[0].status === 'completed' ? 'text-green-400' :
                  steps[0].status === 'in_progress' ? 'text-orange-400' :
                    steps[0].status === 'failed' ? 'text-red-400' :
                      'text-neutral-300'
                  }`}>
                  {steps[0].title}
                </h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {steps[0].description}
                </p>
              </div>
            </div>

            {/* Join Button */}
            {needsJoin && steps[0].status !== 'completed' && (
              <Button
                onClick={handleJoin}
                disabled={isJoining || steps[0].status === 'in_progress'}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                {isJoining ? "Joining..." : "Join"}
              </Button>
            )}
          </div>

          {/* Steps 2 & 3: Combined Mint Process */}
          <div className="flex items-start justify-between p-4 rounded-lg bg-neutral-800/50">
            <div className="flex-1 space-y-3">
              {/* Step 2: Upload Metadata */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {steps[1].status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {steps[1].status === 'in_progress' && (
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {steps[1].status === 'failed' && (
                    <Circle className="w-5 h-5 text-red-500" />
                  )}
                  {steps[1].status === 'pending' && (
                    <Circle className="w-5 h-5 text-neutral-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium text-sm ${steps[1].status === 'completed' ? 'text-green-400' :
                    steps[1].status === 'in_progress' ? 'text-orange-400' :
                      steps[1].status === 'failed' ? 'text-red-400' :
                        'text-neutral-300'
                    }`}>
                    {steps[1].title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {steps[1].description}
                  </p>
                </div>
              </div>

              {/* Step 3: Mint INFT */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {steps[2].status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {steps[2].status === 'in_progress' && (
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {steps[2].status === 'failed' && (
                    <Circle className="w-5 h-5 text-red-500" />
                  )}
                  {steps[2].status === 'pending' && (
                    <Circle className="w-5 h-5 text-neutral-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium text-sm ${steps[2].status === 'completed' ? 'text-green-400' :
                    steps[2].status === 'in_progress' ? 'text-orange-400' :
                      steps[2].status === 'failed' ? 'text-red-400' :
                        'text-neutral-300'
                    }`}>
                    {steps[2].title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {steps[2].id === 3 && isConfirming ? "Waiting for 3 block confirmations..." : steps[2].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Mint Button */}
            {(!needsJoin || steps[0].status === 'completed') && 
             !isProcessing && 
             !isCompleted && (
              <div className="ml-4">
                {(steps[1].status === 'failed' || steps[2].status === 'failed') ? (
                  <Button
                    onClick={resetAndRestart}
                    disabled={isProcessing || isContractPending || isConfirming}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    size="sm"
                  >
                    {(isProcessing || isContractPending) ? "Retrying..." : "Retry"}
                  </Button>
                ) : (
                  <Button
                    onClick={startMinting}
                    disabled={isProcessing || isContractPending || isConfirming || !localVibePass}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    size="sm"
                  >
                    {isProcessing || isContractPending || isConfirming ? (
                      currentStep === 2 ? "Uploading..." :
                        currentStep === 3 ? "Minting..." :
                          isContractPending ? "Confirm Transaction..." :
                            isConfirming ? "Confirming..." :
                              "Processing..."
                    ) : (
                      "Mint INFT"
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
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
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing || isContractPending || isConfirming || isJoining}
              className="w-full"
            >
              Cancel
            </Button>
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