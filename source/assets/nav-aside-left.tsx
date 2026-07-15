"use client";

import { cvx } from "xuxi";
import { cn } from "@/utils/cn";
import { isNotif } from ".notif";
import { Svg } from "@/ui/svg";
import { ScrollArea } from "@/ui/scroll-area";
import { ButtonAside, LinkHome } from "./nav-head";
import { NavLinkItem } from "@/source/assets/navlink";
import { useNavContext } from "@/source/hooks/use-nav";
import { Sheets, SheetsContent, SheetsTrigger } from "@/ui/sheets";
import { useApp } from "@/modules/web/configuration/app-context";

import type { FileDocMeta, MetaDocsRoute, NestedMetaDocsRoute } from "@/routes";

import style from "./aside.module.css";

interface AsideLeftProps {
  classNames?: { aside?: string; overlay?: string };
  routes?: (MetaDocsRoute | NestedMetaDocsRoute)[] | null;
}
export function AsideLeft(_props: AsideLeftProps) {
  const { classNames, routes = [] } = _props;
  const { minQuery, maxQuery: query, open, setOpen, toggle, pathname } = useNavContext();
  const { dir } = useApp();
  const isRoot = pathname === "/" || pathname.startsWith("/examples/");

  return (
    <>
      <aside data-controls="routes" data-routes={isRoot ? "root" : undefined} data-state={query ? (open ? "open" : "closed") : undefined} className={cn(classes({ style: "aside" }), "data-[routes=root]:md:sr-only data-[routes=root]:md:hidden", classNames?.aside)}>
        {query && (
          <hgroup className={classes({ style: "hgroup" })}>
            <LinkHome />
            <ButtonAside
              {...{
                open,
                onOpenChange: setOpen,
                hidden: minQuery,
                onClick: toggle,
                className: "mr-1.5 rtl:mr-0 rtl:ml-1.5"
              }}
            />
          </hgroup>
        )}

        <ScrollArea dir={dir} classNames={{ viewport: classes({ style: "nav" }), thumb: "max-md:sr-only" }}>
          <NavLinkItem
            href="/docs"
            title="Getting Started"
            className="z-9 flex w-full select-none flex-row flex-nowrap items-center justify-between rounded-sm py-1 text-sm font-medium text-muted-foreground focus-visible:ring-inset focus-visible:ring-offset-[-2px] data-[path=active]:text-constructive"
            onClick={() => {
              if (query) {
                setTimeout(() => {
                  setOpen(false);
                }, 500);
              }
            }}
          />

          <NavRoutes {...{ routes, setOpen, query }} />
        </ScrollArea>
      </aside>

      <Overlay open={!minQuery && open} setOpen={setOpen} className={classNames?.overlay} />
    </>
  );
}

function NavRoutes({ routes, query, setOpen }: { routes: (MetaDocsRoute | NestedMetaDocsRoute)[] | null; query?: boolean; setOpen: (v: boolean) => void }) {
  if (!routes) return null;

  function trigger(title: string) {
    return (
      <SheetsTrigger unstyled type="button" className={classes({ style: "trigger" })}>
        <span className="truncate">{title}</span>
        <Svg size={18} className="ml-auto transition-transform group-data-[state=closed]/t:rotate-90 rtl:ml-0 rtl:mr-auto">
          <path fill="none" stroke="currentColor" strokeDasharray="12" strokeDashoffset="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16l-7 -7M12 16l7 -7">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="12;0" />
          </path>
        </Svg>
      </SheetsTrigger>
    );
  }

  function linkItem(routes: FileDocMeta[]) {
    return routes?.map(route => (
      <NavLinkItem
        key={route.path}
        href={route.path}
        title={route.meta.title}
        isNew={isNotif(route.name).new()}
        isUpdated={isNotif(route.name).updated()}
        classNames={{
          link: style.link,
          mark: "absolute z-[2] mt-[-24px] right-1 left-auto rtl:right-auto rtl:left-1"
        }}
        onClick={() => {
          if (query) {
            setTimeout(() => {
              setOpen(false);
            }, 500);
          }
        }}
      />
    ));
  }

  return routes.map((route, index) => {
    if ((route as NestedMetaDocsRoute).data[0].data) {
      const nestedRoute = route as NestedMetaDocsRoute; // Handle NestedRoute
      return (
        <Sheets.Collapsible key={index} defaultOpen className={style.collapse}>
          {trigger(nestedRoute.group)}
          <SheetsContent unstyled className="z-[1] w-full">
            <NavRoutes routes={nestedRoute.data} {...{ query, setOpen }} />
          </SheetsContent>
        </Sheets.Collapsible>
      );
    } else {
      const singleRoute = route as MetaDocsRoute; // Handle singleRoute
      return (
        <Sheets.Collapsible key={index} defaultOpen className={style.collapse}>
          {trigger(singleRoute.group)}
          <SheetsContent data-inner-collapse="">{linkItem(singleRoute.data)}</SheetsContent>
        </Sheets.Collapsible>
      );
    }
  });
}

function Overlay({ open, setOpen, className }: { open?: boolean; setOpen: (value: boolean) => void; className?: string }) {
  if (!open) return null;

  return <span data-routes="overlay" onClick={() => setOpen(false)} className={cn(classes({ style: "overlay" }), className)} />;
}

const classes = cvx({
  variants: {
    style: {
      aside:
        "bg-background w-0 m-0 h-[--aside-h] max-h-[--aside-h] [--aside-h:100dvh] md:[--aside-h:calc(100dvh-2rem)] md:mt-[2rem] top-0 bottom-0 md:sticky md:top-[calc(var(--navbar)+2rem)] max-md:data-[state=closed]:opacity-0 overflow-hidden md:transition-none [transition:all_0.5s_ease] focus-visible:outline-0 [--aside-w:calc(var(--aside)-1rem)] md:ltr:pr-6 md:ltr:pl-4 md:rtl:pl-6 md:rtl:pr-4 md:ltr:left-0 md:rtl:right-0 md:w-[--aside-w] md:min-w-[--aside-w] md:max-w-[--aside-w] max-md:fixed max-md:z-[111] max-md:ltr:left-0 max-md:rtl:right-0 max-md:border-0 max-md:ltr:border-r-[0.04rem] max-md:rtl:border-l-[0.04rem] max-md:border-muted/75 max-md:rtl:border-r-0 max-md:rtl:border-l max-md:data-[state=open]:w-[--aside-w] max-md:data-[state=open]:min-w-[--aside-w] max-md:data-[state=open]:max-w-[--aside-w] data-[state=open]:ltr:pl-6 data-[state=open]:ltr:pr-6 data-[state=open]:rtl:pr-3 max-md:data-[state=closed]:ltr:pl-0 max-md:data-[state=closed]:rtl:pr-0 max-md:data-[state=closed]:ltr:pr-0 max-md:data-[state=closed]:rtl:pl-0 max-md:pb-24 md:pb-20",
      hgroup: "mb-4 flex h-[--navbar] flex-row items-center justify-between md:sr-only md:hidden",
      nav: "relative items-start justify-start max-md:pt-0 overflow-y-auto overflow-x-hidden webkit-scrollbar pl-4 pr-1.5 rtl:pr-4 rtl:pl-1.5",
      overlay: " pl-8 rtl:pl-0 rtl:pr-8 md:hidden md:sr-only fixed max-md:z-[95] w-full h-full min-w-full min-h-full inset-y-0 inset-x-0 backdrop-blur-[0.5px] bg-background/15 supports-[backdrop-filter]:bg-background/15",
      trigger: "group/t font-medium text-sm w-full flex items-center justify-start focus-visible:ring-inset focus-visible:ring-offset-[-2px] text-muted-foreground data-[state*=open]:text-color max-md:active:text-color md:hover:text-color"
    }
  }
});
