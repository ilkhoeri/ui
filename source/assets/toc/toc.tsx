"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { sourceFile } from "@/source/utils";
import { usePathname } from "next/navigation";
import { CircleArrowIcon } from "@/icons/*";
import { formatTitle } from "@/source/utils/text-transform";
import { useQueryApp } from "@/source/hooks/use-query-app";

import type { Item, TableOfContents } from "./config";
import { useIsomorphicEffect } from "@/hooks/use-isomorphic-effect";
import { useContentReady } from "./context";
import { Loader } from "@/ui/loader";

export function useMounted() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return mounted;
}

function extractIds(items?: Item[] | null): string[] {
  if (!items) return [];
  const result: string[] = [];

  for (const item of items) {
    if (item?.url) {
      const id = item?.url?.split("#")[1];
      if (id) result.push(id);
    }

    if (item?.items?.length) {
      result.push(...extractIds(item?.items));
    }
  }

  return result;
}

interface TocProps {
  toc: TableOfContents | null;
  sub?: number;
}

export function TableOfContents({ toc, sub }: TocProps) {
  const pathname = usePathname();
  const mount = useMounted();
  const { min_lg } = useQueryApp();
  const { ready } = useContentReady();

  const itemIds = React.useMemo(() => extractIds(toc?.items), [toc]);
  const activeItem = useActiveItem(itemIds);

  const paths = pathname.split("/").slice(2).filter(Boolean);
  const editPageLink = paths.length > 1 ? `https://github.com/ilkhoeri/ui/edit/main/resource/docs_raw/${sourceFile(paths)}.mdx` : "";

  const isAvailableTOC = min_lg && toc?.items && toc?.items?.length > 1;

  return (
    <aside
      data-controls="table-of-contents"
      suppressHydrationWarning
      className="m-0 mt-[calc(var(--navbar)*-1)] h-[--aside-h] max-h-[--aside-h] w-full overflow-hidden bg-background-theme pt-[calc(var(--navbar)+18px)] [--aside-h:100dvh] [--aside-w:calc(var(--aside)-1rem)] max-lg:sr-only max-lg:z-[-111] max-lg:hidden lg:sticky lg:top-0 lg:w-[--aside-w] lg:min-w-[--aside-w] lg:max-w-[--aside-w] lg:pl-8 lg:pr-4 lg:transition-none lg:[--aside-h:calc(100dvh-0rem)] lg:rtl:pl-4 lg:rtl:pr-8"
    >
      {!(ready || mount) ? (
        <>
          <Loader size={16} classNames={{ root: "mt-4 mb-8 mx-auto" }} />
          <hr className="mt-5 w-full min-w-[212px]" />
        </>
      ) : (
        isAvailableTOC && (
          <>
            <nav className="sticky flex flex-col flex-nowrap items-start justify-start overflow-y-auto overflow-x-hidden pl-3 pt-4 webkit-scrollbar max-lg:pb-24 max-lg:pt-0 lg:pb-20 rtl:pl-0 rtl:pr-3">
              <hgroup>
                <h4 role="presentation" className="mb-2 font-medium text-paragraph">
                  On This Page
                </h4>
              </hgroup>

              <Tree key={pathname} tree={toc} sub={sub} activeItem={activeItem} />
            </nav>
            <hr className="mt-5 w-full min-w-[212px]" />
          </>
        )
      )}

      <Link href={editPageLink} target="_blank" rel="noopener noreferrer nofollow" className="group mt-5 h-4 justify-start gap-1 pb-1.5 text-muted-foreground">
        <span className="truncate text-sm transition-all underline-hover group-hover:text-constructive">Edit this page on GitHub</span>
        <CircleArrowIcon size={18} className="group-hover:text-blue-500" />
      </Link>
    </aside>
  );
}

interface TreeProps {
  tree: TableOfContents;
  level?: number;
  sub?: number;
  activeItem?: string | null;
}

function useActiveItem(itemIds: string[]) {
  const { ready } = useContentReady();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const previousId = React.useRef<string | null>(null);

  useIsomorphicEffect(() => {
    if (!ready || !itemIds.length) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      let visibleId: string | null = null;

      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleId = entry.target.id;
          break;
        }
      }

      if (visibleId && visibleId !== previousId.current) {
        previousId.current = visibleId;
        requestAnimationFrame(() => setActiveId(visibleId));
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "0% 0% -80% 0%",
      threshold: 0.1
    });

    itemIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      itemIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      previousId.current = null;
    };
  }, [ready, itemIds.join(",")]); // depend on a stable string

  return activeId;
}

const Tree = React.memo(function Tree({ tree, level = 1, sub = 3, activeItem }: TreeProps) {
  if (!tree?.items?.length || level >= sub) return null;

  return (
    <div className={cn("w-full list-none text-span", { "pl-4 rtl:pl-0 rtl:pr-4 [&>div]:max-w-[calc(100%-2rem)]": level !== 1 })}>
      {tree.items.map(item => {
        const formattedTitle = formatTitle(item.title);
        const isActive = item.url === `#${activeItem}`;

        return (
          <div key={item.url} className="pt-2 text-muted-foreground">
            <a
              href={item.url}
              suppressHydrationWarning
              data-state={isActive ? "active" : ""}
              title={formattedTitle}
              className={cn("max-w-full truncate text-muted-foreground no-underline transition-colors hover:text-color data-[state=active]:text-blue-500 hover:data-[state=active]:text-blue-500", isActive && "underline-active")}
            >
              <span className="truncate">{formattedTitle}</span>
            </a>
            {item.items?.length ? <Tree tree={item} level={level + 1} sub={sub} activeItem={activeItem} /> : null}
          </div>
        );
      })}
    </div>
  );
});

/*
function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<any>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry?.target?.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}
function Tree({ tree, level = 1, sub = 3, activeItem }: TreeProps) {
  return tree?.items?.length && level < sub ? (
    <div className={cn("list-none text-span w-full", { "pl-4 rtl:pl-0 rtl:pr-4": level !== 1 })}>
      {tree.items.map((item, index) => {
        return (
          <div key={index} className={cn("pt-2 text-muted-foreground")}>
            <a href={item.url} className={cn("inline-block no-underline transition-colors", item.url === `#${activeItem}` ? "text-blue-500 hover:text-blue-500" : "text-muted-foreground hover:text-color")}>
              {formatTitle(sanitizedName(item.title))}
            </a>
            {item.items?.length ? <Tree sub={sub} tree={item} level={level + 1} activeItem={activeItem} /> : null}
          </div>
        );
      })}
    </div>
  ) : null;
}
*/
