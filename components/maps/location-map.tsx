"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

// Type declaration for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

interface LocationMapProps {
  users: Array<{
    id: string;
    name: string | null;
    email: string;
    locations: Array<{
      latitude: number;
      longitude: number;
      createdAt: Date;
    }>;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    severity: string;
    latitude: number | null;
    longitude: number | null;
    user: {
      name: string | null;
      email: string;
    };
  }>;
}

export function LocationMap({ users, alerts }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Get user's current location
  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          if (map) {
            map.setCenter(location);
            map.setZoom(14);
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Try to get user location first, fallback to default
    const initializeMap = () => {
      const defaultCenter = { lat: 40.7829, lng: -73.9654 }; // Default to NYC
      const center = userLocation || defaultCenter;

      const mapInstance = new window.google.maps.Map(mapRef.current!, {
        center,
        zoom: userLocation ? 14 : 12,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      setMap(mapInstance);
    };

    initializeMap();
  }, [userLocation]);

  // Auto-get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers: any[] = [];

    // Add user location markers
    users.forEach((user) => {
      if (user.locations && user.locations.length > 0) {
        const latestLocation = user.locations[0];
        const marker = new window.google.maps.Marker({
          position: {
            lat: latestLocation.latitude,
            lng: latestLocation.longitude,
          },
          map,
          title: user.name || user.email,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#10B981" stroke="#ffffff" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24),
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${user.name || user.email}</h3>
              <p class="text-sm text-gray-600">Last seen: ${new Date(
                latestLocation.createdAt
              ).toLocaleString()}</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      }
    });

    // Add alert markers
    alerts.forEach((alert) => {
      if (alert.latitude && alert.longitude) {
        const severityColor =
          {
            CRITICAL: "#EF4444",
            HIGH: "#F97316",
            MEDIUM: "#EAB308",
            LOW: "#3B82F6",
          }[alert.severity] || "#6B7280";

        const marker = new window.google.maps.Marker({
          position: {
            lat: alert.latitude,
            lng: alert.longitude,
          },
          map,
          title: `${alert.type} - ${alert.user.name || alert.user.email}`,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="${severityColor}" stroke="#ffffff" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-red-600">${alert.type.replace(
                "_",
                " "
              )}</h3>
              <p class="text-sm">${alert.user.name || alert.user.email}</p>
              <span class="inline-block px-2 py-1 text-xs rounded" style="background-color: ${severityColor}; color: white;">
                ${alert.severity}
              </span>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      }
    });

    setMarkers(newMarkers);
  }, [map, users, alerts]);

  return (
    <Card className="h-[600px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Live Location Map
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={getUserLocation}
          disabled={isLocating}
          className="flex items-center gap-2"
        >
          <Navigation className="h-4 w-4" />
          {isLocating ? "Locating..." : "My Location"}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapRef} className="w-full h-[520px] rounded-b-lg" />
      </CardContent>
    </Card>
  );
}
