"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardHomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to vibepass page by default
    router.replace('/vibepass')
  }, [router])

  // Show a loading state while redirecting
  return (
    <div className="p-6 flex items-center justify-center h-96">
      <div className="text-white text-lg">Redirecting to VibePass...</div>
    </div>
  )
}