"use client";
import { useCallback, Ref, useRef, RefObject } from "react";

export type PossibleRef<T> = Ref<T> | RefObject<T | null> | undefined;

export function assignRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (typeof ref === "object" && ref !== null && "current" in ref) {
    (ref as RefObject<T | null>).current = value;
  }
}

export function mergeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T | null) => {
    refs.forEach(ref => assignRef(ref, node));
  };
}

export function createRefs<F, U extends string>(keys: U[]): { [K in U]: React.RefObject<F | null> } {
  return keys.reduce(
    (acc, key) => {
      acc[key] = useRef<F>(null);
      return acc;
    },
    {} as { [K in U]: React.RefObject<F | null> }
  );
}

export function useMergedRef<T>(...refs: PossibleRef<T>[]) {
  return useCallback(mergeRefs(...refs), refs);
}
