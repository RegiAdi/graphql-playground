"use client"

import { useQuery } from "@apollo/client"
import { GET_GUILD_INFO } from "@/lib/graphql/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Coins, User, Calendar, Shield } from "lucide-react"

export function GuildInfo() {
  const { loading, error, data } = useQuery(GET_GUILD_INFO)

  // Mock data for development
  const mockData = {
    guild: {
      id: "1",
      name: "Arcane Council",
      level: 15,
      members: [
        {
          id: "1",
          name: "ArcaneWizard",
          rank: "Guild Master",
          class: "Mage",
          level: 48,
          lastActive: "2025-05-15T10:30:00Z",
        },
        {
          id: "2",
          name: "FrostMage",
          rank: "Officer",
          class: "Mage",
          level: 45,
          lastActive: "2025-05-15T09:15:00Z",
        },
        {
          id: "3",
          name: "FireCaster",
          rank: "Officer",
          class: "Mage",
          level: 44,
          lastActive: "2025-05-14T22:45:00Z",
        },
        {
          id: "4",
          name: "DragonSlayer",
          rank: "Member",
          class: "Mage",
          level: 42,
          lastActive: "2025-05-16T08:20:00Z",
        },
        {
          id: "5",
          name: "SpellWeaver",
          rank: "Member",
          class: "Mage",
          level: 40,
          lastActive: "2025-05-13T14:10:00Z",
        },
        {
          id: "6",
          name: "ManaStorm",
          rank: "Member",
          class: "Mage",
          level: 38,
          lastActive: "2025-05-12T18:30:00Z",
        },
        {
          id: "7",
          name: "ArcaneApprentice",
          rank: "Initiate",
          class: "Mage",
          level: 35,
          lastActive: "2025-05-15T11:45:00Z",
        },
      ],
      achievements: [
        {
          id: "1",
          name: "Arcane Masters",
          description: "Complete all arcane-related quests in the realm.",
          completedAt: "2025-04-20T15:30:00Z",
        },
        {
          id: "2",
          name: "Dragon Slayers",
          description: "Defeat the ancient dragon Azurath as a guild.",
          completedAt: "2025-03-15T20:45:00Z",
        },
        {
          id: "3",
          name: "Tower of Knowledge",
          description: "Unlock the secrets of the ancient mage tower.",
          completedAt: "2025-02-10T12:15:00Z",
        },
      ],
      treasury: {
        gold: 125000,
        items: [
          {
            id: "1",
            name: "Arcane Crystal",
            quantity: 25,
          },
          {
            id: "2",
            name: "Dragon Scale",
            quantity: 10,
          },
          {
            id: "3",
            name: "Ancient Tome",
            quantity: 5,
          },
        ],
      },
    },
  }

  // Use mock data while developing
  const guild = data?.guild || mockData.guild

  if (loading) return <div className="text-center py-10">Loading guild information...</div>
  if (error) return <div className="text-center py-10 text-red-500">Error loading guild information!</div>

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Online now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return "Yesterday"
    return `${Math.floor(diffInHours / 24)} days ago`
  }

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

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "guild master":
        return "text-purple-300"
      case "officer":
        return "text-blue-300"
      case "member":
        return "text-gray-300"
      case "initiate":
        return "text-gray-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Guild Information</h1>
        <Badge variant="outline" className="bg-gray-800">
          Level {guild.level}
        </Badge>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            {guild.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>{guild.members.length} Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>{guild.achievements.length} Achievements</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">{guild.treasury.gold.toLocaleString()} Gold in Treasury</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="members">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-2 px-4 text-left text-sm font-medium">Name</th>
                      <th className="py-2 px-4 text-left text-sm font-medium">Rank</th>
                      <th className="py-2 px-4 text-left text-sm font-medium">Class</th>
                      <th className="py-2 px-4 text-left text-sm font-medium">Level</th>
                      <th className="py-2 px-4 text-right text-sm font-medium">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {guild.members.map((member) => (
                      <tr
                        key={member.id}
                        className={`hover:bg-gray-700/50 ${member.name === "DragonSlayer" ? "bg-purple-900/30 border-purple-500" : ""}`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </td>
                        <td className={`py-3 px-4 ${getRankColor(member.rank)}`}>{member.rank}</td>
                        <td className={`py-3 px-4 ${getClassColor(member.class)}`}>{member.class}</td>
                        <td className="py-3 px-4">{member.level}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-gray-400">{formatLastActive(member.lastActive)}</span>
                            {formatLastActive(member.lastActive) === "Online now" && (
                              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          <div className="grid gap-4">
            {guild.achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-400" />
                      {achievement.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Completed: {formatDate(achievement.completedAt)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="treasury" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700 md:col-span-2">
              <CardHeader>
                <CardTitle>Guild Treasury Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="py-2 px-4 text-left text-sm font-medium">Item</th>
                        <th className="py-2 px-4 text-right text-sm font-medium">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {guild.treasury.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-700/50">
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4 text-right">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Treasury Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span>Gold</span>
                  </div>
                  <span className="font-mono">{guild.treasury.gold.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>Items</span>
                  </div>
                  <span className="font-mono">
                    {guild.treasury.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <div className="pt-2">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm">
                    Donate to Treasury
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
