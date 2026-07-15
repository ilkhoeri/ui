"use client";
import * as React from "react";
import { useId } from "@/hooks/use-id";
import { useUncontrolled } from "@/hooks/use-uncontrolled";
import { cvx, rem, type cvxVariants } from "xuxi";
import { cn } from "@/utils/cn";

const classes = cvx({
  variants: {
    switch: {
      root: "stylelayer-switch flex relative gap-3",
      track: "",
      thumb: "",
      trackLabel: "",
      input: "sr-only",
      labelWrapper: "cursor-default inline-flex flex-col space-y-1.5",
      label: "relative block text-color text-sm m-0 p-0",
      description: "text-muted-foreground text-xs",
      error: "text-destructive text-xs"
    },
    switchGroup: {
      root: "inline-flex flex-col items-start leading-tight",
      label: "relative inline-block font-medium cursor-default [word-break:break-word] text-[0.875rem] [-webkit-tap-highlight-color:transparent]",
      description: "text-muted-foreground text-xs block m-0 p-0 [word-break:break-word] mt-0.5",
      group: "flex flex-col items-start",
      error: "text-destructive text-xs mt-1"
    },
    withAsterisk: {
      true: "after:content-['*'] after:-mt-1 after:text-destructive after:px-1 after:font-semibold"
    }
  }
});

type __KeyVar = keyof cvxVariants<typeof classes>;
type __Selector<K extends __KeyVar> = NonNullable<cvxVariants<typeof classes>[K]>;
type CSSProperties = React.CSSProperties & { [key: string]: any };
type StylesNames<K extends string, Exclude extends string = never> = Omit<
  {
    className?: string;
    style?: CSSProperties;
    classNames?: Partial<Record<K, string>>;
    styles?: Partial<Record<K, CSSProperties>>;
    unstyled?: Partial<Record<K, boolean>>;
  },
  Exclude
>;
type Component<T extends React.ElementType, Exclude extends string = never> = Omit<React.ComponentProps<T>, Exclude> & {
  style?: CSSProperties;
};
type ComponentProps<T extends React.ElementType, Exclude extends string = never> = React.PropsWithoutRef<Component<T, Exclude>>;

interface __Props {
  size?: (string & {}) | number;
  required?: boolean;
  color?: CSSProperties["color"];
  labelPosition?: "left" | "right";
  round?: (string & {}) | number;
  disabled?: boolean;
}
interface CtxProps extends __Props {
  value: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const ctx = React.createContext<CtxProps | undefined>(undefined);
const useSwitchGroupCtx = () => React.useContext(ctx)!;

interface __SwitchGroupProps extends __Props {
  wrapperProps?: React.PropsWithRef<Component<"div">>;
  readOnly?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  id?: string;
}

interface SwitchGroupProps extends ComponentProps<"div", "children" | "color" | "defaultValue" | "onChange">, StylesNames<__Selector<"switchGroup">>, __SwitchGroupProps {
  children: React.ReactNode;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

export const SwitchGroup = React.forwardRef<HTMLDivElement, SwitchGroupProps>((_props, ref) => {
  const { children, value, defaultValue, onChange, size, labelPosition, readOnly, required, color, round, disabled, label, description, className, classNames, style, styles, unstyled, error, role = "presentation", id: defaulId, wrapperProps: wp, ...props } = _props;
  const id = useId(defaulId);
  const stylesApi = {
    id,
    unstyled,
    classNames,
    styles,
    required,
    disabled,
    label,
    description,
    error
  };

  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: [],
    onChange
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const itemValue = event.currentTarget.value;
    if (!readOnly) {
      setValue(_value.includes(itemValue) ? _value.filter(item => item !== itemValue) : [..._value, itemValue]);
    }
  };
  return (
    <ctx.Provider
      value={{
        value: _value,
        onChange: handleChange,
        size,
        required,
        color,
        labelPosition,
        round,
        disabled
      }}
    >
      <div {...{ ref, role, ...switchGroupStyles("root", stylesApi), ...props }}>
        {label && <div {...switchGroupStyles("label", stylesApi)}>{label}</div>}
        {description && <p {...switchGroupStyles("description", stylesApi)}>{description}</p>}
        <div
          {...{
            role: wp?.role || "group",
            "aria-labelledby": wp?.["aria-labelledby"] || `${id}-label`,
            "aria-describedby": wp?.["aria-describedby"] || `"${id}-description`,
            ...switchGroupStyles("group", {
              className: wp?.className,
              style: wp?.style,
              ...stylesApi
            }),
            ...wp
          }}
        >
          {children}
        </div>
        {error && <p {...switchGroupStyles("error", stylesApi)}>{error}</p>}
      </div>
    </ctx.Provider>
  );
});
SwitchGroup.displayName = "Switch/SwitchGroup";

interface __SwitchProps extends __SwitchGroupProps {
  offLabel?: React.ReactNode;
  onLabel?: React.ReactNode;
  thumbIcon?: React.ReactNode;
  rootRef?: React.ForwardedRef<HTMLDivElement>;
}

interface SwitchProps extends ComponentProps<"input", "size" | "children" | "color">, __SwitchProps, StylesNames<__Selector<"switch">> {
  id?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>((_props, ref) => {
  const { classNames, className, style, styles, unstyled, color, label, offLabel, onLabel, id, size, round, thumbIcon, checked, defaultChecked, onChange, labelPosition, description, error, disabled, required, rootRef, wrapperProps: wp, ...props } = _props;

  const uuid = useId(id);
  const ctx = useSwitchGroupCtx();

  const contextProps = ctx
    ? {
        checked: ctx.value.includes(props.value as string),
        onChange: ctx.onChange
      }
    : {};

  const [_checked, handleChange] = useUncontrolled({
    value: contextProps.checked ?? checked,
    defaultValue: defaultChecked,
    finalValue: false
  });

  const rest = {
    unstyled,
    classNames,
    styles,
    required,
    size: ctx?.size ?? size,
    color: ctx?.color ?? color,
    round: ctx?.round ?? round,
    disabled: ctx?.disabled ?? disabled,
    labelPosition: ctx?.labelPosition ?? labelPosition,
    error
  };

  return (
    <div
      {...{
        ref: wp?.ref || rootRef,
        ...switchStyles("root", { className, style, ...rest }),
        ...wp
      }}
    >
      <input
        {...{
          ref,
          disabled: ctx?.disabled ?? disabled,
          required: ctx?.required ?? required,
          id: uuid,
          type: "checkbox",
          role: "switch",
          checked: _checked,
          "data-checked": contextProps.checked || checked || undefined,
          onChange: event => {
            contextProps.onChange?.(event);
            onChange?.(event);
            handleChange(event.currentTarget.checked);
          },
          ...switchStyles("input"),
          ...props
        }}
      />
      <label
        {...{
          htmlFor: uuid,
          "aria-hidden": "true",
          ...switchStyles("track", rest)
        }}
      >
        <span {...switchStyles("thumb", rest)}>{thumbIcon}</span>
        {(onLabel || offLabel) && <span {...switchStyles("trackLabel", rest)}>{_checked ? onLabel : offLabel}</span>}
      </label>
      {(label || description || error) && (
        <div {...switchStyles("labelWrapper", rest)}>
          {label && <label {...{ htmlFor: uuid, ...switchStyles("label", rest) }}>{label}</label>}
          {description && <p {...switchStyles("description", rest)}>{description}</p>}
          {error && typeof error !== "boolean" && <p {...switchStyles("error", rest)}>{error}</p>}
        </div>
      )}
    </div>
  );
}) as SwitchComponent;
Switch.displayName = "Switch";

function state<T>(val: T) {
  return val ? "true" : undefined;
}
function switchGroupStyles(selector: __Selector<"switchGroup">, options: StylesNames<__Selector<"switchGroup">> & __SwitchGroupProps = {}) {
  const { unstyled, className, classNames, style, styles, disabled, error, required, id, label, description } = options;
  function selected<T>(select: __Selector<"switchGroup">, state: T) {
    return selector === select ? (state as T) : undefined;
  }
  return {
    id: `${id}-${selector}`,
    "data-required": selected("label", state(required)),
    "aria-disabled": disabled || undefined,
    "data-disabled": disabled || undefined,
    "data-error": selected("root", state(error)),
    className: cn(
      !unstyled?.[selector] && [
        selected("group", label || description ? "mt-2.5" : undefined),
        classes({
          switchGroup: selector,
          withAsterisk: selected("label", required)
        })
      ],
      classNames?.[selector],
      className
    ),
    style: {
      ...styles?.[selector],
      ...style
    }
  };
}
function switchStyles(selector: __Selector<"switch">, options: StylesNames<__Selector<"switch">> & __SwitchProps = {}) {
  const { unstyled, className, classNames, style, styles, disabled, required, onLabel, offLabel, error, size = 20, round = 9999, labelPosition = "right", color = "hsl(var(--constructive))" } = options;
  function selected<T>(select: __Selector<"switch">, state: T) {
    return selector === select ? (state as T) : undefined;
  }
  return {
    "data-error": selected("root", state(error)),
    "data-label-position": selected("root", labelPosition),
    "data-without-labels": selected("track", state(!onLabel && !offLabel)),
    "data-switch": cn(selector),
    "data-required": selected("label", state(required)),
    "aria-disabled": disabled || undefined,
    "data-disabled": disabled || undefined,
    className: cn(
      !unstyled?.[selector] &&
        classes({
          switch: selector,
          withAsterisk: selected("label", required)
        }),
      classNames?.[selector],
      className
    ),
    style: {
      ...selected("root", {
        "--switch-round": rem(round),
        "--switch-h": `calc(${rem(size)} + 0.125rem)`,
        "--switch-w": `calc((${rem(size)} * 2) + 0.125rem)`,
        "--switch-thumb-margin": `calc(${rem(size)} * (20 / 100))`,
        "--switch-thumb-sz": `calc(${rem(size)} - var(--switch-thumb-margin))`,
        "--switch-color": color,
        "--switch-label-fz": `calc(${rem(size)} * (35 / 100))`,
        "--switch-thumb-padding": "calc(var(--switch-thumb-margin) / 2)"
      }),
      ...selected("error", {
        "--switch-error-size": size === undefined ? undefined : `calc(${rem(size)} - ${rem(2)})`
      }),
      ...styles?.[selector],
      ...style
    }
  };
}

// Export as a composite component
type ForwardRef<T extends React.ElementType, Props> = React.ForwardRefExoticComponent<{ ref?: React.ComponentPropsWithRef<T>["ref"] } & Props>;
type SwitchComponent = ForwardRef<"input", SwitchProps> & {
  Group: typeof SwitchGroup;
};
// Attach sub-components
Switch.Group = SwitchGroup;
