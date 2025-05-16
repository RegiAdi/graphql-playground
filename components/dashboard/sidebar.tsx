"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Shield, Sword, Scroll, Trophy, Users, LogOut, Swords, Coins } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { usePlayer } from "@/contexts/player-context"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()
  const { gold } = usePlayer() // Use gold from context

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="w-64 bg-gray-800 p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500 bg-gray-700 flex items-center justify-center">
          <span className="text-xl font-bold">D</span>
        </div>
        <div>
          <h2 className="font-bold text-base">DragonSlayer</h2>
          <p className="text-[0.7rem] text-gray-400">Level 42 Mage</p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        <SidebarItem
          href="/dashboard"
          icon={<Sword className="w-5 h-5" />}
          label="Character Stats"
          active={pathname === "/dashboard"}
        />
        <SidebarItem
          href="/dashboard/inventory"
          icon={<Shield className="w-5 h-5" />}
          label="Inventory"
          active={pathname === "/dashboard/inventory"}
        />
        <SidebarItem
          href="/dashboard/quests"
          icon={<Scroll className="w-5 h-5" />}
          label="Quests"
          active={pathname === "/dashboard/quests"}
        />
        <SidebarItem
          href="/dashboard/leaderboard"
          icon={<Trophy className="w-5 h-5" />}
          label="Leaderboard"
          active={pathname === "/dashboard/leaderboard"}
        />
        <SidebarItem
          href="/dashboard/guild"
          icon={<Users className="w-5 h-5" />}
          label="Guild"
          active={pathname === "/dashboard/guild"}
        />
        <SidebarItem
          href="/dashboard/battle"
          icon={<Swords className="w-5 h-5" />}
          label="Battle"
          active={pathname === "/dashboard/battle"}
        />
      </nav>

      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[0.7rem]">
            <div className="text-gray-400">Server</div>
            <div className="font-medium">Azeroth-PVP</div>
          </div>
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex items-center gap-2 mb-4 px-2 py-1 bg-gray-700/50 rounded-md">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="text-xs">{gold.toLocaleString()} Gold</span>
        </div>
        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
}

function SidebarItem({ href, icon, label, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors ${
        active ? "bg-purple-900/50 text-purple-300" : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
