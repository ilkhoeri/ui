"use client";
import React from "react";
import Link from "next/link";
import { useNavContext } from "../hooks/use-nav";
import { CommandDialog } from "./command-dialog";
import { appRoutes } from "@/source/routes";
import { NavLinkItem } from "@/source/assets/navlink";
import { cn } from "@/utils/cn";
import { Polymorphic } from "@/ui/polymorphic-slot";
import { FloatingIndicator } from "@/ui/floating-indicator";
import { BrandOeriIcon, CircleArrowIcon, TextDirectionIcon } from "@/icons/*";
import { useApp } from "@/modules/web/configuration/app-context";
import { Burger } from "@/ui/burger";
import { Button } from "@/ui/button";
import { Sheets } from "@/ui/sheets";
import { metaDocsRoute, type MetaDocsRoute, type NestedMetaDocsRoute } from "@/routes";

import globalStyle from "../styles/styles";
import { siteConfig } from "@/site/config";
import { usePathname } from "next/navigation";

interface HeadnavProps {
  routes?: (MetaDocsRoute | NestedMetaDocsRoute)[] | null;
}

export function Headnav({ routes = metaDocsRoute }: HeadnavProps) {
  const { toggleDirection, dir } = useApp();
  const { minQuery, toggle, pathname, open, setOpen } = useNavContext();

  const [parentRef, setParentRef] = React.useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = React.useState<Record<string, HTMLAnchorElement | null>>({});
  const [active, setActive] = React.useState<string>(`/${pathname.split("/").filter(Boolean)[0] || "docs"}`);
  const [hover, setHover] = React.useState<string | null>(null);

  const setControlRef = (key: string) => (node: HTMLAnchorElement) => {
    controlsRefs[key] = node;
    setControlsRefs(controlsRefs);
  };
  const isActive = (key: string) => (active === key ? "true" : undefined);

  const excludesPath = pathname.split("/").filter(Boolean).includes("examples");

  return (
    <header
      dir={dir}
      className={cn("fixed inset-x-0 top-0 z-[--z,88] mr-[--has-scrollbar] flex h-[--navbar] w-[calc(100%-var(--has-scrollbar,0px))] max-w-var items-center justify-between border-0 border-b-[0.04rem] border-b-muted/75 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-5 xl:px-6")}
    >
      <Polymorphic dir={dir} className="relative mx-auto flex w-full max-w-screen-3xl items-center 3xl:px-12">
        <LinkHome open={open} className="[transition:all_0.5s_ease] max-md:data-[state=open]:translate-x-[-32px] max-md:data-[state=open]:opacity-0" />

        {minQuery && (
          <div dir={dir} ref={setParentRef} className="relative hidden h-full items-center justify-between rounded-md text-sm font-medium md:flex ltr:ml-10 ltr:mr-auto rtl:ml-auto rtl:mr-10">
            {appRoutes["services"].map(i => (
              <Link key={i.href} ref={setControlRef(i.href)} href={i.href} role="button" onClick={() => setActive(i.href)} data-active={isActive(i.href)} className="h-6 cursor-pointer select-none rounded-sm text-muted-foreground transition-colors centered hover:text-color data-[active]:text-color">
                <span className="relative z-1 px-2 py-1" onMouseEnter={() => setHover(i.href)} onMouseLeave={() => setHover(null)}>
                  {i.title}
                </span>
              </Link>
            ))}
            <FloatingIndicator target={controlsRefs[hover ?? active]} parent={parentRef} transitionDuration={450} className="rounded-lg border bg-background/15 shadow-md" />
          </div>
        )}

        <div dir={dir} className={globalStyle({ toggle: "group" }, { "max-md:pr-2 rtl:max-md:pr-0 rtl:max-md:pl-2": excludesPath }, "ltr:ml-auto rtl:mr-auto gap-1.5")}>
          <CommandDialog routes={routes} />
          <div className="grid grid-flow-col gap-0.5">
            <LinksSection />
            <Button size="icon" variant="outline" onClick={toggleDirection} className="border-background bg-color text-background transition-colors max-md:hidden [&_svg]:transition-colors">
              <TextDirectionIcon dir={dir} size={20} stroke={2} />
            </Button>
          </div>
        </div>

        <ButtonAside {...{ open, onOpenChange: setOpen, onClick: toggle }} hidden={minQuery || excludesPath} className="max-md:mx-2 max-md:data-[state=open]:translate-x-[212px] max-md:data-[state=open]:opacity-0 ltr:[--x:calc(212px)] rtl:[--x:calc(212px*-1)]" />
      </Polymorphic>
    </header>
  );
}

function LinksSection() {
  return appRoutes["sections"].map((i, __i) => (
    <NavLinkItem
      key={__i}
      icon={i.icon}
      target="_blank"
      aria-label={i.label}
      href={i.href}
      iconProps={{
        currentFill: i.label.includes("Collective") ? "fill-stroke" : "fill",
        fill: "white",
        stroke: "white",
        size: 20
      }}
      className={globalStyle({ toggle: "item", size: "icon-xs" }, "bg-[--color] border border-background focus-visible:ring-[--color] [&_svg]:hover:text-white hover:bg-[--color] [@media(hover:hover)]:hover:bg-[--color] max-md:hidden max-md:last-of-type:flex")}
      style={{
        "--color": i.color
      }}
    />
  ));
}

export function LinkHomeX({ open, className }: { open?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="oeri" data-state={open ? "open" : "closed"} className={cn("gap-2 rounded-lg px-2 py-1 font-geist-mono text-lg font-medium leading-none", className)}>
      <BrandOeriIcon size={30} />
      <span>oeri</span>
    </Link>
  );
}

export function LinkHome({ className }: { open?: boolean; className?: string }) {
  const { dir } = useApp();
  const [open, setOpen] = React.useState(false);
  const currentUrl = usePathname();
  const lastUrl = React.useRef<typeof currentUrl>(currentUrl);

  React.useEffect(() => {
    const cleanup = setTimeout(() => {
      if (lastUrl.current !== currentUrl) {
        setOpen(false);
        lastUrl.current = currentUrl;
      }
    }, 100);
    return () => clearTimeout(cleanup);
  }, [lastUrl.current, currentUrl, setOpen]);

  return (
    <Sheets.Dropdown align={dir === "rtl" ? "end" : "start"} sideOffset={0} open={open} onOpenChange={setOpen} clickOutsideToClose modal>
      <Sheets.Trigger unstyled openChangeOnContextMenu>
        <Link href="/" aria-label="oeri" className={cn("gap-1 rounded-lg px-2 py-1 text-[22px] leading-none duration-75 hover:text-constructive-foreground", className)}>
          <BrandOeriIcon size={28} />
          <span className="font-ubuntu font-semibold tracking-wide">{siteConfig.name}</span>
        </Link>
      </Sheets.Trigger>
      <Sheets.Content className="z-99 w-44 min-w-[12.5rem] rounded-xl border-constructive bg-background-theme p-2 shadow-[0_10px_32px_rgba(34,42,53,0.15),0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.08),0_1px_1px_rgba(34,42,53,0.1),0_24px_68px_rgba(47,48,55,0.1)] ring-1 ring-constructive/5">
        <Link className="block w-full gap-2 rounded-sm p-2 text-sm/5 outline-none transition-colors duration-75 hover:bg-constructive-emphasis/5" role="menuitem" tabIndex={-1} data-orientation="vertical" href="/branding">
          <div className="flex w-full items-center gap-x-1 border-b border-dashed border-b-color pb-2">
            <BrandOeriIcon size={20} />
            <span className="font-medium">Branding assets</span>
          </div>
          <span className="mt-2 inline-flex items-center gap-2 text-left text-xs text-color rtl:text-right">
            View {siteConfig.name} Logos
            <CircleArrowIcon />
          </span>
        </Link>
      </Sheets.Content>
    </Sheets.Dropdown>
  );
}

export function ButtonAside(_props: React.ComponentProps<typeof Burger>) {
  const { hidden, className, ...props } = _props;
  if (hidden) return null;
  return (
    <Burger
      {...{
        ...props,
        className: cn("relative z-10 scale-100 opacity-100 md:sr-only md:hidden lg:scale-0 lg:opacity-0", className)
      }}
    />
  );
}
