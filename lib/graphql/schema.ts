import { gql } from "graphql-tag"

export const typeDefs = gql`
  # Enums
  enum CharacterClass {
    Warrior
    Mage
    Rogue
    Priest
    Warlock
    Paladin
    Druid
    Hunter
    Shaman
  }

  enum ItemType {
    weapon
    armor
    accessory
    consumable
    quest
  }

  enum ItemRarity {
    common
    uncommon
    rare
    epic
    legendary
  }

  enum QuestStatus {
    available
    active
    completed
    failed
  }

  enum QuestDifficulty {
    Easy
    Medium
    Hard
    Legendary
  }

  enum GuildRank {
    Guild_Master
    Officer
    Member
    Initiate
  }

  # Types
  type Player {
    id: ID!
    username: String!
    email: String
    characters: [Character!]
    createdAt: String!
    lastLogin: String!
  }

  type Character {
    id: ID!
    playerId: ID!
    player: Player
    name: String!
    class: CharacterClass!
    level: Int!
    experience: Int!
    nextLevelExperience: Int!
    health: Int!
    maxHealth: Int!
    mana: Int!
    maxMana: Int!
    strength: Int!
    agility: Int!
    intelligence: Int!
    stamina: Int!
    criticalChance: Float!
    armor: Int!
    gold: Int!
    achievementPoints: Int!
    inventory: [CharacterInventoryItem!]
    quests: [CharacterQuest!]
    guild: Guild
    guildRank: GuildRank
    achievements: [Achievement!]
    createdAt: String!
    updatedAt: String!
  }

  type Item {
    id: ID!
    name: String!
    description: String
    type: ItemType!
    rarity: ItemRarity!
    levelRequirement: Int!
    icon: String
    strengthBonus: Int
    agilityBonus: Int
    intelligenceBonus: Int
    staminaBonus: Int
    healthBonus: Int
    manaBonus: Int
    armorBonus: Int
    criticalBonus: Float
    value: Int!
    createdAt: String!
  }

  type CharacterInventoryItem {
    id: ID!
    characterId: ID!
    itemId: ID!
    item: Item!
    quantity: Int!
    isEquipped: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Guild {
    id: ID!
    name: String!
    description: String
    level: Int!
    experience: Int!
    nextLevelExperience: Int!
    gold: Int!
    members: [GuildMember!]
    treasuryItems: [GuildTreasuryItem!]
    achievements: [GuildAchievement!]
    createdAt: String!
    updatedAt: String!
  }

  type GuildMember {
    id: ID!
    guildId: ID!
    characterId: ID!
    character: Character!
    rank: GuildRank!
    joinedAt: String!
    lastActive: String!
  }

  type GuildTreasuryItem {
    id: ID!
    guildId: ID!
    itemId: ID!
    item: Item!
    quantity: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Quest {
    id: ID!
    title: String!
    description: String
    levelRequirement: Int!
    difficulty: QuestDifficulty!
    experienceReward: Int!
    goldReward: Int!
    itemRewards: [QuestReward!]
    repeatable: Boolean!
    createdAt: String!
  }

  type QuestReward {
    id: ID!
    questId: ID!
    itemId: ID!
    item: Item!
    quantity: Int!
  }

  type CharacterQuest {
    id: ID!
    characterId: ID!
    questId: ID!
    quest: Quest!
    status: QuestStatus!
    progress: Int!
    totalRequired: Int!
    startedAt: String!
    completedAt: String
    deadline: String
  }

  type Achievement {
    id: ID!
    name: String!
    description: String
    points: Int!
    createdAt: String!
  }

  type GuildAchievement {
    id: ID!
    guildId: ID!
    achievementId: ID!
    achievement: Achievement!
    completedAt: String!
  }

  type CharacterAchievement {
    id: ID!
    characterId: ID!
    achievementId: ID!
    achievement: Achievement!
    completedAt: String!
  }

  # Leaderboard entry
  type LeaderboardEntry {
    rank: Int!
    character: Character!
  }

  # Queries
  type Query {
    # Player queries
    player(id: ID!): Player
    playerByUsername(username: String!): Player
    currentPlayer: Player

    # Character queries
    character(id: ID!): Character
    charactersByPlayerId(playerId: ID!): [Character!]
    currentPlayerCharacters: [Character!]

    # Item queries
    item(id: ID!): Item
    items(type: ItemType, rarity: ItemRarity, levelRequirement: Int): [Item!]

    # Guild queries
    guild(id: ID!): Guild
    guildByName(name: String!): Guild
    guilds: [Guild!]
    guildMembers(guildId: ID!): [GuildMember!]
    guildTreasury(guildId: ID!): [GuildTreasuryItem!]
    guildAchievements(guildId: ID!): [GuildAchievement!]

    # Quest queries
    quest(id: ID!): Quest
    quests(difficulty: QuestDifficulty, levelRequirement: Int): [Quest!]
    characterQuests(characterId: ID!, status: QuestStatus): [CharacterQuest!]

    # Achievement queries
    achievement(id: ID!): Achievement
    achievements: [Achievement!]
    characterAchievements(characterId: ID!): [CharacterAchievement!]

    # Leaderboard queries
    leaderboard(limit: Int): [LeaderboardEntry!]
  }

  # Mutations
  type Mutation {
    # Player mutations
    createPlayer(username: String!, email: String!, password: String!): Player
    updatePlayer(id: ID!, username: String, email: String): Player
    deletePlayer(id: ID!): Boolean

    # Character mutations
    createCharacter(playerId: ID!, name: String!, class: CharacterClass!): Character
    updateCharacter(id: ID!, name: String, gold: Int): Character
    deleteCharacter(id: ID!): Boolean

    # Inventory mutations
    addItemToInventory(characterId: ID!, itemId: ID!, quantity: Int!): CharacterInventoryItem
    removeItemFromInventory(characterId: ID!, itemId: ID!, quantity: Int!): Boolean
    equipItem(characterId: ID!, itemId: ID!): Boolean
    unequipItem(characterId: ID!, itemId: ID!): Boolean

    # Guild mutations
    createGuild(name: String!, description: String): Guild
    updateGuild(id: ID!, name: String, description: String): Guild
    deleteGuild(id: ID!): Boolean
    addGuildMember(guildId: ID!, characterId: ID!, rank: GuildRank!): GuildMember
    updateGuildMemberRank(guildId: ID!, characterId: ID!, rank: GuildRank!): GuildMember
    removeGuildMember(guildId: ID!, characterId: ID!): Boolean
    addItemToGuildTreasury(guildId: ID!, itemId: ID!, quantity: Int!): GuildTreasuryItem
    removeItemFromGuildTreasury(guildId: ID!, itemId: ID!, quantity: Int!): Boolean

    # Quest mutations
    startQuest(characterId: ID!, questId: ID!): CharacterQuest
    updateQuestProgress(characterId: ID!, questId: ID!, progress: Int!): CharacterQuest
    completeQuest(characterId: ID!, questId: ID!): CharacterQuest
    abandonQuest(characterId: ID!, questId: ID!): Boolean

    # Achievement mutations
    awardAchievementToCharacter(characterId: ID!, achievementId: ID!): CharacterAchievement
    awardAchievementToGuild(guildId: ID!, achievementId: ID!): GuildAchievement
  }
`
