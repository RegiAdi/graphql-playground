"use client"

import { useQuery } from "@apollo/client"
import { GET_CHARACTER_STATS } from "@/lib/graphql/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Zap, Heart, Droplet, Swords } from "lucide-react"

export function CharacterStats() {
  const { loading, error, data } = useQuery(GET_CHARACTER_STATS)

  // Mock data for development
  const mockData = {
    character: {
      id: "1",
      name: "DragonSlayer",
      level: 42,
      class: "Mage",
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
    },
  }

  // Use mock data while developing
  const character = data?.character || mockData.character

  if (loading) return <div className="text-center py-10">Loading character stats...</div>
  if (error) return <div className="text-center py-10 text-red-500">Error loading character stats!</div>

  const expPercentage = (character.experience / character.nextLevelExperience) * 100
  const healthPercentage = (character.health / character.maxHealth) * 100
  const manaPercentage = (character.mana / character.maxMana) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Character Stats</h1>
        <div className="text-sm text-gray-400">Last updated: 5 minutes ago</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
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
            <CardTitle className="text-lg flex items-center gap-2">
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
            <CardTitle className="text-lg flex items-center gap-2">
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
