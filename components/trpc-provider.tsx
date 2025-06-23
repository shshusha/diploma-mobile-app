"use client";

import type React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { trpc, trpcClient } from "../lib/trpc-client";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
