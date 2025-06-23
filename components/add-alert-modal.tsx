"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, MapPin, Loader2 } from "lucide-react";
import { trpc } from "../lib/trpc-client";
import { LocationPicker } from "./location-picker";
import { useToast } from "@/components/ui/use-toast";

const alertFormSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  type: z.enum(["FALL_DETECTED", "IMMOBILITY_DETECTED", "ROUTE_DEVIATION"], {
    required_error: "Please select an alert type",
  }),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    required_error: "Please select a severity level",
  }),
  message: z.string().min(1, "Message is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

interface AddAlertModalProps {
  onAlertAdded?: () => void;
}

export function AddAlertModal({ onAlertAdded }: AddAlertModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);

  const { toast } = useToast();

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      message: "",
    },
  });

  // Get users for dropdown
  const { data: users, isLoading: usersLoading } = trpc.users.getAll.useQuery();

  // Create alert mutation
  const createAlert = trpc.alerts.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Alert Created Successfully",
        description: `${data.type
          .replace("_", " ")
          .toLowerCase()} alert created for ${
          data.user.name || data.user.email
        }`,
      });
      form.reset();
      setSelectedLocation(null);
      setOpen(false);
      onAlertAdded?.();
    },
    onError: (error) => {
      toast({
        title: "Error Creating Alert",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: AlertFormValues) => {
    createAlert.mutate({
      ...values,
      latitude: selectedLocation?.latitude,
      longitude: selectedLocation?.longitude,
    });
  };

  // Pre-defined messages for different alert types
  const getDefaultMessage = (type: string, severity: string) => {
    const messages = {
      FALL_DETECTED: {
        LOW: "Minor fall detected - user may need assistance",
        MEDIUM: "Fall detected - immediate check recommended",
        HIGH: "Significant fall detected - urgent response needed",
        CRITICAL:
          "CRITICAL FALL DETECTED - Emergency response required immediately",
      },
      IMMOBILITY_DETECTED: {
        LOW: "User has been stationary for extended period",
        MEDIUM: "No movement detected for concerning duration",
        HIGH: "Prolonged immobility detected - welfare check needed",
        CRITICAL:
          "CRITICAL - No movement detected for extended period - Emergency response required",
      },
      ROUTE_DEVIATION: {
        LOW: "User has slightly deviated from planned route",
        MEDIUM: "User has deviated from expected route",
        HIGH: "Significant route deviation detected - location check needed",
        CRITICAL:
          "CRITICAL - User far from planned route - Immediate location verification required",
      },
    };
    return (
      messages[type as keyof typeof messages]?.[
        severity as keyof typeof messages.FALL_DETECTED
      ] || ""
    );
  };

  // Update message when type or severity changes
  const watchedType = form.watch("type");
  const watchedSeverity = form.watch("severity");

  const handleTypeOrSeverityChange = () => {
    if (watchedType && watchedSeverity) {
      const defaultMessage = getDefaultMessage(watchedType, watchedSeverity);
      form.setValue("message", defaultMessage);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500 hover:bg-red-600";
      case "HIGH":
        return "bg-orange-500 hover:bg-orange-600";
      case "MEDIUM":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "LOW":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
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
      default:
        return "📢";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Test Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Create Test Alert</span>
          </DialogTitle>
          <DialogDescription>
            Create a test alert to simulate emergency scenarios for testing
            purposes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* User Selection */}
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user to create alert for" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {usersLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading users...
                        </SelectItem>
                      ) : (
                        users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center space-x-2">
                              <span>{user.name || "Unnamed User"}</span>
                              <span className="text-sm text-muted-foreground">
                                ({user.email})
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alert Type Selection */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTimeout(handleTypeOrSeverityChange, 100);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of emergency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FALL_DETECTED">
                        <div className="flex items-center space-x-2">
                          <span>🚨</span>
                          <span>Fall Detected</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="IMMOBILITY_DETECTED">
                        <div className="flex items-center space-x-2">
                          <span>⏰</span>
                          <span>Immobility Detected</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ROUTE_DEVIATION">
                        <div className="flex items-center space-x-2">
                          <span>🗺️</span>
                          <span>Route Deviation</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the type of safety alert to simulate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Severity Selection */}
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity Level</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTimeout(handleTypeOrSeverityChange, 100);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-500 text-white">LOW</Badge>
                          <span>Low Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="MEDIUM">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-500 text-white">
                            MEDIUM
                          </Badge>
                          <span>Medium Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="HIGH">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-orange-500 text-white">
                            HIGH
                          </Badge>
                          <span>High Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="CRITICAL">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-red-500 text-white">
                            CRITICAL
                          </Badge>
                          <span>Critical - Immediate Response</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Higher severity alerts require more urgent response
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alert Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the emergency situation..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This message will be sent to emergency contacts and
                    displayed on the dashboard
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Picker */}
            <div className="space-y-3">
              <FormLabel>Location (Optional)</FormLabel>
              <LocationPicker
                onLocationSelect={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
              {selectedLocation && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Selected Location:</span>
                  </div>
                  {selectedLocation.address && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedLocation.address}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Coordinates: {selectedLocation.latitude.toFixed(6)},{" "}
                    {selectedLocation.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            {/* Preview */}
            {watchedType && watchedSeverity && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Alert Preview:</h4>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getAlertTypeIcon(watchedType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Test Alert</span>
                      <Badge className={getSeverityColor(watchedSeverity)}>
                        {watchedSeverity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {form.watch("message") || "No message provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createAlert.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAlert.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {createAlert.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Alert...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Create Test Alert
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
