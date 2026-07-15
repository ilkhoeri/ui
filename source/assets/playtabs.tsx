"use client";
import * as React from "react";
import { Tabs } from "@/ui/tabs";
import { cvx, cvxVariants } from "xuxi";
import { cn } from "@/utils/cn";
import { Button } from "@/ui/button";
import { nextValue } from "../utils";
import { FloatingIndicator } from "@/ui/floating-indicator";
import { capitalizeWords } from "@/source/ondevelopment/utils";

enum _PlayDisplay {
  Code = "code",
  Raw = "raw",
  Css = "css",
  Edit = "edit",
  Preview = "preview",
  Usage = "usage",
  Tailwind = "tailwind",
  Html = "html",
  Ts = "ts",
  Tsx = "tsx",
  Scss = "scss",
  Bash = "bash",
  Json = "json"
}

enum Expands {
  expand = "expand",
  "expand-full" = "expand-full",
  collapse = "collapse"
}
type _PlayOrigin = "tablist" | "content" | "expand";

type RecordNested<U extends string, T extends string, P = Record<string, unknown>> = {
  [K in U]?: Partial<Record<T, P>>;
};

const classes = cvx({
  variants: {
    card: {
      default: "mt-4 overflow-hidden relative rounded-2xl border shadow-sm min-h-[62px] bg-background",
      resize: "mt-4 overflow-hidden relative rounded-2xl border shadow-sm bg-primitive transition-all"
    },
    statecard: {
      expand: "h-[20rem] max-h-[20rem] text-muted-foreground before:content-[''] before:absolute before:bottom-0 before:inset-x-0 before:w-full before:h-[calc(100%-48px)] before:bg-gradient-to-t before:from-primitive/85 before:z-4",
      "expand-full": "h-max min-h-max max-h-[32rem] [&_[data-code-fragment]]:overflow-auto [&_[data-code-fragment]]:max-h-[calc(32rem-3rem)]",
      collapse: "h-max max-h-max [&_[data-code-fragment]]:pb-[2.5rem] [&_[data-code-fragment]]:overflow-auto [&_[data-code-fragment]]:max-h-max",
      undefined: ""
    },
    button: {
      resizer: "absolute bottom-4 inset-x-[calc(50%-3rem)] z-9 py-1.5 px-3 min-w-26 w-max transition-[bottom,color,opacity]",
      tabs: "h-9 font-semibold rounded-none data-[state=active]:[box-shadow:0_2px_0_0_hsl(var(--color))] [&_svg]:sizer [--sz:20px] select-none"
    }
  }
});

const EXPAND_VALUES: `${Expands}`[] = Object.values(Expands);

export function useExpand(options: { defaultExpanded?: `${Expands}` } = {}) {
  const { defaultExpanded = "expand" } = options;
  const [expand, setExpand] = React.useState<`${Expands}`>(defaultExpanded);

  const Resizer = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>((_props, ref) => {
    const { className, variant = "outline", ...props } = _props;
    return (
      <Button
        {...{
          ref,
          variant,
          "data-expand": expand,
          className: cn(classes({ button: "resizer" }), "[@media(hover:hover)]:hover:bg-background-box", className),
          onClick: e => {
            setExpand(nextValue(expand, EXPAND_VALUES));
            props?.onClick?.(e);
          },
          ...props,
          suppressHydrationWarning: true
        }}
      >
        {capitalizeWords(expand)}
      </Button>
    );
  });
  return { expand, setExpand, Resizer, classes };
}

export interface PlayTabsProps extends RecordNested<"childrens", _PlayDisplay, React.ReactNode> {
  defaultExpanded?: NonNullable<cvxVariants<typeof classes>["statecard"]>;
  defaultValue?: `${_PlayDisplay}`;
  classNames?: Partial<Record<_PlayOrigin, string>>;
}
export function PlayTabs(_Play: PlayTabsProps) {
  const { childrens, defaultExpanded = "expand", defaultValue = "code", classNames } = _Play;
  const isExpand = defaultExpanded !== undefined;
  const use = useExpand({ defaultExpanded: isExpand ? defaultExpanded : undefined });
  const [parentRef, setParentRef] = React.useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = React.useState<Record<string, HTMLButtonElement | null>>({});
  const [active, setActive] = React.useState<string>(defaultValue);
  const [hover, setHover] = React.useState<string | null>(null);

  const setControlRef = (key: string) => (node: HTMLButtonElement) => {
    controlsRefs[key] = node;
    setControlsRefs(controlsRefs);
  };
  const tabs = Object.values(_PlayDisplay);
  const omitTab = (key: _PlayDisplay) => key === "edit" || key === "preview";

  if (!childrens) return null;

  const tabTab = (key: string) => ({
    unstyled: true,
    ref: setControlRef(key),
    onClick: () => setActive(key),
    onMouseEnter: () => setHover(key),
    onMouseLeave: () => setHover(null),
    className: "relative flex items-center justify-center select-none whitespace-nowrap py-2 px-4 text-sm leading-none z-1 text-muted-foreground aria-selected:text-color"
  });

  return (
    <>
      <Tabs.List ref={setParentRef} className={cn("[--content:none]", classNames?.tablist)}>
        {tabs.map(
          key =>
            childrens[key] && (
              <Tabs.Tab key={key} value={key} title={key} {...tabTab(key)}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Tabs.Tab>
            )
        )}
        <FloatingIndicator
          target={controlsRefs[hover ?? active]}
          parent={parentRef}
          transitionDuration={450}
          className="rounded-lg shadow-md bg-primitive [transition:transform,box-shadow_.12s,background-color_.12s] [box-shadow:inset_0_-0.05em_0.5em_hsl(var(--muted-foreground)/0.08),inset_0_0.05em_#f1f7feb5,inset_0_0.25em_0.5em_hsl(var(--muted-foreground)/0.17),inset_0_-0.1em_hsl(var(--background)/0.9),0_0_0_0.075em_hsl(var(--muted-foreground)/0.25),0_0.08em_0.17em_hsl(var(--background)/0.95)]"
        />
      </Tabs.List>

      {tabs.map(
        key =>
          childrens[key] && (
            <Tabs.Panel
              key={key}
              value={key}
              className={cn(
                classes({
                  card: "default",
                  ...(!omitTab(key) ? { statecard: isExpand ? use.expand : undefined, card: "resize" } : {})
                }),
                classNames?.content
              )}
            >
              {childrens[key]}
              {isExpand && !omitTab(key) && <use.Resizer className={classNames?.expand} />}
            </Tabs.Panel>
          )
      )}
    </>
  );
}
