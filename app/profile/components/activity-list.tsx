"use client"

import { useEffect, useState } from "react"
import { getUserActivity } from "@/lib/actions/user"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, LogIn, UserCog, Key } from "lucide-react"

interface ActivityItem {
  type: string
  timestamp: Date
  details: string
}

export default function ActivityList() {
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getUserActivity()
        setActivity(data)
      } catch (error) {
        console.error("Error fetching activity:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4 text-blue-500" />
      case "profile_update":
        return <UserCog className="h-4 w-4 text-green-500" />
      case "password_change":
        return <Key className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activity.length > 0 ? (
        activity.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getActivityIcon(item.type)}</div>
                <div className="flex-1">
                  <p className="font-medium">{item.details}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(item.timestamp)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No recent activity found.</p>
        </div>
      )}
    </div>
  )
}
