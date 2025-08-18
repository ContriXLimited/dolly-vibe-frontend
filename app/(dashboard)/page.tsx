import { redirect } from 'next/navigation'

export default function DashboardHomePage() {
  // Use server-side redirect instead of client-side
  redirect('/vibepass')
}