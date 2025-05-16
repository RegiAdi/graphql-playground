"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface PlayerContextType {
  gold: number
  setGold: (gold: number) => void
  addGold: (amount: number) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children, initialGold = 12450 }: { children: ReactNode; initialGold?: number }) {
  const [gold, setGold] = useState(initialGold)

  const addGold = (amount: number) => {
    setGold((prev) => prev + amount)
  }

  return <PlayerContext.Provider value={{ gold, setGold, addGold }}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider")
  }
  return context
}
