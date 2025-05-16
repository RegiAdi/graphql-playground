"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { GET_INVENTORY } from "@/lib/graphql/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Coins, Shield, Sword, Wand, Shirt, BellRingIcon as Ring } from "lucide-react"

type ItemType = "weapon" | "armor" | "accessory" | "consumable" | "quest"
type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

interface Item {
  id: string
  name: string
  type: ItemType
  rarity: ItemRarity
  level: number
  icon: string
  stats: {
    strength: number
    agility: number
    intelligence: number
    stamina: number
  }
  description: string
}

const rarityColors = {
  common: "text-gray-300",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-orange-400",
}

export function Inventory() {
  const { loading, error, data } = useQuery(GET_INVENTORY)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  // Mock data for development
  const mockData = {
    inventory: {
      items: [
        {
          id: "1",
          name: "Firebrand Staff",
          type: "weapon",
          rarity: "epic",
          level: 40,
          icon: "wand",
          stats: {
            strength: 10,
            agility: 15,
            intelligence: 85,
            stamina: 25,
          },
          description: "A powerful staff that channels the essence of fire, increasing spell damage by 15%.",
        },
        {
          id: "2",
          name: "Dragonscale Robe",
          type: "armor",
          rarity: "rare",
          level: 38,
          icon: "shirt",
          stats: {
            strength: 5,
            agility: 20,
            intelligence: 45,
            stamina: 30,
          },
          description:
            "Crafted from the scales of a fallen dragon, this robe provides exceptional protection against magical attacks.",
        },
        {
          id: "3",
          name: "Amulet of Wisdom",
          type: "accessory",
          rarity: "uncommon",
          level: 35,
          icon: "ring",
          stats: {
            strength: 0,
            agility: 5,
            intelligence: 30,
            stamina: 10,
          },
          description: "An ancient amulet that enhances the wearer's magical abilities and mana regeneration.",
        },
        {
          id: "4",
          name: "Health Potion",
          type: "consumable",
          rarity: "common",
          level: 1,
          icon: "potion",
          stats: {
            strength: 0,
            agility: 0,
            intelligence: 0,
            stamina: 0,
          },
          description: "Restores 500 health when consumed.",
        },
        {
          id: "5",
          name: "Enchanted Dagger",
          type: "weapon",
          rarity: "rare",
          level: 39,
          icon: "sword",
          stats: {
            strength: 25,
            agility: 40,
            intelligence: 15,
            stamina: 10,
          },
          description: "A swift dagger enchanted with arcane energy, increasing critical strike chance.",
        },
        {
          id: "6",
          name: "Mystic Orb",
          type: "quest",
          rarity: "legendary",
          level: 42,
          icon: "orb",
          stats: {
            strength: 0,
            agility: 0,
            intelligence: 0,
            stamina: 0,
          },
          description: "A mysterious orb required for the 'Secrets of the Arcane' quest. Handle with care.",
        },
      ],
      gold: 12450,
      capacity: 50,
      usedCapacity: 32,
    },
  }

  // Use mock data while developing
  const inventory = data?.inventory || mockData.inventory
  const capacityPercentage = (inventory.usedCapacity / inventory.capacity) * 100

  if (loading) return <div className="text-center py-10">Loading inventory...</div>
  if (error) return <div className="text-center py-10 text-red-500">Error loading inventory!</div>

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
        <h1 className="text-2xl font-bold">Inventory</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="font-medium">{inventory.gold.toLocaleString()}</span>
          </div>
          <Badge variant="outline" className="bg-gray-800">
            {inventory.usedCapacity} / {inventory.capacity} slots
          </Badge>
        </div>
      </div>

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
                {inventory.items.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-gray-800 border border-gray-700 rounded-md p-3 cursor-pointer transition-all hover:border-gray-500 ${
                      selectedItem?.id === item.id ? "ring-2 ring-purple-500" : ""
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-md mb-2">
                        {getItemIcon(item.icon)}
                      </div>
                      <div className={`text-sm font-medium text-center ${rarityColors[item.rarity]}`}>{item.name}</div>
                      <div className="text-xs text-gray-400">Level {item.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            {["weapon", "armor", "accessory", "consumable", "quest"].map((type) => (
              <TabsContent key={type} value={type} className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {inventory.items
                    .filter((item) => item.type === type)
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`bg-gray-800 border border-gray-700 rounded-md p-3 cursor-pointer transition-all hover:border-gray-500 ${
                          selectedItem?.id === item.id ? "ring-2 ring-purple-500" : ""
                        }`}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-md mb-2">
                            {getItemIcon(item.icon)}
                          </div>
                          <div className={`text-sm font-medium text-center ${rarityColors[item.rarity]}`}>
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-400">Level {item.level}</div>
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
                <CardTitle className={`flex items-center gap-2 ${rarityColors[selectedItem.rarity]}`}>
                  {getItemIcon(selectedItem.icon)}
                  {selectedItem.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Badge variant="outline" className="bg-gray-700">
                    Level {selectedItem.level}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-700 capitalize">
                    {selectedItem.type}
                  </Badge>
                  <Badge variant="outline" className={`bg-gray-700 capitalize ${rarityColors[selectedItem.rarity]}`}>
                    {selectedItem.rarity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-300">{selectedItem.description}</p>

                {(selectedItem.type === "weapon" ||
                  selectedItem.type === "armor" ||
                  selectedItem.type === "accessory") && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Stats</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedItem.stats.strength > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Strength:</span>
                          <span className="text-green-400">+{selectedItem.stats.strength}</span>
                        </div>
                      )}
                      {selectedItem.stats.agility > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Agility:</span>
                          <span className="text-green-400">+{selectedItem.stats.agility}</span>
                        </div>
                      )}
                      {selectedItem.stats.intelligence > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Intelligence:</span>
                          <span className="text-green-400">+{selectedItem.stats.intelligence}</span>
                        </div>
                      )}
                      {selectedItem.stats.stamina > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Stamina:</span>
                          <span className="text-green-400">+{selectedItem.stats.stamina}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {selectedItem.type === "consumable" && (
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm">
                      Use
                    </button>
                  )}
                  {(selectedItem.type === "weapon" ||
                    selectedItem.type === "armor" ||
                    selectedItem.type === "accessory") && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm">
                      Equip
                    </button>
                  )}
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm">
                    Sell ({Math.floor(selectedItem.level * 10)} gold)
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
