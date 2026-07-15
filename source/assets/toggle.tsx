"use client";

import * as React from "react";
import { Anchor } from "@/ui/anchor";
import { tocopy } from "../utils";
import { cn } from "@/utils/cn";
import { useClipboard } from "@/hooks/use-clipboard";
import { useWindowScroll } from "@/hooks/use-window-scroll";
import { UnstyledButton } from "@/ui/button";
import { Tooltip } from "@/ui/tooltip";
import { Svg } from "@/ui/svg";
import { BrandGithubFillIcon, CheckIcon, CopyIcon, ArrowDownloadIcon } from "@/icons/*";

import globalStyle from "../styles/styles";
import { GITREPO_DOCS_URL } from "@/site/config";

const SIZE_ICON: number | `${number}` = 18;

const sharedProp: React.ComponentProps<typeof Tooltip> = {
  side: "left",
  sideOffset: 6,
  suppressHydrationWarning: true,
  tabIndex: -1
};

export const GetCodeButton = React.forwardRef<
  React.ComponentRef<typeof Anchor>,
  Omit<React.ComponentPropsWithoutRef<typeof Anchor>, "href"> & {
    repo?: string & NonNullable<unknown>;
    href?: string & NonNullable<unknown>;
  }
>(function GetCodeButton({ className, href, repo, ...props }, ref) {
  if (!(repo || href)) return null;

  return (
    <Tooltip asChild {...sharedProp} content="Repository" contentProps={{ className: "min-w-[86px]" }}>
      <Anchor ref={ref} {...props} target="_blank" rel="noopener noreferrer nofollow" href={href || `${GITREPO_DOCS_URL}/${repo}`} tabIndex={-1} title="Get Code" className={globalStyle({ toggle: "item", size: "icon-xs" }, className)}>
        <BrandGithubFillIcon fill="currentColor" size={SIZE_ICON} />
      </Anchor>
    </Tooltip>
  );
});
GetCodeButton.displayName = "GetCodeButton";

export const CopyButton = React.forwardRef<
  React.ComponentRef<typeof UnstyledButton>,
  React.ComponentPropsWithoutRef<typeof UnstyledButton> & {
    value: string | null | undefined;
  }
>(({ value, className, ...props }, ref) => {
  const clipboard = useClipboard({ timeout: 1750 });

  return (
    <Tooltip
      ref={ref}
      {...props}
      onClick={() => {
        if (value) clipboard.copy(tocopy(value));
      }}
      disabled={!value}
      className={globalStyle({ toggle: "item", size: "icon-xs" }, clipboard.copied ? "bg-muted" : "bg-background", className)}
      contentProps={{ className: "min-w-[86px] py-1" }}
      content={value && !clipboard.copied ? "Copy code" : null}
      {...sharedProp}
    >
      {clipboard.copied ? <CheckIcon animation size={SIZE_ICON} className="animate-fade-in fade-in-0 zoom-in-0 [animation-duration:150ms]" /> : <CopyIcon size={SIZE_ICON} />}
    </Tooltip>
  );
});
CopyButton.displayName = "CopyButton";

export const DownloadButton = React.forwardRef<
  React.ComponentRef<typeof UnstyledButton>,
  React.ComponentPropsWithoutRef<typeof UnstyledButton> & {
    code: string;
    filename: string; // beserta ekstensi, misal: "Button.tsx"
  }
>(({ className, code, filename, ...props }, ref) => {
  const [onProcess, setOnProcess] = React.useState(false);

  const handleDownload = React.useCallback(() => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setOnProcess(true);
    setTimeout(() => setOnProcess(false), 2500);
  }, [code, filename]);

  return (
    <>
      <Tooltip ref={ref} {...props} onClick={handleDownload} disabled={!code} className={globalStyle({ toggle: "item", size: "icon-xs" }, "bg-background", className)} contentProps={{ className: "min-w-[86px] py-1" }} content={code && !onProcess ? "Download" : null} {...sharedProp}>
        <ArrowDownloadIcon animation size={SIZE_ICON + 2} />
      </Tooltip>
    </>
  );
});
DownloadButton.displayName = "DownloadButton";

export const ScrollToggle = React.forwardRef<React.ElementRef<typeof UnstyledButton>, React.ComponentPropsWithoutRef<typeof UnstyledButton>>(({ className, ...props }, ref) => {
  const { bottom, scrollWindow, mounted } = useWindowScroll();
  // const [hovered, setHovered] = React.useState(false);
  // const visible = hovered || isScroll;

  if (!mounted) {
    return null;
  }

  const label = bottom ? "Scroll to Top" : "Scroll to Bottom";
  return (
    <UnstyledButton
      ref={ref}
      {...props}
      tabIndex={-1}
      aria-label={label}
      title={label}
      onClick={scrollWindow}
      // onMouseEnter={() => setHovered(true)}
      // onMouseLeave={() => setHovered(false)}
      className={cn(
        "fixed bottom-4 right-4 z-[99] mr-[--scrollbar-space,var(--has-scrollbar)] flex size-8 cursor-pointer select-none items-center justify-center rounded-xl border border-muted-foreground/40 bg-background/40 p-0.5 capitalize text-muted-foreground/90 outline-0 backdrop-blur transition-none duration-0 disabled:pointer-events-none disabled:opacity-50 supports-[backdrop-filter]:bg-background/40 [&_svg]:size-full",
        "after:absolute after:left-0 after:h-8 after:w-12 after:content-['']",
        className
      )}
      // style={{
      //   width: visible ? "32px" : "8px",
      //   transform: visible ? "translateX(0)" : "translateX(12px)",
      //   transition: "transform 0.3s, width 0.3s",
      // }}
    >
      <Svg
        size={24}
        style={{
          transform: bottom ? "scaleY(-1)" : "scaleY(1)",
          transition: "transform 0.3s linear"
        }}
      >
        <path fill="currentColor" fillOpacity="0" strokeDasharray="20" strokeDashoffset="20" d="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5">
          <animate attributeName="d" begin="0.5s" dur="1.5s" repeatCount="indefinite" values="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5;M12 4h2v3h2.5l-4.5 4.5M12 4h-2v3h-2.5l4.5 4.5;M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5" />
          <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.15s" values="0;0.3" />
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0" />
        </path>
        <path strokeDasharray="14" strokeDashoffset="14" d="M6 19h12">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0" />
        </path>
      </Svg>
    </UnstyledButton>
  );
});
ScrollToggle.displayName = "ScrollToggle";
