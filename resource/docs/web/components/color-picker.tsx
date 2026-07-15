"use client";
import * as React from "react";
import { useDidUpdate } from "@/hooks/use-did-update";
import { useUncontrolled } from "@/hooks/use-uncontrolled";
import { mergeRefs, useMergedRef } from "@/hooks/use-merged-ref";
import { clampUseMovePosition, useMove, UseMovePosition } from "@/hooks/use-move";
import { getContrastColor } from "@/hooks/use-random-colors";
import { cvx, rem, type cvxVariants, ocx } from "xuxi";
import { Svg, type SvgProps } from "@/ui/svg";
import { cn } from "@/utils/cn";

const classes = cvx({
  variants: {
    selector: {
      root: "stylelayer-colorpicker w-[--cp-width]",
      saturation: "h-[--cp-saturation-height] rounded-[--cp-round] relative overflow-hidden outline outline-1 outline-muted",
      saturationOverlay: "absolute size-full rounded-[--cp-round] inset-[calc((var(--cp-size)*-1)/(2-1px))]",
      body: "flex flex-row rtl:flex-row-reverse items-center pt-[--cp-space] gap-[var(--cp-space-slider)]",
      sliders: "flex-1 grid grid-flow-row items-center content-between",
      slider: "relative mx-[calc(var(--cp-size)/2)] h-[--slider-h] select-none outline-0",
      preview: "h-[--h] w-[--w] rounded-[--round] cursor-default relative outline outline-1 outline-muted flex items-center justify-center",
      sliderOverlay: "absolute inset-y-0 inset-x-[calc(var(--cp-size)*-1/2-calc(.0625rem*1))] rounded-full",
      thumb: "absolute overflow-hidden cursor-pointer left-[--left] top-[--top] size-[--cp-size] rounded-full border-2 border-solid border-white [box-shadow:0_0_1px_rgba(0,0,0,0.6)]",
      swatch: "m-0.5 cursor-pointer flex-[1_0_var(--rows)] border-0",
      swatches: "-mx-0.5 flex flex-wrap [--round:--cp-swatch-round]",
      shadowOverlay: "absolute z-1 inset-0 size-full rounded-[--round]",
      alphaOverlay: "absolute inset-0 rounded-[--round]",
      colorOverlay: "absolute size-full inset-0 rounded-[--round]",
      childrenOverlay: "absolute size-full inset-0 z-2 flex items-center justify-center rounded-[--round]"
    }
  }
});

export interface HsvaColor {
  h: number;
  s: number;
  v: number;
  a: number;
}
export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}
export interface HslaColor {
  h: number;
  s: number;
  l: number;
  a: number;
}
export type ColorFormat = "hex" | "hexa" | "rgba" | "rgb" | "hsl" | "hsla";
type __Selector = NonNullable<cvxVariants<typeof classes>["selector"]>;
type Options = StylesNames<__Selector> & {};
type CSSProperties = React.CSSProperties & Record<string, any>;
type NestedRecord<U extends [string, unknown], T extends string> = {
  [K in U as K[0]]?: Partial<Record<T, K[1]>>;
};
type Styles = ["unstyled", boolean] | ["classNames", string] | ["styles", CSSProperties];
type StylesNames<T extends string, Exclude extends string = never> = Omit<NestedRecord<Styles, T> & { className?: string; style?: CSSProperties }, Exclude>;
type ComponentProps<T extends React.ElementType, Exclude extends string = never> = StylesNames<__Selector> & {
  color?: React.CSSProperties["color"];
} & React.PropsWithoutRef<Omit<React.ComponentProps<T>, "style" | "color" | Exclude>>;
type CtxProps = {
  getStyles(selector: __Selector, options?: Options): InferType<typeof getStyles>;
};

function getStyles(selector: __Selector, options?: Options) {
  return {
    "data-cp": cn(selector),
    className: cn(!options?.unstyled?.[selector] && classes({ selector }), options?.classNames?.[selector], options?.className),
    style: { ...options?.styles?.[selector], ...options?.style }
  };
}
interface Dependen {
  size?: string | number;
  round?: string | number;
  swatchPerRow?: number;
}
function rootVars(dep: Dependen) {
  return ocx<CSSProperties>({
    "--cp-size": rem(dep?.size),
    "--cp-round": `max(${rem(dep?.round)}, 0.25rem)`,
    "--cp-swatch-row": `${roundValue(100 / dep?.swatchPerRow!)}%`,
    "--cp-width": `var(--cp-full-width, calc(var(--cp-size) * 12.25))`,
    "--cp-saturation-height": `calc(var(--cp-size) * 8.5)`,
    "--cp-space": `calc(var(--cp-size) * 0.5)`,
    "--cp-space-slider": `calc(var(--cp-size) * 0.375)`,
    "--cp-preview-sz": "calc((var(--slider-h) * 2) + var(--cp-space-slider,0))",
    "--cp-swatch-size": `${rem(dep?.size)}`,
    "--cp-swatch-round": "max(calc(var(--cp-round) / 2), .25rem)"
  });
}

const ctx = React.createContext<CtxProps | undefined>(undefined);
const useColorPicker = () => React.useContext(ctx)!;

export interface __ColorPickerProps {
  defaultValue?: string;
  value?: string;
  format?: ColorFormat;
  withPicker?: boolean;
  swatches?: string[];
  swatchPerRow?: number;
  focusable?: boolean;
  size?: string | number;
  round?: string | number;
  alphaLabel?: string;
  hueLabel?: string;
  saturationLabel?: string;
  withShadow?: boolean;
  withClipboard?: boolean;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  onChangeEnd?: (value: string) => void;
  onColorSwatchClick?: (color: string) => void;
}

export type ColorPickerProps = __ColorPickerProps &
  ComponentProps<"div", "onChange" | "value" | "defaultValue"> & {
    selectedIcon?: React.ReactNode;
  };

export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>((_props, ref) => {
  // prettier-ignore
  const { unstyled, classNames, styles, format, value, hueLabel, onChange, alphaLabel, focusable, swatches, withPicker, onChangeEnd, defaultValue, withClipboard, saturationLabel, swatchPerRow = 7, size = 16, round = 6, withShadow = false, onColorSwatchClick, style, fullWidth, children, selectedIcon, ...props } = _props;

  const formatRef = React.useRef(format);
  const valueRef = React.useRef<string>("");
  const scrubTimeoutRef = React.useRef<number>(-1);
  const isScrubbingRef = React.useRef(false);
  const [copied, setCopied] = React.useState(false);
  const withAlpha = format === "hexa" || format === "rgba" || format === "hsla";

  const [_value, setValue, controlled] = useUncontrolled({ value, defaultValue, finalValue: "#FFFFFF", onChange });

  const [parsed, setParsed] = React.useState<HsvaColor>(parseColor(_value));

  const startScrubbing = () => {
    window.clearTimeout(scrubTimeoutRef.current);
    isScrubbingRef.current = true;
  };

  const stopScrubbing = () => {
    window.clearTimeout(scrubTimeoutRef.current);
    scrubTimeoutRef.current = window.setTimeout(() => {
      isScrubbingRef.current = false;
    }, 200);
  };

  const handleChange = (color: Partial<HsvaColor>) => {
    setParsed(current => {
      const next = { ...current, ...color };
      valueRef.current = convertHsvaTo(formatRef.current!, next);
      return next;
    });
    setValue(valueRef.current!);
  };

  useDidUpdate(() => {
    if (isColorValid(value!) && !isScrubbingRef.current) {
      setParsed(parseColor(value!));
    }
  }, [value]);

  useDidUpdate(() => {
    formatRef.current = format;
    setValue(convertHsvaTo(format!, parsed));
  }, [format]);

  async function copyToClipboardWithMeta(value: string) {
    navigator.clipboard.writeText(value.trimEnd());
  }

  const copyColor = React.useCallback(() => {
    if (withClipboard) {
      copyToClipboardWithMeta(_value);
      setCopied(true);
    }
  }, [withClipboard]);

  React.useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const stylesApi = { unstyled, classNames, styles };

  return (
    <ctx.Provider value={{ getStyles }}>
      <Div
        {...{
          ref,
          selector: "root",
          "data-color-format": format,
          "data-full-width": fullWidth ? "true" : undefined,
          style: {
            ...rootVars({ round, size, swatchPerRow }),
            ...(children
              ? {
                  "--cp-input-round": "var(--cp-round)",
                  "--cp-input-p": "calc(var(--cp-space) * 0.7)",
                  "--cp-input-fz": "calc(var(--cp-size) * 0.7)"
                }
              : undefined),
            ...style
          },
          ...stylesApi,
          ...props
        }}
      >
        {withPicker && (
          <>
            <Saturation
              {...{
                focusable,
                value: parsed,
                color: _value,
                saturationLabel,
                onScrubStart: startScrubbing,
                onScrubEnd: stopScrubbing,
                onChange: handleChange,
                onChangeEnd: ({ s, v }) =>
                  onChangeEnd?.(
                    convertHsvaTo(formatRef.current!, {
                      ...parsed,
                      s: s!,
                      v: v!
                    })
                  ),
                ...stylesApi
              }}
            />
            <Div {...{ selector: "body", ...stylesApi }}>
              <Div {...{ selector: "sliders", ...stylesApi }}>
                <HueSlider
                  {...{
                    size,
                    focusable,
                    value: parsed.h,
                    "aria-label": hueLabel,
                    onScrubStart: startScrubbing,
                    onScrubEnd: stopScrubbing,
                    onChange: h => handleChange({ h }),
                    onChangeEnd: h => onChangeEnd?.(convertHsvaTo(formatRef.current!, { ...parsed, h })),
                    ...stylesApi
                  }}
                />
                {withAlpha && (
                  <AlphaSlider
                    {...{
                      focusable,
                      value: parsed.a,
                      "aria-label": alphaLabel,
                      onScrubStart: startScrubbing,
                      onScrubEnd: stopScrubbing,
                      color: convertHsvaTo("hex", parsed),
                      onChange: a => handleChange({ a }),
                      onChangeEnd: a => {
                        onChangeEnd?.(convertHsvaTo(formatRef.current!, { ...parsed, a }));
                      },
                      ...stylesApi
                    }}
                  />
                )}
              </Div>
              {withAlpha && (
                <ColorSwatch
                  {...{
                    color: _value,
                    withShadow,
                    "data-clipboard": withClipboard ? (copied ? "copied" : "") : undefined,
                    onClick: () => {
                      if (withClipboard) copyColor();
                    },
                    ...stylesApi
                  }}
                >
                  {withClipboard && <HasCopyIcon has={copied} color={getContrastColor(_value)} />}
                </ColorSwatch>
              )}
            </Div>
          </>
        )}
        {Array.isArray(swatches) && (
          <Swatches
            {...{
              data: swatches,
              withShadow,
              focusable,
              setValue,
              value: _value,
              selectedIcon,
              onChangeEnd: color => {
                const convertedColor = convertHsvaTo(format!, parseColor(color));
                onColorSwatchClick?.(convertedColor);
                onChangeEnd?.(convertedColor);
                if (!controlled) {
                  setParsed(parseColor(color));
                }
              },
              ...stylesApi
            }}
          />
        )}
        {children}
      </Div>
    </ctx.Provider>
  );
});
ColorPicker.displayName = "ColorPicker";

const Div = React.forwardRef<HTMLDivElement, ComponentProps<"div"> & { selector: "root" | "body" | "sliders" }>(function Div({ unstyled, className, classNames, style, styles, selector, ...props }, ref) {
  const ctx = useColorPicker();
  return (
    <div
      {...{
        ref,
        ...ctx.getStyles(selector, { unstyled, className, classNames, style, styles }),
        ...props
      }}
    />
  );
});
Div.displayName = "ColorPicker/Div";

interface ColorSliderProps extends ComponentProps<"div", "onChange"> {
  overlays: React.CSSProperties[];
  value: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
  focusable?: boolean;
  size?: string | number;
  thumbColor?: React.CSSProperties["color"];
  maxValue: number;
  round: boolean;
}
export const ColorSlider = React.forwardRef<HTMLDivElement, ColorSliderProps>(function ColorSlider(_props, ref) {
  const { unstyled, className, classNames, style, styles, onChange, onChangeEnd, focusable = true, value, overlays, onScrubStart, round, onScrubEnd, maxValue, thumbColor = "transparent", ...props } = _props;
  const ctx = useColorPicker();
  const stylesApi = { unstyled, classNames, styles };

  const [position, setPosition] = React.useState({
    y: 0,
    x: value / maxValue
  });
  const positionRef = React.useRef(position);
  const getChangeValue = (val: number) => (round ? Math.round(val * maxValue) : val * maxValue);
  const { ref: sliderRef } = useMove(
    ({ x, y }) => {
      positionRef.current = { x, y };
      onChange?.(getChangeValue(x));
    },
    {
      onScrubEnd: () => {
        const { x } = positionRef.current;
        onChangeEnd?.(getChangeValue(x));
        onScrubEnd?.();
      },
      onScrubStart
    }
  );

  useDidUpdate(() => {
    setPosition({ y: 0, x: value / maxValue });
  }, [value]);

  const handleArrow = (event: React.KeyboardEvent<HTMLDivElement>, pos: UseMovePosition) => {
    event.preventDefault();
    const _position = clampUseMovePosition(pos);
    onChange?.(getChangeValue(_position.x));
    onChangeEnd?.(getChangeValue(_position.x));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight": {
        handleArrow(event, { x: position.x + 0.05, y: position.y });
        break;
      }
      case "ArrowLeft": {
        handleArrow(event, { x: position.x - 0.05, y: position.y });
        break;
      }
    }
  };

  const layers = overlays.map((overlay, index) => <div key={index} {...ctx.getStyles("sliderOverlay", { style: overlay, ...stylesApi })} />);

  return (
    <div
      {...{
        ref: useMergedRef(sliderRef, ref),
        role: "slider",
        "aria-valuemin": 0,
        "aria-valuenow": value,
        "aria-valuemax": maxValue,
        tabIndex: focusable ? 0 : -1,
        onKeyDown: handleKeyDown,
        ...ctx.getStyles("slider", { className, style, ...stylesApi }),
        ...props
      }}
    >
      {layers}
      <Thumb
        {...{
          position,
          ...ctx.getStyles("thumb", { style: { top: rem(1), background: thumbColor }, ...stylesApi })
        }}
      />
    </div>
  );
});
ColorSlider.displayName = "ColorPicker/ColorSlider";

export const HueSlider = React.forwardRef<HTMLDivElement, Omit<ColorSliderProps, "maxValue" | "overlays" | "round">>((_props, ref) => {
  const { value, onChange, onChangeEnd, ...props } = _props;
  return (
    <ColorSlider
      {...{
        ref,
        onChange,
        value,
        onChangeEnd,
        maxValue: 360,
        thumbColor: `hsl(${value}, 100%, 50%)`,
        round: true,
        "data-hue": "",
        overlays: [
          {
            backgroundImage: "linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(170,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))"
          },
          { boxShadow: `rgba(0, 0, 0, .1) 0 0 0 ${rem(1)} inset, rgb(0, 0, 0, .15) 0 0 ${rem(4)} inset` }
        ],
        ...props
      }}
    />
  );
});
HueSlider.displayName = "ColorPicker/HueSlider";

export const AlphaSlider = React.forwardRef<HTMLDivElement, Omit<ColorSliderProps, "maxValue" | "overlays" | "round">>((_props, ref) => {
  const { color, onChange, onChangeEnd, value, ...props } = _props;
  return (
    <ColorSlider
      {...{
        ref,
        value,
        onChange: val => onChange?.(round(val, 2)),
        onChangeEnd: val => onChangeEnd?.(round(val, 2)),
        maxValue: 1,
        round: false,
        "data-alpa": "",
        overlays: [{ background: "var(--rectangles)" }, { backgroundImage: `linear-gradient(90deg, transparent, ${color})` }, { boxShadow: `rgba(0, 0, 0, .1) 0 0 0 ${rem(1)} inset, rgb(0, 0, 0, .15) 0 0 ${rem(4)} inset` }],
        ...props
      }}
    />
  );
});
AlphaSlider.displayName = "ColorPicker/AlphaSlider";

export interface SaturationProps extends ComponentProps<"div", "onChange"> {
  value: HsvaColor;
  onChange: (color: Partial<HsvaColor>) => void;
  onChangeEnd: (color: Partial<HsvaColor>) => void;
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
  saturationLabel?: string;
  focusable?: boolean;
}
export const Saturation = React.forwardRef<HTMLDivElement, SaturationProps>(function Saturation(_props, ref) {
  const { unstyled, className, classNames, style, styles, onChange, onChangeEnd, value, saturationLabel, focusable = true, color, onScrubStart, onScrubEnd, ...props } = _props;
  const ctx = useColorPicker();
  const stylesApi = { unstyled, classNames, styles };

  const [position, setPosition] = React.useState({
    x: value.s / 100,
    y: 1 - value.v / 100
  });
  const positionRef = React.useRef(position);

  const { ref: moveRef } = useMove(
    ({ x, y }) => {
      positionRef.current = { x, y };
      onChange({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) });
    },
    {
      onScrubEnd: () => {
        const { x, y } = positionRef.current;
        onChangeEnd({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) });
        onScrubEnd?.();
      },
      onScrubStart
    }
  );

  React.useEffect(() => {
    setPosition({ x: value.s / 100, y: 1 - value.v / 100 });
  }, [value.s, value.v]);

  const handleArrow = (event: React.KeyboardEvent<HTMLDivElement>, pos: UseMovePosition) => {
    event.preventDefault();
    const _position = clampUseMovePosition(pos);
    onChange({
      s: Math.round(_position.x * 100),
      v: Math.round((1 - _position.y) * 100)
    });
    onChangeEnd({
      s: Math.round(_position.x * 100),
      v: Math.round((1 - _position.y) * 100)
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowUp": {
        handleArrow(event, { y: position.y - 0.05, x: position.x });
        break;
      }
      case "ArrowDown": {
        handleArrow(event, { y: position.y + 0.05, x: position.x });
        break;
      }
      case "ArrowRight": {
        handleArrow(event, { x: position.x + 0.05, y: position.y });
        break;
      }
      case "ArrowLeft": {
        handleArrow(event, { x: position.x - 0.05, y: position.y });
        break;
      }
    }
  };

  return (
    <div
      {...{
        ref: mergeRefs(moveRef, ref),
        role: "slider",
        "aria-label": saturationLabel,
        "aria-valuenow": position.x,
        "aria-valuetext": convertHsvaTo("rgba", value),
        tabIndex: focusable ? 0 : -1,
        onKeyDown: handleKeyDown,
        ...ctx.getStyles("saturation", { className, style, ...stylesApi }),
        ...props
      }}
    >
      <div {...ctx.getStyles("saturationOverlay", { style: { backgroundColor: `hsl(${value.h}, 100%, 50%)` }, ...stylesApi })} />

      <div
        {...ctx.getStyles("saturationOverlay", {
          style: { backgroundImage: "linear-gradient(90deg, #fff, transparent)" },
          ...stylesApi
        })}
      />

      <div
        {...ctx.getStyles("saturationOverlay", {
          style: { backgroundImage: "linear-gradient(0deg, #000, transparent)" },
          ...stylesApi
        })}
      />

      <Thumb
        {...{
          position,
          ...ctx.getStyles("thumb", {
            style: { backgroundColor: color },
            ...stylesApi
          })
        }}
      />
    </div>
  );
});
Saturation.displayName = "ColorPicker/Saturation";

export interface ThumbProps extends ComponentProps<"div"> {
  variant?: string;
  position: { x: number; y: number };
}
export const Thumb = React.forwardRef<HTMLDivElement, ThumbProps>(({ position, unstyled, className, classNames, style, styles, ...props }, ref) => {
  const ctx = useColorPicker();
  const stylesApi = { unstyled, classNames, styles };
  return (
    <div
      {...{
        ref,
        ...ctx.getStyles("thumb", {
          className,
          style: {
            "--thumb-y-offset": `${position.y * 100}%`,
            "--thumb-x-offset": `${position.x * 100}%`,
            ...style
          },
          ...stylesApi
        }),
        ...props
      }}
    />
  );
});
Thumb.displayName = "ColorPicker/Thumb";

export interface SwatchesProps extends ComponentProps<"div"> {
  size?: string | number;
  data: string[];
  withShadow?: boolean;
  focusable?: boolean;
  onChangeEnd?: (color: string) => void;
  setValue: (value: string) => void;
  value?: string;
  selectedIcon?: React.ReactNode;
}
export const Swatches = React.forwardRef<HTMLDivElement, SwatchesProps>((_props, ref) => {
  const { data: colors, unstyled, className, classNames, style, styles, value, setValue, focusable, withShadow, onChangeEnd, selectedIcon, ...props } = _props;
  const ctx = useColorPicker();
  const stylesApi = { unstyled, classNames, styles };
  return (
    <div
      {...{
        ref,
        ...ctx.getStyles("swatches", {
          className,
          style,
          ...stylesApi
        }),
        ...props
      }}
    >
      {colors.map((color, index) => {
        const selected = value === color;
        return (
          <ColorSwatch
            key={index}
            {...{
              color,
              withShadow,
              "aria-label": color,
              "aria-selected": selected,
              "data-swatch": String(index + 1),
              tabIndex: focusable ? 0 : -1,
              ...ctx.getStyles("swatch", {
                ...stylesApi
              }),
              onClick: () => {
                setValue(color);
                onChangeEnd?.(color);
              }
            }}
          >
            {value === color && selectedIcon}
          </ColorSwatch>
        );
      })}
    </div>
  );
});
Swatches.displayName = "ColorPicker/Swatches";

export interface ColorSwatchProps extends ComponentProps<"button"> {
  withShadow?: boolean;
}
export const ColorSwatch = React.forwardRef<HTMLButtonElement, ColorSwatchProps>(function ColorSwatch(_props, ref) {
  const { unstyled, className, type = "button", classNames, style, styles, color, children, withShadow, ...props } = _props;
  const ctx = useColorPicker();
  const _getStyles = ctx?.getStyles ?? getStyles;
  const stylesApi = { unstyled, classNames, styles };
  return (
    <button
      {...{
        ref,
        type,
        ..._getStyles("preview", { className, style, ...stylesApi }),
        ...props
      }}
    >
      <span
        {..._getStyles("alphaOverlay", {
          style: { background: "var(--rectangles)" },
          ...stylesApi
        })}
      />
      {withShadow && (
        <span
          {..._getStyles("shadowOverlay", {
            style: { boxShadow: "var(--overlay)" },
            ...stylesApi
          })}
        />
      )}
      <span
        {..._getStyles("colorOverlay", {
          style: { backgroundColor: color },
          ...stylesApi
        })}
      />
      <span {..._getStyles("childrenOverlay", stylesApi)}>{children}</span>
    </button>
  );
});
ColorSwatch.displayName = "ColorPicker/ColorSwatch";

export const ColorPickerIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(function ColorPickerIcon({ className, ...props }, ref) {
  return (
    <svg ref={ref} fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={cn("size-5", className)} {...props}>
      <path fill="#FF5178" d="M100 0a100 100 0 00-50 13.398l30 51.961A40 40 0 01100 60V0z" />
      <path fill="#FF9259" d="M49.982 13.408a99.999 99.999 0 00-36.595 36.61l51.968 29.99a40 40 0 0114.638-14.645l-30.01-51.955z" />
      <path fill="#FFD23B" d="M13.386 50.02A100 100 0 000 100.025l60-.014a40 40 0 015.354-20.002L13.386 50.021z" />
      <path fill="#89C247" d="M0 100a99.999 99.999 0 0013.398 50l51.961-30A40.001 40.001 0 0160 100H0z" />
      <path fill="#49B296" d="M13.39 149.989a100.001 100.001 0 0036.599 36.607l30.006-51.958a39.99 39.99 0 01-14.639-14.643l-51.965 29.994z" />
      <path fill="#2897B1" d="M49.989 186.596A99.995 99.995 0 0099.987 200l.008-60a39.996 39.996 0 01-20-5.362l-30.007 51.958z" />
      <path fill="#3EC3FF" d="M100 200c17.554 0 34.798-4.621 50-13.397l-30-51.962A40 40 0 01100 140v60z" />
      <path fill="#09A1E5" d="M150.003 186.601a100.001 100.001 0 0036.601-36.604l-51.962-29.998a40 40 0 01-14.641 14.641l30.002 51.961z" />
      <path fill="#077CCC" d="M186.607 149.992A99.993 99.993 0 00200 99.99l-60 .006a39.998 39.998 0 01-5.357 20.001l51.964 29.995z" />
      <path fill="#622876" d="M200 100c0-17.554-4.621-34.798-13.397-50l-51.962 30A39.997 39.997 0 01140 100h60z" />
      <path fill="#962B7C" d="M186.597 49.99a99.994 99.994 0 00-36.606-36.598l-29.995 51.965a40 40 0 0114.643 14.64l51.958-30.006z" />
      <path fill="#CB2E81" d="M149.976 13.384A99.999 99.999 0 0099.973 0l.016 60a40.001 40.001 0 0120.002 5.353l29.985-51.97z" />
    </svg>
  );
});
ColorPickerIcon.displayName = "ColorPicker/ColorPickerIcon";

interface CopyIconProps extends SvgProps {
  has: boolean;
}
export function HasCopyIcon({ has, size = "50%", color, ...props }: CopyIconProps) {
  return has ? (
    <Svg {...{ size, style: { color, width: size, height: size }, ...props }} suppressHydrationWarning>
      <path d="M5 12l5 5l10 -10" />
    </Svg>
  ) : (
    <Svg {...{ size, style: { color, width: size, height: size }, ...props }} suppressHydrationWarning>
      <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
      <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
    </Svg>
  );
}

export function round(number: number, digits = 0, base = 10 ** digits) {
  return Math.round(base * number) / base;
}

function hslaToHsva({ h, s, l, a }: HslaColor): HsvaColor {
  const ss = s * ((l < 50 ? l : 100 - l) / 100);
  return {
    h,
    s: ss > 0 ? ((2 * ss) / (l + ss)) * 100 : 0,
    v: l + ss,
    a
  };
}

const angleUnits: Record<string, number> = {
  grad: 360 / 400,
  turn: 360,
  rad: 360 / (Math.PI * 2)
};

export function parseHue(value: string, unit = "deg") {
  return Number(value) * (angleUnits[unit] || 1);
}

const HSL_REGEXP = /hsla?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;

export function parseHsla(color: string): HsvaColor {
  const match = HSL_REGEXP.exec(color);
  if (!match) {
    return { h: 0, s: 0, v: 0, a: 1 };
  }
  return hslaToHsva({
    h: parseHue(match[1], match[2]),
    s: Number(match[3]),
    l: Number(match[4]),
    a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1)
  });
}

function rgbaToHsva({ r, g, b, a }: RgbaColor): HsvaColor {
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  const hh = delta ? (max === r ? (g - b) / delta : max === g ? 2 + (b - r) / delta : 4 + (r - g) / delta) : 0;
  return {
    h: round(60 * (hh < 0 ? hh + 6 : hh), 3),
    s: round(max ? (delta / max) * 100 : 0, 3),
    v: round((max / 255) * 100, 3),
    a
  };
}

export function parseHex(color: string): HsvaColor {
  const hex = color[0] === "#" ? color.slice(1) : color;
  if (hex.length === 3) {
    return rgbaToHsva({
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: 1
    });
  }
  return rgbaToHsva({
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
    a: 1
  });
}

export function parseHexa(color: string): HsvaColor {
  const hex = color[0] === "#" ? color.slice(1) : color;
  const roundA = (a: string) => round(parseInt(a, 16) / 255, 3);
  if (hex.length === 4) {
    const withoutOpacity = hex.slice(0, 3);
    const a = roundA(hex[3] + hex[3]);

    const hsvaColor: HsvaColor = { ...parseHex(withoutOpacity), a };
    return hsvaColor;
  }
  const withoutOpacity = hex.slice(0, 6);
  const a = roundA(hex.slice(6, 8));
  const hsvaColor: HsvaColor = { ...parseHex(withoutOpacity), a };
  return hsvaColor;
}

const RGB_REGEXP = /rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;

const VALIDATION_REGEXP: Record<ColorFormat, RegExp> = {
  hex: /^#?([0-9A-F]{3}){1,2}$/i,
  hexa: /^#?([0-9A-F]{4}){1,2}$/i,
  rgb: /^rgb\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i,
  rgba: /^rgba\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i,
  hsl: /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\)/i,
  hsla: /^hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*(\d*(?:\.\d+)?)\)$/i
};

const PARSE_CONVERTERS: Record<ColorFormat, (color: string) => HsvaColor> = {
  hex: parseHex,
  hexa: parseHexa,
  rgb: parseRgba,
  rgba: parseRgba,
  hsl: parseHsla,
  hsla: parseHsla
};

export function parseRgba(color: string): HsvaColor {
  const match = RGB_REGEXP.exec(color);
  if (!match) {
    return { h: 0, s: 0, v: 0, a: 1 };
  }
  return rgbaToHsva({
    r: Number(match[1]) / (match[2] ? 100 / 255 : 1),
    g: Number(match[3]) / (match[4] ? 100 / 255 : 1),
    b: Number(match[5]) / (match[6] ? 100 / 255 : 1),
    a: match[7] === undefined ? 1 : Number(match[7]) / (match[8] ? 100 : 1)
  });
}

export function isColorValid(color: string) {
  for (const [, regexp] of Object.entries(VALIDATION_REGEXP)) {
    if (regexp.test(color)) {
      return true;
    }
  }
  return false;
}

export function parseColor(color: string): HsvaColor {
  if (typeof color !== "string") {
    return { h: 0, s: 0, v: 0, a: 1 };
  }
  if (color === "transparent") {
    return { h: 0, s: 0, v: 0, a: 0 };
  }
  const trimmed = color.trim();
  for (const [rule, regexp] of Object.entries(VALIDATION_REGEXP)) {
    if (regexp.test(trimmed)) {
      return PARSE_CONVERTERS[rule as keyof typeof PARSE_CONVERTERS](trimmed);
    }
  }
  return { h: 0, s: 0, v: 0, a: 1 };
}
export function hsvaToRgbaObject({ h, s, v, a }: HsvaColor): RgbaColor {
  const _h = (h / 360) * 6;
  const _s = s / 100;
  const _v = v / 100;
  const hh = Math.floor(_h);
  const l = _v * (1 - _s);
  const c = _v * (1 - (_h - hh) * _s);
  const d = _v * (1 - (1 - _h + hh) * _s);
  const newModule = hh % 6;
  return {
    r: round([_v, c, l, l, d, _v][newModule] * 255),
    g: round([d, _v, _v, c, l, l][newModule] * 255),
    b: round([l, l, d, _v, _v, c][newModule] * 255),
    a: round(a, 2)
  };
}

export function hsvaToRgba(color: HsvaColor, includeAlpha: boolean) {
  const { r, g, b, a } = hsvaToRgbaObject(color);
  if (!includeAlpha) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${round(a, 2)})`;
}

export function hsvaToHsl({ h, s, v, a }: HsvaColor, includeAlpha: boolean) {
  const hh = ((200 - s) * v) / 100;
  const result = {
    h: Math.round(h),
    s: Math.round(hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0),
    l: Math.round(hh / 2)
  };
  if (!includeAlpha) {
    return `hsl(${result.h}, ${result.s}%, ${result.l}%)`;
  }
  return `hsla(${result.h}, ${result.s}%, ${result.l}%, ${round(a, 2)})`;
}

function formatHexPart(number: number) {
  const hex = number.toString(16);
  return hex.length < 2 ? `0${hex}` : hex;
}

export function hsvaToHex(color: HsvaColor) {
  const { r, g, b } = hsvaToRgbaObject(color);
  return `#${formatHexPart(r)}${formatHexPart(g)}${formatHexPart(b)}`;
}

export function hsvaToHexa(color: HsvaColor) {
  const a = Math.round(color.a * 255);
  return `${hsvaToHex(color)}${formatHexPart(a)}`;
}

const CONVERTERS: Record<ColorFormat, (color: HsvaColor) => string> = {
  hex: hsvaToHex,
  hexa: color => hsvaToHexa(color),
  rgb: color => hsvaToRgba(color, false),
  rgba: color => hsvaToRgba(color, true),
  hsl: color => hsvaToHsl(color, false),
  hsla: color => hsvaToHsl(color, true)
};

export function convertHsvaTo(format: ColorFormat, color: HsvaColor) {
  if (!color) {
    return "#000000";
  }
  if (!(format in CONVERTERS)) {
    return CONVERTERS.hex(color);
  }
  return CONVERTERS[format](color);
}

function roundValue(num: number) {
  return Math.round(num * 100) / 100;
}
