"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { GET_CHARACTER_QUESTS, GET_AVAILABLE_QUESTS } from "@/lib/graphql/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Scroll, Clock, Coins, Award, Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/components/providers/auth-provider"

// Mock data for development or when quests are not found
const mockData = {
  activeQuests: [
    {
      id: "1",
      status: "active",
      progress: 3,
      totalRequired: 5,
      startedAt: "2025-05-15T10:30:00Z",
      completedAt: null,
      deadline: "2025-05-20T12:00:00Z",
      quest: {
        id: "101",
        title: "The Arcane Trials",
        description: "Defeat 5 arcane elementals in the Mystic Forest and collect their essence.",
        experienceReward: 2500,
        goldReward: 750,
        itemRewards: [
          {
            id: "201",
            quantity: 1,
            item: {
              id: "301",
              name: "Arcane Essence Potion",
              rarity: "rare",
            },
          },
        ],
      },
    },
    {
      id: "2",
      status: "active",
      progress: 1,
      totalRequired: 3,
      startedAt: "2025-05-14T15:45:00Z",
      completedAt: null,
      deadline: "2025-05-25T12:00:00Z",
      quest: {
        id: "102",
        title: "Lost Artifacts",
        description: "Find the 3 lost artifacts of the ancient mage council hidden throughout the realm.",
        experienceReward: 3500,
        goldReward: 1200,
        itemRewards: [
          {
            id: "202",
            quantity: 1,
            item: {
              id: "302",
              name: "Staff of the Council",
              rarity: "epic",
            },
          },
        ],
      },
    },
    {
      id: "3",
      status: "active",
      progress: 0,
      totalRequired: 1,
      startedAt: "2025-05-13T09:20:00Z",
      completedAt: null,
      deadline: null,
      quest: {
        id: "103",
        title: "Dragon's Lair",
        description: "Venture into the dragon's lair and defeat the ancient dragon Azurath.",
        experienceReward: 5000,
        goldReward: 2500,
        itemRewards: [
          {
            id: "203",
            quantity: 1,
            item: {
              id: "303",
              name: "Dragon Scale Armor",
              rarity: "legendary",
            },
          },
        ],
      },
    },
  ],
  completedQuests: [
    {
      id: "4",
      status: "completed",
      progress: 1,
      totalRequired: 1,
      startedAt: "2025-05-08T14:30:00Z",
      completedAt: "2025-05-10T15:30:00Z",
      deadline: null,
      quest: {
        id: "104",
        title: "The Goblin Menace",
        description: "Clear out the goblin camp that has been terrorizing the nearby village.",
        experienceReward: 1500,
        goldReward: 500,
        itemRewards: [],
      },
    },
    {
      id: "5",
      status: "completed",
      progress: 10,
      totalRequired: 10,
      startedAt: "2025-05-05T11:15:00Z",
      completedAt: "2025-05-08T09:45:00Z",
      deadline: null,
      quest: {
        id: "105",
        title: "Potion Ingredients",
        description: "Collect 10 rare herbs for the town alchemist.",
        experienceReward: 1000,
        goldReward: 300,
        itemRewards: [
          {
            id: "204",
            quantity: 1,
            item: {
              id: "304",
              name: "Minor Health Potion",
              rarity: "common",
            },
          },
        ],
      },
    },
    {
      id: "6",
      status: "completed",
      progress: 1,
      totalRequired: 1,
      startedAt: "2025-05-03T16:20:00Z",
      completedAt: "2025-05-05T18:20:00Z",
      deadline: null,
      quest: {
        id: "106",
        title: "Escort Mission",
        description: "Escort the merchant safely to the neighboring town.",
        experienceReward: 1200,
        goldReward: 600,
        itemRewards: [],
      },
    },
  ],
  availableQuests: [
    {
      id: "107",
      title: "The Haunted Tower",
      description: "Investigate the mysterious tower that has appeared overnight.",
      levelRequirement: 40,
      difficulty: "Hard",
      experienceReward: 4000,
      goldReward: 1500,
      itemRewards: [
        {
          id: "205",
          quantity: 1,
          item: {
            id: "305",
            name: "Spectral Cloak",
            rarity: "epic",
          },
        },
      ],
    },
    {
      id: "108",
      title: "Rare Herb Collection",
      description: "Collect rare herbs from the enchanted forest for a powerful potion.",
      levelRequirement: 35,
      difficulty: "Easy",
      experienceReward: 1800,
      goldReward: 400,
      itemRewards: [
        {
          id: "206",
          quantity: 2,
          item: {
            id: "306",
            name: "Mana Potion",
            rarity: "uncommon",
          },
        },
      ],
    },
    {
      id: "109",
      title: "Bandit Hideout",
      description: "Find and eliminate the bandit leader who has been raiding caravans.",
      levelRequirement: 38,
      difficulty: "Medium",
      experienceReward: 2500,
      goldReward: 800,
      itemRewards: [
        {
          id: "207",
          quantity: 1,
          item: {
            id: "307",
            name: "Bandit's Dagger",
            rarity: "rare",
          },
        },
      ],
    },
  ],
}

export function QuestTracker() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("active")
  const characterId = user?.id || "mock-character-id"

  // Only fetch data for the active tab to improve performance
  const {
    loading: loadingActive,
    error: errorActive,
    data: dataActive,
  } = useQuery(GET_CHARACTER_QUESTS, {
    variables: { characterId, status: "active" },
    skip: activeTab !== "active" || !user?.id,
  })

  const {
    loading: loadingCompleted,
    error: errorCompleted,
    data: dataCompleted,
  } = useQuery(GET_CHARACTER_QUESTS, {
    variables: { characterId, status: "completed" },
    skip: activeTab !== "completed" || !user?.id,
  })

  const {
    loading: loadingAvailable,
    error: errorAvailable,
    data: dataAvailable,
  } = useQuery(GET_AVAILABLE_QUESTS, {
    variables: { levelRequirement: 40 }, // Assuming character level is 40
    skip: activeTab !== "available" || !user?.id,
  })

  // Use mock data if:
  // 1. There's an error
  // 2. No quest data is returned
  // 3. We're in development mode
  const activeQuests = dataActive?.characterQuests || mockData.activeQuests
  const completedQuests = dataCompleted?.characterQuests || mockData.completedQuests
  const availableQuests = dataAvailable?.quests || mockData.availableQuests

  const loading =
    (activeTab === "active" && loadingActive) ||
    (activeTab === "completed" && loadingCompleted) ||
    (activeTab === "available" && loadingAvailable)

  const error =
    (activeTab === "active" && errorActive) ||
    (activeTab === "completed" && errorCompleted) ||
    (activeTab === "available" && errorAvailable)

  if (loading) return <QuestsLoading />

  const formatDate = (dateString: string) => {
    if (!dateString) return "No deadline"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "hard":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-300"
      case "uncommon":
        return "text-green-400"
      case "rare":
        return "text-blue-400"
      case "epic":
        return "text-purple-400"
      case "legendary":
        return "text-orange-400"
      default:
        return "text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Quest Tracker</h1>
        <Badge variant="outline" className="bg-gray-800">
          {activeQuests.length} Active Quests
        </Badge>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500 p-4 rounded-md mb-4">
          <p className="text-red-300">Error loading quests: {error.message}</p>
          <p className="text-sm text-red-300 mt-1">Using mock data instead.</p>
        </div>
      )}

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-4">
          {activeQuests.length > 0 ? (
            activeQuests.map((quest) => (
              <Card key={quest.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Scroll className="w-5 h-5 text-purple-400" />
                      {quest.quest.title}
                    </CardTitle>
                    {quest.deadline && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Expires: {formatDate(quest.deadline)}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-gray-300">{quest.quest.description}</p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {quest.progress} / {quest.totalRequired}
                      </span>
                    </div>
                    <Progress
                      value={(quest.progress / quest.totalRequired) * 100}
                      className="h-2 bg-gray-700"
                      indicatorClassName="bg-purple-500"
                    />
                  </div>

                  <div className="bg-gray-700 rounded-md p-3 space-y-3">
                    <h4 className="text-xs font-medium flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      Rewards
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-blue-400" />
                        <span>{quest.quest.experienceReward} XP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span>{quest.quest.goldReward} Gold</span>
                      </div>
                    </div>
                    {quest.quest.itemRewards.length > 0 && (
                      <div className="space-y-1">
                        <h5 className="text-xs text-gray-400">Items:</h5>
                        <ul className="space-y-1">
                          {quest.quest.itemRewards.map((reward) => (
                            <li key={reward.id} className={`text-sm ${getRarityColor(reward.item.rarity)}`}>
                              {reward.quantity > 1 ? `${reward.quantity}x ` : ""}
                              {reward.item.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm">
                      Track on Map
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm">
                      Abandon
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Scroll className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No Active Quests</p>
                <p className="text-sm mt-1">Visit the Available tab to accept new quests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="available" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableQuests.length > 0 ? (
              availableQuests.map((quest) => (
                <Card key={quest.id} className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{quest.title}</CardTitle>
                    <p className="text-sm text-gray-300 mt-1">{quest.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-blue-400" />
                        <span>Required Level: {quest.levelRequirement}</span>
                      </div>
                      <Badge variant="outline" className={`bg-gray-700 ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty}
                      </Badge>
                    </div>

                    <div className="bg-gray-700 rounded-md p-3 space-y-2">
                      <h4 className="text-xs text-gray-400">Rewards:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-blue-400" />
                          <span>{quest.experienceReward} XP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span>{quest.goldReward} Gold</span>
                        </div>
                      </div>
                      {quest.itemRewards.length > 0 && (
                        <div className="pt-1">
                          <h5 className="text-xs text-gray-400">Items:</h5>
                          <ul className="space-y-1 mt-1">
                            {quest.itemRewards.map((reward) => (
                              <li key={reward.id} className={`text-sm ${getRarityColor(reward.item.rarity)}`}>
                                {reward.quantity > 1 ? `${reward.quantity}x ` : ""}
                                {reward.item.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm">
                      Accept Quest
                    </button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Scroll className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No Available Quests</p>
                    <p className="text-sm mt-1">Check back later for new adventures</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {completedQuests.length > 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-md divide-y divide-gray-700">
              {completedQuests.map((quest) => (
                <div key={quest.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Scroll className="w-5 h-5 text-green-400" />
                    <span>{quest.quest.title}</span>
                  </div>
                  <div className="text-sm text-gray-400">Completed: {formatDate(quest.completedAt)}</div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Scroll className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No Completed Quests</p>
                <p className="text-sm mt-1">Complete quests to see them here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function QuestsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>

      <Skeleton className="h-10 w-full" />

      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
      </div>
    </div>
  )
}
