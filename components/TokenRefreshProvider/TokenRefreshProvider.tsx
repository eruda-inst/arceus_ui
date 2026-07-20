"use client";

import { ReactNode } from "react";
import { useTokenRefresh } from "@/hooks/tokenRefresh.hook";

interface TokenRefreshProviderProps {
  children: ReactNode;
}

function TokenRefreshProvider({ children }: TokenRefreshProviderProps) {
  useTokenRefresh();

  return <>{children}</>;
}

export default TokenRefreshProvider;
