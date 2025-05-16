import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ApolloProvider } from "@/components/providers/apollo-provider"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MMORPG Dashboard",
  description: "A fullstack MMORPG dashboard with GraphQL",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <ApolloProvider>{children}</ApolloProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
