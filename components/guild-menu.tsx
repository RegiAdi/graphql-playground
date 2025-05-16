"use client"

import { useState } from "react"
import { Users, Shield, Award, Coins, Settings, UserPlus, MessageSquare, Swords, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { usePlayer } from "@/contexts/player-context"

export function GuildMenu() {
  const { gold } = usePlayer()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock guild data
  const guildData = {
    name: "Arcane Council",
    level: 15,
    rank: "Officer",
    memberCount: 24,
    activeMembers: 8,
    treasury: 125000,
    contribution: 15000,
    nextEvent: "Raid on Dragon's Lair",
    eventTime: "Tomorrow, 8:00 PM",
    announcements: [
      {
        id: 1,
        author: "ArcaneWizard",
        content: "New raid schedule posted. Check the calendar!",
        time: "2 hours ago",
      },
      {
        id: 2,
        author: "FrostMage",
        content: "Guild bank donations needed for upcoming event.",
        time: "Yesterday",
      },
    ],
    pendingApplications: 3,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Guild Management</h1>
        <div className="flex items-center gap-2 text-xs">
          <Shield className="h-4 w-4 text-purple-400" />
          <span>{guildData.name}</span>
          <span className="rounded bg-purple-900/50 px-1.5 py-0.5 text-[0.7rem] text-purple-300">
            Lv.{guildData.level}
          </span>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-400" />
            Guild Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col space-y-1">
              <span className="text-gray-400">Your Rank</span>
              <span className="font-medium text-blue-300">{guildData.rank}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-gray-400">Members</span>
              <span className="font-medium">
                {guildData.activeMembers} <span className="text-gray-500">/ {guildData.memberCount} online</span>
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-gray-400">Treasury</span>
              <span className="font-medium text-yellow-400">{guildData.treasury.toLocaleString()} gold</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-gray-400">Your Contribution</span>
              <span className="font-medium text-yellow-400">{guildData.contribution.toLocaleString()} gold</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-800 w-full grid grid-cols-4 h-9">
          <TabsTrigger value="overview" className="text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="members" className="text-xs">
            Members
          </TabsTrigger>
          <TabsTrigger value="events" className="text-xs">
            Events
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-400" />
                Next Guild Event
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs">
              <div className="space-y-2">
                <div className="font-medium">{guildData.nextEvent}</div>
                <div className="text-gray-400">{guildData.eventTime}</div>
                <Button size="sm" variant="outline" className="mt-2 h-7 text-xs w-full">
                  View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs p-0">
              <div className="divide-y divide-gray-700">
                {guildData.announcements.map((announcement) => (
                  <div key={announcement.id} className="p-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-300">{announcement.author}</span>
                      <span className="text-gray-500">{announcement.time}</span>
                    </div>
                    <p className="mt-1 text-gray-300">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button size="sm" className="h-8 text-xs">
              <Coins className="mr-1 h-3 w-3" />
              Donate Gold
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <MessageSquare className="mr-1 h-3 w-3" />
              Guild Chat
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                Guild Members
              </CardTitle>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <UserPlus className="mr-1 h-3 w-3" />
                Invite
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-xs text-center py-12 text-gray-400">Member list loading...</div>
            </CardContent>
          </Card>

          {guildData.pendingApplications > 0 && (
            <Card className="bg-gray-800 border-gray-700 mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-green-400" />
                  Pending Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <div className="flex justify-between items-center">
                  <span>You have {guildData.pendingApplications} pending applications</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-400" />
                Guild Events
              </CardTitle>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Calendar className="mr-1 h-3 w-3" />
                Create Event
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-xs text-center py-12 text-gray-400">No upcoming events</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Swords className="h-4 w-4 text-red-400" />
                Guild Raids
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs">
              <div className="space-y-2">
                <div className="font-medium">Weekly Dragon's Lair Raid</div>
                <div className="text-gray-400">Every Saturday, 8:00 PM</div>
                <Button size="sm" className="mt-2 h-7 text-xs w-full">
                  Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-400" />
                Guild Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs">
              <div className="space-y-3">
                <Button size="sm" variant="outline" className="h-7 text-xs w-full justify-start">
                  <Shield className="mr-2 h-3 w-3" />
                  Guild Emblem
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs w-full justify-start">
                  <Users className="mr-2 h-3 w-3" />
                  Manage Ranks
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs w-full justify-start">
                  <MessageSquare className="mr-2 h-3 w-3" />
                  Guild Message of the Day
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs w-full justify-start">
                  <Award className="mr-2 h-3 w-3" />
                  Guild Achievements
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  Leave Guild
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
