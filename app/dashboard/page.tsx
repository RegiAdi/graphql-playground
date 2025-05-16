"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Zap, Heart, Droplet, Swords } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for development
const mockData = {
  character: {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "DragonSlayer",
    class: "Mage",
    level: 42,
    experience: 75000,
    nextLevelExperience: 100000,
    health: 4200,
    maxHealth: 5000,
    mana: 3800,
    maxMana: 4000,
    strength: 120,
    agility: 180,
    intelligence: 350,
    stamina: 220,
    criticalChance: 15,
    armor: 450,
    gold: 12450,
    achievementPoints: 1950,
    guildRank: "Member",
    guild: {
      id: "123e4567-e89b-12d3-a456-426614174001",
      name: "Arcane Council",
    },
  },
}

export default function CharacterStats() {
  const [loading, setLoading] = useState(true)
  const [character, setCharacter] = useState(mockData.character)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) return <StatsLoading />

  const expPercentage = (character.experience / character.nextLevelExperience) * 100
  const healthPercentage = (character.health / character.maxHealth) * 100
  const manaPercentage = (character.mana / character.maxMana) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Character Stats</h1>
        <div className="text-sm text-gray-400">Last updated: 5 minutes ago</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Level {character.level}</span>
                <span>
                  {character.experience.toLocaleString()} / {character.nextLevelExperience.toLocaleString()}
                </span>
              </div>
              <Progress value={expPercentage} className="h-2 bg-gray-700" indicatorClassName="bg-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>HP</span>
                <span>
                  {character.health.toLocaleString()} / {character.maxHealth.toLocaleString()}
                </span>
              </div>
              <Progress value={healthPercentage} className="h-2 bg-gray-700" indicatorClassName="bg-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" />
              Mana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>MP</span>
                <span>
                  {character.mana.toLocaleString()} / {character.maxMana.toLocaleString()}
                </span>
              </div>
              <Progress value={manaPercentage} className="h-2 bg-gray-700" indicatorClassName="bg-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-red-400" />
                  <span>Strength</span>
                </div>
                <span className="font-mono">{character.strength}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span>Agility</span>
                </div>
                <span className="font-mono">{character.agility}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-400" />
                  <span>Intelligence</span>
                </div>
                <span className="font-mono">{character.intelligence}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-yellow-400" />
                  <span>Stamina</span>
                </div>
                <span className="font-mono">{character.stamina}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Combat Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span>Armor</span>
                </div>
                <span className="font-mono">{character.armor}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span>Critical Chance</span>
                </div>
                <span className="font-mono">{character.criticalChance}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-purple-400" />
                  <span>Magic Resistance</span>
                </div>
                <span className="font-mono">180</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span>Attack Speed</span>
                </div>
                <span className="font-mono">1.8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, j) => (
                      <div key={j} className="flex justify-between items-center">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
