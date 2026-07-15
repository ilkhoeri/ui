"use client";
import React, { useEffect, useState } from "react";
import { cvx, type cvxVariants } from "xuxi";
import { Command, createCommand } from "@/ui/command";
import { SleepingSquareIcon, FolderFilesIcon, FolderPathConnectIcon } from "@/icons/*";
import { fuzzySearch, levenshteinDistance } from "@/source/ondevelopment/utils";
import { Kbd } from "@/ui/kbd";

import { appRoutes } from "@/source/routes";
import type { MetaDocsRoute, NestedMetaDocsRoute } from "@/routes";

type Routes = (MetaDocsRoute | NestedMetaDocsRoute)[] | null;
export type CommandDialogType = { routes: Routes };

export function useSearch<T>({ clearQuery = true }: { clearQuery?: boolean | undefined } = {}) {
  const [query, setQuery] = useState("");
  const [suggest, setSuggest] = useState<T[]>([]);

  useEffect(() => {
    if (!clearQuery) {
      setQuery("");
      setSuggest([]);
    }
  }, [clearQuery]);

  return { query, setQuery, suggest, setSuggest };
}

interface Suggestion {
  id: string;
  label: string;
  href: string;
  leftSection: React.JSX.Element;
}
interface FilterResult {
  group: string;
  actions: Suggestion[];
}

const [appCommandStore, appCommand] = createCommand();

export function CommandDialog({ routes = [] }: { routes?: Routes }) {
  const { query, setQuery, suggest, setSuggest } = useSearch<FilterResult>();

  useEffect(() => {
    const results = filter(routes, query);
    setSuggest(results);
  }, [routes, query, setSuggest]);

  const Suggest = (
    <React.Fragment>
      <h4 {...cns("suggest")}>Suggestions:</h4>
      {suggest.map((group, index) => (
        <Command.ActionsGroup key={index} label={group.group}>
          {group.actions.map(i => (
            <Command.Action key={i.label} href={i.href}>
              {i.leftSection} {i.label}
            </Command.Action>
          ))}
        </Command.ActionsGroup>
      ))}
    </React.Fragment>
  );
  //
  return (
    <>
      <button type="button" {...cns("trigger")} onClick={appCommand.open}>
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <Kbd size="xs" variant="primitive" {...cns("kbd")}>
          <span>⌘</span>K
        </Kbd>
      </button>

      <Command
        {...{
          query,
          store: appCommandStore,
          onQueryChange: setQuery,
          actions: [...suggestMain({ query }), ...suggest],
          nothingFound: suggest?.length > 0 ? Suggest : <SleepingSquareIcon size={160} />,
          classNames: {
            content: "h-2/3",
            empty: suggest?.length > 0 ? "pt-0 [display:unset]" : undefined
          }
        }}
      />
    </>
  );
}

function filter(routes: Routes, query: string) {
  if (!routes) return [];

  const filteredRoutes = routes.flatMap(route => {
    const routeData = (route as NestedMetaDocsRoute).data?.[0]?.data ? (route as NestedMetaDocsRoute).data : [route as MetaDocsRoute];

    return routeData.flatMap(singleRoute => {
      const actions = singleRoute.data
        .filter(i => fuzzySearch(i.name, query))
        .map(i => ({
          id: i.name.toLowerCase().replace(" ", "-"),
          label: i.name,
          href: i.path,
          leftSection: <FolderFilesIcon />
        }));

      return {
        group: singleRoute.group,
        actions
      };
    });
  });

  if (filteredRoutes.some(route => route.actions.length > 0)) {
    return filteredRoutes;
  }

  const levenshteinSuggestions = routes.flatMap(route => {
    const routeData = (route as NestedMetaDocsRoute).data?.[0]?.data ? (route as NestedMetaDocsRoute).data : [route as MetaDocsRoute];

    return routeData.flatMap(singleRoute => {
      const actions = singleRoute.data
        .map(i => ({ item: i, distance: levenshteinDistance(i.name, query) }))
        .filter(({ distance }) => distance <= 4)
        .sort((a, b) => a.distance - b.distance)
        .map(({ item }) => ({
          id: item.name.toLowerCase().replace(" ", "-"),
          label: item.name,
          href: item.path,
          leftSection: <FolderPathConnectIcon />
        }));

      return {
        group: singleRoute.group,
        actions
      };
    });
  });

  return levenshteinSuggestions.filter(route => route.actions.length > 0);
}

function suggestMain({ query }: { query: string }) {
  if (query) return [];

  const routes = appRoutes["suggestions"];
  const actions = routes.data.map(i => ({
    id: i.title.toLowerCase().replace(" ", "-"),
    label: i.title,
    href: i.href,
    leftSection: <i.icon />
  }));
  return [
    {
      group: routes.title,
      actions
    }
  ];
}

const classes = cvx({
  variants: {
    as: {
      trigger:
        "relative inline-flex h-8 w-full items-center justify-start whitespace-nowrap rounded-[0.5rem] border bg-background/20 px-4 py-2 text-sm font-normal text-muted-foreground shadow-none transition-colors hover:bg-muted/20 hover:text-color focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-40 lg:w-64",
      kbd: "pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex [&_span]:text-xs",
      close: "size-4 absolute right-3 top-3 text-muted-foreground hover:text-color rounded-sm disabled:opacity-50",
      suggest: "italic text-left px-2 py-1.5 text-sm font-medium select-none flex items-center",
      content: "overflow-hidden p-0 md:w-[520px] md:h-[360px]",
      command: "[&_[data-command=search-wrap]]:pr-10"
    }
  }
});

type Origin = NonNullable<cvxVariants<typeof classes>["as"]>;
function cns(as: Origin) {
  return {
    className: classes({ as })
  };
}
