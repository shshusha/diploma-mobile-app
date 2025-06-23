"use client"

import { useEffect, useState } from "react"

export function useSSE<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const eventSource = new EventSource(url)

    eventSource.onopen = () => {
      setIsConnected(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data)
        setData(parsedData)
      } catch (err) {
        setError("Failed to parse SSE data")
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      setError("Connection lost")
    }

    return () => {
      eventSource.close()
    }
  }, [url])

  return { data, error, isConnected }
}
