"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Swords, Shield, Zap, Heart, Skull, Flame, Sparkles, Star, Coins, Scroll } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { usePlayer } from "@/contexts/player-context" // Import the player context

// Types for battle entities
interface BattleEntity {
  id: string
  name: string
  level: number
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  attack: number
  defense: number
  speed: number
  critChance: number
  critMultiplier: number
  abilities: Ability[]
  buffs: Buff[]
  debuffs: Debuff[]
  image: string
}

interface Ability {
  id: string
  name: string
  damage: number
  manaCost: number
  cooldown: number
  currentCooldown: number
  type: "physical" | "magical" | "heal" | "buff" | "debuff"
  description: string
  icon: string
}

interface Buff {
  id: string
  name: string
  duration: number
  effect: {
    stat: "attack" | "defense" | "speed" | "critChance"
    value: number
  }
  isPositive: boolean
  icon: string
}

interface Debuff {
  id: string
  name: string
  duration: number
  effect: {
    stat: "attack" | "defense" | "speed" | "critChance"
    value: number
  }
  isPositive: boolean
  icon: string
}

interface BattleLog {
  id: string
  turn: number
  message: string
  type: "attack" | "ability" | "heal" | "buff" | "debuff" | "critical" | "system"
  damage?: number
  heal?: number
}

// Mock player character data
const playerCharacter: BattleEntity = {
  id: "player-1",
  name: "DragonSlayer",
  level: 42,
  health: 4200,
  maxHealth: 4200,
  mana: 3800,
  maxMana: 3800,
  attack: 350,
  defense: 220,
  speed: 180,
  critChance: 15,
  critMultiplier: 2.0,
  abilities: [
    {
      id: "ability-1",
      name: "Fireball",
      damage: 450,
      manaCost: 120,
      cooldown: 2,
      currentCooldown: 0,
      type: "magical",
      description: "Launches a powerful fireball at the enemy.",
      icon: "flame",
    },
    {
      id: "ability-2",
      name: "Arcane Missiles",
      damage: 300,
      manaCost: 80,
      cooldown: 1,
      currentCooldown: 0,
      type: "magical",
      description: "Fires multiple arcane missiles that home in on the target.",
      icon: "sparkles",
    },
    {
      id: "ability-3",
      name: "Mana Shield",
      damage: 0,
      manaCost: 150,
      cooldown: 3,
      currentCooldown: 0,
      type: "buff",
      description: "Creates a protective shield that increases defense.",
      icon: "shield",
    },
  ],
  buffs: [],
  debuffs: [],
  image: "/placeholder.svg?height=100&width=100",
}

// Mock enemy data
const enemies: BattleEntity[] = [
  {
    id: "enemy-1",
    name: "Forest Troll",
    level: 38,
    health: 3200,
    maxHealth: 3200,
    mana: 1000,
    maxMana: 1000,
    attack: 280,
    defense: 200,
    speed: 120,
    critChance: 8,
    critMultiplier: 1.5,
    abilities: [
      {
        id: "enemy-ability-1",
        name: "Club Smash",
        damage: 320,
        manaCost: 0,
        cooldown: 2,
        currentCooldown: 0,
        type: "physical",
        description: "Smashes the target with a heavy club.",
        icon: "swords",
      },
      {
        id: "enemy-ability-2",
        name: "Regeneration",
        damage: -200, // Negative damage means healing
        manaCost: 100,
        cooldown: 4,
        currentCooldown: 0,
        type: "heal",
        description: "Regenerates health over time.",
        icon: "heart",
      },
    ],
    buffs: [],
    debuffs: [],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "enemy-2",
    name: "Dark Wizard",
    level: 40,
    health: 2800,
    maxHealth: 2800,
    mana: 3000,
    maxMana: 3000,
    attack: 200,
    defense: 150,
    speed: 160,
    critChance: 12,
    critMultiplier: 1.8,
    abilities: [
      {
        id: "enemy-ability-1",
        name: "Shadow Bolt",
        damage: 380,
        manaCost: 120,
        cooldown: 1,
        currentCooldown: 0,
        type: "magical",
        description: "Fires a bolt of shadow energy.",
        icon: "zap",
      },
      {
        id: "enemy-ability-2",
        name: "Curse of Weakness",
        damage: 0,
        manaCost: 150,
        cooldown: 3,
        currentCooldown: 0,
        type: "debuff",
        description: "Reduces the target's attack power.",
        icon: "skull",
      },
    ],
    buffs: [],
    debuffs: [],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "enemy-3",
    name: "Ancient Dragon",
    level: 45,
    health: 6000,
    maxHealth: 6000,
    mana: 2500,
    maxMana: 2500,
    attack: 420,
    defense: 350,
    speed: 100,
    critChance: 10,
    critMultiplier: 2.0,
    abilities: [
      {
        id: "enemy-ability-1",
        name: "Dragon Breath",
        damage: 550,
        manaCost: 200,
        cooldown: 3,
        currentCooldown: 0,
        type: "magical",
        description: "Breathes fire on all enemies.",
        icon: "flame",
      },
      {
        id: "enemy-ability-2",
        name: "Tail Swipe",
        damage: 320,
        manaCost: 0,
        cooldown: 1,
        currentCooldown: 0,
        type: "physical",
        description: "Swipes with its massive tail.",
        icon: "swords",
      },
      {
        id: "enemy-ability-3",
        name: "Draconic Roar",
        damage: 0,
        manaCost: 150,
        cooldown: 4,
        currentCooldown: 0,
        type: "buff",
        description: "Increases attack and defense.",
        icon: "zap",
      },
    ],
    buffs: [],
    debuffs: [],
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function AutoBattle() {
  const { user } = useAuth()
  const { gold, addGold } = usePlayer() // Use the player context
  const [selectedEnemy, setSelectedEnemy] = useState<BattleEntity | null>(null)
  const [player, setPlayer] = useState<BattleEntity>({ ...playerCharacter })
  const [enemy, setEnemy] = useState<BattleEntity | null>(null)
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([])
  const [battleState, setBattleState] = useState<"idle" | "in-progress" | "victory" | "defeat">("idle")
  const [currentTurn, setCurrentTurn] = useState(0)
  const [battleSpeed, setBattleSpeed] = useState<"slow" | "normal" | "fast">("normal")
  const [autoProgress, setAutoProgress] = useState(false)
  const [rewards, setRewards] = useState<{ experience: number; gold: number }>({ experience: 0, gold: 0 })
  const [goldAdded, setGoldAdded] = useState(false) // Track if gold has been added to prevent duplicate additions

  // Reset battle state when selecting a new enemy
  useEffect(() => {
    if (selectedEnemy) {
      setEnemy({ ...selectedEnemy })
      setPlayer({ ...playerCharacter })
      setBattleLogs([])
      setBattleState("idle")
      setCurrentTurn(0)
      setAutoProgress(false)
      setRewards({ experience: 0, gold: 0 })
      setGoldAdded(false) // Reset the gold added flag
    }
  }, [selectedEnemy])

  // Auto-progress battle if enabled
  useEffect(() => {
    if (autoProgress && battleState === "in-progress") {
      const delay = battleSpeed === "slow" ? 2000 : battleSpeed === "normal" ? 1000 : 500
      const timer = setTimeout(() => {
        progressBattle()
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [autoProgress, battleState, currentTurn, battleSpeed])

  // Add gold to player's inventory when battle is won
  useEffect(() => {
    if (battleState === "victory" && rewards.gold > 0 && !goldAdded) {
      addGold(rewards.gold)
      setGoldAdded(true) // Set flag to prevent adding gold multiple times

      // Add a log entry about the gold being added to inventory
      addBattleLog({
        id: `log-${Date.now()}`,
        turn: currentTurn,
        message: `${rewards.gold} gold has been added to your inventory.`,
        type: "system",
      })
    }
  }, [battleState, rewards.gold, addGold, goldAdded, currentTurn])

  // Start the battle
  const startBattle = () => {
    if (!enemy) return

    setBattleState("in-progress")
    addBattleLog({
      id: `log-${Date.now()}`,
      turn: 0,
      message: `Battle between ${player.name} and ${enemy.name} has begun!`,
      type: "system",
    })
    setCurrentTurn(1)
  }

  // Progress the battle by one turn
  const progressBattle = () => {
    if (battleState !== "in-progress" || !enemy) return

    // Determine who goes first based on speed
    const playerFirst = player.speed >= enemy.speed

    // Execute turn
    if (playerFirst) {
      executePlayerTurn()
      if (enemy.health <= 0) {
        endBattle("victory")
        return
      }
      executeEnemyTurn()
      if (player.health <= 0) {
        endBattle("defeat")
        return
      }
    } else {
      executeEnemyTurn()
      if (player.health <= 0) {
        endBattle("defeat")
        return
      }
      executePlayerTurn()
      if (enemy.health <= 0) {
        endBattle("victory")
        return
      }
    }

    // Update cooldowns
    updateCooldowns()

    // Next turn
    setCurrentTurn((prev) => prev + 1)
  }

  // Execute player's turn
  const executePlayerTurn = () => {
    if (!enemy) return

    // Choose an ability or basic attack
    const availableAbilities = player.abilities.filter(
      (ability) => ability.currentCooldown === 0 && player.mana >= ability.manaCost,
    )

    let action: "basic" | Ability = "basic"
    if (availableAbilities.length > 0) {
      // Prioritize abilities based on simple logic
      const healingNeeded = player.health < player.maxHealth * 0.5
      const buffNeeded = player.buffs.length === 0

      if (healingNeeded) {
        const healAbility = availableAbilities.find((a) => a.type === "heal")
        if (healAbility) action = healAbility
      } else if (buffNeeded) {
        const buffAbility = availableAbilities.find((a) => a.type === "buff")
        if (buffAbility) action = buffAbility
      } else {
        // Find the highest damage ability
        const damageAbilities = availableAbilities.filter((a) => a.type === "magical" || a.type === "physical")
        if (damageAbilities.length > 0) {
          action = damageAbilities.reduce((prev, current) => (prev.damage > current.damage ? prev : current))
        }
      }
    }

    if (action === "basic") {
      // Basic attack
      const isCritical = Math.random() * 100 < player.critChance
      const damageMultiplier = isCritical ? player.critMultiplier : 1
      const baseDamage = player.attack * (1 - enemy.defense / (enemy.defense + 1000))
      const damage = Math.floor(baseDamage * damageMultiplier)

      // Apply damage
      setEnemy((prev) => {
        if (!prev) return null
        return {
          ...prev,
          health: Math.max(0, prev.health - damage),
        }
      })

      // Log the attack
      addBattleLog({
        id: `log-${Date.now()}`,
        turn: currentTurn,
        message: isCritical
          ? `${player.name} lands a critical hit with a basic attack!`
          : `${player.name} attacks ${enemy.name} with a basic attack.`,
        type: isCritical ? "critical" : "attack",
        damage,
      })
    } else {
      // Use ability
      const ability = action

      // Apply ability effects
      if (ability.type === "magical" || ability.type === "physical") {
        const isCritical = Math.random() * 100 < player.critChance
        const damageMultiplier = isCritical ? player.critMultiplier : 1
        const baseDamage = ability.damage * (1 - enemy.defense / (enemy.defense + 1000))
        const damage = Math.floor(baseDamage * damageMultiplier)

        // Apply damage
        setEnemy((prev) => {
          if (!prev) return null
          return {
            ...prev,
            health: Math.max(0, prev.health - damage),
          }
        })

        // Log the ability
        addBattleLog({
          id: `log-${Date.now()}`,
          turn: currentTurn,
          message: isCritical
            ? `${player.name} casts ${ability.name} for a critical hit!`
            : `${player.name} casts ${ability.name}.`,
          type: isCritical ? "critical" : "ability",
          damage,
        })
      } else if (ability.type === "heal") {
        const healAmount = Math.abs(ability.damage) // Healing is stored as negative damage

        // Apply healing
        setPlayer((prev) => ({
          ...prev,
          health: Math.min(prev.maxHealth, prev.health + healAmount),
        }))

        // Log the healing
        addBattleLog({
          id: `log-${Date.now()}`,
          turn: currentTurn,
          message: `${player.name} casts ${ability.name} and heals for ${healAmount} health.`,
          type: "heal",
          heal: healAmount,
        })
      } else if (ability.type === "buff") {
        // Create a buff
        const newBuff: Buff = {
          id: `buff-${Date.now()}`,
          name: ability.name,
          duration: 3, // 3 turns
          effect: {
            stat: "defense", // Example: buff defense
            value: 50, // Increase by 50
          },
          isPositive: true,
          icon: ability.icon,
        }

        // Apply buff
        setPlayer((prev) => ({
          ...prev,
          buffs: [...prev.buffs, newBuff],
          defense: prev.defense + newBuff.effect.value, // Apply the stat boost
        }))

        // Log the buff
        addBattleLog({
          id: `log-${Date.now()}`,
          turn: currentTurn,
          message: `${player.name} casts ${ability.name} and gains increased defense.`,
          type: "buff",
        })
      } else if (ability.type === "debuff") {
        // Create a debuff
        const newDebuff: Debuff = {
          id: `debuff-${Date.now()}`,
          name: ability.name,
          duration: 3, // 3 turns
          effect: {
            stat: "attack", // Example: debuff attack
            value: 40, // Decrease by 40
          },
          isPositive: false,
          icon: ability.icon,
        }

        // Apply debuff
        setEnemy((prev) => {
          if (!prev) return null
          return {
            ...prev,
            debuffs: [...prev.debuffs, newDebuff],
            attack: prev.attack - newDebuff.effect.value, // Apply the stat reduction
          }
        })

        // Log the debuff
        addBattleLog({
          id: `log-${Date.now()}`,
          turn: currentTurn,
          message: `${player.name} casts ${ability.name} and weakens ${enemy.name}.`,
          type: "debuff",
        })
      }

      // Consume mana and set cooldown
      setPlayer((prev) => ({
        ...prev,
        mana: prev.mana - ability.manaCost,
        abilities: prev.abilities.map((a) => (a.id === ability.id ? { ...a, currentCooldown: a.cooldown } : a)),
      }))
    }
  }

  // Execute enemy's turn
  const executeEnemyTurn = () => {
    if (!enemy) return

    // Choose an ability or basic attack
    const availableAbilities = enemy.abilities.filter(
      (ability) => ability.currentCooldown === 0 && enemy.mana >= ability.manaCost,
    )

    let action: "basic" | Ability = "basic"
    if (availableAbilities.length > 0) {
      // Simple AI logic
      const healingNeeded = enemy.health < enemy.maxHealth * 0.4
      const buffNeeded = enemy.buffs.length === 0 && Math.random() > 0.5

      if (healingNeeded) {
        const healAbility = availableAbilities.find((a) => a.type === "heal")
        if (healAbility) action = healAbility
      } else if (buffNeeded) {
        const buffAbility = availableAbilities.find((a) => a.type === "buff")
        if (buffAbility) action = buffAbility
      } else {
        // Randomly choose an offensive ability
        const offensiveAbilities = availableAbilities.filter(
          (a) => a.type === "magical" || a.type === "physical" || a.type === "debuff",
        )
        if (offensiveAbilities.length > 0) {
          action = offensiveAbilities[Math.floor(Math.random() * offensiveAbilities.length)]
        }
      }
    }

    if (action === "basic") {
      // Basic attack
      const isCritical = Math.random() * 100 < enemy.critChance
      const damageMultiplier = isCritical ? enemy.critMultiplier : 1
      const baseDamage = enemy.attack * (1 - player.defense / (player.defense + 1000))
      const damage = Math.floor(baseDamage * damageMultiplier)

      // Apply damage
      setPlayer((prev) => ({
        ...prev,
        health: Math.max(0, prev.health - damage),
      }))

      // Log the attack
      addBattleLog({
        id: `log-${Date.now()}`,
        turn: currentTurn,
        message: isCritical
          ? `${enemy.name} lands a critical hit with a basic attack!`
          : `${enemy.name} attacks ${player.name} with a basic attack.`,
        type: isCritical ? "critical" : "attack",
        damage,
      })
    } else {
      // Use ability
      const ability = action

      // Apply ability effects
      if (ability.type === "magical" || ability.type === "physical") {
        const isCritical = Math.random() * 100 < enemy.critChance
        const damageMultiplier = isCritical ? enemy.critMultiplier : 1
        const baseDamage = ability.damage * (1 - player.defense / (player.defense + 1000))
        const damage = Math.floor(baseDamage * damageMultiplier)

        // Apply damage
        setPlayer((prev) => ({
          ...prev,
          health: Math.max(0, prev.health - damage),
        }))

        // Log the ability
        addBattleLog({
          id: `log-${Date.now()}`,
          turn: currentTurn,
          message: isCritical
            ? `${enemy.name} uses ${ability.name} for a critical hit!`
            : `${enemy.name} uses ${ability.name}.`,
          type: isCritical ? "critical" : "ability",
          damage,
        })
      } else if (ability.type === "heal") {
        const healAmount = Math.abs(ability.damage) // Healing is stored as negative damage

        // Apply healing
        setEnemy((prev) => {
          if (!prev) return null
          return {
            ...prev,
            health: Math.min(prev.maxHealth, prev.health + healAmount),
          }
        })

        // Log the healing
        addBattleLog({
          id: `log-${Date.now()}`,
          turn: currentTurn,
          message: `${enemy.name} uses ${ability.name} and heals for ${healAmount} health.`,
          type: "heal",
          heal: healAmount,
        })
      } else if (ability.type === "buff") {
        // Create a buff
        const newBuff: Buff = {
          id: `buff-${Date.now()}`,
          name: ability.name,
          duration: 3, // 3 turns
          effect: {
            stat: "attack", // Example: buff attack
            value: 40, // Increase by 40
          },
          isPositive: true,
          icon: ability.icon,
        }

        // Apply buff
        setEnemy((prev) => {
          if (!prev) return null
          return {
            ...prev,
            buffs: [...prev.buffs, newBuff],
            attack: prev.attack + newBuff.effect.value, // Apply the stat boost
          }
        })

        // Log the buff
        addBattleLog({
          id: `log-${Date.now()}`,
          turn: currentTurn,
          message: `${enemy.name} uses ${ability.name} and grows stronger.`,
          type: "buff",
        })
      } else if (ability.type === "debuff") {
        // Create a debuff
        const newDebuff: Debuff = {
          id: `debuff-${Date.now()}`,
          name: ability.name,
          duration: 3, // 3 turns
          effect: {
            stat: "attack", // Example: debuff attack
            value: 50, // Decrease by 50
          },
          isPositive: false,
          icon: ability.icon,
        }

        // Apply debuff
        setPlayer((prev) => ({
          ...prev,
          debuffs: [...prev.debuffs, newDebuff],
          attack: prev.attack - newDebuff.effect.value, // Apply the stat reduction
        }))

        // Log the debuff
        addBattleLog({
          id: `log-${Date.now()}`,
          turn: currentTurn,
          message: `${enemy.name} uses ${ability.name} and weakens ${player.name}.`,
          type: "debuff",
        })
      }

      // Consume mana and set cooldown
      setEnemy((prev) => {
        if (!prev) return null
        return {
          ...prev,
          mana: prev.mana - ability.manaCost,
          abilities: prev.abilities.map((a) => (a.id === ability.id ? { ...a, currentCooldown: a.cooldown } : a)),
        }
      })
    }
  }

  // Update cooldowns and buff/debuff durations
  const updateCooldowns = () => {
    // Update player cooldowns
    setPlayer((prev) => ({
      ...prev,
      abilities: prev.abilities.map((ability) => ({
        ...ability,
        currentCooldown: Math.max(0, ability.currentCooldown - 1),
      })),
      // Update buff durations
      buffs: prev.buffs.map((buff) => ({ ...buff, duration: buff.duration - 1 })).filter((buff) => buff.duration > 0),
      // Update debuff durations
      debuffs: prev.debuffs
        .map((debuff) => ({ ...debuff, duration: debuff.duration - 1 }))
        .filter((debuff) => debuff.duration > 0),
    }))

    // Update enemy cooldowns
    setEnemy((prev) => {
      if (!prev) return null
      return {
        ...prev,
        abilities: prev.abilities.map((ability) => ({
          ...ability,
          currentCooldown: Math.max(0, ability.currentCooldown - 1),
        })),
        // Update buff durations
        buffs: prev.buffs.map((buff) => ({ ...buff, duration: buff.duration - 1 })).filter((buff) => buff.duration > 0),
        // Update debuff durations
        debuffs: prev.debuffs
          .map((debuff) => ({ ...debuff, duration: debuff.duration - 1 }))
          .filter((debuff) => debuff.duration > 0),
      }
    })
  }

  // End the battle
  const endBattle = (result: "victory" | "defeat") => {
    setBattleState(result)
    setAutoProgress(false)

    if (result === "victory" && enemy) {
      // Calculate rewards
      const expReward = Math.floor(enemy.level * 100 * (1 + Math.random() * 0.2))
      const goldReward = Math.floor(enemy.level * 25 * (1 + Math.random() * 0.3))

      setRewards({
        experience: expReward,
        gold: goldReward,
      })

      addBattleLog({
        id: `log-${Date.now()}`,
        turn: currentTurn,
        message: `${player.name} has defeated ${enemy.name}!`,
        type: "system",
      })

      addBattleLog({
        id: `log-${Date.now()}`,
        turn: currentTurn,
        message: `Rewards: ${expReward} XP and ${goldReward} gold`,
        type: "system",
      })
    } else {
      addBattleLog({
        id: `log-${Date.now()}`,
        turn: currentTurn,
        message: `${player.name} has been defeated by ${enemy?.name}!`,
        type: "system",
      })
    }
  }

  // Add a battle log entry
  const addBattleLog = (log: BattleLog) => {
    setBattleLogs((prev) => [log, ...prev])
  }

  // Reset the battle
  const resetBattle = () => {
    if (selectedEnemy) {
      setEnemy({ ...selectedEnemy })
      setPlayer({ ...playerCharacter })
      setBattleLogs([])
      setBattleState("idle")
      setCurrentTurn(0)
      setAutoProgress(false)
      setRewards({ experience: 0, gold: 0 })
      setGoldAdded(false) // Reset the gold added flag
    }
  }

  // Get the icon for an ability
  const getAbilityIcon = (icon: string) => {
    switch (icon) {
      case "flame":
        return <Flame className="w-4 h-4" />
      case "sparkles":
        return <Sparkles className="w-4 h-4" />
      case "shield":
        return <Shield className="w-4 h-4" />
      case "swords":
        return <Swords className="w-4 h-4" />
      case "heart":
        return <Heart className="w-4 h-4" />
      case "zap":
        return <Zap className="w-4 h-4" />
      case "skull":
        return <Skull className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  // Get the color for a battle log entry
  const getLogColor = (type: BattleLog["type"]) => {
    switch (type) {
      case "attack":
        return "text-gray-300"
      case "ability":
        return "text-blue-400"
      case "heal":
        return "text-green-400"
      case "buff":
        return "text-yellow-400"
      case "debuff":
        return "text-purple-400"
      case "critical":
        return "text-red-400"
      case "system":
        return "text-gray-400"
      default:
        return "text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Battle Arena</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="font-medium">{gold.toLocaleString()} Gold</span>
          </div>
          <Badge variant="outline" className="bg-gray-800">
            {battleState === "idle" ? "Select an Enemy" : `Turn ${currentTurn}`}
          </Badge>
        </div>
      </div>

      {!selectedEnemy ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {enemies.map((enemy) => (
            <Card
              key={enemy.id}
              className="bg-gray-800 border-gray-700 cursor-pointer hover:border-purple-500 transition-colors"
              onClick={() => setSelectedEnemy(enemy)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Swords className="w-5 h-5 text-red-400" />
                  {enemy.name}
                </CardTitle>
                <CardDescription>Level {enemy.level}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                    <img src={enemy.image || "/placeholder.svg"} alt={enemy.name} className="w-16 h-16 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      HP
                    </span>
                    <span>{enemy.health}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Swords className="w-4 h-4 text-orange-400" />
                      ATK
                    </span>
                    <span>{enemy.attack}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-400" />
                      DEF
                    </span>
                    <span>{enemy.defense}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Select Enemy</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  {/* Player */}
                  <div className="flex flex-col items-center space-y-3 w-full md:w-1/3">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                      <img
                        src={player.image || "/placeholder.svg"}
                        alt={player.name}
                        className="w-16 h-16 rounded-full"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold">{player.name}</h3>
                      <p className="text-sm text-gray-400">Level {player.level}</p>
                    </div>
                    <div className="w-full space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            HP
                          </span>
                          <span>
                            {player.health} / {player.maxHealth}
                          </span>
                        </div>
                        <Progress
                          value={(player.health / player.maxHealth) * 100}
                          className="h-2 bg-gray-700"
                          indicatorClassName="bg-red-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-blue-400" />
                            MP
                          </span>
                          <span>
                            {player.mana} / {player.maxMana}
                          </span>
                        </div>
                        <Progress
                          value={(player.mana / player.maxMana) * 100}
                          className="h-2 bg-gray-700"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>
                    </div>
                    {player.buffs.length > 0 && (
                      <div className="flex gap-1">
                        {player.buffs.map((buff) => (
                          <Badge
                            key={buff.id}
                            variant="outline"
                            className="bg-green-900/30 text-green-400 border-green-500"
                          >
                            {buff.name} ({buff.duration})
                          </Badge>
                        ))}
                      </div>
                    )}
                    {player.debuffs.length > 0 && (
                      <div className="flex gap-1">
                        {player.debuffs.map((debuff) => (
                          <Badge
                            key={debuff.id}
                            variant="outline"
                            className="bg-red-900/30 text-red-400 border-red-500"
                          >
                            {debuff.name} ({debuff.duration})
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Battle Status */}
                  <div className="flex flex-col items-center justify-center w-full md:w-1/3">
                    {battleState === "idle" ? (
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded text-lg"
                        onClick={startBattle}
                      >
                        Start Battle
                      </Button>
                    ) : battleState === "in-progress" ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-xl font-bold">VS</div>
                        <div className="flex gap-2">
                          <Button
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={progressBattle}
                            disabled={autoProgress}
                          >
                            Next Turn
                          </Button>
                          <Button
                            variant={autoProgress ? "destructive" : "outline"}
                            onClick={() => setAutoProgress(!autoProgress)}
                          >
                            {autoProgress ? "Stop Auto" : "Auto Battle"}
                          </Button>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={battleSpeed === "slow" ? "bg-gray-700" : ""}
                            onClick={() => setBattleSpeed("slow")}
                          >
                            Slow
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={battleSpeed === "normal" ? "bg-gray-700" : ""}
                            onClick={() => setBattleSpeed("normal")}
                          >
                            Normal
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={battleSpeed === "fast" ? "bg-gray-700" : ""}
                            onClick={() => setBattleSpeed("fast")}
                          >
                            Fast
                          </Button>
                        </div>
                      </div>
                    ) : battleState === "victory" ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-xl font-bold text-green-400">Victory!</div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span>{rewards.experience} XP</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Coins className="w-5 h-5 text-yellow-400" />
                            <span>{rewards.gold} Gold</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button className="bg-purple-600 hover:bg-purple-700" onClick={resetBattle}>
                            Battle Again
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedEnemy(null)}>
                            Choose Enemy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-xl font-bold text-red-400">Defeat</div>
                        <div className="flex gap-2 mt-2">
                          <Button className="bg-purple-600 hover:bg-purple-700" onClick={resetBattle}>
                            Try Again
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedEnemy(null)}>
                            Choose Enemy
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enemy */}
                  {enemy && (
                    <div className="flex flex-col items-center space-y-3 w-full md:w-1/3">
                      <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                        <img
                          src={enemy.image || "/placeholder.svg"}
                          alt={enemy.name}
                          className="w-16 h-16 rounded-full"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold">{enemy.name}</h3>
                        <p className="text-sm text-gray-400">Level {enemy.level}</p>
                      </div>
                      <div className="w-full space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-red-400" />
                              HP
                            </span>
                            <span>
                              {enemy.health} / {enemy.maxHealth}
                            </span>
                          </div>
                          <Progress
                            value={(enemy.health / enemy.maxHealth) * 100}
                            className="h-2 bg-gray-700"
                            indicatorClassName="bg-red-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-blue-400" />
                              MP
                            </span>
                            <span>
                              {enemy.mana} / {enemy.maxMana}
                            </span>
                          </div>
                          <Progress
                            value={(enemy.mana / enemy.maxMana) * 100}
                            className="h-2 bg-gray-700"
                            indicatorClassName="bg-blue-500"
                          />
                        </div>
                      </div>
                      {enemy.buffs.length > 0 && (
                        <div className="flex gap-1">
                          {enemy.buffs.map((buff) => (
                            <Badge
                              key={buff.id}
                              variant="outline"
                              className="bg-green-900/30 text-green-400 border-green-500"
                            >
                              {buff.name} ({buff.duration})
                            </Badge>
                          ))}
                        </div>
                      )}
                      {enemy.debuffs.length > 0 && (
                        <div className="flex gap-1">
                          {enemy.debuffs.map((debuff) => (
                            <Badge
                              key={debuff.id}
                              variant="outline"
                              className="bg-red-900/30 text-red-400 border-red-500"
                            >
                              {debuff.name} ({debuff.duration})
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="abilities">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="abilities">Abilities</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>
              <TabsContent value="abilities" className="mt-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>Your Abilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {player.abilities.map((ability) => (
                        <div
                          key={ability.id}
                          className={`bg-gray-700 rounded-md p-3 border ${
                            ability.currentCooldown > 0 ? "border-gray-600 opacity-60" : "border-purple-500"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-600 rounded-md flex items-center justify-center">
                                {getAbilityIcon(ability.icon)}
                              </div>
                              <div>
                                <h4 className="font-medium">{ability.name}</h4>
                                <p className="text-xs text-gray-400">{ability.type}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              {ability.currentCooldown > 0 && (
                                <Badge variant="outline" className="bg-gray-600">
                                  CD: {ability.currentCooldown}
                                </Badge>
                              )}
                              <span className="text-xs text-blue-400">{ability.manaCost} MP</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2">{ability.description}</p>
                          {ability.damage > 0 && (
                            <div className="mt-1 text-sm text-red-400">Damage: {ability.damage}</div>
                          )}
                          {ability.damage < 0 && (
                            <div className="mt-1 text-sm text-green-400">Heal: {Math.abs(ability.damage)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="stats" className="mt-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>Battle Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">{player.name}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Swords className="w-5 h-5 text-red-400" />
                              <span>Attack</span>
                            </div>
                            <span className="font-mono">{player.attack}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Shield className="w-5 h-5 text-blue-400" />
                              <span>Defense</span>
                            </div>
                            <span className="font-mono">{player.defense}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Zap className="w-5 h-5 text-yellow-400" />
                              <span>Speed</span>
                            </div>
                            <span className="font-mono">{player.speed}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Flame className="w-5 h-5 text-orange-400" />
                              <span>Critical Chance</span>
                            </div>
                            <span className="font-mono">{player.critChance}%</span>
                          </div>
                        </div>
                      </div>

                      {enemy && (
                        <div className="space-y-4">
                          <h3 className="font-medium text-lg">{enemy.name}</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Swords className="w-5 h-5 text-red-400" />
                                <span>Attack</span>
                              </div>
                              <span className="font-mono">{enemy.attack}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-400" />
                                <span>Defense</span>
                              </div>
                              <span className="font-mono">{enemy.defense}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                <span>Speed</span>
                              </div>
                              <span className="font-mono">{enemy.speed}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-400" />
                                <span>Critical Chance</span>
                              </div>
                              <span className="font-mono">{enemy.critChance}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scroll className="w-5 h-5 text-gray-400" />
                  Battle Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] overflow-y-auto space-y-2 pr-2">
                  {battleLogs.length > 0 ? (
                    battleLogs.map((log) => (
                      <div key={log.id} className={`text-xs ${getLogColor(log.type)}`}>
                        <div className="flex justify-between">
                          <span>{log.message}</span>
                          {log.damage && <span className="text-red-400">-{log.damage}</span>}
                          {log.heal && <span className="text-green-400">+{log.heal}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">Battle log will appear here</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
