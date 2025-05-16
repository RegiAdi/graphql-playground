"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { GET_CHARACTER_INVENTORY } from "@/lib/graphql/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Coins, Shield, Sword, Wand, Shirt, BellRingIcon as Ring } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/components/providers/auth-provider"
import { usePlayer } from "@/contexts/player-context"

type ItemType = "weapon" | "armor" | "accessory" | "consumable" | "quest"
type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

interface Item {
  id: string
  name: string
  type: ItemType
  rarity: ItemRarity
  levelRequirement: number
  icon: string
  strengthBonus: number
  agilityBonus: number
  intelligenceBonus: number
  staminaBonus: number
  description: string
}

interface InventoryItem {
  id: string
  quantity: number
  isEquipped: boolean
  item: Item
}

const rarityColors = {
  common: "text-gray-300",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-orange-400",
}

// Mock data for development or when character is not found
const mockData = {
  character: {
    id: "mock-character-id",
    inventory: [
      {
        id: "1",
        quantity: 1,
        isEquipped: true,
        item: {
          id: "101",
          name: "Firebrand Staff",
          type: "weapon",
          rarity: "epic",
          levelRequirement: 40,
          icon: "wand",
          strengthBonus: 10,
          agilityBonus: 15,
          intelligenceBonus: 85,
          staminaBonus: 25,
          description: "A powerful staff that channels the essence of fire, increasing spell damage by 15%.",
        },
      },
      {
        id: "2",
        quantity: 1,
        isEquipped: true,
        item: {
          id: "102",
          name: "Dragonscale Robe",
          type: "armor",
          rarity: "rare",
          levelRequirement: 38,
          icon: "shirt",
          strengthBonus: 5,
          agilityBonus: 20,
          intelligenceBonus: 45,
          staminaBonus: 30,
          description:
            "Crafted from the scales of a fallen dragon, this robe provides exceptional protection against magical attacks.",
        },
      },
      {
        id: "3",
        quantity: 1,
        isEquipped: true,
        item: {
          id: "103",
          name: "Amulet of Wisdom",
          type: "accessory",
          rarity: "uncommon",
          levelRequirement: 35,
          icon: "ring",
          strengthBonus: 0,
          agilityBonus: 5,
          intelligenceBonus: 30,
          staminaBonus: 10,
          description: "An ancient amulet that enhances the wearer's magical abilities and mana regeneration.",
        },
      },
      {
        id: "4",
        quantity: 5,
        isEquipped: false,
        item: {
          id: "104",
          name: "Health Potion",
          type: "consumable",
          rarity: "common",
          levelRequirement: 1,
          icon: "potion",
          strengthBonus: 0,
          agilityBonus: 0,
          intelligenceBonus: 0,
          staminaBonus: 0,
          description: "Restores 500 health when consumed.",
        },
      },
      {
        id: "5",
        quantity: 1,
        isEquipped: false,
        item: {
          id: "105",
          name: "Enchanted Dagger",
          type: "weapon",
          rarity: "rare",
          levelRequirement: 39,
          icon: "sword",
          strengthBonus: 25,
          agilityBonus: 40,
          intelligenceBonus: 15,
          staminaBonus: 10,
          description: "A swift dagger enchanted with arcane energy, increasing critical strike chance.",
        },
      },
      {
        id: "6",
        quantity: 1,
        isEquipped: false,
        item: {
          id: "106",
          name: "Mystic Orb",
          type: "quest",
          rarity: "legendary",
          levelRequirement: 42,
          icon: "orb",
          strengthBonus: 0,
          agilityBonus: 0,
          intelligenceBonus: 0,
          staminaBonus: 0,
          description: "A mysterious orb required for the 'Secrets of the Arcane' quest. Handle with care.",
        },
      },
    ],
  },
}

export default function Inventory() {
  const { user } = useAuth()
  const { gold } = usePlayer() // Use gold from context
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  // Use the user ID as the character ID for now
  // In a real app, you would fetch the character ID associated with the user
  const characterId = user?.id || "mock-character-id"

  const { loading, error, data } = useQuery(GET_CHARACTER_INVENTORY, {
    variables: { characterId },
    // Skip the query if we don't have a user ID
    skip: !user?.id,
  })

  // Use mock data if:
  // 1. We're in development mode
  // 2. There's an error
  // 3. No character data is returned
  const character = data?.character || mockData.character
  const inventory = character?.inventory || []
  const capacityPercentage = (inventory.length / 50) * 100

  if (loading) return <InventoryLoading />

  const getItemIcon = (icon: string) => {
    switch (icon) {
      case "sword":
        return <Sword className="w-5 h-5" />
      case "shield":
        return <Shield className="w-5 h-5" />
      case "wand":
        return <Wand className="w-5 h-5" />
      case "shirt":
        return <Shirt className="w-5 h-5" />
      case "ring":
        return <Ring className="w-5 h-5" />
      default:
        return <Sword className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Inventory</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="font-medium">{gold.toLocaleString()}</span>
          </div>
          <Badge variant="outline" className="bg-gray-800">
            {inventory.length} / 50 slots
          </Badge>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500 p-4 rounded-md mb-4">
          <p className="text-red-300">Error loading inventory: {error.message}</p>
          <p className="text-sm text-red-300 mt-1">Using mock data instead.</p>
        </div>
      )}

      <Progress value={capacityPercentage} className="h-2 bg-gray-700" indicatorClassName="bg-blue-500" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="weapon">Weapons</TabsTrigger>
              <TabsTrigger value="armor">Armor</TabsTrigger>
              <TabsTrigger value="accessory">Accessories</TabsTrigger>
              <TabsTrigger value="consumable">Consumables</TabsTrigger>
              <TabsTrigger value="quest">Quest Items</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-gray-800 border border-gray-700 rounded-md p-3 cursor-pointer transition-all hover:border-gray-500 ${
                      selectedItem?.id === item.id ? "ring-2 ring-purple-500" : ""
                    } ${item.isEquipped ? "border-blue-500" : ""}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-md mb-2">
                        {getItemIcon(item.item.icon)}
                      </div>
                      <div className={`text-xs font-medium text-center ${rarityColors[item.item.rarity]}`}>
                        {item.item.name}
                      </div>
                      <div className="text-[0.65rem] text-gray-400">Level {item.item.levelRequirement}</div>
                      {item.quantity > 1 && <div className="text-[0.65rem] text-gray-300 mt-1">x{item.quantity}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            {["weapon", "armor", "accessory", "consumable", "quest"].map((type) => (
              <TabsContent key={type} value={type} className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {inventory
                    .filter((item) => item.item.type === type)
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`bg-gray-800 border border-gray-700 rounded-md p-3 cursor-pointer transition-all hover:border-gray-500 ${
                          selectedItem?.id === item.id ? "ring-2 ring-purple-500" : ""
                        } ${item.isEquipped ? "border-blue-500" : ""}`}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-md mb-2">
                            {getItemIcon(item.item.icon)}
                          </div>
                          <div className={`text-xs font-medium text-center ${rarityColors[item.item.rarity]}`}>
                            {item.item.name}
                          </div>
                          <div className="text-[0.65rem] text-gray-400">Level {item.item.levelRequirement}</div>
                          {item.quantity > 1 && (
                            <div className="text-[0.65rem] text-gray-300 mt-1">x{item.quantity}</div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div>
          {selectedItem ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${rarityColors[selectedItem.item.rarity]}`}>
                  {getItemIcon(selectedItem.item.icon)}
                  {selectedItem.item.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Badge variant="outline" className="bg-gray-700">
                    Level {selectedItem.item.levelRequirement}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-700 capitalize">
                    {selectedItem.item.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`bg-gray-700 capitalize ${rarityColors[selectedItem.item.rarity]}`}
                  >
                    {selectedItem.item.rarity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-gray-300">{selectedItem.item.description}</p>

                {(selectedItem.item.type === "weapon" ||
                  selectedItem.item.type === "armor" ||
                  selectedItem.item.type === "accessory") && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Stats</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedItem.item.strengthBonus > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Strength:</span>
                          <span className="text-green-400">+{selectedItem.item.strengthBonus}</span>
                        </div>
                      )}
                      {selectedItem.item.agilityBonus > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Agility:</span>
                          <span className="text-green-400">+{selectedItem.item.agilityBonus}</span>
                        </div>
                      )}
                      {selectedItem.item.intelligenceBonus > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Intelligence:</span>
                          <span className="text-green-400">+{selectedItem.item.intelligenceBonus}</span>
                        </div>
                      )}
                      {selectedItem.item.staminaBonus > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Stamina:</span>
                          <span className="text-green-400">+{selectedItem.item.staminaBonus}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {selectedItem.item.type === "consumable" && (
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm">
                      Use
                    </button>
                  )}
                  {(selectedItem.item.type === "weapon" ||
                    selectedItem.item.type === "armor" ||
                    selectedItem.item.type === "accessory") && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm">
                      {selectedItem.isEquipped ? "Unequip" : "Equip"}
                    </button>
                  )}
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm">
                    Sell ({Math.floor(selectedItem.item.levelRequirement * 10)} gold)
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700 h-full flex items-center justify-center">
              <CardContent className="text-center py-10 text-gray-400">
                <p>Select an item to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function InventoryLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      <Skeleton className="h-2 w-full" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-10 w-full" />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
          </div>
        </div>

        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  )
}
