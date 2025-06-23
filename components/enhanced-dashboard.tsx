"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertTriangle, MapPin, Users, Shield, Clock, CheckCircle, Activity, RefreshCw } from "lucide-react"
import { trpc } from "../lib/trpc-client"
import { LocationMap } from "./maps/location-map"
import { UserManagement } from "./user-management"
import { AddAlertModal } from "./add-alert-modal"
import { useToast } from "@/hooks/use-toast"

export function EnhancedDashboard() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false)

  const { toast } = useToast()

  // Fetch data with automatic polling every 30 seconds
  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = trpc.users.getAll.useQuery(undefined, {
    refetchInterval: 30000, // Poll every 30 seconds
    refetchIntervalInBackground: true,
  })

  const {
    data: alerts,
    isLoading: alertsLoading,
    refetch: refetchAlerts,
  } = trpc.alerts.getAll.useQuery(
    {
      isResolved: false,
      limit: 10,
    },
    {
      refetchInterval: 30000, // Poll every 30 seconds
      refetchIntervalInBackground: true,
    },
  )

  const utils = trpc.useUtils()

  const resolveAlert = trpc.alerts.resolve.useMutation({
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches
      await utils.alerts.getAll.cancel()

      // Snapshot the previous value
      const previousAlerts = utils.alerts.getAll.getData()

      // Optimistically update to the new value
      if (previousAlerts) {
        utils.alerts.getAll.setData(
          { isResolved: false, limit: 10 },
          previousAlerts.map((alert) =>
            alert.id === id ? { ...alert, isResolved: true, resolvedAt: new Date() } : alert,
          ),
        )
      }

      // Return a context object with the snapshotted value
      return { previousAlerts }
    },
    onSuccess: () => {
      toast({
        title: "Alert Resolved",
        description: "The alert has been successfully resolved.",
      })
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAlerts) {
        utils.alerts.getAll.setData({ isResolved: false, limit: 10 }, context.previousAlerts)
      }
      toast({
        title: "Error",
        description: "Failed to resolve alert. Please try again.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      utils.alerts.getAll.invalidate()
      utils.users.getAll.invalidate()
    },
  })

  const invalidateQueries = () => {
    // Invalidate tRPC queries to refresh data
    utils.alerts.getAll.invalidate()
    utils.users.getAll.invalidate()
  }

  const manualRefresh = () => {
    refetchUsers()
    refetchAlerts()
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated.",
    })
  }

  if (usersLoading || alertsLoading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard...</div>
  }

  const currentUsers = users || []
  const currentAlerts = alerts || []
  const activeAlerts = currentAlerts.filter((alert) => !alert.isResolved)
  const totalUsers = currentUsers.length
  const criticalAlerts = activeAlerts.filter((alert) => alert.severity === "CRITICAL").length

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500"
      case "HIGH":
        return "bg-orange-500"
      case "MEDIUM":
        return "bg-yellow-500"
      case "LOW":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "FALL_DETECTED":
        return "🚨"
      case "IMMOBILITY_DETECTED":
        return "⏰"
      case "ROUTE_DEVIATION":
        return "🗺️"
      case "DANGER_ZONE_ENTRY":
        return "⚠️"
      case "MANUAL_EMERGENCY":
        return "🆘"
      default:
        return "📢"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Alert Button and Manual Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">Auto-refresh every 30s</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={manualRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <AddAlertModal onAlertAdded={invalidateQueries} />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active monitoring users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Unresolved alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Live Map</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest safety alerts from monitored users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No active alerts. All users are safe! 🎉</p>
                ) : (
                  activeAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getAlertTypeIcon(alert.type)}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{alert.user.name || alert.user.email}</p>
                            <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(alert.createdAt).toLocaleString()}</span>
                            {alert.latitude && alert.longitude && (
                              <>
                                <MapPin className="h-3 w-3 ml-2" />
                                <span>
                                  {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (alert.latitude && alert.longitude) {
                              window.open(`https://maps.google.com/?q=${alert.latitude},${alert.longitude}`, "_blank")
                            }
                          }}
                          disabled={!alert.latitude || !alert.longitude}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => resolveAlert.mutate({ id: alert.id })}
                          disabled={resolveAlert.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <LocationMap users={currentUsers} alerts={currentAlerts} />
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and their safety settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.name || "Unnamed User"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{user._count?.alerts || 0} alerts</div>
                        <div>{user._count?.emergencyContacts || 0} contacts</div>
                      </div>
                      <Dialog
                        open={isUserManagementOpen && selectedUserId === user.id}
                        onOpenChange={(open) => {
                          setIsUserManagementOpen(open)
                          if (!open) setSelectedUserId(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id)
                              setIsUserManagementOpen(true)
                            }}
                          >
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Manage {user.name || user.email}</DialogTitle>
                          </DialogHeader>
                          {selectedUserId && <UserManagement userId={selectedUserId} />}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
