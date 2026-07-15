import * as React from "react";
import { createPortal } from "react-dom";
import { cvx, type cvxVariants } from "xuxi";
import { cn } from "@/utils/cn";

type ElementType<T> = {
  el?: React.ElementType;
  unstyled?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<T>, T>;

export type ComponentType<T> = React.ComponentType<React.HTMLAttributes<T>>;
export type PartialType<K extends keyof any, T> = Partial<{ [P in K]?: T }>;

export const compStyles = cvx({
  assign: "relative",
  variants: {
    el: {
      main: "w-full relative flex flex-col md:flex-row mx-auto min-h-screen pt-[--navbar] pb-20 md:max-lg:pr-8 rtl:md:max-lg:pr-0 rtl:md:max-lg:pl-8 max-w-var",
      section: "w-full max-w-full overflow-x-hidden max-md:px-6 pt-9 flex flex-col",
      p: "text-paragraph whitespace-pre-wrap [&:not(:first-child)]:mt-3"
    }
  }
});

export type ClassesProps<T extends (...keys: any) => any> = cvxVariants<T> & {
  unstyled?: boolean;
  className?: string;
};
export function classes<T extends (...keys: any) => any>(props: ClassesProps<T>): string {
  const { className, unstyled = false, ...rest } = props;
  return cn(!unstyled && compStyles({ ...rest }), className)!;
}

export const Comp = React.forwardRef<HTMLElement, ElementType<HTMLElement>>((_props, ref) => {
  const { el = "main", unstyled, className, ...props } = _props;
  const Component = el;
  const els = (el as cvxVariants<typeof compStyles>["el"]) || undefined;
  return (
    <Component
      {...{
        ref,
        className: classes<typeof compStyles>({
          el: els,
          unstyled,
          className
        }),
        ...props
      }}
    />
  );
});
Comp.displayName = "Comp";

const headings = cvx({
  assign: "scroll-m-20 first:mt-0",
  variants: {
    variant: {
      title: "border-b mt-12 font-bold tracking-normal pb-2",
      segment: "mt-12 font-bold tracking-normal",
      section: "border-0 mt-8 font-semibold tracking-tight pb-0",
      article: "mb-4 font-medium"
    },
    size: {
      h1: "text-h1",
      h2: "text-h2",
      h3: "text-h3",
      h4: "text-h4",
      h5: "text-h5",
      h6: "text-h6"
    }
  },
  defaultVariants: { variant: "title", size: "h3" }
});

interface HeadingElement extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, cvxVariants<typeof headings> {
  el?: cvxVariants<typeof headings>["size"];
  unstyled?: boolean;
}
// variant="segment" className="mb-12 font-geist-sans tracking-px text-h1"
export const Title = React.forwardRef<HTMLHeadingElement, HeadingElement>((_props, ref) => {
  const { el = "h1", children, title, role = "presentation", unstyled, className, variant, size, ...props } = _props;
  const Component: React.ElementType = el;
  return (
    <Component ref={ref} role={role} className={cn(!unstyled && headings({ variant, size }), className)} {...props}>
      {children || title}
    </Component>
  );
});
Title.displayName = "Title";

interface PortalProps {
  portal?: boolean;
  children: React.ReactNode;
  container: Element | DocumentFragment | null;
  key?: null | string;
}
export function Portal(props: PortalProps) {
  const { portal = true, children, container, key } = props;
  if (typeof document === "undefined") return null;
  return portal ? createPortal(children, container || document.body, key) : children;
}

/**
export const X = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>((props, ref) => (
  <div ref={ref} {...props} />
));
X.displayName = "X";
 */
