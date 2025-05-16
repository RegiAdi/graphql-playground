"use client"

import { useQuery } from "@apollo/client"
import { GET_LEADERBOARD } from "@/lib/graphql/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trophy, Search, Medal, User, Users } from "lucide-react"
import { useState } from "react"

export function Leaderboard() {
  const { loading, error, data } = useQuery(GET_LEADERBOARD)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for development
  const mockData = {
    leaderboard: {
      players: [
        {
          id: "1",
          name: "ShadowBlade",
          level: 50,
          class: "Rogue",
          guild: "Midnight Assassins",
          achievementPoints: 2850,
          rank: 1,
        },
        {
          id: "2",
          name: "LightBringer",
          level: 49,
          class: "Paladin",
          guild: "Holy Crusaders",
          achievementPoints: 2780,
          rank: 2,
        },
        {
          id: "3",
          name: "ArcaneWizard",
          level: 48,
          class: "Mage",
          guild: "Arcane Council",
          achievementPoints: 2720,
          rank: 3,
        },
        {
          id: "4",
          name: "DragonSlayer",
          level: 42,
          class: "Mage",
          guild: "Arcane Council",
          achievementPoints: 1950,
          rank: 42,
        },
        {
          id: "5",
          name: "NatureFury",
          level: 47,
          class: "Druid",
          guild: "Guardians of Nature",
          achievementPoints: 2650,
          rank: 4,
        },
        {
          id: "6",
          name: "WarChief",
          level: 47,
          class: "Warrior",
          guild: "Blood Legion",
          achievementPoints: 2600,
          rank: 5,
        },
        {
          id: "7",
          name: "SoulHarvester",
          level: 46,
          class: "Warlock",
          guild: "Shadow Covenant",
          achievementPoints: 2550,
          rank: 6,
        },
        {
          id: "8",
          name: "StormCaller",
          level: 46,
          class: "Shaman",
          guild: "Elements Fury",
          achievementPoints: 2500,
          rank: 7,
        },
        {
          id: "9",
          name: "SilentArrow",
          level: 45,
          class: "Hunter",
          guild: "Wild Trackers",
          achievementPoints: 2450,
          rank: 8,
        },
        {
          id: "10",
          name: "HolyHealer",
          level: 45,
          class: "Priest",
          guild: "Divine Light",
          achievementPoints: 2400,
          rank: 9,
        },
      ],
    },
  }

  // Use mock data while developing
  const leaderboard = data?.leaderboard || mockData.leaderboard

  if (loading) return <div className="text-center py-10">Loading leaderboard...</div>
  if (error) return <div className="text-center py-10 text-red-500">Error loading leaderboard!</div>

  const filteredPlayers = leaderboard.players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getClassColor = (className: string) => {
    switch (className.toLowerCase()) {
      case "warrior":
        return "text-brown-400"
      case "mage":
        return "text-blue-400"
      case "rogue":
        return "text-yellow-400"
      case "priest":
        return "text-white"
      case "warlock":
        return "text-purple-400"
      case "paladin":
        return "text-pink-400"
      case "druid":
        return "text-green-400"
      case "hunter":
        return "text-green-400"
      case "shaman":
        return "text-blue-300"
      default:
        return "text-gray-400"
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-400" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className="w-5 h-5 flex items-center justify-center text-gray-400">{rank}</span>
  }

  const getPlayerHighlight = (name: string) => {
    return name === "DragonSlayer" ? "bg-purple-900/30 border-purple-500" : ""
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-sm text-gray-400">Season 8 - Week 12</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search players..."
            className="pl-8 bg-gray-800 border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Top Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-2 px-4 text-left text-sm font-medium">Rank</th>
                  <th className="py-2 px-4 text-left text-sm font-medium">Player</th>
                  <th className="py-2 px-4 text-left text-sm font-medium">Level</th>
                  <th className="py-2 px-4 text-left text-sm font-medium hidden md:table-cell">Class</th>
                  <th className="py-2 px-4 text-left text-sm font-medium hidden lg:table-cell">Guild</th>
                  <th className="py-2 px-4 text-right text-sm font-medium">Achievement Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPlayers.map((player) => (
                  <tr key={player.id} className={`hover:bg-gray-700/50 ${getPlayerHighlight(player.name)}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">{getRankIcon(player.rank)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{player.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{player.level}</td>
                    <td className={`py-3 px-4 hidden md:table-cell ${getClassColor(player.class)}`}>{player.class}</td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{player.guild}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">{player.achievementPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
