"use client";
import React from "react";
import ReactDOM from "react-dom";
import { useDidUpdate } from "@/hooks/use-did-update";
import { useWindowEvent } from "@/hooks/use-window-event";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useId } from "@/hooks/use-id";
import { rem } from "xuxi";

type CSSProperties = React.CSSProperties & { [key: string]: any };
interface TransitionProps {
  keepMounted?: boolean;
  transition?: Transition;
  duration?: number;
  exitDuration?: number;
  timingFunction?: string;
  mounted: boolean;
  children: (styles: CSSProperties) => React.JSX.Element;
  onExited?: () => void;
  onExit?: () => void;
  onEnter?: () => void;
  onEntered?: () => void;
  enterDelay?: number;
  exitDelay?: number;
}
export type TransitionOverride = Partial<Omit<TransitionProps, "mounted">>;
interface UseDialogOptions {
  open: boolean;
  onClose: () => void;
  id: string | undefined;
  transitionProps: TransitionOverride | undefined;
  trapFocus: boolean | undefined;
  closeOnEscape: boolean | undefined;
  returnFocus: boolean | undefined;
}
export interface TransitionStyles {
  common?: React.CSSProperties;
  in: React.CSSProperties;
  out: React.CSSProperties;
  transitionProperty: React.CSSProperties["transitionProperty"];
}
export type TransitionName =
  "fade" | "fade-down" | "fade-up" | "fade-left" | "fade-right" | "skew-up" | "skew-down" | "rotate-right" | "rotate-left" | "slide-down" | "slide-up" | "slide-right" | "slide-left" | "scale-y" | "scale-x" | "scale" | "pop" | "pop-top-left" | "pop-top-right" | "pop-bottom-left" | "pop-bottom-right";

export type Transition = TransitionName | TransitionStyles;

export function useDialog(options: UseDialogOptions) {
  const { id, transitionProps, open, trapFocus, closeOnEscape, onClose, returnFocus } = options;
  const _id = useId(id);
  const [titleMounted, setTitleMounted] = React.useState(false);
  const [bodyMounted, setBodyMounted] = React.useState(false);

  const transitionDuration = typeof transitionProps?.duration === "number" ? transitionProps?.duration : 200;

  const shouldLockScroll = useLockScroll({ open, transitionDuration });

  useWindowEvent(
    "keydown",
    event => {
      if (event.key === "Escape" && closeOnEscape) {
        const shouldTrigger = (event.target as HTMLElement)?.getAttribute("data-stop-propagation") !== "true";
        if (shouldTrigger) onClose();
      }
    },
    { capture: true }
  );

  useFocusReturn({ open, shouldReturnFocus: trapFocus && returnFocus });

  return {
    _id,
    titleMounted,
    bodyMounted,
    shouldLockScroll,
    setTitleMounted,
    setBodyMounted
  };
}

interface UseScrollLockOptions {
  open: boolean;
  transitionDuration: number;
}

export function useLockScroll(options: UseScrollLockOptions) {
  const { open, transitionDuration } = options;
  const [shouldLockScroll, setShouldLockScroll] = React.useState(open);
  const timeout = React.useRef<number>(0);
  const reduceMotion = useReducedMotion();
  const _transitionDuration = reduceMotion ? 0 : transitionDuration;

  React.useEffect(() => {
    if (open) {
      setShouldLockScroll(true);
      window.clearTimeout(timeout.current);
    } else if (_transitionDuration === 0) {
      setShouldLockScroll(false);
    } else {
      timeout.current = window.setTimeout(() => setShouldLockScroll(false), _transitionDuration);
    }

    return () => window.clearTimeout(timeout.current);
  }, [open, _transitionDuration]);

  return shouldLockScroll;
}

interface UseFocusReturnOptions {
  open: boolean;
  shouldReturnFocus?: boolean;
}

/** Returns focus to last active element, used in Dialog */
export function useFocusReturn(options: UseFocusReturnOptions) {
  const { open, shouldReturnFocus = true } = options;
  const lastActiveElement = React.useRef<HTMLElement>(null);
  const returnFocus = () => {
    if (lastActiveElement.current && "focus" in lastActiveElement.current && typeof lastActiveElement.current.focus === "function") {
      lastActiveElement.current?.focus({ preventScroll: true });
    }
  };

  useDidUpdate(() => {
    let timeout = -1;

    const clearFocusTimeout = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        window.clearTimeout(timeout);
      }
    };

    document.addEventListener("keydown", clearFocusTimeout);

    if (open) {
      lastActiveElement.current = document.activeElement as HTMLElement;
    } else if (shouldReturnFocus) {
      timeout = window.setTimeout(returnFocus, 10);
    }

    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("keydown", clearFocusTimeout);
    };
  }, [open, shouldReturnFocus]);

  return returnFocus;
}

export type TransitionStatus = "entered" | "exited" | "entering" | "exiting" | "pre-exiting" | "pre-entering";

interface Options {
  duration: number;
  exitDuration: number;
  timingFunction: string;
  mounted: boolean;
  onEnter?: () => void;
  onExit?: () => void;
  onEntered?: () => void;
  onExited?: () => void;
  enterDelay?: number;
  exitDelay?: number;
}

export function useTransition(options: Options) {
  const { duration, exitDuration, timingFunction, mounted, onEnter, onExit, onEntered, onExited, enterDelay, exitDelay } = options;
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion;
  const [transitionDuration, setTransitionDuration] = React.useState(reduceMotion ? 0 : duration);
  const [transitionStatus, setStatus] = React.useState<TransitionStatus>(mounted ? "entered" : "exited");
  const transitionTimeoutRef = React.useRef<number>(-1);
  const delayTimeoutRef = React.useRef<number>(-1);
  const rafRef = React.useRef(-1);

  const handleStateChange = (shouldMount: boolean) => {
    const preHandler = shouldMount ? onEnter : onExit;
    const handler = shouldMount ? onEntered : onExited;

    window.clearTimeout(transitionTimeoutRef.current);

    const newTransitionDuration = reduceMotion ? 0 : shouldMount ? duration : exitDuration;
    setTransitionDuration(newTransitionDuration);

    if (newTransitionDuration === 0) {
      if (typeof preHandler === "function") preHandler();
      if (typeof handler === "function") handler();
      setStatus(shouldMount ? "entered" : "exited");
    } else {
      // Make sure new status won't be set within the same frame as this would disrupt animation #3126
      rafRef.current = requestAnimationFrame(() => {
        ReactDOM.flushSync(() => {
          setStatus(shouldMount ? "pre-entering" : "pre-exiting");
        });

        rafRef.current = requestAnimationFrame(() => {
          if (typeof preHandler === "function") preHandler();
          setStatus(shouldMount ? "entering" : "exiting");

          transitionTimeoutRef.current = window.setTimeout(() => {
            if (typeof handler === "function") handler();
            setStatus(shouldMount ? "entered" : "exited");
          }, newTransitionDuration);
        });
      });
    }
  };

  const handleTransitionWithDelay = (shouldMount: boolean) => {
    window.clearTimeout(delayTimeoutRef.current);
    const delay = shouldMount ? enterDelay : exitDelay;

    if (typeof delay !== "number") {
      handleStateChange(shouldMount);
      return;
    }

    delayTimeoutRef.current = window.setTimeout(
      () => {
        handleStateChange(shouldMount);
      },
      shouldMount ? enterDelay : exitDelay
    );
  };

  useDidUpdate(() => {
    handleTransitionWithDelay(mounted);
  }, [mounted]);

  React.useEffect(
    () => () => {
      window.clearTimeout(transitionTimeoutRef.current);
      cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return {
    transitionDuration,
    transitionStatus,
    transitionTimingFunction: timingFunction || "ease"
  };
}

const popIn = (from: "top" | "bottom") => ({
  in: { opacity: 1, transform: "scale(1)" },
  out: {
    opacity: 0,
    transform: `scale(.9) translateY(${rem(from === "bottom" ? 10 : -10)})`
  },
  transitionProperty: "transform, opacity"
});

export const transitions: Record<TransitionName, TransitionStyles> = {
  fade: {
    in: { opacity: 1 },
    out: { opacity: 0 },
    transitionProperty: "opacity"
  },

  "fade-up": {
    in: { opacity: 1, transform: "translateY(0)" },
    out: { opacity: 0, transform: `translateY(${rem(30)}` },
    transitionProperty: "opacity, transform"
  },

  "fade-down": {
    in: { opacity: 1, transform: "translateY(0)" },
    out: { opacity: 0, transform: `translateY(${rem(-30)}` },
    transitionProperty: "opacity, transform"
  },

  "fade-left": {
    in: { opacity: 1, transform: "translateX(0)" },
    out: { opacity: 0, transform: `translateX(${rem(30)}` },
    transitionProperty: "opacity, transform"
  },

  "fade-right": {
    in: { opacity: 1, transform: "translateX(0)" },
    out: { opacity: 0, transform: `translateX(${rem(-30)}` },
    transitionProperty: "opacity, transform"
  },

  scale: {
    in: { opacity: 1, transform: "scale(1)" },
    out: { opacity: 0, transform: "scale(0)" },
    common: { transformOrigin: "top" },
    transitionProperty: "transform, opacity"
  },

  "scale-y": {
    in: { opacity: 1, transform: "scaleY(1)" },
    out: { opacity: 0, transform: "scaleY(0)" },
    common: { transformOrigin: "top" },
    transitionProperty: "transform, opacity"
  },

  "scale-x": {
    in: { opacity: 1, transform: "scaleX(1)" },
    out: { opacity: 0, transform: "scaleX(0)" },
    common: { transformOrigin: "left" },
    transitionProperty: "transform, opacity"
  },

  "skew-up": {
    in: { opacity: 1, transform: "translateY(0) skew(0deg, 0deg)" },
    out: {
      opacity: 0,
      transform: `translateY(${rem(-20)}) skew(-10deg, -5deg)`
    },
    common: { transformOrigin: "top" },
    transitionProperty: "transform, opacity"
  },

  "skew-down": {
    in: { opacity: 1, transform: "translateY(0) skew(0deg, 0deg)" },
    out: {
      opacity: 0,
      transform: `translateY(${rem(20)}) skew(-10deg, -5deg)`
    },
    common: { transformOrigin: "bottom" },
    transitionProperty: "transform, opacity"
  },

  "rotate-left": {
    in: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
    out: { opacity: 0, transform: `translateY(${rem(20)}) rotate(-5deg)` },
    common: { transformOrigin: "bottom" },
    transitionProperty: "transform, opacity"
  },

  "rotate-right": {
    in: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
    out: { opacity: 0, transform: `translateY(${rem(20)}) rotate(5deg)` },
    common: { transformOrigin: "top" },
    transitionProperty: "transform, opacity"
  },

  "slide-down": {
    in: { opacity: 1, transform: "translateY(0)" },
    out: { opacity: 0, transform: "translateY(-100%)" },
    common: { transformOrigin: "top" },
    transitionProperty: "transform, opacity"
  },

  "slide-up": {
    in: { opacity: 1, transform: "translateY(0)" },
    out: { opacity: 0, transform: "translateY(100%)" },
    common: { transformOrigin: "bottom" },
    transitionProperty: "transform, opacity"
  },

  "slide-left": {
    in: { opacity: 1, transform: "translateX(0)" },
    out: { opacity: 0, transform: "translateX(100%)" },
    common: { transformOrigin: "left" },
    transitionProperty: "transform, opacity"
  },

  "slide-right": {
    in: { opacity: 1, transform: "translateX(0)" },
    out: { opacity: 0, transform: "translateX(-100%)" },
    common: { transformOrigin: "right" },
    transitionProperty: "transform, opacity"
  },

  pop: {
    ...popIn("bottom"),
    common: { transformOrigin: "center center" }
  },

  "pop-bottom-left": {
    ...popIn("bottom"),
    common: { transformOrigin: "bottom left" }
  },

  "pop-bottom-right": {
    ...popIn("bottom"),
    common: { transformOrigin: "bottom right" }
  },

  "pop-top-left": {
    ...popIn("top"),
    common: { transformOrigin: "top left" }
  },

  "pop-top-right": {
    ...popIn("top"),
    common: { transformOrigin: "top right" }
  }
};

const transitionStatuses = {
  entering: "in",
  entered: "in",
  exiting: "out",
  exited: "out",
  "pre-exiting": "out",
  "pre-entering": "out"
} as const;

export function getTransitionStyles({ transition, state, duration, timingFunction }: { transition: Transition; state: keyof typeof transitionStatuses; duration: number; timingFunction: React.CSSProperties["transitionTimingFunction"] }): React.CSSProperties {
  const shared = {
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: timingFunction
  };

  if (typeof transition === "string") {
    if (!(transition in transitions)) {
      return {};
    }

    return {
      transitionProperty: transitions[transition].transitionProperty,
      ...shared,
      ...transitions[transition].common,
      ...transitions[transition][transitionStatuses[state]]
    };
  }

  return {
    transitionProperty: transition.transitionProperty,
    ...shared,
    ...transition.common,
    ...transition[transitionStatuses[state]]
  };
}

export function Transition({ keepMounted, transition = "fade", duration = 250, exitDuration = duration, mounted, children, timingFunction = "ease", onExit, onEntered, onEnter, onExited, enterDelay, exitDelay }: TransitionProps) {
  const { transitionDuration, transitionStatus, transitionTimingFunction } = useTransition({
    mounted,
    exitDuration,
    duration,
    timingFunction,
    onExit,
    onEntered,
    onEnter,
    onExited,
    enterDelay,
    exitDelay
  });

  if (transitionDuration === 0) {
    return mounted ? children({}) : keepMounted ? children({ display: "none" }) : null;
  }

  return transitionStatus === "exited"
    ? keepMounted
      ? children({ display: "none" })
      : null
    : children(
        getTransitionStyles({
          transition,
          duration: transitionDuration,
          state: transitionStatus,
          timingFunction: transitionTimingFunction
        })
      );
}
