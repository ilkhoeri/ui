"use client";
import * as React from "react";
import { cvx, rem, type cvxVariants } from "xuxi";
import { cn } from "@/utils/cn";

const classes = cvx({
  variants: {
    selector: {
      root: "group/root relative flex w-full overflow-hidden border rounded-[var(--progress-radius,9999px)] [height:--progress-size] bg-muted-foreground/60",
      section:
        "flex h-full w-[--progress-section-width] items-center justify-center overflow-hidden bg-[--progress-section-color] [background-size:20px_20px] [transition:width_var(--progress-transition-duration,100ms)_ease] first-of-type:rounded-none first-of-type:rounded-l-[--progress-radius] last-of-type:rounded-none last-of-type:rounded-r-[--progress-radius]",
      label: "select-none truncate px-1 text-[min(calc(var(--progress-size)*0.65),18px)] font-bold leading-none text-[var(--progress-label-color,hsl(var(--color)))]"
    },
    striped: {
      true: "data-[striped]:[background-image:linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]",
      false: ""
    },
    animated: {
      true: "data-[animated]:[animation:stripes-animation_1s_linear_infinite]",
      false: ""
    }
  }
});

type ProgressState = "loading" | "complete" | "indeterminate";
type Selector = NonNullable<cvxVariants<typeof classes>["selector"]>;
type CSSProperties = React.CSSProperties & Record<string, any>;
type Color = React.CSSProperties["color"];

type ComponentProps<T extends React.ElementType, Exclude extends string = never> = React.PropsWithoutRef<Omit<React.ComponentProps<T>, "style" | "color" | Exclude>> &
  Omit<
    {
      className?: string;
      style?: CSSProperties;
      unstyled?: boolean;
      color?: Color;
    },
    Exclude
  >;

interface CtxProps extends __ProgressProps {
  getStyles(selector: Selector, options?: Options): InferType<typeof getStyles>;
  state: ProgressState;
}

const ctx = React.createContext<CtxProps | undefined>(undefined);
const useProgress = () => React.useContext(ctx)!;

const is = <T, K>(state: T, value: K) => ((state as T) ? (value as K) : undefined);
function getState(value: number | undefined, { min = 0, max = 100 }: Record<"min" | "max", number | undefined>) {
  let state: ProgressState = "indeterminate";
  if (typeof value === "number") {
    if (value >= max) {
      state = "complete";
    } else if (value > min) {
      state = "loading";
    }
  }
  return state;
}

interface Options extends Partial<__ProgressProps> {
  className?: string;
  style?: CSSProperties;
  striped?: boolean;
}
function getStyles(selector: Selector, options: Options = {}) {
  const { className, classNames, style, styles, unstyled, size, striped, animated, transitionDuration, round, value, color } = options;

  const isUnstyled = typeof unstyled === "object" ? unstyled?.[selector] : unstyled;

  return {
    className: cn(
      !isUnstyled &&
        classes({
          selector,
          striped: selector === "section" && striped,
          animated: selector === "section" && animated
        }),
      classNames?.[selector],
      className
    ),
    style: {
      ...is(selector === "root", {
        "--progress-size": rem(size),
        "--progress-radius": is(round, rem(round)),
        "--progress-transition-duration": is(typeof transitionDuration === "number", `${transitionDuration}ms`)
      }),
      ...is(selector === "section", {
        "--progress-section-width": `${value}%`,
        "--progress-section-color": color
      }),
      ...styles?.[selector],
      ...style
    }
  };
}

interface __ProgressProps {
  min: number | undefined;
  max: number | undefined;
  value: number | undefined;
  striped: boolean | undefined;
  animated: boolean | undefined;
  size: (string & {}) | number | undefined;
  round: (string & {}) | number | undefined;
  transitionDuration?: number | undefined;
  color: Color | ((value: number) => Color) | undefined;
  classNames: Partial<Record<Selector, string>> | undefined;
  styles: Partial<Record<Selector, CSSProperties>> | undefined;
  unstyled: boolean | Partial<Record<Selector, boolean>> | undefined;
  /** Determines whether `aria-*` props should be added to the root element, `true` by default */
  withAria: boolean;
}

export interface ProgressProps extends Partial<__ProgressProps>, ComponentProps<"div", "unstyled" | "color"> {
  label?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>((_props, ref) => {
  const { value, min = 0, max = 100, unstyled, classNames, styles, className, style, color, striped: stripedProp, animated, size = 8, round, transitionDuration, role = "status", children, label, withAria = true, ...props } = _props;
  const striped = stripedProp || animated;

  const state = getState(value, { min, max });

  const cssVanilla = (
    <style
      dangerouslySetInnerHTML={{
        __html: `@keyframes stripes-animation{0%{background-position:0 0;}100%{background-position: 40px 0;}}`
      }}
    />
  );

  return (
    <ctx.Provider
      value={{
        getStyles,
        striped,
        animated,
        withAria,
        value,
        min,
        max,
        state,
        size: size ?? undefined,
        round: round ?? undefined,
        transitionDuration: transitionDuration ?? undefined,
        unstyled: unstyled ?? undefined,
        classNames: classNames ?? undefined,
        styles: styles ?? undefined,
        color: color ?? "#3b82f6"
      }}
    >
      <div
        ref={ref}
        {...{
          ...props,
          role,
          "data-value": value,
          "data-min": min,
          "data-max": max,
          "data-state": state,
          ...getStyles("root", { unstyled, classNames, styles, className, style, size, round, transitionDuration })
        }}
      >
        {children || <ProgressSection {...{ value, min, max, striped, animated }} color={typeof color === "function" ? color(1) : color} label={label} />}
        {cssVanilla}
      </div>
    </ctx.Provider>
  );
}) as ProgressComponent;
Progress.displayName = "Progress";

export interface ProgressSectionProps extends ComponentProps<"div"> {
  value?: number | undefined;
  min?: number | undefined;
  max?: number | undefined;
  striped?: boolean | undefined;
  animated?: boolean | undefined;
  label?: string;
}
export const ProgressSection = React.forwardRef<HTMLDivElement, ProgressSectionProps>((_props, ref) => {
  const { unstyled, className, color, style, value, min, max, striped, animated, role = "progressbar", "aria-valuemax": avMx, "aria-valuemin": avMn, "aria-valuenow": avNow, "aria-valuetext": avTxt, "aria-label": aLb, title, label, children, ...props } = _props;
  const ctx = useProgress();

  const propsApi = {
    unstyled: unstyled ?? ctx?.unstyled,
    color: color ?? ctx?.color,
    value: value ?? ctx?.value,
    animated: animated ?? ctx?.animated,
    striped: (animated || striped) ?? ctx.striped,
    min: min ?? ctx?.min ?? 0,
    max: max ?? ctx?.max ?? 100,
    classNames: ctx?.classNames,
    styles: ctx?.styles
  };

  const ariaAttributes = ctx?.withAria
    ? {
        role,
        "aria-label": aLb || label,
        "aria-valuemin": avMn || propsApi?.min,
        "aria-valuemax": avMx || propsApi?.max,
        "aria-valuenow": avNow || propsApi?.value,
        "aria-valuetext": avTxt || `${propsApi?.value}%`
      }
    : {};

  const state = getState(propsApi?.value, { min: propsApi?.min, max: propsApi?.max });

  return (
    <div
      ref={ref}
      {...{
        ...props,
        ...ariaAttributes,
        title: title ?? label,
        "data-striped": is(propsApi.striped, "true"),
        "data-animated": is(propsApi.animated, "true"),
        "data-value": propsApi?.value,
        "data-min": propsApi?.min,
        "data-max": propsApi?.max,
        "data-state": state,
        ...ctx.getStyles("section", { className, style, ...propsApi })
      }}
    >
      {children ?? (label ? <ProgressLabel label={label} /> : null)}
    </div>
  );
});
ProgressSection.displayName = "ProgressSection";

export interface ProgressLabelProps extends ComponentProps<"div"> {
  label?: string;
}
export const ProgressLabel = React.forwardRef<HTMLDivElement, ProgressLabelProps>((_props, ref) => {
  const { unstyled: unstyledProp, className, color: colorProp, style, title, label, children, ...props } = _props;
  const ctx = useProgress();

  const propsApi = {
    unstyled: unstyledProp ?? ctx.unstyled,
    color: colorProp ?? ctx.color,
    classNames: ctx?.classNames,
    styles: ctx?.styles
  };

  return (
    <div ref={ref} {...{ ...props, title: title ?? label }} {...ctx.getStyles("label", { className, style, ...propsApi })}>
      {children || label}
    </div>
  );
});
ProgressLabel.displayName = "ProgressLabel";

// Export as a composite component
type ForwardRef<T extends React.ElementType, Props> = React.ForwardRefExoticComponent<{ ref?: React.ComponentPropsWithRef<T>["ref"] } & Props>;
interface ProgressComponent extends ForwardRef<"div", ProgressProps> {
  Section: typeof ProgressSection;
  Label: typeof ProgressLabel;
}
// Attach sub-components
Progress.Section = ProgressSection;
Progress.Label = ProgressLabel;
