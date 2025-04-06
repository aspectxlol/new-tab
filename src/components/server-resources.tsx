"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Server, Cpu, HardDrive, Activity, Network } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type ResourceMetric = {
  name: string
  value: number
  used: number
  capacity: number
  unit: string
  icon: React.ReactNode
  color: string
}

export function ServerResources() {
  const [resources, setResources] = useState<ResourceMetric[]>([
    {
      name: "CPU",
      value: 12,
      icon: <Cpu className="h-4 w-4" />,
      capacity: 100,
      used: 12,
      unit: "%",
      color: "bg-blue-500",
    },
    {
      name: "Memory",
      value: 16,
      icon: <Activity className="h-4 w-4" />,
      capacity: 32,
      used: 16,
      unit: "GB",
      color: "bg-green-500",
    },
    {
      name: "Disk",
      value: 60,
      icon: <HardDrive className="h-4 w-4" />,
      capacity: 1024,
      used: 640,
      unit: "GB",
      color: "bg-amber-500",
    },
    {
      name: "Network",
      value: 40,
      icon: <Network className="h-4 w-4" />,
      capacity: 100,
      used: 40,
      unit: "Mbps",
      color: "bg-red-500",
    },
  ])

  // Simulate changing resource values
  useEffect(() => {
    const interval = setInterval(() => {
      setResources((prev) =>
        prev.map((resource) => {
          let newValue = resource.value;
          let newUsed = resource.used;

          if (resource.name === "CPU" || resource.name === "Memory" || resource.name === "Network") {
            // Random increase or decrease for fluctuating resources
            const change = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5;
            newValue = Math.min(Math.max(resource.value + change, 5), 95);
            newUsed = resource.name === "CPU" ? newValue : (newValue / 100) * resource.capacity;
          }

          return {
            ...resource,
            value: newValue,
            used: Number(newUsed.toFixed(1)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  // Format the usage display
  const formatUsage = (resource: ResourceMetric) => {
    if (resource.name === "CPU") {
      return `${Math.round(resource.value)}%`
    } else {
      const formattedCapacity =
        resource.unit === "GB" && resource.capacity >= 1024
          ? `${(resource.capacity / 1024).toFixed(0)}TB`
          : `${resource.capacity} ${resource.unit}`

      return `${resource.used} ${resource.unit} / ${formattedCapacity}`
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between flex-shrink-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-gray-500" />
            <span>Server Resources</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center">
        <div className="space-y-6">
          {resources.map((resource) => (
            <div key={resource.name} className="">
              <div className="flex items-center justify-between">
                <div className="flex items-ceter gap-2">
                  {resource.icon}
                  <span className="text-sm font-medium">{resource.name}</span>
                </div>
                <span className="text-sm font-medium">{formatUsage(resource)}</span>
              </div>
              <Progress value={resource.value} className="h-2" indicatorClassName={resource.color} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

