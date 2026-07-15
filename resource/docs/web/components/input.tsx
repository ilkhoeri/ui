"use client";
import * as React from "react";
import { useId } from "@/hooks/use-id";
import { cvx, ocx, rem, type cvxVariants } from "xuxi";
import { cn } from "@/utils/cn";
import { Svg } from "./svg";
import { usePasswordRequirementCtx } from "./password-requirement";

export const classes = cvx({
  assign:
    "stylelayer-inputs relative flex h-[--input-h,var(--input-sz)] w-[--input-w,var(--input-sz)] max-w-[--input-w,100%] cursor-pointer appearance-none rounded-lg border bg-background px-3 py-2 text-sm ring-offset-constructive/35 transition-colors [-moz-appearance:none] [-webkit-appearance:none] placeholder:text-muted-foreground focus-visible:border-constructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2 focus-visible:placeholder:text-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-[disabled='true']:cursor-not-allowed aria-[disabled='true']:opacity-50",
  variants: {
    variant: {
      button: "min-w-9 justify-center active:scale-95 transition-transform",
      checkbox: "items-center justify-center rounded-md p-0 align-middle outline-0 transition-colors duration-200 delay-200 checked:bg-color checked:delay-0 data-[state=indeterminate]:bg-color",
      color: "rounded-xl bg-transparent bg-none py-0 px-0",
      date: "min-w-52 text-muted-foreground [&:where(:is(:not([value=''])))]:text-color",
      "datetime-local": "min-w-52 text-muted-foreground [&:where(:is(:not([value=''])))]:text-color",
      email: "cursor-text justify-start [--bg-required:hsl(var(--background))_var(--bg-atmail)] focus-visible:[--bg-required:hsl(var(--background))] [&:where(:is(:not([value=''])))]:[--bg-required:hsl(var(--background))]",
      file: "text-muted-foreground [&:where(:is(:not([value=''])))]:text-color [&:where(:is(:not([value=''])))]:border-constructive [&:where(:is(:not([value=''])))]:bg-constructive/30 [&:where(:is(:not([value=''])))]:ring-constructive break-words items-center justify-center rounded-2xl border-2 file:border-constructive outline-none ring-1 ring-transparent ring-offset-2 ring-offset-background pb-0 pt-[25%] px-[15%] border-dashed file:border-0 file:bg-transparent file:text-sm file:font-medium",
      hidden: "sr-only !hidden",
      image: "bg-center text-transparent align-middle items-center justify-center rounded-2xl border py-0 px-0 outline-0 outline-none [&>*]:border-0 [&>*]:outline-0 [&>*]:outline-none",
      month: "min-w-52 text-muted-foreground [&:where(:is(:not([value=''])))]:text-color",
      number: "cursor-text justify-start [&[type=number]::-webkit-inner-spin-button]:[-webkit-appearance:none] [&[type=number]::-webkit-outer-spin-button]:[-webkit-appearance:none] [appearance:textfield] [-moz-appearance:textfield]",
      password: "h-9 w-full cursor-text justify-start [-webkit-text-security:disc] data-[state=text]:[-webkit-text-security:none]",
      radio: "rounded-full px-0 py-0 items-center justify-center border-muted-foreground checked:border-color",
      range:
        "h-max items-center overflow-x-hidden rounded-full border-0 bg-transparent p-0 text-constructive [--thumb-border:calc(var(--thumb-sz)/3.5)] [--thumb-inner-color:--track-color-active] [--thumb-outer-color:hsl(var(--pure-white))] [--thumb-sz:1rem] [--track-color-active:hsl(var(--constructive))] [--track-height:calc(var(--thumb-sz)/2)]",
      reset: "min-w-9 justify-center active:scale-95 transition-transform",
      search: "cursor-text justify-start",
      submit: "min-w-9 justify-center active:scale-95 transition-transform",
      tel: "cursor-text justify-start",
      text: "cursor-text justify-start",
      numeric: "cursor-text justify-start",
      phone: "cursor-text justify-start",
      float: "cursor-text justify-start",
      time: "min-w-52 text-muted-foreground [&:where(:is(:not([value=''])))]:text-color",
      url: "cursor-text justify-start",
      week: "min-w-52 text-muted-foreground [&:where(:is(:not([value=''])))]:text-color",
      pin: "block rounded-md border bg-transparent p-0 text-center text-[20px] font-bold leading-[20px] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[24px] placeholder:text-muted-foreground/80 focus:placeholder:opacity-0 focus-visible:border-transparent focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-[#2f81f7] focus-visible:ring-offset-0"
    }
  }
});

const classesWrapper = cvx({
  variants: {
    selector: {
      root: "relative leading-[1.55]",
      label: "inline-block break-words text-[0.875rem] font-medium",
      description: "text-muted-foreground text-xs leading-tight [word-wrap:break-word] [word-break:break-word] [line-break:anywhere]",
      error: "text-destructive text-xs leading-tight [word-wrap:break-word]",
      required: "cursor-[inherit] relative block text-sm m-0 p-0 -mt-1 text-destructive px-1 font-semibold"
    }
  }
});

const classesPassword = cvx({
  variants: {
    selector: {
      wrapper: "relative flex w-full items-center",
      input: classes({ variant: "password" }),
      toggle: "pointer-events-auto absolute bottom-0 right-0 z-99 flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] border-0 !bg-transparent outline-0"
    }
  }
});

type __Variant = NonNullable<cvxVariants<typeof classes>["variant"]>;
type __Selector = NonNullable<cvxVariants<typeof classesWrapper>["selector"]>;
type CSSProperties = React.CSSProperties & Record<string, any>;
type StylesNames<T extends string, Exclude extends string = never> = Omit<
  {
    className?: string;
    style?: CSSProperties;
    classNames?: Partial<Record<T, string>>;
    styles?: Partial<Record<T, CSSProperties>>;
    unstyled?: boolean | Partial<Record<T, boolean>>;
  },
  Exclude
>;
type ComponentProps<T extends React.ElementType, Exclude extends string = never> = StylesNames<__Selector, Exclude> & React.PropsWithoutRef<Omit<React.ComponentProps<T>, "style" | Exclude>>;

interface CtxProps {
  getStyles(selector: __Selector, options?: Options): InferType<typeof getStyles>;
  offsetTop: boolean;
  offsetBottom: boolean;
  describedBy: string | undefined;
  inputId: string | undefined;
  labelId: string | undefined;
}

const ctx = React.createContext<CtxProps | undefined>(undefined);
const useInputWrapperCtx = () => React.useContext(ctx)!;

function is<T>(state: T) {
  return (state as T) ? "true" : undefined;
}

export function getInputOffsets(inputWrapperOrder: ("label" | "input" | "description" | "error")[], { hasDescription, hasError }: { hasDescription: boolean; hasError: boolean }) {
  const inputIndex = inputWrapperOrder.findIndex(part => part === "input");
  const aboveInput = inputWrapperOrder.slice(0, inputIndex);
  const belowInput = inputWrapperOrder.slice(inputIndex + 1);
  const offsetTop = (hasDescription && aboveInput.includes("description")) || (hasError && aboveInput.includes("error"));
  const offsetBottom = (hasDescription && belowInput.includes("description")) || (hasError && belowInput.includes("error"));
  return { offsetBottom, offsetTop };
}

const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+?<>{}\/]).{8,}$/;

export const phoneRegEx = /^(?:0|\+62)(?:\d{3}-\d{4}-\d{4}|\d{3}-\d{3}-\d{4}|\d{4}-\d{4}-\d{3}|\d{4}-\d{4}-\d{4})$/;

function getDefaultSize({ variant, size }: InputStyles): InputStyles["size"] {
  if (size) return size;
  switch (variant) {
    case "text":
      return { h: 36, w: "100%" };
    case "checkbox":
      return 22;
    case "radio":
      return 20;
    case "file":
      return { h: 208, w: 320 };
    case "image":
      return { h: 208, w: 320 };
    case "pin":
      return 40;
    case "color":
      return 32;
    default:
      return { h: 36, w: "100%" };
  }
}

type Options = StylesNames<__Selector> & { size?: (string & {}) | number };
function getStyles(selector: __Selector, options: Options = {}) {
  const { className, classNames, style, styles, unstyled, size } = options;

  const isUnstyled = typeof unstyled === "object" ? unstyled?.[selector] : unstyled;
  return {
    className: cn(!isUnstyled && classesWrapper({ selector }), classNames?.[selector], className),
    style: ocx(
      styles?.[selector],
      style,
      selector === "label" && { "--input-asterisk-color": undefined },
      selector === "error" && { "--input-error-size": size === undefined ? undefined : `calc(${rem(size)} - ${rem(2)})` },
      selector === "description" && { "--input-description-size": size === undefined ? undefined : `calc(${rem(size)} - ${rem(2)})` }
    )
  };
}

interface InputStyles extends cvxVariants<typeof classes> {
  unstyled?: boolean;
  className?: string;
  style?: CSSProperties;
  size?: (number | (string & {})) | { h?: React.CSSProperties["height"]; w?: React.CSSProperties["width"] };
}

function getInputStyles(options: InputStyles = {}) {
  const { className, style, unstyled, variant, size } = options;
  const sizing = getDefaultSize({ size, variant });
  return {
    className: cn(!unstyled && classes({ variant }), className),
    style: {
      ...style,
      ...(typeof sizing === "object" ? { "--input-h": rem(sizing.h), "--input-w": rem(sizing.w) } : { "--input-sz": rem(sizing) })
    }
  };
}

export function floatNumber(value: string, locales: Intl.LocalesArgument = "id-ID", options?: Intl.NumberFormatOptions) {
  // Remove semua karakter non-digit (kecuali minus buat split)
  return value
    .split("-")
    .map(part => {
      const cleaned = part.replace(/\D/g, "");
      if (!cleaned) return "";
      return parseInt(cleaned, 10).toLocaleString(locales, options);
    })
    .join("-");
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "placeholder" | "type">, InputStyles {
  indeterminate?: boolean;
  placeholder?: string | null | undefined;
  type?: "numeric" | "phone" | "float" | React.HTMLInputTypeAttribute;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>((_props, ref) => {
  const { className, style, value, disabled, type = "text", spellCheck = false, autoComplete = "off", unstyled, indeterminate, variant, size, placeholder, "aria-invalid": aI = "false", "aria-disabled": aD, onChange, id, readOnly, "aria-readonly": aRO, tabIndex, ...props } = _props;
  const [numeric, setNumeric] = React.useState(value ?? "");

  const isNumeric = type === "numeric";
  const isFloat = type === "float";
  const isFormatText = isNumeric || isFloat;

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const ctx = useInputWrapperCtx();

  const mergedRef = React.useMemo(() => {
    if (!ref) return inputRef;
    return (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.RefObject<HTMLInputElement | null>).current = node;
      }
    };
  }, [ref]);

  React.useEffect(() => {
    if (type === "checkbox" && indeterminate !== undefined && inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, type]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      if (type === "numeric") {
        const numeric = rawValue.replace(/[^0-9+-]/g, "");
        if (/^[0-9+-]*$/.test(numeric)) setNumeric(numeric);
      }
      if (type === "date") {
        formatDate(new Date(rawValue));
      }
      if (type === "float") {
        const formattedValue = floatNumber(rawValue);
        setNumeric(formattedValue);
      }

      onChange?.(e);
    },
    [type, onChange]
  );

  return (
    <input
      {...props}
      ref={mergedRef}
      {...{
        disabled,
        readOnly,
        spellCheck,
        autoComplete,
        id: ctx?.inputId ?? id,
        onChange: handleChange,
        type: isFormatText ? "text" : type,
        value: isFormatText ? numeric : value,
        tabIndex: tabIndex || (readOnly ? -1 : undefined),
        placeholder: placeholder === null ? undefined : (placeholder ?? type),
        "aria-invalid": aI,
        "aria-disabled": aD || (disabled ? "true" : undefined),
        "data-state": indeterminate ? "indeterminate" : undefined,
        "aria-readonly": aRO || (readOnly ? "true" : undefined),
        ...getInputStyles({ variant: (variant || type) as __Variant, className, style, unstyled, size })
      }}
    />
  );
}) as InputComponent;
Input.displayName = "Input";

type InputPasswordTrees = NonNullable<cvxVariants<typeof classesPassword>["selector"]>;

export interface InputPasswordProps extends Omit<InputProps, "type" | "unstyled" | "indeterminate" | keyof InputStyles> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: SetStateAction<boolean>) => void;
  toggleIcon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  className?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<InputPasswordTrees, string | false>>;
  styles?: Partial<Record<InputPasswordTrees, CSSProperties>>;
  unstyled?: boolean | Partial<Record<InputPasswordTrees, boolean>>;
  validating?: boolean;
}

const pathMap = {
  true: [
    "M1.47978 1.4797C1.30227 1.65721 1.28614 1.93498 1.43137 2.13072L1.47978 2.1868L4.1695 4.87652C2.88817 5.77616 1.93052 7.11985 1.53259 8.70952C1.46554 8.97738 1.62834 9.24892 1.89621 9.31598C2.16409 9.38298 2.4356 9.22025 2.50266 8.95232C2.85564 7.54225 3.72742 6.35956 4.88944 5.59626L6.09586 6.80278C5.62419 7.28378 5.33334 7.94278 5.33334 8.66965C5.33334 10.1424 6.52724 11.3363 8 11.3363C8.72694 11.3363 9.38587 11.0454 9.86694 10.5738L13.8131 14.5201C14.0084 14.7154 14.3249 14.7154 14.5202 14.5201C14.6977 14.3426 14.7139 14.0649 14.5686 13.8691L14.5202 13.813L10.4445 9.73692L10.4453 9.73592L9.64527 8.93732L7.732 7.02445L7.73334 7.02392L5.81252 5.10513L5.81334 5.10392L5.05782 4.35024L2.18689 1.4797C1.99163 1.28444 1.67504 1.28444 1.47978 1.4797ZM6.80274 7.51025L9.15947 9.86698C8.85947 10.1575 8.4506 10.3363 8 10.3363C7.07954 10.3363 6.33334 9.59012 6.33334 8.66965C6.33334 8.21905 6.51216 7.81018 6.80274 7.51025ZM8 3.66658C7.33314 3.66658 6.68607 3.7653 6.07406 3.94992L6.89874 4.77404C7.25594 4.70346 7.62427 4.66658 8 4.66658C10.6154 4.66658 12.8733 6.45342 13.4981 8.95538C13.565 9.22325 13.8364 9.38618 14.1043 9.31932C14.3723 9.25238 14.5352 8.98098 14.4683 8.71305C13.7329 5.7684 11.077 3.66658 8 3.66658ZM8.1298 6.0061L10.664 8.53992C10.5961 7.16865 9.49814 6.07168 8.1298 6.0061Z"
  ],
  false: [
    "M7.99993 6.00316C9.47266 6.00316 10.6666 7.19708 10.6666 8.66981C10.6666 10.1426 9.47266 11.3365 7.99993 11.3365C6.52715 11.3365 5.33324 10.1426 5.33324 8.66981C5.33324 7.19708 6.52715 6.00316 7.99993 6.00316ZM7.99993 7.00315C7.07946 7.00315 6.33324 7.74935 6.33324 8.66981C6.33324 9.59028 7.07946 10.3365 7.99993 10.3365C8.9204 10.3365 9.6666 9.59028 9.6666 8.66981C9.6666 7.74935 8.9204 7.00315 7.99993 7.00315ZM7.99993 3.66675C11.0756 3.66675 13.7307 5.76675 14.4673 8.70968C14.5344 8.97755 14.3716 9.24908 14.1037 9.31615C13.8358 9.38315 13.5643 9.22041 13.4973 8.95248C12.8713 6.45205 10.6141 4.66675 7.99993 4.66675C5.38454 4.66675 3.12664 6.45359 2.50182 8.95555C2.43491 9.22341 2.16348 9.38635 1.89557 9.31948C1.62766 9.25255 1.46471 8.98115 1.53162 8.71321C2.26701 5.76856 4.9229 3.66675 7.99993 3.66675Z"
  ]
};

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>((_props, ref) => {
  const { defaultOpen = false, open: openProp, onOpenChange: setOpenProp, id, unstyled, className, classNames, styles, style, disabled, value, onChange, autoComplete = "off", spellCheck = false, placeholder = "•••••••••••", "aria-disabled": aD, "aria-invalid": aI = "false", toggleIcon, validating, ...props } = _props;

  const ctx = useInputWrapperCtx();
  const rpCtx = usePasswordRequirementCtx();

  const [password, setPassword] = React.useState("");

  const [_open, _setOpen] = React.useState(defaultOpen);
  const openChange = openProp ?? _open;
  const setOpenChange = React.useCallback(
    (open: SetStateAction<boolean>) => {
      const openState = typeof open === "function" ? open(openChange) : open;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, openChange]
  );

  function getStyles(selector: InputPasswordTrees, opt: { className?: string; style?: CSSProperties } = {}) {
    const isUnstyled = () => (typeof unstyled === "boolean" ? unstyled : unstyled?.[selector]);
    return {
      "data-state": openChange ? "text" : "password",
      className: cn(selector === "input" && [!openChange && ""], !isUnstyled() && classesPassword({ selector }), opt.className, classNames?.[selector]),
      style: { ...opt.style, ...styles?.[selector] }
    };
  }

  return (
    <div {...getStyles("wrapper", { className, style })}>
      <input
        {...props}
        ref={ref}
        {...{
          disabled,
          autoComplete,
          spellCheck,
          id: ctx?.inputId ?? id,
          value: password,
          onChange: e => {
            onChange?.(e);
            setPassword(e.target.value);
            if (rpCtx && !validating) {
              rpCtx?.onValueChange?.(e.currentTarget.value);
            }
          },
          type: openChange ? "text" : "password",
          placeholder: placeholder === null ? undefined : placeholder,
          "aria-invalid": aI,
          "aria-disabled": aD || (disabled ? "true" : undefined),
          ...getStyles("input")
        }}
      />

      <button type="button" role="button" tabIndex={-1} onClick={() => setOpenChange(!openChange)} {...getStyles("toggle")}>
        {(typeof toggleIcon === "function" ? toggleIcon(openChange) : toggleIcon) ?? (
          <Svg currentFill="fill" size={20} viewBox="0 0 16 16">
            {pathMap[String(openChange) as keyof typeof pathMap].map((d, index) => (
              <path key={index} d={d} />
            ))}
          </Svg>
        )}
      </button>
    </div>
  );
});
InputPassword.displayName = "InputPassword";

interface __InputWrapperProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  withAsterisk?: boolean;
  labelProps?: Record<string, any>;
  descriptionProps?: Record<string, any>;
  errorProps?: Record<string, any>;
  inputContainer?: (children: React.ReactNode) => React.ReactNode;
  inputWrapperOrder?: ("label" | "input" | "description" | "error")[];
}

export interface InputWrapperProps extends __InputWrapperProps, ComponentProps<"div"> {
  __staticSelector?: string;
  // __stylesApiProps?: Record<string, any>;
  id?: string;
  size?: (string & {}) | number;
  labelElement?: "label" | "div";
}
export const InputWrapper = React.forwardRef<HTMLDivElement, InputWrapperProps>((_props, ref) => {
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    size,
    label,
    error,
    description,
    labelProps,
    descriptionProps,
    errorProps,
    children,
    withAsterisk,
    id,
    required,
    __staticSelector,
    labelElement = "label",
    inputContainer = children => children,
    inputWrapperOrder = ["label", "description", "input", "error"],
    ...props
  } = _props;

  const idBase = useId(id);
  const isRequired = typeof withAsterisk === "boolean" ? withAsterisk : required;
  const errorId = errorProps?.id || `${idBase}-error`;
  const descriptionId = descriptionProps?.id || `${idBase}-description`;
  const inputId = idBase;
  const hasError = !!error && typeof error !== "boolean";
  const hasDescription = !!description;
  const _describedBy = `${hasError ? errorId : ""} ${hasDescription ? descriptionId : ""}`;
  const describedBy = _describedBy.trim().length > 0 ? _describedBy.trim() : undefined;
  const labelId = labelProps?.id || `${idBase}-label`;

  const isUnstyled = (selector: __Selector) => (typeof unstyled === "object" ? unstyled?.[selector] : unstyled);
  const stylesApi = { size, __staticSelector };

  const _label = label && (
    <InputLabel key="label" labelElement={labelElement} id={labelId} htmlFor={inputId} required={isRequired} unstyled={isUnstyled("label")} className={cn(classNames?.label, labelProps?.className)} style={ocx(styles?.label, labelProps?.style)} {...stylesApi} {...labelProps}>
      {label}
    </InputLabel>
  );

  const _description = hasDescription && (
    <InputDescription
      key="description"
      {...descriptionProps}
      {...stylesApi}
      size={descriptionProps?.size || stylesApi.size}
      id={descriptionProps?.id || descriptionId}
      unstyled={isUnstyled("description")}
      className={cn(classNames?.description, descriptionProps?.className)}
      style={ocx(styles?.description, descriptionProps?.style)}
    >
      {description}
    </InputDescription>
  );

  const _input = <React.Fragment key="input">{inputContainer!(children)}</React.Fragment>;

  const _error = hasError && (
    <InputError key="error" {...errorProps} {...stylesApi} size={errorProps?.size || stylesApi.size} id={errorProps?.id || errorId} unstyled={isUnstyled("error")} className={cn(classNames?.error, errorProps?.className)} style={ocx(styles?.error, errorProps?.style)}>
      {error}
    </InputError>
  );

  const content = inputWrapperOrder!.map(part => {
    switch (part) {
      case "label":
        return _label;
      case "input":
        return _input;
      case "description":
        return _description;
      case "error":
        return _error;
      default:
        return null;
    }
  });

  return (
    <ctx.Provider value={{ getStyles, describedBy, inputId, labelId, ...getInputOffsets(inputWrapperOrder!, { hasDescription, hasError }) }}>
      <div ref={ref} data-error={is(!!error)} {...getStyles("root", { className, classNames, style, styles, unstyled, ...stylesApi })} {...props}>
        {content}
      </div>
    </ctx.Provider>
  );
});
InputWrapper.displayName = "InputWrapper";

export interface InputLabelProps extends ComponentProps<"label", "classNames" | "styles" | "unstyled"> {
  unstyled?: boolean;
  __staticSelector?: string;
  required?: boolean;
  size?: (string & {}) | number;
  labelElement?: "label" | "div";
}
export const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>((_props, ref) => {
  const { className, style, unstyled, labelElement: el = "label", size, required, htmlFor, onMouseDown, children, __staticSelector, ...props } = _props;

  const ctx = useInputWrapperCtx();
  const _getStyles = ctx?.getStyles ?? getStyles;

  const Comp = el;
  return (
    <Comp
      // @ts-ignore
      ref={ref}
      htmlFor={el === "label" ? htmlFor : undefined}
      {..._getStyles("label", { className, style, unstyled, size })}
      data-required={required}
      aria-required={required}
      onMouseDown={e => {
        onMouseDown?.(e as React.MouseEvent<HTMLLabelElement, MouseEvent>);
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      }}
      {...props}
    >
      {children}
      {required && (
        <span {...getStyles("required")} aria-hidden>
          {" *"}
        </span>
      )}
    </Comp>
  );
});
InputLabel.displayName = "InputLabel";

export interface InputDescriptionProps extends ComponentProps<"p", "classNames" | "styles" | "unstyled"> {
  unstyled?: boolean;
  __staticSelector?: string;
  __inheritStyles?: boolean;
  size?: (string & {}) | number;
}
export const InputDescription = React.forwardRef<HTMLParagraphElement, InputDescriptionProps>((_props, ref) => {
  const { className, style, unstyled, size, __staticSelector, __inheritStyles = true, ...props } = _props;
  const ctx = useInputWrapperCtx();
  const _getStyles = (__inheritStyles && ctx?.getStyles) || getStyles;
  return <p ref={ref} {..._getStyles("description", { className, style, unstyled, size })} {...props} />;
});
InputDescription.displayName = "InputDescription";

export interface InputErrorProps extends ComponentProps<"p", "classNames" | "styles" | "unstyled"> {
  unstyled?: boolean;
  __staticSelector?: string;
  __inheritStyles?: boolean;
  size?: (string & {}) | number;
}
export const InputError = React.forwardRef<HTMLParagraphElement, InputErrorProps>((_props, ref) => {
  const { className, style, unstyled, size, __staticSelector, __inheritStyles = true, ...props } = _props;
  const ctx = useInputWrapperCtx();
  const _getStyles = (__inheritStyles && ctx?.getStyles) || getStyles;
  return <p ref={ref} {..._getStyles("error", { className, style, unstyled, size })} {...props} />;
});
InputError.displayName = "InputError";

// Export as a composite component
type ForwardRef<T extends React.ElementType, Props> = React.ForwardRefExoticComponent<{ ref?: React.ComponentPropsWithRef<T>["ref"] } & Props>;
interface InputComponent extends ForwardRef<"input", InputProps> {
  Password: typeof InputPassword;
  Wrapper: typeof InputWrapper;
  Label: typeof InputLabel;
  Description: typeof InputDescription;
  Error: typeof InputError;
}
// Attach sub-components
Input.Password = InputPassword;
Input.Wrapper = InputWrapper;
Input.Label = InputLabel;
Input.Description = InputDescription;
Input.Error = InputError;
