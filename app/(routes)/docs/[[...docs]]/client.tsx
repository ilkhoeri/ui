"use client";

import React from "react";
import Link from "next/link";
import { cvx } from "xuxi";
import { cn } from "@/utils/cn";
import { Title } from "@/source/assets/components";
import { transform, sanitizedWord } from "@/modules/web/utilities/text-parser";

import { FolderFilesIcon } from "@/icons/*";
import type { FileDocMeta, MetaDocsRoute, NestedMetaDocsRoute } from "@/routes";

import globalStyle from "@/source/styles/styles";

const classes = cvx({
  variants: {
    as: {
      wrapper: "w-full min-w-full grid sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4 mt-5 sm:gap-6",
      label: "absolute left-0 z-9 cursor-pointer font-bold tracking-normal transition-all",
      input:
        "peer mb-12 mt-1 w-full min-w-full border-b bg-transparent pb-3 leading-none transition-colors placeholder:min-h-8 placeholder:leading-none placeholder:text-transparent placeholder-shown:bg-transparent autofill:bg-transparent valid:bg-transparent focus:bg-transparent focus-visible:border-b-color focus-visible:[outline:none] focus-visible:ring-transparent focus-visible:ring-0 focus-visible:placeholder:text-muted-foreground"
    },
    labelState: {
      true: "top-[-24px] text-[100%]",
      false: "translate-y-0 text-h3 peer-focus:top-[-28px] peer-focus:text-[100%] peer-focus-visible:top-[-28px] peer-focus-visible:text-[100%]"
    }
  }
});

function renderCard(route: FileDocMeta[] | null) {
  if (!route) return null;
  return route.map((item, index) => (
    <Link key={index} href={item.path} title={item.meta.summary} className={globalStyle({ cards: "box" })}>
      <FolderFilesIcon size={32} />
      <span className="mt-3 font-medium">{item.meta.title}</span>
      <span className="mt-1.5 line-clamp-2 text-center text-sm font-medium text-muted-foreground">{item.meta.summary}</span>
    </Link>
  ));
}

function isSingleRoute(route: MetaDocsRoute | NestedMetaDocsRoute): route is MetaDocsRoute {
  return (route as MetaDocsRoute).data[0].path !== undefined;
}

function renderSingleRoute(routes: MetaDocsRoute[], value: string) {
  return (
    <div className={classes({ as: "wrapper" })}>
      {routes.map(route => {
        const filtered = route.data.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
        return renderCard(filtered);
      })}
    </div>
  );
}

function renderNestedRoute(routes: NestedMetaDocsRoute[], value: string) {
  return routes.map(route =>
    route.data.map((subRoute, index) => {
      const filtered = subRoute.data.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
      if (!filtered.length) return null;
      return (
        <div key={index} className="mt-12 w-full min-w-full first-of-type:mt-0">
          <Title el="h4" id={sanitizedWord(subRoute.group)}>
            {subRoute.group}
          </Title>
          <div className={classes({ as: "wrapper" })}>{renderCard(filtered)}</div>
        </div>
      );
    })
  );
}

interface FilterDocsProps {
  id: string;
  value: string;
  className?: string;
  autoFocus?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
export function FilterDocs(props: FilterDocsProps) {
  const { id, value, onChange, className, autoFocus = true } = props;
  const _id = sanitizedWord(id);
  return (
    <>
      <input id={_id} name={_id} value={value} onChange={onChange} autoFocus={autoFocus} className={cn(classes({ as: "input" }), className)} placeholder="Search" autoComplete="true" type="text" />
      <label role="presentation" htmlFor={_id} className={classes({ as: "label", labelState: !!value })}>
        {transform.capitalize(id)}
      </label>
    </>
  );
}

interface RestDocsProps {
  id: string;
  routes: (MetaDocsRoute | NestedMetaDocsRoute)[] | null;
}
export function RestDocs(props: RestDocsProps) {
  const { routes, id } = props;
  const [value, setValue] = React.useState<string>("");

  if (!routes) return null;

  return (
    <div className="relative mx-auto flex w-full flex-col items-center justify-start">
      <FilterDocs id={id} value={value} onChange={e => setValue(e.target.value)} />
      {isSingleRoute(routes[0]) ? renderSingleRoute(routes as MetaDocsRoute[], value) : renderNestedRoute(routes as NestedMetaDocsRoute[], value)}
    </div>
  );
}
