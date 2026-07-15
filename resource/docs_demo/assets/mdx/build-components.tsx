"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { customOrder } from "@/routes";
import { siteConfig } from "@/site/config";
import { transform } from "@/utils/text-parser";
import { Button, ButtonProps } from "@/ui/button";
import { typographyVariant } from "@/ui/typography";
import { CheckIcon, ClipboardCheckIcon } from "@/icons/*";
import { FloatingIndicator } from "@/ui/floating-indicator";

type SizeImage = number | `${number}`;
type DataFigure = {
  name: string;
  src: string;
  caption?: string | string[];
};
interface FigureProps extends React.HTMLAttributes<HTMLElement> {
  data: (DataFigure | DataFigure[]) | null;
  width?: SizeImage;
  height?: SizeImage;
  size?: [SizeImage, SizeImage];
  classNames?: {
    figure?: string;
    image?: string;
    caption?: string;
    h4?: string;
    p?: string;
  };
}

export function Figure({ data, width = "260", height = "300", size, className, classNames, ...props }: FigureProps) {
  if (!data) {
    return null;
  }
  return Array.isArray(data) ? (
    data.map((data, __i) => <Figure key={__i} {...{ data, size, classNames }} />)
  ) : (
    <figure
      {...{
        className: cn("relative", className, classNames?.figure),
        ...props
      }}
    >
      <Image src={data.src} alt={data.name} width={size?.[0] || width} height={size?.[1] || height} className={classNames?.image} />
      <figcaption className={classNames?.caption}>
        <h4 className={classNames?.h4}>{data.name}</h4>
        {data.caption && Array.isArray(data.caption) ? (
          data.caption.map((i, __i) => (
            <p key={__i} className={classNames?.p}>
              {i}
            </p>
          ))
        ) : (
          <p className={classNames?.p}>{data.caption}</p>
        )}
      </figcaption>
    </figure>
  );
}

interface CopyButtonProps extends ButtonProps {
  text: string | undefined;
  className?: string;
}

export function CopyButton({ text, className, ...props }: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 700);
  };

  return (
    <Button size="icon" className={cn("size-7 !bg-slate-700 !text-white", className)} disabled={isCopied} onClick={copy} aria-label="Copy" {...props}>
      <span className="sr-only">Copy</span>
      {isCopied ? <CheckIcon className="text-green-400" /> : <ClipboardCheckIcon />}
    </Button>
  );
}

export function BannerClosingGetStarted() {
  const [rootRef, setRootRef] = React.useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = React.useState<Record<string, HTMLAnchorElement | null>>({});
  const [active, setActive] = React.useState(0);
  const [hover, setHover] = React.useState<number | null>(null);

  const setControlRef = (index: number) => (node: HTMLAnchorElement) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };
  const isActive = (index: number) => ((hover ?? active) === index ? "true" : undefined);

  const controls = customOrder.map((item, index) => (
    <Link
      key={item}
      href={`/docs/web/${item}`}
      className="touch-manipulation appearance-none rounded-none border-white text-sm font-medium leading-none text-[#c1c1c1] transition hover:!text-black data-[active]:text-black md:shadow-md max-md:border-x max-md:border-t max-md:first-of-type:rounded-t-xl max-md:last-of-type:rounded-b-xl max-md:last-of-type:border-y md:border-y md:border-l md:first-of-type:rounded-l-xl md:last-of-type:rounded-r-xl md:last-of-type:border md:rtl:border-l-0 md:rtl:border-r md:rtl:first-of-type:rounded-l-none md:rtl:first-of-type:rounded-r-xl md:rtl:last-of-type:rounded-r-none md:rtl:last-of-type:rounded-l-xl"

      ref={setControlRef(index)}
      onClick={() => setActive(index)}
      data-active={isActive(index)}
      onContextMenu={e => e.preventDefault()}
    >
      <span className="relative z-1 size-full px-4 py-3 font-semibold" onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)}>
        {transform.capitalizeFirst(item)}
      </span>
    </Link>
  ));

  return (
    <section className="card_fold rounded-2xl px-8 py-12 text-white shadow-xl">
      <h3 className={cn(typographyVariant({ prose: "h3" }), "relative z-[3] !mt-0")}>Ready to build with confidence?</h3>
      <p className="relative z-[3] mt-3 max-w-xl text-lg text-[#c1c1c1]">
        <b>{siteConfig.name}</b> gives you full control, elegant defaults, and a toolbox designed to scale — no bloat, no surprises.
      </p>

      <p className="relative z-[3] mt-4 text-base font-medium text-white">Explore:</p>

      <div ref={setRootRef} className="relative z-[3] mt-2 grid max-md:grid-flow-row md:w-max md:grid-flow-col">
        {controls}
        <FloatingIndicator target={controlsRefs[hover ?? active]} color="white" parent={rootRef} className={cn((hover === null || hover === 0) && "max-md:rounded-t-xl md:rounded-l-xl", hover === 3 && "max-md:rounded-b-xl md:rounded-r-xl")} />
      </div>
      <span className="fold" />
      <div className="points_wrapper">
        {[...Array(15)].map((_, index) => (
          <i key={index} className="point" />
        ))}
      </div>
    </section>
  );
}
