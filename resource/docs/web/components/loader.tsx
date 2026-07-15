import * as React from "react";
import { ocx } from "xuxi";
import { cn } from "@/utils/cn";

type SubKeys = {
  spinner: "root" | "bar";
  orbit: "root" | "inner" | "orbit";
  clockwise: "root" | "clockwise";
  dots: "root" | "dots";
  buffer: "root" | "buffer";
  rises: "root" | "rises";
};

type classes = {
  [K in keyof SubKeys]: Record<SubKeys[K], string>;
};

type __Loader = keyof SubKeys;
type __Selector<T extends __Loader> = keyof classes[T];
type StylesNames<T extends __Loader> = {
  unstyled?: Partial<Record<__Selector<T>, boolean>>;
  className?: string;
  style?: React.CSSProperties & { [key: string]: any };
  classNames?: Partial<Record<SubKeys[T], string>>;
  styles?: Partial<Record<__Selector<T>, React.CSSProperties & { [key: string]: any }>>;
  color?: React.CSSProperties["color"] | "currentColor";
  size?: string | number;
  duration?: number;
};

type LoaderSyntheticProps<K extends __Loader, T extends React.ElementType = "div", Exclude extends string = never> = StylesNames<K> & Omit<React.ComponentPropsWithoutRef<T>, "style" | "color" | Exclude>;

function clamp(value: number, precision: number = 1): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

function getStyles<T extends __Loader>(loader: T, selector: __Selector<T>, options?: StylesNames<T>) {
  const dynamicStyles = ["duration", "color", "size"].reduce(
    (acc, key) => {
      const value = options?.[key as keyof typeof options];
      if (value !== undefined) {
        acc[`--${loader}-${key}`] = key === "duration" ? `${clamp(value as number)}s` : key === "size" && typeof value === "number" ? `${value}px` : String(value);
      }
      return acc;
    },
    {} as Record<string, string>
  );
  return {
    "data-loader": loader,
    [`data-${loader}`]: selector,
    className: cn({ "stylelayer-loader": selector === "root" }, !options?.unstyled?.[selector], options?.classNames?.[selector], options?.className),
    style: ocx(dynamicStyles, options?.styles?.[selector], options?.style)
  };
}

export const LoaderSpinner = React.forwardRef<HTMLDivElement, LoaderSyntheticProps<"spinner">>(function LoaderSpinner(_props, ref) {
  const { size = "20px", color, duration = 1.2, unstyled, className, classNames, style, styles, ...props } = _props;
  return (
    <div {...{ ref, ...getStyles<"spinner">("spinner", "root", { size, color, duration, unstyled, className, classNames, style, styles }), ...props }}>
      {[...Array(12)].map((_, index) => (
        <div
          key={index}
          {...getStyles<"spinner">("spinner", "bar", {
            unstyled,
            classNames,
            style: {
              "--child-delay": `${clamp(-duration - index / -10)}s`,
              transform: `rotate(${clamp(30 * index)}deg) translate(146%)`
            },
            styles
          })}
        />
      ))}
    </div>
  );
});
LoaderSpinner.displayName = "LoaderSpinner";

export const LoaderOrbit = React.forwardRef<HTMLDivElement, LoaderSyntheticProps<"orbit">>(function LoaderOrbit(_props, ref) {
  const { size = "3rem", color, duration = 1.2, unstyled, className, classNames, style, styles, children, ...props } = _props;
  return (
    <div {...{ ref, ...getStyles<"orbit">("orbit", "root", { size, color, duration, unstyled, className, classNames, style, styles }), ...props }}>
      <div {...getStyles<"orbit">("orbit", "inner", { unstyled, classNames, styles })}>
        {[...Array(2)].map((_, index) => (
          <div key={index} {...getStyles<"orbit">("orbit", "orbit", { unstyled, classNames, styles })} />
        ))}
      </div>
      {children}
    </div>
  );
});

export const LoaderClockWise = React.forwardRef<HTMLDivElement, LoaderSyntheticProps<"clockwise">>(function LoaderClockWise(_props, ref) {
  const { size = "3rem", color, duration = 1.2, unstyled, className, classNames, style, styles, ...props } = _props;
  return (
    <div {...{ ref, ...getStyles<"clockwise">("clockwise", "root", { size, color, duration, unstyled, className, classNames, style, styles }), ...props }}>
      {[...Array(2)].map((_, index) => (
        <div key={index} {...getStyles<"clockwise">("clockwise", "clockwise", { unstyled, classNames, styles })} />
      ))}
    </div>
  );
});

export const LoaderDots = React.forwardRef<HTMLDivElement, LoaderSyntheticProps<"dots">>(function LoaderDots(_props, ref) {
  const { size = "3rem", color, duration = 1.2, unstyled, className, classNames, style, styles, ...props } = _props;
  return (
    <div {...{ ref, ...getStyles<"dots">("dots", "root", { size, color, duration, unstyled, className, classNames, style, styles }), ...props }}>
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          {...getStyles<"dots">("dots", "dots", {
            unstyled,
            classNames,
            styles,
            style: { "--dots-delay": `${clamp(0.2 * index)}s` }
          })}
        />
      ))}
    </div>
  );
});

export const LoaderBuffer = React.forwardRef<HTMLDivElement, LoaderSyntheticProps<"buffer">>(function LoaderBuffer(_props, ref) {
  const { size = "3rem", color, duration = 1, unstyled, className, classNames, style, styles, ...props } = _props;
  return (
    <div {...{ ref, ...getStyles<"buffer">("buffer", "root", { size, color, duration, unstyled, className, classNames, style, styles }), ...props }}>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          {...getStyles<"buffer">("buffer", "buffer", {
            unstyled,
            classNames,
            styles,
            style: { "--buffer-delay": `${clamp(((index + 1) / 5) * duration)}s` }
          })}
        />
      ))}
    </div>
  );
});

export const LoaderRises = React.forwardRef<HTMLDivElement, LoaderSyntheticProps<"rises">>(function LoaderRises(_props, ref) {
  const { size = "3rem", color, duration = 1, unstyled, className, classNames, style, styles, ...props } = _props;
  return (
    <div {...{ ref, ...getStyles<"rises">("rises", "root", { size, color, duration, unstyled, className, classNames, style, styles }), ...props }}>
      <span className="sr-only hidden" />
    </div>
  );
});

export type LoaderProps =
  | ({ variant?: "spinner" } & LoaderSyntheticProps<"spinner">)
  | ({ variant?: "orbit" } & LoaderSyntheticProps<"orbit">)
  | ({ variant?: "clockwise" } & LoaderSyntheticProps<"clockwise">)
  | ({ variant?: "dots" } & LoaderSyntheticProps<"dots">)
  | ({ variant?: "buffer" } & LoaderSyntheticProps<"buffer">)
  | ({ variant?: "rises" } & LoaderSyntheticProps<"rises">);

const loaderMap = {
  spinner: LoaderSpinner,
  orbit: LoaderOrbit,
  clockwise: LoaderClockWise,
  dots: LoaderDots,
  buffer: LoaderBuffer,
  rises: LoaderRises
} as const;

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>((_props, ref) => {
  const { variant = "spinner", ...props } = _props;
  const Component = loaderMap[variant];
  return <Component ref={ref} {...(props as LoaderSyntheticProps<typeof variant>)} />;
}) as LoaderComponent;
Loader.displayName = "Loader";

// Export as a composite component
type ForwardRef<T extends React.ElementType, Props> = React.ForwardRefExoticComponent<{ ref?: React.ComponentPropsWithRef<T>["ref"] } & Props>;
type LoaderComponent = ForwardRef<"div", LoaderProps> & {
  Spinner: typeof LoaderSpinner;
  Orbit: typeof LoaderOrbit;
  ClockWise: typeof LoaderClockWise;
  Dots: typeof LoaderDots;
  Buffer: typeof LoaderBuffer;
  Rises: typeof LoaderRises;
};
// Attach sub-components
Loader.Spinner = LoaderSpinner;
Loader.Orbit = LoaderOrbit;
Loader.ClockWise = LoaderClockWise;
Loader.Dots = LoaderDots;
Loader.Buffer = LoaderBuffer;
Loader.Rises = LoaderRises;
