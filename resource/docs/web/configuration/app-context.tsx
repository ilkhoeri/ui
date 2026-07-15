// required global.d.ts
"use client";
import * as React from "react";
import { Cookies, Theme } from "./types";
import { useDirection } from "@/hooks/use-direction";
import { useCookie } from "@/hooks/use-cookie";

export type CookiesName = `${Cookies}` | (string & {});

type DirectedAppValue = {
  dir: Direction;
  theme: Theme;
  isOpenAside: boolean;
};

interface AppContext extends DirectedAppValue {
  openAside: Booleanish;
  setOpenAside: (v: Booleanish) => void;
  /** default value = `30` (one month) */
  setCookie: (name: CookiesName, value: string, days?: number) => void;
  toggleDirection: () => void;
  setDirection: (dir: Direction) => void;
}

const ctx = React.createContext<AppContext | undefined>(undefined);

export function useApp() {
  const _ctx = React.useContext(ctx);
  if (!_ctx) throw new Error("main layout must be used within an <AppProvider>");
  return _ctx;
}

interface AppProviderProps {
  children: React.ReactNode;
}

function useCookieValues() {
  const [dir] = useCookie<Direction>("__dir", "ltr");
  const [theme] = useCookie<Theme>("__theme", "system");
  const [isOpenAside] = useCookie<boolean>("__is_open_aside", true);
  return { theme, dir, isOpenAside };
}

export function AppProvider(props: AppProviderProps) {
  const { children, ...others } = props;
  const { theme, dir: initialDirection, isOpenAside } = useCookieValues();
  const { dir, ..._direction } = useDirection({ initialDirection });
  const [openAside, setOpenAside] = React.useState<Booleanish>(isOpenAside);
  const setCookie = React.useCallback((name: string, value: string, days = 30) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
  }, []);

  const contextValue = React.useMemo<AppContext>(
    () => ({
      theme,
      dir,
      openAside,
      setOpenAside,
      setCookie,
      isOpenAside,
      ..._direction,
      ...others
    }),
    [theme, dir, openAside, setOpenAside, isOpenAside, setCookie, _direction, others]
  );

  return (
    <ctx.Provider value={contextValue}>
      <html lang="en" dir={dir} suppressHydrationWarning data-themeid-light="default" data-themeid-dark="default" data-theme="default">
        {children}
      </html>
    </ctx.Provider>
  );
}
