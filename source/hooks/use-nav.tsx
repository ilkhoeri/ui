"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, ReactNode, useEffect } from "react";
import { useOpenState, type ClickOpenOptions } from "@/hooks/use-open-state";
import { useMediaQuery } from "@/hooks/use-media-query";

interface MediaQuery {
  mediaQuery?: number;
}

interface NavContextProps extends MediaQuery, ClickOpenOptions, Omit<InferType<typeof useOpenState>, keyof ClickOpenOptions> {
  minQuery: boolean | undefined;
  maxQuery: boolean | undefined;
  isSegment: boolean | undefined;
  pathname: string;
}

interface NavProviderProps extends ClickOpenOptions, MediaQuery {
  children: ReactNode;
}

const NavContext = createContext<NavContextProps | undefined>(undefined);

export function NavProvider({ children, popstate = true, mediaQuery = 768, ...rest }: NavProviderProps) {
  const pathname = usePathname();
  const state = useOpenState({ popstate, ...rest });
  const { open } = state;

  const minQuery = useMediaQuery(`(min-width: ${mediaQuery}px)`);
  const maxQuery = useMediaQuery(`(max-width: ${mediaQuery - 1}px)`);
  const isHomePage = pathname === "/";
  const isExamplePage = pathname.startsWith("/examples");
  const notSegment = (isHomePage || isExamplePage) && minQuery;

  useEffect(() => {
    const body = document.body;

    if (open && maxQuery) {
      body.style.setProperty("overflow", "hidden");
    } else {
      body.style.removeProperty("overflow");
    }

    return () => {
      if (open && maxQuery) {
        body.style.removeProperty("overflow");
      }
    };
  }, [open, maxQuery]);

  const value = {
    mediaQuery,
    minQuery,
    maxQuery,
    isSegment: !notSegment,
    pathname,
    ...state
  };

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNavContext(): NavContextProps {
  const context = useContext(NavContext);

  if (!context) throw new Error("useNavContext must be used within an NavProvider");

  return context;
}
