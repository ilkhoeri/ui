"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/ui/breadcrumb";
import { getDisplayName } from "../utils";

export interface BreadcrumbDropdownProps {
  paths: string[];
}

export function NavigationBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname
    .split("/")
    .filter(Boolean)
    .filter(part => part !== "");
  const active = (index: number) => index === paths.length - 1 || undefined;
  const links = (index: number) => (active(index) ? "" : `/${paths.slice(0, index + 1).join("/")}`);

  const items = paths.map((path, index) => (
    <Link key={path} href={links(index)} aria-disabled={paths[1] === path || active(index)}>
      {getDisplayName(path)}
    </Link>
  ));

  return <Breadcrumb overflowWrap items={items} separator={<Breadcrumb.Icons icon="chevron" />} classNames={{ root: "mb-8", breadcrumb: "[font-size:clamp(0.75rem,0.35rem+0.8vw,1rem)]" }} />;
}
