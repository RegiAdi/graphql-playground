import { createServerClient } from "@/lib/supabase/server"

export const resolvers = {
  // Player queries
  player: async (_: any, { id }: { id: string }) => {
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.from("players").select("*").eq("id", id)

      if (error) throw new Error(error.message)

      if (!data || data.length === 0) {
        return null
      }

      return data[0]
    } catch (error: any) {
      console.error("Error in player query:", error.message)
      throw new Error(`Failed to fetch player: ${error.message}`)
    }
  },

  playerByUsername: async (_: any, { username }: { username: string }) => {
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.from("players").select("*").eq("username", username)

      if (error) throw new Error(error.message)

      if (!data || data.length === 0) {
        return null
      }

      return data[0]
    } catch (error: any) {
      console.error("Error in playerByUsername query:", error.message)
      throw new Error(`Failed to fetch player by username: ${error.message}`)
    }
  },

  // Item queries
  item: async (_: any, { id }: { id: string }) => {
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.from("items").select("*").eq("id", id)

      if (error) throw new Error(error.message)

      if (!data || data.length === 0) {
        return null
      }

      return data[0]
    } catch (error: any) {
      console.error("Error in item query:", error.message)
      throw new Error(`Failed to fetch item: ${error.message}`)
    }
  },

  // Guild queries
  guild: async (_: any, { id }: { id: string }) => {
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.from("guilds").select("*").eq("id", id)

      if (error) throw new Error(error.message)

      if (!data || data.length === 0) {
        return null
      }

      return data[0]
    } catch (error: any) {
      console.error("Error in guild query:", error.message)
      throw new Error(`Failed to fetch guild: ${error.message}`)
    }
  },

  guildByName: async (_: any, { name }: { name: string }) => {
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.from("guilds").select("*").eq("name", name)

      if (error) throw new Error(error.message)

      if (!data || data.length === 0) {
        return null
      }

      return data[0]
    } catch (error: any) {
      console.error("Error in guildByName query:", error.message)
      throw new Error(`Failed to fetch guild by name: ${error.message}`)
    }
  },

  // Quest queries
  quest: async (_: any, { id }: { id: string }) => {
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.from("quests").select("*").eq("id", id)

      if (error) throw new Error(error.message)

      if (!data || data.length === 0) {
        return null
      }

      return data[0]
    } catch (error: any) {
      console.error("Error in quest query:", error.message)
      throw new Error(`Failed to fetch quest: ${error.message}`)
    }
  },

  // Achievement queries
  achievement: async (_: any, { id }: { id: string }) => {
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.from("achievements").select("*").eq("id", id)

      if (error) throw new Error(error.message)

      if (!data || data.length === 0) {
        return null
      }

      return data[0]
    } catch (error: any) {
      console.error("Error in achievement query:", error.message)
      throw new Error(`Failed to fetch achievement: ${error.message}`)
    }
  },

  characterQuests: async (_: any, { characterId, status }: { characterId: string; status?: string }) => {
    try {
      const supabase = createServerClient()
      let query = supabase
        .from("character_quests")
        .select(`
        id,
        character_id,
        quest_id,
        status,
        progress,
        total_required,
        started_at,
        completed_at,
        deadline,
        quest (
          id,
          title,
          description,
          experience_reward,
          gold_reward,
          item_rewards (
            id,
            quantity,
            item (
              id,
              name,
              rarity
            )
          )
        )
      `)
        .eq("character_id", characterId)

      if (status) {
        query = query.eq("status", status)
      }

      const { data, error } = await query

      if (error) throw new Error(error.message)

      // Return empty array if no quests found
      if (!data || data.length === 0) {
        return []
      }

      // Transform the data to match the GraphQL schema
      return data.map((quest) => ({
        id: quest.id,
        characterId: quest.character_id,
        questId: quest.quest_id,
        status: quest.status,
        progress: quest.progress,
        totalRequired: quest.total_required,
        startedAt: quest.started_at,
        completedAt: quest.completed_at,
        deadline: quest.deadline,
        quest: {
          id: quest.quest.id,
          title: quest.quest.title,
          description: quest.quest.description,
          experienceReward: quest.quest.experience_reward,
          goldReward: quest.quest.gold_reward,
          itemRewards: quest.quest.item_rewards.map((reward: any) => ({
            id: reward.id,
            quantity: reward.quantity,
            item: {
              id: reward.item.id,
              name: reward.item.name,
              rarity: reward.item.rarity,
            },
          })),
        },
      }))
    } catch (error: any) {
      console.error("Error in characterQuests query:", error.message)
      throw new Error(`Failed to fetch character quests: ${error.message}`)
    }
  },

  quests: async (_: any, { difficulty, levelRequirement }: { difficulty?: string; levelRequirement?: number }) => {
    try {
      const supabase = createServerClient()
      let query = supabase.from("quests").select(`
        id,
        title,
        description,
        level_requirement,
        difficulty,
        experience_reward,
        gold_reward,
        item_rewards (
          id,
          quantity,
          item (
            id,
            name,
            rarity
          )
        )
      `)

      if (difficulty) {
        query = query.eq("difficulty", difficulty)
      }

      if (levelRequirement) {
        query = query.lte("level_requirement", levelRequirement)
      }

      const { data, error } = await query

      if (error) throw new Error(error.message)

      // Return empty array if no quests found
      if (!data || data.length === 0) {
        return []
      }

      // Transform the data to match the GraphQL schema
      return data.map((quest) => ({
        id: quest.id,
        title: quest.title,
        description: quest.description,
        levelRequirement: quest.level_requirement,
        difficulty: quest.difficulty,
        experienceReward: quest.experience_reward,
        goldReward: quest.gold_reward,
        itemRewards: quest.item_rewards.map((reward: any) => ({
          id: reward.id,
          quantity: reward.quantity,
          item: {
            id: reward.item.id,
            name: reward.item.name,
            rarity: reward.item.rarity,
          },
        })),
      }))
    } catch (error: any) {
      console.error("Error in quests query:", error.message)
      throw new Error(`Failed to fetch quests: ${error.message}`)
    }
  },
}
