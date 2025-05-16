"use client"

import type React from "react"

import { Shield, Sword, Scroll, Trophy, Users } from "lucide-react"
import Image from "next/image"

type Tab = "stats" | "inventory" | "quests" | "leaderboard" | "guild"

interface SidebarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500">
          <Image
            src="/placeholder.svg?height=48&width=48"
            alt="Player avatar"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="font-bold text-lg">DragonSlayer</h2>
          <p className="text-xs text-gray-400">Level 42 Mage</p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        <SidebarItem
          icon={<Sword className="w-5 h-5" />}
          label="Character Stats"
          active={activeTab === "stats"}
          onClick={() => setActiveTab("stats")}
        />
        <SidebarItem
          icon={<Shield className="w-5 h-5" />}
          label="Inventory"
          active={activeTab === "inventory"}
          onClick={() => setActiveTab("inventory")}
        />
        <SidebarItem
          icon={<Scroll className="w-5 h-5" />}
          label="Quests"
          active={activeTab === "quests"}
          onClick={() => setActiveTab("quests")}
        />
        <SidebarItem
          icon={<Trophy className="w-5 h-5" />}
          label="Leaderboard"
          active={activeTab === "leaderboard"}
          onClick={() => setActiveTab("leaderboard")}
        />
        <SidebarItem
          icon={<Users className="w-5 h-5" />}
          label="Guild"
          active={activeTab === "guild"}
          onClick={() => setActiveTab("guild")}
        />
      </nav>

      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-xs">
            <div className="text-gray-400">Server</div>
            <div className="font-medium">Azeroth-PVP</div>
          </div>
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors ${
        active ? "bg-purple-900/50 text-purple-300" : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
