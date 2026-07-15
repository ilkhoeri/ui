import * as React from "react";
import { cvx, type cvxVariants } from "xuxi";
import { cn } from "@/utils/cn";

const classRoot = "block max-w-full font-mono text-xs text-color focus-visible:ring-muted overflow-visible leading-normal whitespace-pre overflow-x-auto [word-wrap:normal] [word-break:normal]";

const classes = cvx({
  variants: {
    selector: {
      pre: classRoot,
      code: classRoot,
      samp: "[overflow-wrap:anywhere]"
    },
    block: {
      true: "py-1 px-2 rounded-md w-max whitespace-pre-wrap",
      false: "border border-solid border-[#d1d8e0] dark:border-[#22242b] p-4 rounded-lg"
    },
    quote: {
      true: "relative isolate my-6 flex flex-row items-center rounded-lg bg-[#edeff2] dark:bg-[#121316] py-6 pl-12 pr-4 [unicode-bidi:isolate] before:absolute before:left-6 before:z-[10] before:h-4/5 before:w-1 before:bg-[#bbbcbe] dark:before:bg-[#202425] before:content-['']",
      false: "m-0 bg-[#edeff2] dark:bg-[#121316]"
    },
    label: {
      true: "relative isolate mt-8 [unicode-bidi:isolate] before:absolute before:-top-6 before:left-0 before:z-[10] before:text-muted-foreground before:content-[attr(data-label)]",
      false: ""
    }
  }
});

type __CodeSelector = NonNullable<cvxVariants<typeof classes>["selector"]>;
type Options = StylesNames<__CodeSelector> & __CodeProps & {};
type CSSProperties = React.CSSProperties & { [key: string]: any };
type NestedRecord<U extends [string, unknown], T extends string> = {
  [K in U as K[0]]?: Partial<Record<T, K[1]>>;
};
type Styles = ["unstyled", boolean] | ["classNames", string] | ["styles", CSSProperties];
type StylesNames<T extends string, Exclude extends string = never> = Omit<NestedRecord<Styles, T> & { className?: string; style?: CSSProperties }, Exclude>;

function getStyles(selector: __CodeSelector, options: Options = {}) {
  const { dir, block, quote, unstyled, className, classNames, style, styles, color, bg, code, samp, label } = options;
  const switchRoot = code && samp;

  const switchClass = [classes({ block: block }), classes({ quote: quote }), classes({ label: !!label })];
  return {
    dir: dir,
    className: cn(!unstyled?.[selector] && classes({ selector }), selector === "pre" && switchRoot && [switchClass, "grid grid-flow-row space-y-4"], selector === "code" && !switchRoot && !unstyled?.code && [switchClass, { "[&>samp]:whitespace-normal": block }], classNames?.[selector], className),
    style: {
      "--bg": selector === "code" && bg,
      "--color": selector === "code" && color,
      ...styles?.[selector],
      ...style
    }
  };
}

interface __CodeProps {
  code?: string;
  samp?: any;
  label?: string;
  block?: boolean;
  quote?: boolean;
  dir?: "ltr" | "rtl" | (string & {});
  bg?: React.CSSProperties["color"];
  color?: React.CSSProperties["color"];
}
export interface CodeProps extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>, "ref" | "color" | "style" | "dir">, StylesNames<__CodeSelector>, __CodeProps {
  children?: string;
}
export const Code = React.forwardRef<HTMLPreElement, CodeProps>(function Code(_props, ref) {
  const { code, samp, unstyled, className, classNames, style, styles, block, color, bg, children, quote, dir = "ltr", label, ...props } = _props;
  const Component = block || (code && samp) ? "pre" : "code";
  const rest = { dir, unstyled, classNames, styles, label, code, samp, block, quote };
  const content = (
    <>
      {code && samp ? <code {...getStyles("code", rest)}>{code}</code> : code}
      {samp && <samp {...getStyles("samp", rest)}>{typeJSON(samp[0])}</samp>}
    </>
  );
  return (
    <Component ref={ref} data-label={label || undefined} {...{ ...getStyles(Component, { className, style, color, bg, ...rest }), ...props }}>
      {children || content}
    </Component>
  );
});

// Function to convert type to JSON-like string
export function typeJSON<T extends object>(example: T): string {
  const typeRepresentation = JSON.stringify(
    Object.keys(example).reduce(
      (acc, key) => {
        // @ts-ignore
        acc[key] = typeof (example as T)[key];
        return acc;
      },
      {} as Record<string, string>
    ),
    null,
    2
  );

  return typeRepresentation;
}
