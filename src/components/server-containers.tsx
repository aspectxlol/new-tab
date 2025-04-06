"use client"

import { useState, useEffect } from "react"
import { Box, CheckCircle, XCircle, Clock, AlertTriangle, Server } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

type ContainerStatus = "running" | "stopped" | "restarting" | "unhealthy"

type Container = {
  id: string
  name: string
  status: ContainerStatus
  image: string
  ports: Array<{
    internal: number
    external: number
    protocol?: "tcp" | "udp"
  }>
  lastHealthcheck: {
    timestamp: Date
    status: "passed" | "failed" | "warning"
  }
}

export function ServerContainers() {
  const [containers, setContainers] = useState<Container[]>([
    {
      // Jellyfin
      id: "jellyfin",
      name: "Jellyfin",
      status: "running",
      image: "jellyfin/jellyfin:latest",
      ports: [
        { internal: 8096, external: 8096 },
        { internal: 8920, external: 8920 },
      ],
      lastHealthcheck: {
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        status: "passed",
      },
    },
    {
      // Nextcloud
      id: "nextcloud",
      name: "Nextcloud",
      status: "running",
      image: "nextcloud:latest",
      ports: [
        { internal: 80, external: 8081 },
      ],
      lastHealthcheck: {
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        status: "passed",
      },
    },
    {
      // Samba
      id: "samba",
      name: "Samba",
      status: "running",
      image: "dperson/samba:latest",
      ports: [
        { internal: 139, external: 139 },
        { internal: 135, external: 135 },
        { internal: 445, external: 445 },
        { internal: 137, external: 137 },
      ],
      lastHealthcheck: {
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        status: "passed",
      },
    },
    {
      // Portainer
      id: "portainer",
      name: "Portainer",
      status: "running",
      image: "portainer/portainer-ce:latest",
      ports: [
        { internal: 9000, external: 9000 },
      ],
      lastHealthcheck: {
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        status: "passed",
      },
    },
    {
      id: "api-webserver",
      name: "API Webserver",
      status: "running",
      image: "node:alpine",
      ports: [
        { internal: 3000, external: 3000 },
      ],
      lastHealthcheck: {
        timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
        status: "warning",
      },
    },
    {
      // postgres api-db
      id: "api-db",
      name: "API Database",
      status: "running",
      image: "postgres:alpine",
      ports: [{ internal: 5432, external: 5432 }],
      lastHealthcheck: {
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        status: "passed",
      },
    },
    {
      // redis api-db
      id: "api-db-redis",
      name: "API Database Redis",
      status: "running",
      image: "redis:alpine",
      ports: [{ internal: 6379, external: 6379 }],
      lastHealthcheck: {
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        status: "passed",
      },
    },
    {
      // wireguard for VPN
      id: "wireguard",
      name: "Wireguard",
      status: "running",
      image: "linuxserver/wireguard:latest",
      ports: [
        { internal: 51820, external: 51820 },
        { internal: 51821, external: 51821 },
      ],
      lastHealthcheck: {
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        status: "passed",
      },
    },
    {
      // homeassistant
      id: "homeassistant",
      name: "Home Assistant",
      status: "running",
      image: "homeassistant/home-assistant:latest",
      ports: [
        { internal: 8123, external: 8123 },
      ],
      lastHealthcheck: {
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        status: "passed",
      },
    },
  ])

  const [uptime, setUptime] = useState({
    days: 2,
    hours: 8,
    minutes: 15,
  })

  // Simulate occasional container status changes
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * containers.length)
      const randomContainer = { ...containers[randomIndex] }

      // Randomly change status sometimes
      if (Math.random() > 0.7) {
        const statuses: ContainerStatus[] = ["running", "stopped", "restarting", "unhealthy"]
        const currentStatusIndex = statuses.indexOf(randomContainer.status)
        const newStatusIndex = (currentStatusIndex + 1) % statuses.length
        randomContainer.status = statuses[newStatusIndex]

        // Update healthcheck based on new status
        if (randomContainer.status === "running") {
          randomContainer.lastHealthcheck = {
            timestamp: new Date(),
            status: "passed",
          }
        } else if (randomContainer.status === "unhealthy") {
          randomContainer.lastHealthcheck = {
            timestamp: new Date(),
            status: "failed",
          }
        } else if (randomContainer.status === "restarting") {
          randomContainer.lastHealthcheck = {
            timestamp: new Date(),
            status: "warning",
          }
        }

        const updatedContainers = [...containers]
        updatedContainers[randomIndex] = randomContainer
        setContainers(updatedContainers)
      }
    }, 10000)

    // Update uptime
    const uptimeInterval = setInterval(() => {
      setUptime((prev) => {
        let { days, hours, minutes } = prev
        minutes += 1

        if (minutes >= 60) {
          minutes = 0
          hours += 1
        }

        if (hours >= 24) {
          hours = 0
          days += 1
        }

        return { days, hours, minutes }
      })
    }, 60000) // Update every minute

    return () => {
      clearInterval(interval)
      clearInterval(uptimeInterval)
    }
  }, [containers])

  const getStatusIcon = (status: ContainerStatus) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "stopped":
        return <XCircle className="h-4 w-4 text-gray-500" />
      case "restarting":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "unhealthy":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: ContainerStatus) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-500">Running</Badge>
      case "stopped":
        return <Badge className="bg-gray-500">Stopped</Badge>
      case "restarting":
        return <Badge className="bg-blue-500">Restarting</Badge>
      case "unhealthy":
        return <Badge className="bg-red-500">Unhealthy</Badge>
      default:
        return null
    }
  }

  const getHealthcheckIcon = (status: "passed" | "failed" | "warning") => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffMins < 24 * 60) {
      const hours = Math.floor(diffMins / 60)
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    } else {
      const days = Math.floor(diffMins / (24 * 60))
      return `${days} day${days !== 1 ? "s" : ""} ago`
    }
  }

  const runningContainers = containers.filter((c) => c.status === "running").length
  const totalContainers = containers.length

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-shrink-0">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5 text-gray-500" />
            <span>Containers</span>
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="text-xs bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
            <Server className="h-3 w-3 text-gray-500" />
            <span>
              Uptime: {uptime.days}d {uptime.hours}h {uptime.minutes}m
            </span>
          </div>
          <Badge className="bg-green-500">
            {runningContainers}/{totalContainers}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(400px-64px)]">
          <div className="space-y-3 pr-4">
            {containers.map((container) => {
              return (
                <div
                  key={container.id}
                  className={`border rounded-md p-3 ${container.status === "unhealthy"
                    ? "border-red-200 bg-red-50"
                    : container.status === "restarting"
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200"
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(container.status)}
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{container.name}</span>
                      </div>
                    </div>
                    {getStatusBadge(container.status)}
                  </div>
                  <div className="text-xs text-gray-500 mb-2 pl-10">{container.image}</div>
                  {container.ports.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2 pl-10">
                      {container.ports.map((port, index) => (
                        <div
                          key={index}
                          className="text-xs bg-gray-100 px-1.5 py-0.5 rounded flex items-center"
                          title={port.protocol ? `${port.protocol} port` : "port"}
                        >
                          <span className="text-gray-700">
                            {port.external}:{port.internal}
                          </span>
                          {port.protocol && <span className="ml-1 text-xs text-gray-500">({port.protocol})</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <span>Last check:</span>
                      {getHealthcheckIcon(container.lastHealthcheck.status)}
                      <span>{formatTime(container.lastHealthcheck.timestamp)}</span>
                    </div>
                    <div>
                      {container.status === "running" && <span className="text-green-600 text-xs">Healthy</span>}
                      {container.status === "restarting" && (
                        <span className="text-blue-600 text-xs">Restarting...</span>
                      )}
                      {container.status === "unhealthy" && <span className="text-red-600 text-xs">Check failed</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
