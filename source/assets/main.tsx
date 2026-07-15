"use client";

import { cn } from "@/utils/cn";
import { compStyles } from "./components";
import { useApp } from "@/config/app-context";

export function Main({ className, dir: _, ...props }: React.ComponentPropsWithRef<"main">) {
  const { dir } = useApp();
  return <main {...props} dir={dir} className={cn(compStyles({ el: "main" }), className)} />;
}
