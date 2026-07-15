"use client";
import * as React from "react";
import { Group } from "./group";
import { usePagination } from "@/hooks/use-pagination";
import { cvx, rem, type cvxVariants } from "xuxi";
import { cn } from "@/utils/cn";
import { getContrastColor } from "@/hooks/use-random-colors";

const classes = cvx({
  variants: {
    selector: {
      root: "mx-auto size-auto stylelayer-pagination",
      control: "pagination-control",
      dots: "pagination-dots"
    },
    active: {
      true: "active"
    }
  }
});

type __Selector = NonNullable<cvxVariants<typeof classes>["selector"]>;
type Options = StylesNames<__Selector> & { active?: boolean };
type CSSProperties = React.CSSProperties & { [key: string]: any };
type NestedRecord<U extends [string, unknown], T extends string> = {
  [K in U as K[0]]?: Partial<Record<T, K[1]>>;
};
type Styles = ["unstyled", boolean] | ["classNames", string] | ["styles", CSSProperties];
type StylesNames<T extends string, Exclude extends string = never> = Omit<NestedRecord<Styles, T> & { className?: string; style?: CSSProperties }, Exclude>;
type ComponentProps<T extends React.ElementType, Exclude extends string = never> = StylesNames<__Selector> & {
  color?: React.CSSProperties["color"];
} & React.PropsWithoutRef<Omit<React.ComponentProps<T>, "style" | "color" | Exclude>>;
type CtxProps = __PaginationProps & {
  getStyles(selector: __Selector, options?: Options): InferType<typeof getStyles>;
  range: (number | "dots")[];
  active: number;
  onFirst: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onLast: () => void;
};

function getStyles(selector: __Selector, options?: Options) {
  return {
    "data-pgn": cn(selector),
    className: cn(!options?.unstyled?.[selector] && classes({ selector, active: options?.active }), options?.classNames?.[selector], options?.className),
    style: {
      ...options?.styles?.[selector],
      ...options?.style
    }
  };
}

const ctx = React.createContext<CtxProps | undefined>(undefined);
const usePaginationCtx = () => React.useContext(ctx)!;

export interface __PaginationProps {
  total: number;
  onChange?: (page: number) => void;
  disabled?: boolean;
  getItemProps?: (page: number) => Record<string, any>;
}

export interface PaginationProps extends __PaginationProps, ComponentProps<typeof Group, "onChange" | "value" | "defaultValue" | "unstyled"> {
  siblings?: number;
  boundaries?: number;
  hideWithOnePage?: boolean;
  size?: (string & {}) | number;
  withEdges?: boolean;
  withControls?: boolean;
  value?: number;
  defaultValue?: number;
  icons?: {
    first?: PaginationIcon;
    previous?: PaginationIcon;
    next?: PaginationIcon;
    last?: PaginationIcon;
    dots?: PaginationIcon;
  };
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onFirstPage?: () => void;
  onLastPage?: () => void;
  getControlProps?: (control: "first" | "previous" | "next" | "last") => Record<string, any>;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>((_props, ref) => {
  const {
    unstyled,
    className,
    classNames,
    style,
    styles,
    gap,
    size,
    color,
    getControlProps,
    hideWithOnePage,
    total,
    value,
    defaultValue,
    onChange,
    disabled,
    onNextPage,
    onPreviousPage,
    onFirstPage,
    onLastPage,
    getItemProps,
    children,
    icons = {},
    siblings = 1,
    boundaries = 1,
    withEdges = false,
    withControls = true,
    role = "navigation",
    "aria-label": al = "pagination",
    ...props
  } = _props;

  const { range, setPage, next, previous, active, first, last } = usePagination({
    page: value,
    initialPage: defaultValue,
    onChange,
    total,
    siblings,
    boundaries
  });

  const handleNextPage = createEventHandler(onNextPage, next);
  const handlePreviousPage = createEventHandler(onPreviousPage, previous);
  const handleFirstPage = createEventHandler(onFirstPage, first);
  const handleLastPage = createEventHandler(onLastPage, last);

  const { first: firstIcon, previous: previousIcon, next: nextIcon, last: lastIcon, dots: dotsIcon } = icons;
  const rest = { unstyled, classNames, styles };

  if (total <= 0 || (hideWithOnePage && total === 1)) {
    return null;
  }

  const content = (
    <>
      {withEdges && <PaginationFirst icon={firstIcon} {...getControlProps?.("first")} />}
      {withControls && <PaginationPrevious icon={previousIcon} {...getControlProps?.("previous")} />}
      <PaginationItems {...{ dotsIcon }} />
      {withControls && <PaginationNext icon={nextIcon} {...getControlProps?.("next")} />}
      {withEdges && <PaginationLast icon={lastIcon} {...getControlProps?.("last")} />}
    </>
  );

  return (
    <ctx.Provider
      value={{
        getStyles,
        total,
        range,
        active,
        disabled,
        getItemProps,
        onChange: setPage,
        onNext: handleNextPage,
        onPrevious: handlePreviousPage,
        onFirst: handleFirstPage,
        onLast: handleLastPage
      }}
    >
      <PaginationRoot {...{ ref, role, gap, size, className, style, color, "aria-label": al, ...rest, ...props }}>{children || content}</PaginationRoot>
    </ctx.Provider>
  );
}) as PaginationComponent;
Pagination.displayName = "Pagination";

export interface PaginationRootProps extends ComponentProps<typeof Group, "value" | "onChange" | "unstyled"> {
  size?: number | string;
}
const PaginationRoot = React.forwardRef<HTMLDivElement, PaginationRootProps>((_props, ref) => {
  const { gap = 8, size = 32, color, role = "navigation", "aria-label": al = "pagination", className, classNames, style, styles, unstyled, ...props } = _props;
  return (
    <Group
      {...{
        ref,
        role,
        gap,
        "aria-label": al,
        ...getStyles("root", {
          unstyled,
          className,
          classNames,
          styles,
          style: {
            "--control-size": rem(size),
            "--active-bg": color ? color : undefined,
            "--active-color": getContrastColor(color),
            ...style
          }
        }),
        ...props
      }}
    />
  );
});
PaginationRoot.displayName = "Pagination/PaginationRoot";

type InheritedProps<T extends React.ElementType, OverrideProps = object> = OverrideProps & Omit<React.JSX.LibraryManagedAttributes<T, React.ComponentPropsWithoutRef<T>>, keyof OverrideProps>;
type PolymorphicType<T extends React.ElementType, Props = object> = InheritedProps<T, { el?: T | (React.ElementType & {}) } & Props>;
type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>["ref"];

type PaginationControlProps<T extends React.ElementType> = PolymorphicType<T> & StylesNames<__Selector>;

export const PaginationControl = React.forwardRef(function PaginationControl<T extends React.ElementType>(
  _props: PaginationControlProps<T> & {
    color?: React.CSSProperties["color"];
    active?: boolean;
    withPadding?: boolean;
  },
  ref: PolymorphicRef<T>
) {
  const { unstyled, classNames, className, style, styles, active, disabled, el, withPadding = true, ...props } = _props;
  const ctx = usePaginationCtx();
  const _disabled = disabled || ctx.disabled;
  const Component = (el || "button") as React.ElementType;

  return (
    <Component
      {...{
        ref,
        "data-active": active ? "true" : undefined,
        "data-padding": withPadding ? "true" : undefined,
        disabled: _disabled,
        ...ctx.getStyles("control", { unstyled, className, style, classNames, styles, active }),
        ...props
      }}
    />
  );
});
PaginationControl.displayName = "Pagination/PaginationControl";

type EdgeProps = {
  icon: React.FC<PaginationIconProps>;
  action: "onNext" | "onPrevious" | "onFirst" | "onLast";
  type: "next" | "previous";
};

const Edge = React.forwardRef(function Edge<T extends React.ElementType>(_props: PaginationControlProps<T>, ref: PolymorphicRef<T>) {
  const { icon: Icon, action, type, onClick, title, ...props } = _props as PaginationControlProps<T> & EdgeProps;
  const ctx = usePaginationCtx();
  const disabled = type === "next" ? ctx.active === ctx.total : ctx.active === 1;
  return (
    <PaginationControl {...{ ref, title: title || action.replace("on", ""), disabled: ctx.disabled || disabled, onClick: onClick || ctx[action], withPadding: false, ...props }}>
      <Icon />
    </PaginationControl>
  );
}) as React.ForwardRefExoticComponent<EdgeProps & PaginationControlProps<React.ElementType> & React.RefAttributes<React.ElementType>>;
Edge.displayName = "Pagination/Edge";

export type PaginationIconProps = React.ComponentPropsWithoutRef<"svg">;
export type PaginationIcon = React.FC<PaginationIconProps>;

function PaginationIcon(_props: PaginationIconProps) {
  return (
    <svg
      {...{
        ..._props,
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }}
    />
  );
}

export const PaginationFirstIcon = (props: PaginationIconProps) => (
  <PaginationIcon {...props}>
    <path d="m11 17-5-5 5-5" />
    <path d="m18 17-5-5 5-5" />
  </PaginationIcon>
);

export const PaginationNextIcon = (props: PaginationIconProps) => (
  <PaginationIcon {...props}>
    <path d="m9 18 6-6-6-6" />
  </PaginationIcon>
);

export const PaginationPreviousIcon = (props: PaginationIconProps) => (
  <PaginationIcon {...props}>
    <path d="m15 18-6-6 6-6" />
  </PaginationIcon>
);

export const PaginationLastIcon = (props: PaginationIconProps) => (
  <PaginationIcon {...props}>
    <path d="m6 17 5-5-5-5" />
    <path d="m13 17 5-5-5-5" />
  </PaginationIcon>
);

export const PaginationDotsIcon = (props: PaginationIconProps) => (
  <PaginationIcon {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </PaginationIcon>
);

export interface PaginationItemsProps {
  dotsIcon?: PaginationIcon;
}

export const PaginationItems = React.forwardRef(function PaginationItems<T extends React.ElementType>(_props: PaginationActions<T>, ref: PolymorphicRef<T>) {
  const { dotsIcon = PaginationDotsIcon, el, ...props } = _props;
  const ctx = usePaginationCtx();

  const items = ctx.range.map((page, index) => {
    if (page === "dots") {
      return <PaginationDots key={index} icon={dotsIcon} />;
    }
    return (
      <PaginationControl
        key={index}
        {...{
          ref,
          el,
          active: page === ctx.active,
          "aria-current": page === ctx.active ? "page" : undefined,
          onClick: () => ctx.onChange?.(page),
          disabled: ctx.disabled,
          ...ctx.getItemProps?.(page),
          ...props
        }}
      >
        {page}
      </PaginationControl>
    );
  });

  return <>{items}</>;
});
PaginationItems.displayName = "Pagination/PaginationItems";

type PaginationActions<T extends React.ElementType> = PaginationControlProps<T> & {
  icon?: React.FC<PaginationIconProps>;
};

type EdgeElement = <T extends React.ElementType = "div">(_props: PaginationActions<T> & { ref?: PolymorphicRef<T> }) => React.ReactElement;

export const PaginationFirst = React.forwardRef(function PaginationFirst<T extends React.ElementType>(_props: PaginationActions<T>, ref: PolymorphicRef<T>) {
  const { icon = PaginationFirstIcon, ...props } = _props;
  return <Edge {...{ ref, icon, type: "previous", action: "onFirst", name: "PaginationFirst", ...props }} />;
}) as EdgeElement;

export const PaginationPrevious = React.forwardRef(function PaginationPrevious<T extends React.ElementType>(_props: PaginationActions<T>, ref: PolymorphicRef<T>) {
  const { icon = PaginationPreviousIcon, ...props } = _props;
  return <Edge {...{ ref, icon, type: "previous", action: "onPrevious", name: "PaginationPrevious", ...props }} />;
}) as EdgeElement;

export const PaginationNext = React.forwardRef(function PaginationNext<T extends React.ElementType>(_props: PaginationActions<T>, ref: PolymorphicRef<T>) {
  const { icon = PaginationNextIcon, ...props } = _props;
  return <Edge {...{ ref, icon, type: "next", action: "onNext", name: "PaginationNext", ...props }} />;
}) as EdgeElement;

export const PaginationLast = React.forwardRef(function PaginationLast<T extends React.ElementType>(_props: PaginationActions<T>, ref: PolymorphicRef<T>) {
  const { icon = PaginationLastIcon, el, ...props } = _props;
  return <Edge {...{ ref, el, icon, type: "next", action: "onLast", name: "PaginationLast", ...props }} />;
}) as EdgeElement;

const PaginationDots = React.forwardRef<HTMLDivElement, PaginationActions<"div">>(function PaginationDots(_props, ref) {
  const { classNames, className, style, styles, icon: Icon, ...props } = _props;
  const ctx = usePaginationCtx();
  return <div {...{ ref, ...ctx.getStyles("dots", { className, style, styles, classNames }), ...props }}>{Icon && <Icon />}</div>;
});

type EventHandler<Event> = ((event?: Event) => void) | undefined;
export function createEventHandler<Event>(parentEventHandler: EventHandler<Event>, eventHandler: EventHandler<Event>) {
  return (event?: Event) => {
    parentEventHandler?.(event);
    eventHandler?.(event);
  };
}

// Export as a composite component
type PaginationComponent = React.ForwardRefExoticComponent<PaginationProps> & {
  Root: typeof Pagination;
  First: typeof PaginationFirst;
  Previous: typeof PaginationPrevious;
  Items: typeof PaginationItems;
  Next: typeof PaginationNext;
  Last: typeof PaginationLast;
};
// Attach sub-components
Pagination.Root = Pagination;
Pagination.First = PaginationFirst;
Pagination.Previous = PaginationPrevious;
Pagination.Items = PaginationItems;
Pagination.Next = PaginationNext;
Pagination.Last = PaginationLast;
