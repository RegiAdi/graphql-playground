import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { PlayerProvider } from "@/contexts/player-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PlayerProvider>
      <div className="flex min-h-screen bg-gray-900 text-gray-100">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </PlayerProvider>
  )
}
