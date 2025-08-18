"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"

export default function RootPage() {
  const router = useRouter()
  const { isLoggedIn, initialize } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize auth store first
    initialize()
    
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [initialize])

  useEffect(() => {
    if (!isInitialized) return

    // Check if user is logged in (has completed wallet authentication)
    if (isLoggedIn) {
      // User is logged in, redirect to dashboard
      router.replace('/vibepass')
    } else {
      // User is not logged in, redirect to login
      router.replace('/login')
    }
  }, [router, isLoggedIn, isInitialized])

  // Show a loading state while redirecting
  return (
    <div className="p-6 flex items-center justify-center h-96">
      <div className="text-white text-lg">Redirecting...</div>
    </div>
  )
}