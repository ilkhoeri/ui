import * as React from "react";
import { Svg } from "./svg";
import { cn } from "@/utils/cn";
import { cvx, rem, type cvxVariants } from "xuxi";
import { UnstyledButton, type UnstyledButtonProps } from "./button";

export interface BurgerProps extends UnstyledButtonProps<"children"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: SetStateAction<boolean>) => void;
  size?: number | `${number}`;
  unstyled?: boolean;
}
export const Burger = React.forwardRef<HTMLButtonElement, BurgerProps>(function Burger(_props, ref) {
  const { defaultOpen = false, open: openProp, onOpenChange: setOpenProp, onClick, unstyled, className, style, size = 32, color = "hsl(var(--color))", ...props } = _props;

  const [_open, _setOpen] = React.useState(defaultOpen);
  const openChange = openProp ?? _open;
  const setOpenChange = React.useCallback(
    (open: SetStateAction<boolean>) => {
      const openState = typeof open === "function" ? open(openChange) : open;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, openChange]
  );

  return (
    <UnstyledButton
      {...{
        ref,
        ...getStyles({ classes: "root", open: openChange, size, className, unstyled, style, color }),
        onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          setOpenChange?.(o => !o);
          onClick?.(e);
        },
        ...props
      }}
    >
      <Svg currentFill="fill" size="calc(var(--burger-size)/1.333)" {...getStyles({ classes: "svg", open: openChange })}>
        {[...Array(3)].map((_, index) => (
          <path key={index} {...getStyles({ path: index as Index, open: openChange, index })} />
        ))}
      </Svg>
    </UnstyledButton>
  );
});

type Index = 0 | 1 | 2;
type Selector = cvxVariants<typeof burger>;
interface Options extends Pick<BurgerProps, "style" | "size" | "unstyled" | "className" | "open" | "color"> {
  index?: number;
}
function getStyles(selector: Selector & Options = {}) {
  const { className, open, index, classes, path, unstyled, style, size, color } = selector;
  return {
    "data-state": classes ? (open ? "open" : "closed") : undefined,
    className: cn(!unstyled && burger(selector), className),
    d: (path ? burger({ path: index as Index }) : undefined) as React.SVGAttributes<SVGPathElement>["d"],
    style: {
      ...(path
        ? {
            transition: "transform .35s ease",
            transform: open ? burger({ isOpen: index as Index }) : "none"
          }
        : undefined),
      ...(selector.classes === "root" ? { "--burger-size": rem(size), "--burger-color": color } : undefined),
      ...style
    } as React.CSSProperties
  };
}

const burger = cvx({
  variants: {
    classes: {
      root: "size-[--burger-size] rounded-[calc(var(--burger-size)/5.333)] text-[--burger-color] border-solid border-[--burger-color] flex items-center justify-center relative cursor-pointer outline-none focus-visible:outline-0",
      svg: "shrink-0 overflow-visible [transition:transform_.35s_ease] data-[state=open]:[transition-delay:.15s] data-[state=open]:rotate-45"
    },
    path: {
      "0": "m3.45,8.83c-.39,0-.76-.23-.92-.62-.21-.51.03-1.1.54-1.31L14.71,2.08c.51-.21,1.1.03,1.31.54.21.51-.03,1.1-.54,1.31L3.84,8.75c-.13.05-.25.08-.38.08Z",
      "1": "m2.02,17.13c-.39,0-.76-.23-.92-.62-.21-.51.03-1.1.54-1.31L21.6,6.94c.51-.21,1.1.03,1.31.54.21.51-.03,1.1-.54,1.31L2.4,17.06c-.13.05-.25.08-.38.08Z",
      "2": "m8.91,21.99c-.39,0-.76-.23-.92-.62-.21-.51.03-1.1.54-1.31l11.64-4.82c.51-.21,1.1.03,1.31.54.21.51-.03,1.1-.54,1.31l-11.64,4.82c-.13.05-.25.08-.38.08Z"
    },
    isOpen: {
      "0": "rotate(112.5deg) translate(-27.2%,-80.2%)",
      "1": "rotate(22.5deg) translate(15.5%,-23%)",
      "2": "rotate(112.5deg) translate(-15%,-149.5%)"
    }
  }
});
