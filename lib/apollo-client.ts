"use client"

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"

// Use a function to create a new client instance to avoid
// shared client instances between server/client
export function createApolloClient() {
  const httpLink = new HttpLink({
    uri: "/api/graphql",
  })

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  })
}

// For client components
let clientSideClient: ApolloClient<any> | null = null

export function getClient() {
  // Create a new client if one doesn't exist
  if (!clientSideClient) {
    clientSideClient = createApolloClient()
  }

  return clientSideClient
}
