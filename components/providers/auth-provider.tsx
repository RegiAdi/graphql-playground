"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Initial session check
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, username: string) => {
    // Use emailRedirect: false to disable email verification
    const { error, data } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirect: false,
        data: {
          username,
        },
      },
    })

    if (error) throw error

    // Create player record
    if (data.user) {
      const { error: playerError } = await supabaseClient.from("players").insert([
        {
          id: data.user.id,
          username,
          email,
        },
      ])
      if (playerError) throw playerError

      // Automatically sign in the user after sign up
      // This is needed because Supabase still creates the user in a "confirmed" state
      // even though we disabled email verification
      if (!data.session) {
        const { error: signInError } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
      }
    }
  }

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut()
    if (error) throw error
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
