import { gql } from "@apollo/client"

export const CREATE_CHARACTER = gql`
  mutation CreateCharacter($playerId: ID!, $name: String!, $class: CharacterClass!) {
    createCharacter(playerId: $playerId, name: $name, class: $class) {
      id
      name
      class
      level
    }
  }
`

export const START_QUEST = gql`
  mutation StartQuest($characterId: ID!, $questId: ID!) {
    startQuest(characterId: $characterId, questId: $questId) {
      id
      status
      progress
      totalRequired
      startedAt
      quest {
        id
        title
      }
    }
  }
`

export const UPDATE_QUEST_PROGRESS = gql`
  mutation UpdateQuestProgress($characterId: ID!, $questId: ID!, $progress: Int!) {
    updateQuestProgress(characterId: $characterId, questId: $questId, progress: $progress) {
      id
      progress
      totalRequired
    }
  }
`

export const COMPLETE_QUEST = gql`
  mutation CompleteQuest($characterId: ID!, $questId: ID!) {
    completeQuest(characterId: $characterId, questId: $questId) {
      id
      status
      completedAt
    }
  }
`

export const ADD_ITEM_TO_INVENTORY = gql`
  mutation AddItemToInventory($characterId: ID!, $itemId: ID!, $quantity: Int!) {
    addItemToInventory(characterId: $characterId, itemId: $itemId, quantity: $quantity) {
      id
      quantity
    }
  }
`

export const CREATE_GUILD = gql`
  mutation CreateGuild($name: String!, $description: String) {
    createGuild(name: $name, description: $description) {
      id
      name
      description
    }
  }
`

export const ADD_GUILD_MEMBER = gql`
  mutation AddGuildMember($guildId: ID!, $characterId: ID!, $rank: GuildRank!) {
    addGuildMember(guildId: $guildId, characterId: $characterId, rank: $rank) {
      id
      rank
    }
  }
`
