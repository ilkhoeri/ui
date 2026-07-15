"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";
import { Svg } from "@/ui/svg";
import { usePathname } from "next/navigation";
import type { FileDocMeta, MetaDocsRoute } from "@/routes";

function getPrevNextRoutes(pathname: string, routes: MetaDocsRoute[] | null): FileDocMeta[] {
  let currentRoutes: FileDocMeta[] = [];

  if (routes) {
    if ((routes as MetaDocsRoute[]).every(route => "path" in route.data[0])) {
      currentRoutes = (routes as MetaDocsRoute[]).flatMap(section => section.data.map(route => route));
    }
  }

  const currentIndex = currentRoutes.findIndex(route => route.path === pathname);
  const previousRoute = currentRoutes[currentIndex - 1] || null;
  const nextRoute = currentRoutes[currentIndex + 1] || null;

  return [previousRoute, nextRoute] as const;
}

const classes = {
  root: "grid grid-flow-row gap-4 pt-12 [--pd:.25rem] md:grid-flow-col md:grid-cols-2 md:gap-8 md:[--pd:.5rem] xl:gap-9 xl:[--pd:1rem]",
  previous: "group/previous items-start ltr:pl-[--pd] rtl:ml-auto rtl:pr-[--pd]",
  next: "group/next ml-auto items-end ltr:pr-[--pd] rtl:ml-0 rtl:mr-auto rtl:pl-[--pd]",
  link: "group/link flex w-full cursor-pointer appearance-none flex-col justify-between gap-2 rounded-2xl border border-blue-500 bg-blue-400/10 p-4 text-[clamp(0.75rem,0.65rem+0.65vw,0.9rem)] font-medium leading-tight text-muted-foreground transition-[transform,color,background-color,border-color,text-decoration-color,fill,stroke] duration-75 [-moz-appearance:none] [-webkit-appearance:none] hover:text-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primitive-emphasis/35 focus-visible:ring-offset-1 focus-visible:ring-offset-background active:scale-[.995] disabled:pointer-events-none disabled:gap-2 disabled:opacity-50 dark:bg-blue-600/10 md:only:col-span-2 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  icon: "rtl:rotate-180",
  wrap: "inline-flex items-center gap-1 text-blue-500 transition-colors group-hover/link:text-blue-600",
  label: "truncate text-lg font-semibold",
  summary: "mb-auto line-clamp-2 w-full max-w-full text-muted-foreground group-[]/previous:text-start group-[]/next:text-end"
};

const SIZE_ICON: number = 32;

export interface NavBottomProps {
  routes: MetaDocsRoute[] | null;
}
export function NavBottom(props: NavBottomProps) {
  const pathname = usePathname();
  const [previous, next] = getPrevNextRoutes(pathname, props.routes);

  return (
    <nav className={classes.root}>
      {previous && (
        <Link className={cn(classes.link, classes.previous)} href={previous ? previous.path : ""}>
          <div className={classes.wrap}>
            <Svg className={classes.icon} stroke={1.5} size={SIZE_ICON}>
              <path fill="currentColor" fillOpacity="0" strokeDasharray="64" strokeDashoffset="64" d="M21 12c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9Z">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
                <animate fill="freeze" attributeName="fill-opacity" begin="1.1s" dur="0.15s" values="0;0.3" />
              </path>
              <path strokeDasharray="12" strokeDashoffset="12" d="M17 12h-9.5">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="12;0" />
              </path>
              <path strokeDasharray="8" strokeDashoffset="8" d="M7 12l4 4M7 12l4 -4">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" values="8;0" />
              </path>
            </Svg>
            <span className={classes.label}>{previous ? previous.meta.title : "Previous"}</span>
          </div>
          <p className={classes.summary}>
            <bdi>{previous.meta.summary}</bdi>
          </p>
        </Link>
      )}

      {next && (
        <Link className={cn(classes.link, classes.next)} href={next ? next.path : ""}>
          <div className={classes.wrap}>
            <span className={classes.label}>{next ? next.meta.title : "Next"}</span>
            <Svg className={classes.icon} stroke={1.5} size={SIZE_ICON}>
              <path fill="currentColor" fillOpacity="0" strokeDasharray="64" strokeDashoffset="64" d="M3 12c0 4.97 4.03 9 9 9c4.97 0 9 -4.03 9 -9c0 -4.97 -4.03 -9 -9 -9c-4.97 0 -9 4.03 -9 9Z">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
                <animate fill="freeze" attributeName="fill-opacity" begin="1.1s" dur="0.15s" values="0;0.3" />
              </path>
              <path strokeDasharray="12" strokeDashoffset="12" d="M7 12h9.5">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="12;0" />
              </path>
              <path strokeDasharray="8" strokeDashoffset="8" d="M17 12l-4 4M17 12l-4 -4">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" values="8;0" />
              </path>
            </Svg>
          </div>
          <p className={classes.summary}>{next.meta.summary}</p>
        </Link>
      )}
    </nav>
  );
}
