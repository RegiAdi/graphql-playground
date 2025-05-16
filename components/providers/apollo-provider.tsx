"use client"

import type React from "react"

import { useState } from "react"
import { ApolloProvider as BaseApolloProvider } from "@apollo/client"
import { createApolloClient } from "@/lib/apollo-client"

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  // Create the Apollo client on the client-side
  const [client] = useState(() => createApolloClient())

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>
}
