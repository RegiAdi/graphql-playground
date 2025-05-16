"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Search, Medal, User, Users, Swords, Coins, Award, Crown, Star, Shield } from "lucide-react"

// Mock data for different leaderboard types
const mockLeaderboardData = {
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
  ],
  guilds: [
    {
      id: "1",
      name: "Midnight Assassins",
      members: 120,
      level: 25,
      achievementPoints: 12500,
      rank: 1,
    },
    {
      id: "2",
      name: "Holy Crusaders",
      members: 115,
      level: 24,
      achievementPoints: 11800,
      rank: 2,
    },
    {
      id: "3",
      name: "Arcane Council",
      members: 110,
      level: 23,
      achievementPoints: 11200,
      rank: 3,
    },
    {
      id: "4",
      name: "Guardians of Nature",
      members: 105,
      level: 22,
      achievementPoints: 10800,
      rank: 4,
    },
    {
      id: "5",
      name: "Blood Legion",
      members: 100,
      level: 21,
      achievementPoints: 10500,
      rank: 5,
    },
  ],
  pvp: [
    {
      id: "1",
      name: "ShadowBlade",
      class: "Rogue",
      rating: 2850,
      wins: 320,
      losses: 120,
      winRate: "72.7%",
      rank: 1,
    },
    {
      id: "2",
      name: "DeathKnight",
      class: "Death Knight",
      rating: 2780,
      wins: 310,
      losses: 130,
      winRate: "70.5%",
      rank: 2,
    },
    {
      id: "3",
      name: "ArcaneWizard",
      class: "Mage",
      rating: 2720,
      wins: 300,
      losses: 140,
      winRate: "68.2%",
      rank: 3,
    },
    {
      id: "4",
      name: "DragonSlayer",
      class: "Mage",
      rating: 2200,
      wins: 180,
      losses: 120,
      winRate: "60.0%",
      rank: 15,
    },
    {
      id: "5",
      name: "WarChief",
      class: "Warrior",
      rating: 2650,
      wins: 290,
      losses: 150,
      winRate: "65.9%",
      rank: 4,
    },
  ],
  wealth: [
    {
      id: "1",
      name: "GoldHoarder",
      class: "Rogue",
      gold: 5000000,
      rank: 1,
    },
    {
      id: "2",
      name: "RichMage",
      class: "Mage",
      gold: 4500000,
      rank: 2,
    },
    {
      id: "3",
      name: "WealthyPaladin",
      class: "Paladin",
      gold: 4000000,
      rank: 3,
    },
    {
      id: "4",
      name: "DragonSlayer",
      class: "Mage",
      gold: 1500000,
      rank: 22,
    },
    {
      id: "5",
      name: "MerchantDruid",
      class: "Druid",
      gold: 3500000,
      rank: 4,
    },
  ],
  achievements: [
    {
      id: "1",
      name: "AchievementHunter",
      class: "Hunter",
      achievements: 520,
      points: 12500,
      rank: 1,
    },
    {
      id: "2",
      name: "QuestMaster",
      class: "Warrior",
      achievements: 510,
      points: 12200,
      rank: 2,
    },
    {
      id: "3",
      name: "LoreKeeper",
      class: "Mage",
      achievements: 500,
      points: 12000,
      rank: 3,
    },
    {
      id: "4",
      name: "DragonSlayer",
      class: "Mage",
      achievements: 320,
      points: 7800,
      rank: 35,
    },
    {
      id: "5",
      name: "ExplorerShaman",
      class: "Shaman",
      achievements: 490,
      points: 11800,
      rank: 4,
    },
  ],
}

export function LeaderboardMenu() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("players")

  // Use mock data while developing
  const leaderboard = mockLeaderboardData

  const getClassColor = (className: string) => {
    switch (className?.toLowerCase()) {
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
      case "death knight":
        return "text-red-400"
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

  const filterData = (data: any[]) => {
    if (!searchQuery) return data
    return data.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Leaderboards</h1>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-xs text-gray-400">Season 8 - Week 12</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search players or guilds..."
            className="pl-8 bg-gray-800 border-gray-700 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="players" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 bg-gray-800">
          <TabsTrigger value="players" className="text-xs">
            <User className="w-4 h-4 mr-1" /> Players
          </TabsTrigger>
          <TabsTrigger value="guilds" className="text-xs">
            <Users className="w-4 h-4 mr-1" /> Guilds
          </TabsTrigger>
          <TabsTrigger value="pvp" className="text-xs">
            <Swords className="w-4 h-4 mr-1" /> PvP
          </TabsTrigger>
          <TabsTrigger value="wealth" className="text-xs">
            <Coins className="w-4 h-4 mr-1" /> Wealth
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs">
            <Award className="w-4 h-4 mr-1" /> Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Crown className="w-4 h-4 mr-2 text-yellow-400" /> Top Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-2 px-4 text-left text-xs font-medium">Rank</th>
                      <th className="py-2 px-4 text-left text-xs font-medium">Player</th>
                      <th className="py-2 px-4 text-left text-xs font-medium">Level</th>
                      <th className="py-2 px-4 text-left text-xs font-medium hidden md:table-cell">Class</th>
                      <th className="py-2 px-4 text-left text-xs font-medium hidden lg:table-cell">Guild</th>
                      <th className="py-2 px-4 text-right text-xs font-medium">Achievement Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filterData(leaderboard.players).map((player) => (
                      <tr key={player.id} className={`hover:bg-gray-700/50 ${getPlayerHighlight(player.name)}`}>
                        <td className="py-2 px-4">
                          <div className="flex items-center justify-center">{getRankIcon(player.rank)}</div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-xs">{player.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 text-xs">{player.level}</td>
                        <td className={`py-2 px-4 hidden md:table-cell text-xs ${getClassColor(player.class)}`}>
                          {player.class}
                        </td>
                        <td className="py-2 px-4 hidden lg:table-cell text-xs">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{player.guild}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 text-right font-mono text-xs">{player.achievementPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guilds">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-400" /> Top Guilds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-2 px-4 text-left text-xs font-medium">Rank</th>
                      <th className="py-2 px-4 text-left text-xs font-medium">Guild</th>
                      <th className="py-2 px-4 text-left text-xs font-medium">Level</th>
                      <th className="py-2 px-4 text-left text-xs font-medium hidden md:table-cell">Members</th>
                      <th className="py-2 px-4 text-right text-xs font-medium">Achievement Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filterData(leaderboard.guilds).map((guild) => (
                      <tr
                        key={guild.id}
                        className={`hover:bg-gray-700/50 ${guild.name === "Arcane Council" ? "bg-purple-900/30 border-purple-500" : ""}`}
                      >
                        <td className="py-2 px-4">
                          <div className="flex items-center justify-center">{getRankIcon(guild.rank)}</div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-xs">{guild.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 text-xs">{guild.level}</td>
                        <td className="py-2 px-4 hidden md:table-cell text-xs">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{guild.members}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 text-right font-mono text-xs">{guild.achievementPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pvp">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Swords className="w-4 h-4 mr-2 text-red-400" /> PvP Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-2 px-4 text-left text-xs font-medium">Rank</th>
                      <th className="py-2 px-4 text-left text-xs font-medium">Player</th>
                      <th className="py-2 px-4 text-left text-xs font-medium hidden md:table-cell">Class</th>
                      <th className="py-2 px-4 text-left text-xs font-medium">Rating</th>
                      <th className="py-2 px-4 text-left text-xs font-medium hidden lg:table-cell">W/L</th>
                      <th className="py-2 px-4 text-right text-xs font-medium">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filterData(leaderboard.pvp).map((player) => (
                      <tr key={player.id} className={`hover:bg-gray-700/50 ${getPlayerHighlight(player.name)}`}>
                        <td className="py-2 px-4">
                          <div className="flex items-center justify-center">{getRankIcon(player.rank)}</div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-xs">{player.name}</span>
                          </div>
                        </td>
                        <td className={`py-2 px-4 hidden md:table-cell text-xs ${getClassColor(player.class)}`}>
                          {player.class}
                        </td>
                        <td className="py-2 px-4 text-xs font-medium text-blue-400">{player.rating}</td>
                        <td className="py-2 px-4 hidden lg:table-cell text-xs">
                          <span className="text-green-400">{player.wins}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-red-400">{player.losses}</span>
                        </td>
                        <td className="py-2 px-4 text-right font-mono text-xs">{player.winRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wealth">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Coins className="w-4 h-4 mr-2 text-yellow-400" /> Wealthiest Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-2 px-4 text-left text-xs font-medium">Rank</th>
                      <th className="py-2 px-4 text-left text-xs font-medium">Player</th>
                      <th className="py-2 px-4 text-left text-xs font-medium hidden md:table-cell">Class</th>
                      <th className="py-2 px-4 text-right text-xs font-medium">Gold</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filterData(leaderboard.wealth).map((player) => (
                      <tr key={player.id} className={`hover:bg-gray-700/50 ${getPlayerHighlight(player.name)}`}>
                        <td className="py-2 px-4">
                          <div className="flex items-center justify-center">{getRankIcon(player.rank)}</div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-xs">{player.name}</span>
                          </div>
                        </td>
                        <td className={`py-2 px-4 hidden md:table-cell text-xs ${getClassColor(player.class)}`}>
                          {player.class}
                        </td>
                        <td className="py-2 px-4 text-right font-mono text-xs text-yellow-400">
                          {player.gold.toLocaleString()} Gold
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Star className="w-4 h-4 mr-2 text-purple-400" /> Achievement Leaders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-2 px-4 text-left text-xs font-medium">Rank</th>
                      <th className="py-2 px-4 text-left text-xs font-medium">Player</th>
                      <th className="py-2 px-4 text-left text-xs font-medium hidden md:table-cell">Class</th>
                      <th className="py-2 px-4 text-left text-xs font-medium hidden lg:table-cell">Achievements</th>
                      <th className="py-2 px-4 text-right text-xs font-medium">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filterData(leaderboard.achievements).map((player) => (
                      <tr key={player.id} className={`hover:bg-gray-700/50 ${getPlayerHighlight(player.name)}`}>
                        <td className="py-2 px-4">
                          <div className="flex items-center justify-center">{getRankIcon(player.rank)}</div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-xs">{player.name}</span>
                          </div>
                        </td>
                        <td className={`py-2 px-4 hidden md:table-cell text-xs ${getClassColor(player.class)}`}>
                          {player.class}
                        </td>
                        <td className="py-2 px-4 hidden lg:table-cell text-xs">{player.achievements}</td>
                        <td className="py-2 px-4 text-right font-mono text-xs text-purple-400">{player.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
