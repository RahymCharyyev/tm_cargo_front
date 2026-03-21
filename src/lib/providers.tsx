'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import ruRU from 'antd/locale/ru_RU';
import type { Locale } from 'antd/lib/locale';
import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from './auth-store';
import { api } from './api-client';
import type { AuthUser } from './auth-store';

const antdLocaleMap: Record<string, Locale> = {
  ru: ruRU,
  en: enUS,
  tk: enUS,
};

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

export function Providers({
  children,
  locale = 'ru',
}: {
  children: ReactNode;
  locale?: string;
}) {
  const queryClient = getQueryClient();
  const antdLocale = antdLocaleMap[locale] ?? ruRU;

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={antdLocale}
        theme={{
          token: {
            colorPrimary: '#3D7EF9',
            colorLink: '#3D7EF9',
            colorLinkHover: '#2B529B',
            borderRadius: 10,
            borderRadiusLG: 14,
            borderRadiusSM: 7,
            fontFamily: 'inherit',
            colorBgContainer: '#ffffff',
          },
          components: {
            Button: {
              primaryColor: '#ffffff',
              borderRadius: 10,
              controlHeight: 40,
            },
            Input: {
              borderRadius: 10,
              controlHeight: 40,
            },
            Select: {
              borderRadius: 10,
              controlHeight: 40,
            },
            DatePicker: {
              borderRadius: 10,
              controlHeight: 40,
            },
            Pagination: {
              borderRadius: 8,
            },
          },
        }}
      >
        <AuthHydration>{children}</AuthHydration>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
