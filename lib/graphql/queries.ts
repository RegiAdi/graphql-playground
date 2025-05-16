import { gql } from "@apollo/client"

export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      class
      level
      experience
      nextLevelExperience
      health
      maxHealth
      mana
      maxMana
      strength
      agility
      intelligence
      stamina
      criticalChance
      armor
      gold
      achievementPoints
      guildRank
      guild {
        id
        name
      }
    }
  }
`

export const GET_CHARACTER_INVENTORY = gql`
  query GetCharacterInventory($characterId: ID!) {
    character(id: $characterId) {
      id
      inventory {
        id
        quantity
        isEquipped
        item {
          id
          name
          description
          type
          rarity
          levelRequirement
          icon
          strengthBonus
          agilityBonus
          intelligenceBonus
          staminaBonus
        }
      }
    }
  }
`

export const GET_CHARACTER_QUESTS = gql`
  query GetCharacterQuests($characterId: ID!, $status: QuestStatus) {
    characterQuests(characterId: $characterId, status: $status) {
      id
      status
      progress
      totalRequired
      startedAt
      completedAt
      deadline
      quest {
        id
        title
        description
        experienceReward
        goldReward
        itemRewards {
          id
          quantity
          item {
            id
            name
            rarity
          }
        }
      }
    }
  }
`

// Add the missing GET_QUESTS query
export const GET_QUESTS = gql`
  query GetQuests($status: QuestStatus) {
    quests(status: $status) {
      id
      title
      description
      levelRequirement
      difficulty
      experienceReward
      goldReward
      itemRewards {
        id
        quantity
        item {
          id
          name
          rarity
        }
      }
    }
  }
`

export const GET_GUILD_INFO = gql`
  query GetGuildInfo($id: ID!) {
    guild(id: $id) {
      id
      name
      description
      level
      experience
      nextLevelExperience
      gold
      members {
        id
        rank
        joinedAt
        lastActive
        character {
          id
          name
          class
          level
        }
      }
      treasuryItems {
        id
        quantity
        item {
          id
          name
          rarity
        }
      }
      achievements {
        id
        completedAt
        achievement {
          id
          name
          description
          points
        }
      }
    }
  }
`

export const GET_LEADERBOARD = gql`
  query GetLeaderboard($limit: Int) {
    leaderboard(limit: $limit) {
      rank
      character {
        id
        name
        class
        level
        achievementPoints
        guild {
          id
          name
        }
      }
    }
  }
`

export const GET_AVAILABLE_QUESTS = gql`
  query GetAvailableQuests($levelRequirement: Int) {
    quests(levelRequirement: $levelRequirement) {
      id
      title
      description
      levelRequirement
      difficulty
      experienceReward
      goldReward
      itemRewards {
        id
        quantity
        item {
          id
          name
          rarity
        }
      }
    }
  }
`
