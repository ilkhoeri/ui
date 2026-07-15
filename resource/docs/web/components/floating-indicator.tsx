"use client";
import * as React from "react";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { useMutationObserver } from "@/hooks/use-mutation-observer";
import { getEnv, useTimeout } from "@/hooks/use-timeout";
import { ocx } from "xuxi";
import { cn } from "@/utils/cn";

function isParent(parentElement: HTMLElement | EventTarget | null, childElement: HTMLElement | null) {
  if (!childElement || !parentElement) {
    return false;
  }
  let parent = childElement.parentNode;
  while (parent != null) {
    if (parent === parentElement) {
      return true;
    }
    parent = parent.parentNode;
  }
  return false;
}
function toInt(value?: string) {
  return value ? parseInt(value, 10) : 0;
}

interface UseFloatingIndicatorInput {
  target: HTMLElement | null | undefined;
  parent: HTMLElement | null | undefined;
  ref: React.RefObject<HTMLDivElement | null>;
  displayAfterTransitionEnd?: boolean;
}
export function useFloatingIndicator({ target, parent, ref, displayAfterTransitionEnd }: UseFloatingIndicatorInput) {
  const transitionTimeout = React.useRef<number>(-1);
  const [initialized, setInitialized] = React.useState(false);

  const [hidden, setHidden] = React.useState(typeof displayAfterTransitionEnd === "boolean" ? displayAfterTransitionEnd : false);

  const updatePosition = () => {
    if (!target || !parent || !ref.current) return;

    const targetRect = target.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const targetComputedStyle = window.getComputedStyle(target);
    const parentComputedStyle = window.getComputedStyle(parent);

    const borderTopWidth = toInt(targetComputedStyle.borderTopWidth) + toInt(parentComputedStyle.borderTopWidth);
    const borderLeftWidth = toInt(targetComputedStyle.borderLeftWidth) + toInt(parentComputedStyle.borderLeftWidth);

    const position = {
      top: targetRect.top - parentRect.top - borderTopWidth,
      left: targetRect.left - parentRect.left - borderLeftWidth,
      width: targetRect.width,
      height: targetRect.height
    };

    ref.current.style.transform = `translateY(${position.top}px) translateX(${position.left}px)`;
    ref.current.style.width = `${position.width}px`;
    ref.current.style.height = `${position.height}px`;
  };

  const updatePositionWithoutAnimation = () => {
    window.clearTimeout(transitionTimeout.current);
    if (ref.current) {
      ref.current.style.transitionDuration = "0ms";
    }
    updatePosition();
    transitionTimeout.current = window.setTimeout(() => {
      if (ref.current) {
        ref.current.style.transitionDuration = "";
      }
    }, 30);
  };

  const targetResizeObserver = React.useRef<ResizeObserver | null>(null);
  const parentResizeObserver = React.useRef<ResizeObserver | null>(null);

  React.useEffect(() => {
    updatePosition();

    if (target) {
      targetResizeObserver.current = new ResizeObserver(updatePositionWithoutAnimation);
      targetResizeObserver.current.observe(target);

      if (parent) {
        parentResizeObserver.current = new ResizeObserver(updatePositionWithoutAnimation);
        parentResizeObserver.current.observe(parent);
      }

      return () => {
        targetResizeObserver.current?.disconnect();
        parentResizeObserver.current?.disconnect();
      };
    }

    return undefined;
  }, [parent, target]);

  React.useEffect(() => {
    if (parent) {
      const handleTransitionEnd = (event: TransitionEvent) => {
        if (isParent(event.target, parent)) {
          updatePositionWithoutAnimation();
          setHidden(false);
        }
      };

      parent.addEventListener("transitionend", handleTransitionEnd);
      return () => {
        parent.removeEventListener("transitionend", handleTransitionEnd);
      };
    }

    return undefined;
  }, [parent]);
  useTimeout(
    () => {
      // Prevents warning about state update without act
      if (getEnv() !== "test") {
        setInitialized(true);
      }
    },
    20,
    { autoInvoke: true }
  );
  useMutationObserver(
    mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes" && mutation.attributeName === "dir") {
          updatePositionWithoutAnimation();
        }
      });
    },
    { attributes: true, attributeFilter: ["dir"] },
    () => document.documentElement
  );
  return { initialized, hidden };
}

type Options = __FloatingIndicatorProps & { initialized?: boolean; hidden?: boolean; arHide?: ElementProps["aria-hidden"] };
function getStyles(options: Options) {
  const { unstyled, className, style, color, initialized, transitionDuration, hidden, arHide } = options;
  const isActive = (initial: boolean | undefined) => (initial ? "true" : undefined);
  return {
    hidden,
    "data-hidden": isActive(hidden),
    "aria-hidden": arHide || isActive(hidden),
    "data-initialized": isActive(initialized),
    className: cn(!unstyled && "pointer-events-none absolute left-0 top-0 z-0 bg-[--floating-color] duration-0 ease-ease [transition-property:transform,width,height,border-radius] aria-hidden:hidden data-[initialized]:[transition-duration:--transition-duration]", className),
    style: ocx(style, {
      "--floating-color": color,
      "--transition-duration": typeof transitionDuration === "number" ? `${transitionDuration}ms` : transitionDuration
    })
  };
}

interface __FloatingIndicatorProps {
  unstyled?: boolean;
  className?: string;
  style?: React.CSSProperties & Record<string, any>;
  color?: React.CSSProperties["color"];
  transitionDuration?: number | string;
}
type ElementProps = Omit<React.ComponentProps<"div">, keyof __FloatingIndicatorProps>;
export interface FloatingIndicatorProps extends React.PropsWithoutRef<ElementProps>, __FloatingIndicatorProps {
  target: HTMLElement | null | undefined;
  parent: HTMLElement | null | undefined;
  displayAfterTransitionEnd?: boolean;
}
export const FloatingIndicator = React.forwardRef<HTMLDivElement, FloatingIndicatorProps>((_props, ref) => {
  const { unstyled, className, style, parent, target, displayAfterTransitionEnd, hidden: _hidden, "aria-hidden": arHide, transitionDuration = 200, color = "hsl(var(--constructive))", ...props } = _props;
  const innerRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRef(ref, innerRef);
  const { initialized, hidden } = useFloatingIndicator({
    target,
    parent,
    ref: innerRef as any,
    displayAfterTransitionEnd
  });

  if (!target || !parent) {
    return null;
  }
  const stylesApi = { unstyled, className, style, color, target, transitionDuration, initialized, hidden, arHide };
  return <div {...{ ref: mergedRef, ...getStyles(stylesApi), ...props }} />;
});
FloatingIndicator.displayName = "FloatingIndicator";
