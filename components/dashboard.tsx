"use client"

import { useState } from "react"
import { ApolloProvider } from "@apollo/client"
import { client } from "@/lib/apollo-client"
import { Sidebar } from "@/components/sidebar"
import { CharacterStats } from "@/components/character-stats"
import { Inventory } from "@/components/inventory"
import { QuestTracker } from "@/components/quest-tracker"
import { LeaderboardMenu } from "@/components/leaderboard-menu"
import { GuildInfo } from "@/components/guild-info"

type Tab = "stats" | "inventory" | "quests" | "leaderboard" | "guild"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("stats")

  return (
    <ApolloProvider client={client}>
      <div className="flex min-h-screen bg-gray-900 text-gray-100">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          {activeTab === "stats" && <CharacterStats />}
          {activeTab === "inventory" && <Inventory />}
          {activeTab === "quests" && <QuestTracker />}
          {activeTab === "leaderboard" && <LeaderboardMenu />}
          {activeTab === "guild" && <GuildInfo />}
        </main>
      </div>
    </ApolloProvider>
  )
}
