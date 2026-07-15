"use client";
import * as React from "react";
import { Svg, SvgProps } from "@/ui/svg";
import { CodeLanguage } from "./types";
import { ComponentProps, CSSProperties } from "../types/component";
import { UnstyledButton } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { Tooltip } from "@/ui/tooltip";
import { useUncontrolled } from "@/hooks/use-uncontrolled";
import { cvx, ocx, rem, type cvxVariants } from "xuxi";
import { cn } from "@/utils/cn";
import { CopyButton } from "@/ui/copy-button";
import { CheckIcon, CopyIcon } from "@/icons/*";
import { useShiki } from "./shiki-context";

export const classes = cvx({
  variants: {
    selector: {
      // [&:where([data-collapsed]):global([data-radix-scroll-area-viewport]>div)]:!block
      root: "relative mt-0 bg-primitive",
      code: "inline-block rounded-[.125rem] p-[var(--code-p,.0625rem_.1875rem)] font-mono [font-size:var(--code-fz,.8125rem)] leading-[--code-line-height,1.55]",
      codeWrapper: "relative max-h-[--ch-max-collapsed-height] overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-[38] before:rounded-[calc(.5rem-.0625rem)] before:bg-gradient-to-t before:from-primitive/85 before:content-[''] data-[expanded]:max-h-none data-[expanded]:before:hidden",
      showCodeButton:
        "absolute bottom-2 left-1/2 z-[40] inline-flex h-8 w-max min-w-26 -translate-x-1/2 cursor-pointer appearance-none items-center justify-center rounded-md border bg-background px-3 py-1.5 text-center text-[clamp(0.75rem,0.65rem+0.65vw,0.9rem)] font-medium leading-tight text-muted-foreground transition-[bottom,color,opacity] duration-75 [-moz-appearance:none] [-webkit-appearance:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-foreground/35 focus-visible:ring-offset-1 focus-visible:ring-offset-background active:scale-[.985] disabled:pointer-events-none disabled:gap-2 disabled:opacity-50 aria-hidden:hidden data-[hidden]:hidden [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-background-box hover:text-color",
      pre: "m-0 block leading-[0] p-[var(--pre-p,.625rem_1rem)] [--code-line-height:--code-leading,1.7]",
      header: "flex items-start justify-between",
      file: "m-0 flex cursor-pointer items-center justify-center gap-[.4375rem] whitespace-nowrap border border-l-0 border-t-0 border-solid px-[.75rem] py-[.4375rem] font-geist-mono text-xs font-bold leading-none text-muted-foreground opacity-80 only:cursor-default last-of-type:rounded-br-[.25rem] hover:opacity-100 data-[active]:bg-background-theme data-[active]:text-color data-[active]:opacity-100",
      files: "flex",
      fileIcon: "flex shrink-0 grow-0 items-center justify-center [&>svg]:block",
      controls: "mr-[0rem] mt-[0rem] flex items-center flex-row",
      control: "size-8 m-0 bg-transparent text-muted-foreground opacity-80 hover:text-color hover:opacity-100",
      copy: "absolute right-[.3125rem] top-[.3125rem] z-1 size-8 m-0 bg-transparent text-muted-foreground opacity-80 hover:text-color hover:opacity-100"
    }
  }
});
type __Selector = NonNullable<cvxVariants<typeof classes>["selector"]>;
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
type Options = __CodeHighlightTabsProps & {};

function state<K, T>(x: K, y: T) {
  return (x as K) ? (y as T) : undefined;
}
function is<K>(x: K) {
  return state(x as K, "true");
}
export function getStyles(selector: __Selector, opt: Options = {}) {
  const isRoot = selector === "root";
  const isUnstyled = typeof opt?.unstyled === "object" ? opt?.unstyled?.[selector] : opt?.unstyled;
  return {
    className: cn(!isUnstyled && classes({ selector }), opt?.classNames?.[selector], opt?.className),
    style: ocx(opt?.styles?.[selector], opt?.style, isRoot && { "--ch-max-collapsed-height": rem(opt?.maxCollapsedHeight) })
  };
}

export interface CodeHighlightTabsCode {
  language?: CodeLanguage;
  code: string;
  fileName?: string;
  icon?: React.ReactNode;
}
export interface __CodeHighlightTabsProps extends StylesNames<__Selector> {
  defaultActiveTab?: number;
  activeTab?: number;
  onTabChange?: (tab: number) => void;
  withHeader?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  getFileIcon?: (fileName: string) => React.ReactNode;
  maxCollapsedHeight?: React.CSSProperties["maxHeight"];
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  expandCodeLabel?: string;
  collapseCodeLabel?: string;
  withExpandButton?: boolean;
}

export interface CodeHighlightTabsProps extends __CodeHighlightTabsProps, ComponentProps<"div"> {
  code: CodeHighlightTabsCode | CodeHighlightTabsCode[];
  tooltipSide?: React.ComponentProps<typeof Tooltip>["side"];
}

export const CodeHighlightTabs = React.forwardRef<HTMLDivElement, CodeHighlightTabsProps>((_props, ref) => {
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    children,
    code,
    defaultActiveTab,
    activeTab,
    onTabChange,
    getFileIcon,
    expanded,
    defaultExpanded,
    onExpandedChange,
    withExpandButton,
    withHeader = true,
    tooltipSide = "left",
    copyLabel = "Copy code",
    copiedLabel = "Copied",
    maxCollapsedHeight = rem("8rem"),
    expandCodeLabel = "Expand code",
    collapseCodeLabel = "Collapse code",
    ...props
  } = _props;

  const [value, setValue] = useUncontrolled({
    defaultValue: defaultActiveTab,
    value: activeTab,
    finalValue: 0,
    onChange: onTabChange
  });

  const [_expanded, setExpanded] = useUncontrolled({
    defaultValue: defaultExpanded,
    value: expanded,
    finalValue: true,
    onChange: onExpandedChange
  });

  const nodes = Array.isArray(code) ? code : [code];
  const currentCode = nodes[value];

  const ctx = useShiki();

  const highlighted = ctx?.shiki(currentCode.code, currentCode.language || "tsx");

  const language = currentCode.language || "tsx";

  const stylesApi = { classNames, styles, unstyled, maxCollapsedHeight };

  const files = nodes.map((node, index) => (
    <UnstyledButton {...getStyles("file", stylesApi)} key={node.fileName} data-active={is(index === value)} onClick={() => setValue(index)}>
      <FileIcon fileIcon={node.icon} getFileIcon={getFileIcon} fileName={node.fileName} key="file-icon" {...getStyles("fileIcon", stylesApi)} />
      <span key="file-name">{node.fileName}</span>
    </UnstyledButton>
  ));

  return (
    <div ref={ref} dir="ltr" data-collapsed={is(!_expanded)} {...getStyles("root", { className, style, ...stylesApi })} {...props}>
      {withHeader && (
        <div {...getStyles("header", stylesApi)}>
          <ScrollArea type="never" dir="ltr" orientation="horizontal">
            <div {...getStyles("files", stylesApi)}>{files}</div>
          </ScrollArea>
          <div {...getStyles("controls", stylesApi)}>
            {withExpandButton && (
              <Tooltip side={tooltipSide} content={_expanded ? collapseCodeLabel : expandCodeLabel} classNames={{ content: "text-sm" }} onClick={() => setExpanded(!_expanded)} aria-label={_expanded ? collapseCodeLabel : expandCodeLabel} {...getStyles("control", stylesApi)}>
                <ExpandIcon expanded={_expanded} />
              </Tooltip>
            )}

            <CopyButton value={currentCode.code.trim()}>
              {({ copied, copy }) => (
                <Tooltip side={tooltipSide} onClick={copy} content={copied ? copiedLabel : copyLabel} aria-label={copied ? copiedLabel : copyLabel} classNames={{ content: "text-sm" }} {...getStyles("control", { className: "max-md:flex", ...stylesApi })}>
                  <HasCopyIcon has={copied} />
                </Tooltip>
              )}
            </CopyButton>
          </div>
        </div>
      )}

      <ScrollArea
        dir="ltr"
        orientation="horizontal"
        {...getStyles("codeWrapper", stylesApi)}
        data-expanded={is(_expanded)}
        styles={{ viewport: state(!_expanded, { overflowX: "hidden" }), scrollbar: state(!_expanded, { display: "none" }) }}
        dangerouslySetInnerHTML={highlighted.highlighted ? { __html: highlighted.code } : undefined}
      >
        {!highlighted.highlighted ? (
          <pre {...getStyles("pre", stylesApi)}>
            <code data-unstyled data-language={language} {...getStyles("code", stylesApi)}>
              {highlighted.code}
            </code>
          </pre>
        ) : null}
      </ScrollArea>
      <UnstyledButton {...getStyles("showCodeButton", stylesApi)} data-hidden={is(!_expanded)} aria-hidden={is(!_expanded)} onClick={() => setExpanded(!_expanded)}>
        {_expanded ? collapseCodeLabel : expandCodeLabel}
      </UnstyledButton>
    </div>
  );
});
CodeHighlightTabs.displayName = "CodeHighlightTabs";

interface CopyIconProps extends SvgProps {
  has: boolean;
}
export function HasCopyIcon({ has, ...props }: CopyIconProps) {
  return has ? <CheckIcon className="animate-fade-in fade-in-0 zoom-in-0 [animation-duration:150ms]" {...props} /> : <CopyIcon {...props} />;
}

interface ExpandIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  expanded: boolean;
}
export function ExpandIcon({ expanded, style, ...props }: ExpandIconProps) {
  return (
    <Svg style={{ width: rem(18), height: rem(18), ...style }} {...props}>
      {expanded ? (
        <>
          <path d="M12 13v-8l-3 3m6 0l-3 -3" />
          <path d="M9 17l1 0" />
          <path d="M14 17l1 0" />
          <path d="M19 17l1 0" />
          <path d="M4 17l1 0" />
        </>
      ) : (
        <>
          <path d="M12 11v8l3 -3m-6 0l3 3" />
          <path d="M9 7l1 0" />
          <path d="M14 7l1 0" />
          <path d="M19 7l1 0" />
          <path d="M4 7l1 0" />
        </>
      )}
    </Svg>
  );
}

interface FileIconProps {
  fileName: string | undefined;
  getFileIcon?: ((fileName: string) => React.ReactNode) | undefined;
  fileIcon: React.ReactNode | undefined;
  className?: string;
  style?: React.CSSProperties;
}
export function FileIcon({ fileIcon, fileName, getFileIcon, className, style }: FileIconProps) {
  if (fileIcon) return <span {...{ className, style }}>{fileIcon}</span>;
  if (getFileIcon && fileName) return <span {...{ className, style }}>{getFileIcon(fileName)}</span>;
  return null;
}
