"use client";

import React from "react";
import { cvx } from "xuxi";
import { cn } from "@/utils/cn";
import { Typography } from "@/ui/typography";
import { useClipboard } from "@/hooks/use-clipboard";
import { ArrowIcon, HasCopyIcon, BrandOeriIcon as LogoIcon, TextIcon } from "@/icons/*";

const FONT_VARIANT = {
  name: "Ubuntu",
  url: "https://fonts.google.com/?query=ubuntu&preview.text=UI%C2%B7kit"
};

const COLOR_PALETTE = ["#142641", "#284e83", "#3569b2"];

const brandingMap = {
  logoMap: [{ theme: "light", style: { stroke: "black" } }, { theme: "dark", style: { stroke: "white" } }, { theme: "light" }, { theme: "dark" }],
  colorPalette: COLOR_PALETTE,
  downloadAs: ["png", "svg"]
};

export function BrandingPage() {
  return (
    <div className={classes({ class: "root" })}>
      <Typography prose="h1" className="!mb-0">
        Media Assets
      </Typography>

      <Typography prose="h1" className="!-my-8">
        Logo
      </Typography>
      <div className={classes({ class: "content" })}>
        <LogoMap />
        <span className={classes({ class: "border", inset: "top" })} />
        <span className={classes({ class: "border", inset: "bottom" })} />
      </div>

      <Typography prose="h1" className="!-mb-8">
        Palette
      </Typography>
      <div className={classes({ class: "content" })}>
        <FontPalette />
        <ColorPalette />
        <span className={classes({ class: "border", inset: "top" })} />
        <span className={classes({ class: "border", inset: "bottom" })} />
      </div>
    </div>
  );
}

function LogoMap() {
  return brandingMap.logoMap.map((r, _r) => (
    <div key={_r} className={classes({ class: "card", container: r.theme as "light" | "dark" })}>
      <div className={classes({ class: "sectionTop" })}>
        <div className="relative flex h-1/2 w-1/2 items-center justify-center">
          <LogoIcon size="full" {...r.style} />
        </div>
      </div>
      <div className={classes({ class: "sectionBottom", theme: r.theme as "light" | "dark" })}>
        {brandingMap.downloadAs.map((i, _i) => (
          <a key={_i} href={`/icons/oeri-${!r.style ? "asset" : r.theme === "light" ? "logo-black" : "logo-white"}.${i}`} download={`oeri-logo-${!r.style ? "color" : r.theme === "light" ? "black" : "white"}`} className={classes({ card: "action" })}>
            <TextIcon size={26} icon={i as React.ComponentProps<typeof TextIcon>["icon"]} />
            <span className={classes({ card: "label" })}>Download as {i.toUpperCase()}</span>
          </a>
        ))}
      </div>
      <span className={classes({ class: "border", inset: "left" })} />
      <span className={classes({ class: "border", inset: "right" })} />
    </div>
  ));
}

function FontPalette() {
  return (
    <div className={cn(classes({ class: "card" }), "aspect-[6/4] bg-color [&_*]:!text-background")}>
      <div className={classes({ class: "sectionTop" })}>
        <Typography prose="h1" className="whitespace-nowrap font-ubuntu text-2xl leading-none">
          {FONT_VARIANT.name}
        </Typography>
      </div>
      <div className={cn(classes({ class: "sectionBottom", theme: "light" }), "w-full")} tabIndex={-1}>
        <a aria-label="use font" href={FONT_VARIANT.url} target="_blank" rel="noopener noreferrer nofollow" className={classes({ class: "action-palette" })}>
          <ArrowIcon arrow="up-right" />
          <span className={classes({ card: "label" })}>Google Fonts</span>
        </a>
      </div>
      <span className={classes({ class: "border", inset: "left" })} />
      <span className={classes({ class: "border", inset: "right" })} />
    </div>
  );
}

function ColorPalette() {
  return brandingMap.colorPalette.map((r, _r) => (
    <div key={_r} className={cn(classes({ class: "card" }), "aspect-[6/4] [&_*]:!text-white")} {...{ style: { backgroundColor: r } }}>
      <div className={classes({ class: "sectionTop" })}>
        <Typography prose="h1" className={classes({ card: "named" })}>
          {r}
        </Typography>
      </div>
      {CopyColors(r)}
      <span className={classes({ class: "border", inset: "left" })} />
      <span className={classes({ class: "border", inset: "right" })} />
    </div>
  ));
}

function CopyColors(value: string) {
  const clipboard = useClipboard({ timeout: 1000 });
  return (
    <div className={classes({ class: "sectionBottom", theme: "dark" })} tabIndex={-1} onClick={() => clipboard.copy(value)}>
      <div className={classes({ class: "action-palette" })}>
        <HasCopyIcon has={clipboard.copied} />
        <span className="text-sm/5">{clipboard.copied ? "Copied" : "Copy"}</span>
      </div>
    </div>
  );
}

const classes = cvx({
  variants: {
    class: {
      root: "flex grow flex-col items-center justify-center gap-20 text-clip py-20 lg:px-12 2xl:pl-4",
      content: "relative w-full max-w-full grid gap-8 md:grid-cols-2 2xl:grid-cols-4",
      card: "relative flex aspect-[7/9] w-full flex-col rounded-none border-0 bg-clip-padding shadow-[0_1px_1px,0_-1px_1px,0_4px_6px] shadow-black/[0.06]",
      sectionTop: "relative flex flex-1 items-center justify-center",
      sectionBottom: "divide-y-[1px] border-t border-dashed cursor-pointer",
      border: "absolute border-dashed border-black dark:border-white [--inset:1px]",
      "action-palette": "flex items-center gap-2 px-4 py-2"
    },
    inset: {
      left: "w-px inset-y-0 -left-[--inset] border-l -my-[1.875rem]",
      right: "w-px inset-y-0 -right-[--inset] border-r -my-[1.875rem]",
      top: "h-px inset-x-0 -top-[--inset] border-t",
      bottom: "h-px inset-x-0 -bottom-[--inset] border-t"
    },
    container: {
      light: "text-primary bg-white [&_*]:text-black hover:[&_a]:!text-black",
      dark: "bg-black text-white [&_*]:text-white hover:[&_a]:!text-white"
    },
    theme: {
      light: "divide-black border-t-black",
      dark: "divide-white border-t-white"
    },
    card: {
      named: "leading-none whitespace-nowrap",
      label: "mr-auto text-sm/5 font-semibold rtl:ml-auto rtl:mr-0",
      action: "inline-flex border-dashed h-9 w-full items-center justify-start gap-2 px-4 py-2 focus-visible:outline-0 focus-visible:ring-0"
    }
  }
});
