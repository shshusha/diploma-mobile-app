"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Edit, Phone, Mail, User, Shield } from "lucide-react";
import { trpc } from "../lib/trpc-client";

interface UserManagementProps {
  userId: string;
}

export function UserManagement({ userId }: UserManagementProps) {
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isEditRulesOpen, setIsEditRulesOpen] = useState(false);

  const { data: user, refetch } = trpc.users.getById.useQuery({ id: userId });

  const addContact = trpc.emergencyContacts.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsAddContactOpen(false);
    },
  });

  const updateRules = trpc.detectionRules.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditRulesOpen(false);
    },
  });

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <p className="text-lg font-medium">
                {user.name || "Not provided"}
              </p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <Label>Phone</Label>
              <p className="text-lg">{user.phone || "Not provided"}</p>
            </div>
            <div>
              <Label>Member Since</Label>
              <p className="text-lg">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="rules">Detection Rules</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
        </TabsList>

        {/* Emergency Contacts */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>
                    Manage emergency contacts for this user
                  </CardDescription>
                </div>
                <Dialog
                  open={isAddContactOpen}
                  onOpenChange={setIsAddContactOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Emergency Contact</DialogTitle>
                    </DialogHeader>
                    <AddContactForm
                      userId={userId}
                      onSubmit={(data) => addContact.mutate(data)}
                      isLoading={addContact.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.emergencyContacts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No emergency contacts added yet.
                  </p>
                ) : (
                  user.emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </span>
                            {contact.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {contact.email}
                              </span>
                            )}
                          </div>
                          {contact.relation && (
                            <Badge variant="outline">{contact.relation}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detection Rules */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Detection Rules
                  </CardTitle>
                  <CardDescription>
                    Configure safety detection parameters
                  </CardDescription>
                </div>
                <Dialog
                  open={isEditRulesOpen}
                  onOpenChange={setIsEditRulesOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Rules
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Detection Rules</DialogTitle>
                    </DialogHeader>
                    <EditRulesForm
                      rules={user.detectionRules[0]}
                      onSubmit={(data) =>
                        updateRules.mutate({
                          id: user.detectionRules[0]?.id,
                          ...data,
                        })
                      }
                      isLoading={updateRules.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {user.detectionRules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Fall Detection Sensitivity</Label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              user.detectionRules[0].fallSensitivity * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round(
                          user.detectionRules[0].fallSensitivity * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Immobility Timeout</Label>
                    <p className="text-lg font-medium">
                      {Math.floor(
                        user.detectionRules[0].immobilityTimeout / 60
                      )}{" "}
                      minutes
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Badge
                      variant={
                        user.detectionRules[0].isActive
                          ? "default"
                          : "secondary"
                      }
                    >
                      {user.detectionRules[0].isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No detection rules configured.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>Recent alerts for this user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.alerts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No alerts in history.
                  </p>
                ) : (
                  user.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              alert.isResolved ? "secondary" : "destructive"
                            }
                            className={
                              alert.severity === "CRITICAL"
                                ? "bg-red-500"
                                : alert.severity === "HIGH"
                                ? "bg-orange-500"
                                : alert.severity === "MEDIUM"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                            }
                          >
                            {alert.severity}
                          </Badge>
                          <span className="font-medium">
                            {alert.type.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant={alert.isResolved ? "default" : "destructive"}
                      >
                        {alert.isResolved ? "Resolved" : "Active"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper components
function AddContactForm({
  userId,
  onSubmit,
  isLoading,
}: {
  userId: string;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    relation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ userId, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email (Optional)</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="relation">Relationship</Label>
        <Select
          value={formData.relation}
          onValueChange={(value) =>
            setFormData({ ...formData, relation: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="spouse">Spouse</SelectItem>
            <SelectItem value="parent">Parent</SelectItem>
            <SelectItem value="child">Child</SelectItem>
            <SelectItem value="sibling">Sibling</SelectItem>
            <SelectItem value="friend">Friend</SelectItem>
            <SelectItem value="emergency">Emergency Services</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Adding..." : "Add Contact"}
      </Button>
    </form>
  );
}

function EditRulesForm({
  rules,
  onSubmit,
  isLoading,
}: {
  rules: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    fallSensitivity: rules?.fallSensitivity || 0.8,
    immobilityTimeout: rules?.immobilityTimeout || 300,
    isActive: rules?.isActive || true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fallSensitivity">Fall Detection Sensitivity</Label>
        <Input
          id="fallSensitivity"
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={formData.fallSensitivity}
          onChange={(e) =>
            setFormData({
              ...formData,
              fallSensitivity: Number.parseFloat(e.target.value),
            })
          }
        />
        <p className="text-sm text-muted-foreground">
          Current: {Math.round(formData.fallSensitivity * 100)}%
        </p>
      </div>
      <div>
        <Label htmlFor="immobilityTimeout">Immobility Timeout (minutes)</Label>
        <Input
          id="immobilityTimeout"
          type="number"
          min="1"
          max="60"
          value={Math.floor(formData.immobilityTimeout / 60)}
          onChange={(e) =>
            setFormData({
              ...formData,
              immobilityTimeout: Number.parseInt(e.target.value) * 60,
            })
          }
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
        />
        <Label htmlFor="isActive">Enable detection rules</Label>
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Updating..." : "Update Rules"}
      </Button>
    </form>
  );
}
