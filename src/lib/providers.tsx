'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from './auth-store';
import { api } from './api-client';
import type { AuthUser } from './auth-store';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

function AuthHydration({ children }: { children: ReactNode }) {
  const { hydrate, token, setUser, isHydrated, logout } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isHydrated && token) {
      api
        .get<AuthUser>('/auth/me')
        .then((user) => {
          setUser(user);
        })
        .catch(() => {
          logout();
        });
    }
  }, [isHydrated, token, setUser, logout]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydration>{children}</AuthHydration>
    </QueryClientProvider>
  );
}
