"use client";
import * as React from "react";
import { mergeRefs } from "@/hooks/use-merged-ref";

export type TransformProps = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, "style"> & {
  el?: React.ElementType;
  ref?: React.Ref<HTMLElement>;
  style?: React.CSSProperties & Record<string, any>;
  /**
   *### opacity is number
   *```js
   * value : 0.1 - 1
   * default_value : 1 (for before animation)
   *```
   */
  opacity?: {
    before?: number | string;
    after?: number | string;
  };
  /**
   *### withoutOpacity is boolean
   *```js
   * default_value :
   * before_animation = 0
   * after_animation = 1
   *```
   */
  withoutOpacity?: boolean;
  /**
   *### hold is number
   *```js
   * value : 0.1 - 1
   * default_value : 0.1
   *```
   */
  hold?: number;
  /**
   *```js
   * default_value :
   * "opacity 0.5s ease, all 1s ease"
   *```
   */
  // transition?: string;
  /**
   *### transform is short set transform style
   *```js
   * default_value :
    --transform-before: scale(0);
    --transform-after: scale(1);
    --transform-origin: bottom;
    --transform-delay: 0.3s;
   *```
   */
  transform?: {
    before?: "scale(0)" | "translateY(6rem)" | "translateX(-6rem)" | "translateX(-2rem)" | "none" | (string & {});
    after?: "scale(1)" | "translateX(0)" | "translateY(0)" | "none" | (string & {});
    origin?: "0 0" | "center" | "top" | "right" | "bottom" | "left" | "-moz-initial" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | (string & {});
    box?: React.CSSProperties["transformBox"];
    style?: React.CSSProperties["transformStyle"];
  };

  transition?:
    | React.CSSProperties["transition"]
    | {
        delay?: React.CSSProperties["transitionDelay"] | string | number;
        property?: React.CSSProperties["transitionProperty"] | (string & {});
        duration?: React.CSSProperties["transitionDuration"] | (string & {});
        timingFunction?: React.CSSProperties["transitionTimingFunction"] | (string & {});
        behavior?: React.CSSProperties["transitionBehavior"] | (string & {});
      };
};

export const observeIntersection = (ref: React.RefObject<HTMLElement | null>, { hold = 0.1, opacity, withoutOpacity, transform }: TransformProps) => {
  const windowHeight = window.innerHeight;
  const threshold = windowHeight * hold;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const targetElement = entry.target as HTMLElement;
        targetElement.style.setProperty("--opacity-after", entry.isIntersecting && !withoutOpacity ? String(opacity?.after || "1") : null);
        targetElement.style.setProperty("--transform-after", entry.isIntersecting ? transform?.after || "scale(1)" : null);
        targetElement.setAttribute("data-transform", entry.isIntersecting ? "true" : "false");
      });
    },
    { rootMargin: `0px 0px -${threshold}px 0px` }
  );

  const currentRef = ref.current;

  if (currentRef) {
    observer.observe(currentRef);
  }

  return () => {
    if (currentRef) {
      observer.unobserve(currentRef);
    }
  };
};

export const Transform = React.forwardRef<HTMLElement, TransformProps>((props, ref) => {
  const { style, el = "div", hold, opacity, withoutOpacity, transform, transition, ...others } = props;
  const componentRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const cleanup = observeIntersection(componentRef, {
      hold,
      opacity,
      withoutOpacity,
      transform
    });
    return cleanup;
  }, [hold, opacity, transform, withoutOpacity]);

  const Component = el as React.ElementType;

  return (
    <Component
      {...{
        ref: mergeRefs(componentRef, ref),
        "data-animation": "transform",
        style: {
          "--transform-before": transform?.before || "scale(0)",
          transformOrigin: transform?.origin || "center",
          transformStyle: transform?.style,
          transformBox: transform?.box,
          transform: "var(--transform-after, var(--transform-before))",
          transition: (typeof transition === "string" && transition) || "opacity 0.5s ease 0.3s, transform 1s ease",
          ...(typeof transition === "object"
            ? {
                transitionBehavior: transition.behavior,
                transitionDelay: typeof transition.delay === "number" ? `${transition.delay}s` : transition.delay,
                transitionDuration: transition.duration,
                transitionProperty: transition.property,
                transitionTimingFunction: transition.timingFunction
              }
            : {}),
          ...(!withoutOpacity
            ? {
                opacity: "var(--opacity-after, var(--opacity-before))",
                "--opacity-before": opacity?.before || "0"
              }
            : undefined),
          ...style
        } as React.CSSProperties & Record<string, any>,
        ...others
      }}
    />
  );
});
Transform.displayName = "Transform";
