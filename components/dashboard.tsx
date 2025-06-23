"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  MapPin,
  Users,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import { trpc } from "../lib/trpc-client";

export function Dashboard() {
  const utils = trpc.useUtils();
  const { data: users, isLoading: usersLoading } = trpc.users.getAll.useQuery();
  const { data: alerts, isLoading: alertsLoading } =
    trpc.alerts.getAll.useQuery({
      isResolved: false,
      limit: 10,
    });

  const invalidateAlerts = () => {
    utils.alerts.getAll.invalidate({ isResolved: false, limit: 10 });
  };

  const resolveAlert = trpc.alerts.resolve.useMutation({
    onSuccess: () => {
      // Refetch alerts after resolving
      invalidateAlerts();
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500";
      case "HIGH":
        return "bg-orange-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "LOW":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "FALL_DETECTED":
        return "🚨";
      case "IMMOBILITY_DETECTED":
        return "⏰";
      case "ROUTE_DEVIATION":
        return "🗺️";
      case "DANGER_ZONE_ENTRY":
        return "⚠️";
      case "MANUAL_EMERGENCY":
        return "🆘";
      default:
        return "📢";
    }
  };

  if (usersLoading || alertsLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  const activeAlerts = alerts?.filter((alert) => !alert.isResolved) || [];
  const totalUsers = users?.length || 0;
  const criticalAlerts = activeAlerts.filter(
    (alert) => alert.severity === "CRITICAL"
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active monitoring users
            </p>
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
            <CardTitle className="text-sm font-medium">
              Critical Alerts
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalAlerts}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3m</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Latest safety alerts from monitored users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAlerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No active alerts. All users are safe! 🎉
              </p>
            ) : (
              activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getAlertTypeIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">
                          {alert.user.name || alert.user.email}
                        </p>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.message}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                        {alert.latitude && alert.longitude && (
                          <>
                            <MapPin className="h-3 w-3 ml-2" />
                            <span>
                              {alert.latitude.toFixed(4)},{" "}
                              {alert.longitude.toFixed(4)}
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
                          window.open(
                            `https://maps.google.com/?q=${alert.latitude},${alert.longitude}`,
                            "_blank"
                          );
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

      {/* Users Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Monitored Users</CardTitle>
          <CardDescription>
            Overview of all users in the safety monitoring system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users?.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{user.name || "Unnamed User"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.phone && (
                    <p className="text-sm text-muted-foreground">
                      {user.phone}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <span>{user._count.alerts} alerts</span>
                    <span>{user._count.emergencyContacts} contacts</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
