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
import { AlertType, Severity } from "@prisma/client";

const alertFormSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  type: z.nativeEnum(AlertType, {
    required_error: "Please select an alert type",
  }),
  severity: z.nativeEnum(Severity, {
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
      SEVERE_WEATHER_WARNING: {
        INFO: "Severe Weather Warning - Low Impact",
        ADVISORY: "Severe Weather Warning - Advisory",
        WATCH: "Severe Weather Warning - Watch",
        WARNING: "Severe Weather Warning - Warning",
        EMERGENCY: "Severe Weather Warning - Emergency",
        CRITICAL: "Severe Weather Warning - Critical",
      },
      FLOOD_WARNING: {
        INFO: "Flood Warning - Low Impact",
        ADVISORY: "Flood Warning - Advisory",
        WATCH: "Flood Warning - Watch",
        WARNING: "Flood Warning - Warning",
        EMERGENCY: "Flood Warning - Emergency",
        CRITICAL: "Flood Warning - Critical",
      },
      TORNADO_WARNING: {
        INFO: "Tornado Warning - Low Impact",
        ADVISORY: "Tornado Warning - Advisory",
        WATCH: "Tornado Warning - Watch",
        WARNING: "Tornado Warning - Warning",
        EMERGENCY: "Tornado Warning - Emergency",
        CRITICAL: "Tornado Warning - Critical",
      },
      HURRICANE_WARNING: {
        INFO: "Hurricane Warning - Low Impact",
        ADVISORY: "Hurricane Warning - Advisory",
        WATCH: "Hurricane Warning - Watch",
        WARNING: "Hurricane Warning - Warning",
        EMERGENCY: "Hurricane Warning - Emergency",
        CRITICAL: "Hurricane Warning - Critical",
      },
      EARTHQUAKE_ALERT: {
        INFO: "Earthquake Alert - Low Impact",
        ADVISORY: "Earthquake Alert - Advisory",
        WATCH: "Earthquake Alert - Watch",
        WARNING: "Earthquake Alert - Warning",
        EMERGENCY: "Earthquake Alert - Emergency",
        CRITICAL: "Earthquake Alert - Critical",
      },
      TSUNAMI_WARNING: {
        INFO: "Tsunami Warning - Low Impact",
        ADVISORY: "Tsunami Warning - Advisory",
        WATCH: "Tsunami Warning - Watch",
        WARNING: "Tsunami Warning - Warning",
        EMERGENCY: "Tsunami Warning - Emergency",
        CRITICAL: "Tsunami Warning - Critical",
      },
      WILDFIRE_ALERT: {
        INFO: "Wildfire Alert - Low Impact",
        ADVISORY: "Wildfire Alert - Advisory",
        WATCH: "Wildfire Alert - Watch",
        WARNING: "Wildfire Alert - Warning",
        EMERGENCY: "Wildfire Alert - Emergency",
        CRITICAL: "Wildfire Alert - Critical",
      },
      CIVIL_EMERGENCY: {
        INFO: "Civil Emergency - Low Impact",
        ADVISORY: "Civil Emergency - Advisory",
        WATCH: "Civil Emergency - Watch",
        WARNING: "Civil Emergency - Warning",
        EMERGENCY: "Civil Emergency - Emergency",
        CRITICAL: "Civil Emergency - Critical",
      },
      AMBER_ALERT: {
        INFO: "Amber Alert - Low Impact",
        ADVISORY: "Amber Alert - Advisory",
        WATCH: "Amber Alert - Watch",
        WARNING: "Amber Alert - Warning",
        EMERGENCY: "Amber Alert - Emergency",
        CRITICAL: "Amber Alert - Critical",
      },
      SILVER_ALERT: {
        INFO: "Silver Alert - Low Impact",
        ADVISORY: "Silver Alert - Advisory",
        WATCH: "Silver Alert - Watch",
        WARNING: "Silver Alert - Warning",
        EMERGENCY: "Silver Alert - Emergency",
        CRITICAL: "Silver Alert - Critical",
      },
      TERRORISM_ALERT: {
        INFO: "Terrorism Alert - Low Impact",
        ADVISORY: "Terrorism Alert - Advisory",
        WATCH: "Terrorism Alert - Watch",
        WARNING: "Terrorism Alert - Warning",
        EMERGENCY: "Terrorism Alert - Emergency",
        CRITICAL: "Terrorism Alert - Critical",
      },
      HAZMAT_INCIDENT: {
        INFO: "Hazmat Incident - Low Impact",
        ADVISORY: "Hazmat Incident - Advisory",
        WATCH: "Hazmat Incident - Watch",
        WARNING: "Hazmat Incident - Warning",
        EMERGENCY: "Hazmat Incident - Emergency",
        CRITICAL: "Hazmat Incident - Critical",
      },
      INFRASTRUCTURE_FAILURE: {
        INFO: "Infrastructure Failure - Low Impact",
        ADVISORY: "Infrastructure Failure - Advisory",
        WATCH: "Infrastructure Failure - Watch",
        WARNING: "Infrastructure Failure - Warning",
        EMERGENCY: "Infrastructure Failure - Emergency",
        CRITICAL: "Infrastructure Failure - Critical",
      },
      PUBLIC_HEALTH_EMERGENCY: {
        INFO: "Public Health Emergency - Low Impact",
        ADVISORY: "Public Health Emergency - Advisory",
        WATCH: "Public Health Emergency - Watch",
        WARNING: "Public Health Emergency - Warning",
        EMERGENCY: "Public Health Emergency - Emergency",
        CRITICAL: "Public Health Emergency - Critical",
      },
      EVACUATION_ORDER: {
        INFO: "Evacuation Order - Low Impact",
        ADVISORY: "Evacuation Order - Advisory",
        WATCH: "Evacuation Order - Watch",
        WARNING: "Evacuation Order - Warning",
        EMERGENCY: "Evacuation Order - Emergency",
        CRITICAL: "Evacuation Order - Critical",
      },
      SHELTER_IN_PLACE: {
        INFO: "Shelter in Place - Low Impact",
        ADVISORY: "Shelter in Place - Advisory",
        WATCH: "Shelter in Place - Watch",
        WARNING: "Shelter in Place - Warning",
        EMERGENCY: "Shelter in Place - Emergency",
        CRITICAL: "Shelter in Place - Critical",
      },
      ROAD_CLOSURE: {
        INFO: "Road Closure - Low Impact",
        ADVISORY: "Road Closure - Advisory",
        WATCH: "Road Closure - Watch",
        WARNING: "Road Closure - Warning",
        EMERGENCY: "Road Closure - Emergency",
        CRITICAL: "Road Closure - Critical",
      },
      POWER_OUTAGE: {
        INFO: "Power Outage - Low Impact",
        ADVISORY: "Power Outage - Advisory",
        WATCH: "Power Outage - Watch",
        WARNING: "Power Outage - Warning",
        EMERGENCY: "Power Outage - Emergency",
        CRITICAL: "Power Outage - Critical",
      },
      WATER_EMERGENCY: {
        INFO: "Water Emergency - Low Impact",
        ADVISORY: "Water Emergency - Advisory",
        WATCH: "Water Emergency - Watch",
        WARNING: "Water Emergency - Warning",
        EMERGENCY: "Water Emergency - Emergency",
        CRITICAL: "Water Emergency - Critical",
      },
    };
    return (
      messages[type as keyof typeof messages]?.[
        severity as keyof typeof messages.SEVERE_WEATHER_WARNING
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
      case "EMERGENCY":
        return "bg-orange-500 hover:bg-orange-600";
      case "WARNING":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "ADVISORY":
        return "bg-blue-500 hover:bg-blue-600";
      case "INFO":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "SEVERE_WEATHER_WARNING":
        return "🌪️";
      case "FLOOD_WARNING":
        return "🌊";
      case "TORNADO_WARNING":
        return "🌪️";
      case "HURRICANE_WARNING":
        return "🌪️";
      case "EARTHQUAKE_ALERT":
        return "🌏";
      case "TSUNAMI_WARNING":
        return "🌊";
      case "WILDFIRE_ALERT":
        return "🔥";
      case "CIVIL_EMERGENCY":
        return "🚨";
      case "AMBER_ALERT":
        return "🚨";
      case "SILVER_ALERT":
        return "🚨";
      case "TERRORISM_ALERT":
        return "🚨";
      case "HAZMAT_INCIDENT":
        return "🚨";
      case "INFRASTRUCTURE_FAILURE":
        return "🚨";
      case "PUBLIC_HEALTH_EMERGENCY":
        return "🚨";
      case "EVACUATION_ORDER":
        return "��";
      case "SHELTER_IN_PLACE":
        return "🏠";
      case "ROAD_CLOSURE":
        return "🚧";
      case "POWER_OUTAGE":
        return "💡";
      case "WATER_EMERGENCY":
        return "🌊";
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
                      <SelectItem value="SEVERE_WEATHER_WARNING">
                        <div className="flex items-center space-x-2">
                          <span>🌪️</span>
                          <span>Severe Weather Warning</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FLOOD_WARNING">
                        <div className="flex items-center space-x-2">
                          <span>🌊</span>
                          <span>Flood Warning</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="TORNADO_WARNING">
                        <div className="flex items-center space-x-2">
                          <span>🌪️</span>
                          <span>Tornado Warning</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="HURRICANE_WARNING">
                        <div className="flex items-center space-x-2">
                          <span>🌪️</span>
                          <span>Hurricane Warning</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="EARTHQUAKE_ALERT">
                        <div className="flex items-center space-x-2">
                          <span>🌏</span>
                          <span>Earthquake Alert</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="TSUNAMI_WARNING">
                        <div className="flex items-center space-x-2">
                          <span>🌊</span>
                          <span>Tsunami Warning</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="WILDFIRE_ALERT">
                        <div className="flex items-center space-x-2">
                          <span>🔥</span>
                          <span>Wildfire Alert</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="CIVIL_EMERGENCY">
                        <div className="flex items-center space-x-2">
                          <span>🚨</span>
                          <span>Civil Emergency</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="AMBER_ALERT">
                        <div className="flex items-center space-x-2">
                          <span>🚨</span>
                          <span>Amber Alert</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="SILVER_ALERT">
                        <div className="flex items-center space-x-2">
                          <span>🚨</span>
                          <span>Silver Alert</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="TERRORISM_ALERT">
                        <div className="flex items-center space-x-2">
                          <span>🚨</span>
                          <span>Terrorism Alert</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="HAZMAT_INCIDENT">
                        <div className="flex items-center space-x-2">
                          <span>🚨</span>
                          <span>Hazmat Incident</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="INFRASTRUCTURE_FAILURE">
                        <div className="flex items-center space-x-2">
                          <span>🚨</span>
                          <span>Infrastructure Failure</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="PUBLIC_HEALTH_EMERGENCY">
                        <div className="flex items-center space-x-2">
                          <span>🚨</span>
                          <span>Public Health Emergency</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="EVACUATION_ORDER">
                        <div className="flex items-center space-x-2">
                          <span>🚨</span>
                          <span>Evacuation Order</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="SHELTER_IN_PLACE">
                        <div className="flex items-center space-x-2">
                          <span>🏠</span>
                          <span>Shelter in Place</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ROAD_CLOSURE">
                        <div className="flex items-center space-x-2">
                          <span>🚧</span>
                          <span>Road Closure</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="POWER_OUTAGE">
                        <div className="flex items-center space-x-2">
                          <span>💡</span>
                          <span>Power Outage</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="WATER_EMERGENCY">
                        <div className="flex items-center space-x-2">
                          <span>🌊</span>
                          <span>Water Emergency</span>
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
                      <SelectItem value="INFO">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-500 text-white">INFO</Badge>
                          <span>Info</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ADVISORY">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-500 text-white">
                            ADVISORY
                          </Badge>
                          <span>Advisory</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="WATCH">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-gray-500 text-white">
                            WATCH
                          </Badge>
                          <span>Watch</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="WARNING">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-500 text-white">
                            WARNING
                          </Badge>
                          <span>Warning</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="EMERGENCY">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-orange-500 text-white">
                            EMERGENCY
                          </Badge>
                          <span>Emergency</span>
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
