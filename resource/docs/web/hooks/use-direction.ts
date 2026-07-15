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

  const setDirection = (direction: Direction) => {
    setDir(direction);
    document.documentElement.setAttribute("dir", direction);
    setCookie("__dir", direction);
  };

  useIsomorphicEffect(() => {
    if (detectDirection) {
      const direction = document.documentElement.getAttribute("dir");
      if (direction === "rtl" || direction === "ltr") {
        setDirection(direction);
      }
    }
  }, [detectDirection]);

  const toggleDirection = () => setDirection(dir === "ltr" ? "rtl" : "ltr");

  return { toggleDirection, setDirection, dir };
}
