"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigation, X } from "lucide-react"

interface LocationPickerProps {
  onLocationSelect: (location: { latitude: number; longitude: number; address?: string } | null) => void
  selectedLocation: { latitude: number; longitude: number; address?: string } | null
}

export function LocationPicker({ onLocationSelect, selectedLocation }: LocationPickerProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && inputRef.current) {
      // Initialize Google Places Autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        fields: ["geometry", "formatted_address", "name"],
      })

      // Listen for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace()
        if (place?.geometry?.location) {
          const location = {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            address: place.formatted_address || place.name,
          }
          onLocationSelect(location)
        }
      })
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [onLocationSelect])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    setIsLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Reverse geocode to get address
        try {
          const geocoder = new window.google.maps.Geocoder()
          const response = await geocoder.geocode({
            location: { lat: latitude, lng: longitude },
          })

          const address = response.results[0]?.formatted_address || "Current Location"

          onLocationSelect({
            latitude,
            longitude,
            address,
          })

          if (inputRef.current) {
            inputRef.current.value = address
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error)
          onLocationSelect({
            latitude,
            longitude,
            address: "Current Location",
          })
        }

        setIsLoadingLocation(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Unable to get your current location. Please try again or enter an address manually.")
        setIsLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const clearLocation = () => {
    onLocationSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input ref={inputRef} placeholder="Search for a location or address..." className="w-full" />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          className="shrink-0"
        >
          {isLoadingLocation ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>
        {selectedLocation && (
          <Button type="button" variant="outline" size="icon" onClick={clearLocation} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Search for an address or click the navigation button to use your current location
      </div>
    </div>
  )
}
