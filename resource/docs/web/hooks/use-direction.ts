"use client";
import React from "react";

export type Direction = "ltr" | "rtl";

export interface useDirectionProps {
  /** Direction set as a default value, `ltr` by default */
  defaultDirection?: Direction;
  /** Determines whether direction should be updated on mount based on `dir` attribute set on root element (usually html element), `true` by default */
  detectDirection?: boolean;
}
export function useDirection(_dir: useDirectionProps) {
  const { defaultDirection = "ltr", detectDirection = true } = _dir;
  const useIsomorphicEffect = typeof document !== "undefined" ? React.useLayoutEffect : React.useEffect;

  const [dir, setDir] = React.useState<Direction>(defaultDirection);

  const setCookie = (name: string, value: string, days = 30) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
  };

  useIsomorphicEffect(() => {
    if (!detectDirection) return;

    const html = document.documentElement;

    const observer = new MutationObserver(() => {
      const current = html.getAttribute("dir");

      if (current === "ltr" || current === "rtl") {
        setDir(current);
      }
    });

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["dir"]
    });

    return () => observer.disconnect();
  }, [detectDirection]);

  // Sinkronisasi setiap kali dir berubah
  useIsomorphicEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    setCookie("__dir", dir);
  }, [dir]);

  const setDirection = React.useCallback((direction: Direction) => {
    setDir(direction);
  }, []);

  const toggleDirection = React.useCallback(() => {
    setDir(prev => (prev === "ltr" ? "rtl" : "ltr"));
  }, []);

  return {
    dir,
    setDirection,
    toggleDirection
  };
}
