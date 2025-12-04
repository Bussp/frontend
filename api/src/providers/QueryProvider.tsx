import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClient } from "../hooks/queryClient";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
