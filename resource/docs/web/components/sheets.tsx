"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { mergeRefs } from "@/hooks/use-merged-ref";
import { cvx, rem, ocx } from "xuxi";
import { cn } from "@/utils/cn";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { useMeasureScrollbar } from "@/hooks/use-measure-scrollbar";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useElementRect } from "@/hooks/use-element-info";
import { getVarsPositions, useUpdatedPositions } from "@/hooks/use-open-state";
import { Svg } from "@/ui/svg";

export enum SheetsVariant {
  Accordion = "accordion",
  Collapsible = "collapsible",
  Dropdown = "dropdown",
  Dialog = "dialog",
  Drawer = "drawer"
}
export enum SheetsAlign {
  start = "start",
  center = "center",
  end = "end"
}
export enum SheetsSide {
  top = "top",
  right = "right",
  bottom = "bottom",
  left = "left"
}
type SharedType = {
  unstyled?: boolean;
  className?: string;
  style?: React.CSSProperties & Record<string, any>;
};

type ComponentProps<T extends React.ElementType, Exclude extends string = never> = React.PropsWithoutRef<Omit<React.ComponentProps<T>, "style" | Exclude>> & SharedType;

type ComponentPropsWithRef<T extends React.ElementType, Exclude extends string = never> = React.PropsWithRef<Omit<React.ComponentProps<T>, "style" | Exclude>> & SharedType;

interface SheetsContextProps {
  variant: `${SheetsVariant}`;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  useHideScrollbar(value?: string | undefined): [boolean, number] | undefined;
  triggerBounding: InferType<typeof useElementRect>;
  contentBounding: InferType<typeof useElementRect>;
  render: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  openId: string | null;
  setOpenId: (value: string | null) => void;
  toggle: (value: string | undefined) => void;
  dataState: (isOpen?: boolean) => "open" | "closed" | "opened";
  attr(isOpen?: boolean | string): Record<string, string | undefined>;
  styleVars(): Record<string, never> | {};
  multipleOpen: boolean;
  defaultOpen: boolean | (string | null);
  clickOutsideToClose: boolean;
  modal: boolean;
  sideOffset: number;
  alignOffset: number;
  hotKeys: string;
  popstate: boolean;
  withOverlay: boolean;
  closedMultiple: (callback?: () => void) => void;
  isOpenMultiple: (value: string | undefined) => boolean;
  shouldRenderMultiple: (value: string | undefined) => boolean;
  handleOverlayClickMultiple: (e: React.MouseEvent, value: string | undefined) => void;
}

interface SheetsProviderProps extends Omit<Partial<SheetsContextProps>, "setOpen" | "setOpenId"> {
  children: React.ReactNode;
  open?: SheetsContextProps["open"];
  onOpenChange?: SheetsContextProps["setOpen"];
  openId?: SheetsContextProps["openId"];
  onOpenChangeId?: SheetsContextProps["setOpenId"];
  align?: SheetsContextProps["align"];
  side?: SheetsContextProps["side"];
  withOverlay?: boolean;
}

const SheetsCtx = React.createContext<SheetsContextProps | null>(null);

const useSheetsCtx = (value?: string) => {
  const ctx = React.useContext(SheetsCtx);
  if (!ctx) {
    throw new Error("useSheetsCtx must be used within a <Sheets>");
  }
  const { isOpenMultiple, shouldRenderMultiple, handleOverlayClickMultiple, toggle, ...rest } = ctx;
  return {
    isOpenMultiple: isOpenMultiple(value),
    shouldRenderMultiple: shouldRenderMultiple(value),
    toggle: () => toggle(value),
    handleOverlayClickMultiple: (e: React.MouseEvent) => handleOverlayClickMultiple(e, value),
    ...rest
  };
};

export function SheetsProvider(_props: SheetsProviderProps) {
  const {
    children,
    variant = "accordion",
    openId: openChangeId = undefined,
    onOpenChangeId = undefined,
    modal = false,
    open: openChange = undefined,
    onOpenChange = undefined,
    clickOutsideToClose = false,
    hotKeys = "",
    popstate = false,
    sideOffset = 0,
    alignOffset = 0,
    withOverlay,
    side = "bottom",
    align = "center",
    multipleOpen = false,
    defaultOpen = false
  } = _props;

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const defaultOpenBoolean = typeof defaultOpen === "boolean" ? defaultOpen || false : false;
  const defaultOpenString = typeof defaultOpen !== "boolean" ? defaultOpen || null : null;

  const isDropdown = variant === SheetsVariant.Dropdown;
  const isDropDrawer = ["dropdown", "drawer"].includes(variant);
  const isMeasureSize = ["accordion", "collapsible", "dropdown"].includes(variant);

  const [isOpen, setIsOpen] = React.useState(defaultOpenBoolean);
  const open = openChange !== undefined ? openChange : isOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setIsOpen;

  const [render, setRender] = React.useState(open);
  const [initialOpen, setInitialOpen] = React.useState(false);

  const [isOpenId, setIsOpenId] = React.useState<string | null>(defaultOpenString);
  const openId = openChangeId !== undefined ? openChangeId : isOpenId;
  const setOpenId = onOpenChangeId !== undefined ? onOpenChangeId : setIsOpenId;

  const [renderStates, setRenderStates] = React.useState<Record<string, boolean>>({});

  const triggerBounding = useElementRect<HTMLButtonElement>(triggerRef?.current);
  const contentBounding = useElementRect<HTMLDivElement>(contentRef?.current, render);

  const { newAlign, newSide } = useUpdatedPositions({
    triggerRect: triggerBounding.rect,
    contentRect: contentBounding.rect,
    align,
    side,
    sideOffset,
    alignOffset
  });

  const { vars } = getVarsPositions({
    sideOffset,
    alignOffset,
    align: newAlign,
    side: newSide,
    triggerRect: triggerBounding.rect,
    contentRect: contentBounding.rect,
    contentSize: contentBounding.size
  });

  useHotkeys([[hotKeys, () => setOpen(!open)]]);

  useMeasureScrollbar(!open ? render : open, { modal: modal });

  function useHideScrollbar(value?: string | undefined) {
    // if (!(multipleOpen && value)) return;
    const stateOpened = multipleOpen && value ? shouldRenderMultiple(value) : render;
    return useMeasureScrollbar(stateOpened, { modal });
  }

  const everyRefs = [triggerRef, contentRef];
  const handler = () => clickOutsideToClose && setOpen(false);

  useClickOutside(handler, everyRefs);

  React.useLayoutEffect(() => {
    if (multipleOpen) {
      if (triggerRef?.current) {
        triggerRef.current.dataset.refsId = triggerRef?.current?.id;
      }
      if (contentRef?.current) {
        contentRef.current.dataset.refsId = contentRef?.current?.id;
      }
    }
  }, [multipleOpen, triggerRef, contentRef]);

  React.useEffect(() => {
    if (defaultOpenString && multipleOpen) {
      setRenderStates(prev => ({ ...prev, [defaultOpenString]: true }));
    }
  }, [defaultOpenString, multipleOpen]);

  const closedMultiple = (callback?: () => void) => {
    if (multipleOpen) {
      if (openId) {
        setOpenId(null);
        setTimeout(() => {
          setRenderStates(prev => ({ ...prev, [openId]: false }));
          if (callback) callback();
        }, 150);
      } else if (callback) {
        callback();
      }
    }
  };

  const isOpenMultiple = (value: string | undefined) => openId === value;
  const shouldRenderMultiple = (value: string | undefined) => (value ? !!renderStates[value] : false);

  const handleOverlayClickMultiple = (e: React.MouseEvent, value: string | undefined) => {
    if (value && (e.target as HTMLElement).dataset.value === value) {
      closedMultiple();
    }
  };

  const toggle = React.useCallback(
    (value: string | undefined) => {
      if (value && multipleOpen) {
        if (openId === value) {
          closedMultiple();
        } else {
          closedMultiple(() => {
            setOpenId(value);
            setRenderStates(prev => ({ ...prev, [value]: true }));
          });
        }
      } else {
        if (!open) {
          if (popstate) {
            window.history.pushState({ open: true }, "");
          }
          setOpen(true);
        } else {
          if (popstate) {
            window.history.back();
          }
          setOpen(false);
        }
      }
    },
    [popstate, multipleOpen, setOpen, openId, setOpenId, closedMultiple, setRenderStates]
  );

  React.useLayoutEffect(() => {
    if (typeof defaultOpen === "boolean") {
      if (open !== defaultOpen) setInitialOpen(true);
    }
    if (typeof defaultOpen !== "boolean") {
      if (openId !== defaultOpen) setInitialOpen(true);
    }
  }, [open, openId, defaultOpen]);

  React.useEffect(() => {
    const historyPopState = () => {
      if (open) setOpen(false);
    };
    if (popstate) {
      window.addEventListener("popstate", historyPopState, { passive: true });
      return () => {
        window.removeEventListener("popstate", historyPopState);
      };
    }
  }, [popstate, open, setOpen]);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (!multipleOpen) {
      if (open) setRender(true);
      else timeoutId = setTimeout(() => setRender(false), 150);
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [multipleOpen, open]);

  const dataSide = isDropdown ? newSide : side;
  const dataAlign = isDropdown ? newAlign : align;
  const dataState = (isOpen: boolean = open) => (isOpen ? (initialOpen ? "open" : "opened") : "closed");

  function attr(isOpen: boolean | string = open) {
    return {
      "data-state": typeof isOpen === "boolean" ? dataState(isOpen) : isOpen,
      ...setValues(isDropdown, { "data-align": dataAlign }),
      ...setValues(isDropDrawer, { "data-side": dataSide })
    };
  }

  function styleVars() {
    return {
      ...setValues(isDropdown, {
        "--side-offset": `${sideOffset}px`,
        "--align-offset": `${alignOffset}px`,
        ...vars.triggerInset
      }),
      ...setValues(isMeasureSize, {
        ...vars.triggerSize,
        ...vars.contentSize
      })
    };
  }

  return (
    <SheetsCtx.Provider
      value={{
        variant,
        withOverlay: withOverlay || ["dialog", "drawer"].includes(variant),
        modal: modal || ["dialog", "drawer"].includes(variant),
        multipleOpen,
        defaultOpen,
        clickOutsideToClose,
        hotKeys,
        popstate,
        sideOffset,
        alignOffset,
        triggerRef,
        contentRef,
        overlayRef,
        useHideScrollbar,
        triggerBounding,
        contentBounding,
        render,
        open,
        setOpen,
        openId,
        setOpenId,
        toggle,
        attr,
        styleVars,
        dataState,
        side: dataSide,
        align: dataAlign,
        closedMultiple,
        isOpenMultiple,
        shouldRenderMultiple,
        handleOverlayClickMultiple
      }}
    >
      {children}
    </SheetsCtx.Provider>
  );
}

interface SheetsItemCtxProps {
  isOpen: boolean;
  value: string | undefined;
  toggleId: () => void;
  contentHeight: number;
  contentRef: React.RefObject<HTMLDivElement | null>;
  dataStateItem: string | undefined;
}

const SheetsItemCtx = React.createContext<SheetsItemCtxProps | undefined>(undefined);

const useSheetsItemCtx = () => React.useContext(SheetsItemCtx)!;

export type SheetsProps = ({ variant?: "accordion" } & SheetsAccordionProps) | ({ variant?: "collapsible" } & SheetsCollapsibleProps) | ({ variant?: "dialog" } & SheetsDialogProps) | ({ variant?: "drawer" } & SheetsDrawerProps) | ({ variant?: "dropdown" } & SheetsDropdownProps);

export const Sheets = React.forwardRef<React.ComponentRef<"div">, SheetsProps>((_props, ref) => {
  const { variant = "accordion", ...props } = _props;

  switch (variant) {
    case "accordion":
      return <SheetsAccordion ref={ref} {...(props as SheetsAccordionProps)} />;
    case "collapsible":
      return <SheetsCollapsible ref={ref} {...(props as SheetsCollapsibleProps)} />;
    case "dialog":
      return <SheetsDialog {...(props as SheetsDialogProps)} />;
    case "drawer":
      return <SheetsDrawer {...(props as SheetsDrawerProps)} />;
    case "dropdown":
      return <SheetsDropdown {...(props as SheetsDropdownProps)} />;
  }
}) as SheetsComponent;
Sheets.displayName = "Sheets";

export interface SheetsAccordionProps extends ComponentPropsWithRef<"div"> {
  defaultOpen?: string | null;
  openId?: SheetsContextProps["openId"];
  onOpenChangeId?: SheetsContextProps["setOpenId"];
}
export function SheetsAccordion(_props: SheetsAccordionProps) {
  const { children, defaultOpen, openId, onOpenChangeId, ...props } = _props;
  return (
    <SheetsProvider variant="accordion" {...{ defaultOpen, openId, onOpenChangeId }}>
      <SheetsRoot {...props}>{children}</SheetsRoot>
    </SheetsProvider>
  );
}
SheetsAccordion.displayName = "SheetsAccordion";

export interface SheetsCollapsibleProps extends ComponentPropsWithRef<"div"> {
  defaultOpen?: boolean;
  open?: SheetsContextProps["open"];
  onOpenChange?: SheetsContextProps["setOpen"];
  clickOutsideToClose?: boolean;
}
export function SheetsCollapsible(_props: SheetsCollapsibleProps) {
  const { children, defaultOpen, open, onOpenChange, clickOutsideToClose, ...props } = _props;

  const hasSheetsChild = hasSpecificChildren(children, [SheetsTrigger, SheetsContent], "some");

  const renderProvider = (content: React.ReactNode) => (
    <SheetsProvider variant="collapsible" {...{ defaultOpen, open, onOpenChange, clickOutsideToClose }}>
      {content}
    </SheetsProvider>
  );

  return hasSheetsChild ? renderProvider(<SheetsRoot {...props}>{children}</SheetsRoot>) : renderProvider(<SheetsContent {...props}>{children}</SheetsContent>);
}
SheetsCollapsible.displayName = "SheetsCollapsible";

export interface SheetsMultipleOpenTrue {
  multipleOpen?: true;
  defaultOpen?: string | null;
  openId?: SheetsContextProps["openId"];
  onOpenChangeId?: SheetsContextProps["setOpenId"];
}
export interface SheetsMultipleOpenFalse {
  multipleOpen?: false;
  defaultOpen?: boolean;
  open?: SheetsContextProps["open"];
  onOpenChange?: SheetsContextProps["setOpen"];
}

export type SheetsDialogProps = (SheetsMultipleOpenTrue | SheetsMultipleOpenFalse) & {
  children: React.ReactNode;
  modal?: boolean;
  hotKeys?: string;
  popstate?: boolean;
};
export function SheetsDialog(_props: SheetsDialogProps) {
  const { children, modal = true, ...props } = _props;
  return (
    <SheetsProvider variant="dialog" {...{ modal, ...props }}>
      {children}
    </SheetsProvider>
  );
}
SheetsDialog.displayName = "SheetsDialog";

export type SheetsDrawerProps = (SheetsMultipleOpenTrue | SheetsMultipleOpenFalse) & {
  children: React.ReactNode;
  modal?: boolean;
  hotKeys?: string;
  popstate?: boolean;
  side?: SheetsContextProps["side"];
};
export function SheetsDrawer(_props: SheetsDrawerProps) {
  const { children, side = "right", modal = true, ...props } = _props;
  return (
    <SheetsProvider variant="drawer" {...{ side, modal, ...props }}>
      {children}
    </SheetsProvider>
  );
}
SheetsDrawer.displayName = "SheetsDrawer";

export interface SheetsDropdownProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: SheetsContextProps["open"];
  onOpenChange?: SheetsContextProps["setOpen"];
  align?: SheetsContextProps["align"];
  side?: SheetsContextProps["side"];
  withOverlay?: boolean;
  clickOutsideToClose?: boolean;
  modal?: boolean;
  hotKeys?: string;
  sideOffset?: number;
  alignOffset?: number;
  popstate?: boolean;
  multipleOpen?: boolean;
}
export function SheetsDropdown(_props: SheetsDropdownProps) {
  const { children, side = "bottom", ...props } = _props;
  return (
    <SheetsProvider variant="dropdown" side={side} {...props}>
      {children}
    </SheetsProvider>
  );
}
SheetsDropdown.displayName = "SheetsDropdown";

export interface SheetsRootProps extends ComponentProps<"div"> {}
export const SheetsRoot = React.forwardRef<React.ComponentRef<"div">, SheetsRootProps>((_props, ref) => {
  const { className, unstyled, style, ...props } = _props;

  const { variant, ...ctx } = useSheetsCtx();

  return <div {...{ ref, ...(ctx?.attr() ?? {}), ...getStyles("root", { variant, className, unstyled }), style, ...props }} />;
});
SheetsRoot.displayName = "SheetsRoot";

export interface SheetsItemProps extends ComponentProps<"div"> {
  value?: string;
}
export const SheetsItem = React.forwardRef<React.ComponentRef<"div">, SheetsItemProps>((_props, ref) => {
  const { className, unstyled, style, value, "aria-expanded": arExp, ...props } = _props;
  const { variant, multipleOpen, openId, setOpenId, toggle, defaultOpen, ...ctx } = useSheetsCtx();

  const isAccordion = variant === SheetsVariant.Accordion;
  const isOpen = openId === value;
  const dataStateItem = ctx.dataState(isOpen);

  const [contentHeight, setContentHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    if (ctx?.contentRef?.current) {
      setContentHeight(ctx?.contentRef?.current?.scrollHeight);
    }
  }, [isOpen]);

  const toggleId = React.useCallback(() => {
    if (value) setOpenId(isOpen ? null : value);
  }, [isOpen, setOpenId]);

  const item = (
    <div
      ref={ref}
      {...{
        ...getStyles("item", { variant, className, unstyled }),
        ...props,
        "data-controls": value,
        "data-state": dataStateItem,
        "aria-expanded": arExp || (isAccordion ? isOpen : undefined)
      }}
    />
  );

  if (isAccordion) {
    return <SheetsItemCtx.Provider value={{ value, toggleId, isOpen, contentHeight, dataStateItem, contentRef: ctx?.contentRef }}>{item}</SheetsItemCtx.Provider>;
  }

  return item;
});
SheetsItem.displayName = "SheetsItem";

export interface SheetsTriggerProps extends ComponentProps<"button"> {
  openChangeOnContextMenu?: boolean;
}
export const SheetsTrigger = React.forwardRef<React.ComponentRef<"button">, SheetsTriggerProps>((_props, ref) => {
  const { openChangeOnContextMenu = false, type = "button", role = "button", className, id, unstyled, style, onClick, onContextMenu, "aria-controls": arCont, ...props } = _props;
  const { variant, ...ctx } = useSheetsCtx(id);
  const ctxItem = useSheetsItemCtx();

  const isAccordion = variant === SheetsVariant.Accordion;
  const openChange = () => {
    if (isAccordion && ctxItem) ctxItem?.toggleId();
    ctx?.toggle();
  };

  return (
    <button
      {...{
        ref: mergeRefs(ctx?.triggerRef, ref),
        type,
        role,
        id,
        ...props,
        "data-state-multiple": ctx?.multipleOpen ? (ctx?.isOpenMultiple ? "open" : "closed") : undefined,
        "data-value": ctx?.multipleOpen ? String(ctx?.triggerRef?.current?.id) : undefined,
        onClick: e => {
          onClick?.(e);
          if (!openChangeOnContextMenu) openChange();
        },
        onContextMenu: e => {
          onContextMenu?.(e);
          if (openChangeOnContextMenu) {
            e.preventDefault();
            openChange();
          }
        },
        ...ctx?.attr(ctxItem ? ctxItem?.dataStateItem : undefined),
        ...getStyles("trigger", { variant, className, unstyled }),
        style: {
          ...style
        },
        "aria-controls": isAccordion ? (ctxItem ? ctxItem?.value : undefined) : arCont
      }}
    />
  );
});
SheetsTrigger.displayName = "SheetsTrigger";

export interface SheetsContentProps extends ComponentProps<"div"> {
  value?: string;
  side?: SheetsContextProps["side"];
}
export const SheetsContent = React.forwardRef<React.ComponentRef<"div">, SheetsContentProps>((_props, ref) => {
  const { className, unstyled, value, side: propSide, ...props } = _props;
  const { variant = "accordion", side: ctxSide, multipleOpen } = useSheetsCtx(value);

  const side = propSide ?? ctxSide;
  const propsApi = { ref, ...props, ...getStyles("content", { variant, side, className, unstyled }), value };

  switch (variant) {
    case SheetsVariant.Accordion:
      return <SheetsContentCollapse {...propsApi} />;

    case SheetsVariant.Collapsible:
      return <SheetsContentCollapse {...propsApi} />;

    default:
      return multipleOpen ? <SheetsContentMultiple {...propsApi} /> : <SheetsContentDefault {...propsApi} />;
  }
});
SheetsContent.displayName = "SheetsContent";

const SheetsContentCollapse = React.forwardRef<React.ComponentRef<"div">, SheetsContentProps>((_props, ref) => {
  const { "aria-disabled": arDsb, style, value, ...props } = _props;
  const ctx = useSheetsCtx(value);
  const ctxItem = useSheetsItemCtx();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div
      {...{
        ref: mergeRefs(ctx?.contentRef, ref),
        ...props,
        role: "region",
        "aria-disabled": arDsb || (ctxItem ? !ctxItem?.isOpen : !ctx.render),
        "data-value": value,
        "aria-labelledby": value,
        ...ctx?.attr(ctxItem?.dataStateItem ?? undefined),
        style: ocx(
          style,
          ctxItem
            ? {
                "--accordion-content-h": rem(ctxItem?.isOpen ? ctxItem?.contentHeight : 0),
                height: typeof ctx.defaultOpen === "string" && ctxItem?.isOpen && !mounted ? "auto" : "var(--accordion-content-h)",
                overflow: "hidden",
                transition: "height 0.3s ease"
              }
            : ctx?.styleVars()
        )
      }}
    />
  );
});
SheetsContentCollapse.displayName = "SheetsContentCollapse";

const SheetsContentDefault = React.forwardRef<React.ComponentRef<"div">, SheetsContentProps>((_props, ref) => {
  const { "aria-disabled": arDsb, style, value, ...props } = _props;
  const ctx = useSheetsCtx(value);

  return (
    <SheetsPortal render={ctx?.render}>
      <SheetsOverlay />
      <div
        {...{
          ref: mergeRefs(ctx?.contentRef, ref),
          ...props,
          role: "region",
          "aria-disabled": arDsb || !ctx.render,
          "data-value": value,
          "aria-labelledby": value,
          ...ctx?.attr(),
          style: ocx(style, ctx?.styleVars())
        }}
      />
    </SheetsPortal>
  );
});
SheetsContentDefault.displayName = "SheetsContentDefault";

const SheetsContentMultiple = React.forwardRef<React.ComponentRef<"div">, SheetsContentProps>((_props, ref) => {
  const { "aria-disabled": arDsb, style, value, ...props } = _props;
  const { modal, ...ctx } = useSheetsCtx(value);

  // const dataState = ctx?.isOpenMultiple ? "open" : "closed";

  useMeasureScrollbar(ctx.shouldRenderMultiple, { modal });

  return (
    <SheetsPortal render={ctx?.shouldRenderMultiple}>
      <SheetsOverlay value={value} />
      <div
        {...{
          ref: mergeRefs(ctx?.contentRef, ref),
          ...props,
          "aria-disabled": arDsb || !ctx?.isOpenMultiple,
          "data-value": value,
          "aria-labelledby": value,
          ...ctx?.attr(ctx?.isOpenMultiple ? "open" : "closed"),
          style: ocx(style, ctx?.styleVars())
        }}
      />
    </SheetsPortal>
  );
});
SheetsContentMultiple.displayName = "SheetsContentMultiple";

export interface SheetsCloseProps extends ComponentProps<"button"> {}
export const SheetsClose = React.forwardRef<React.ComponentRef<"button">, SheetsCloseProps>((_props, ref) => {
  const { type = "button", className, unstyled, onClick, children, ...props } = _props;
  const { variant, ...ctx } = useSheetsCtx();
  return (
    <button
      {...{
        ref,
        type,
        ...props,
        onClick: e => {
          onClick?.(e);
          if (ctx?.multipleOpen) ctx?.closedMultiple();
          if (ctx && !ctx?.multipleOpen) ctx?.setOpen(false);
        },
        ...getStyles("closed", { variant, className, unstyled })
      }}
    >
      {children ?? (
        <Svg viewBox="0 0 18 24">
          <mask id="mask">
            <g stroke="#fff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 5l-14 14" strokeDasharray="24" strokeDashoffset="24">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0" />
              </path>
              <path strokeWidth="4" stroke="#000" d="M2 5l14 14" strokeDasharray="24" strokeDashoffset="24">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0" begin="0.4s" />
              </path>
              <path d="M2 5l14 14" strokeDasharray="24" strokeDashoffset="24">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0" begin="0.4s" />
              </path>
            </g>
          </mask>
          <path fill="currentColor" mask="url(#mask)" d="M0 0h18v24H0z" />
        </Svg>
      )}
    </button>
  );
});
SheetsClose.displayName = "SheetsClose";

export interface SheetsOverlayProps extends ComponentProps<"div"> {
  value?: string;
}
export const SheetsOverlay = React.forwardRef<React.ComponentRef<"div">, SheetsOverlayProps>((_props, ref) => {
  const { className, unstyled, style, onClick, value, ...props } = _props;
  const { variant, ...ctx } = useSheetsCtx(value);

  const dataState = ctx?.multipleOpen ? (ctx?.isOpenMultiple ? "open" : "closed") : undefined;

  if (!ctx.withOverlay) return null;

  return (
    <div
      {...{
        ref: mergeRefs(ctx?.overlayRef, ref),
        ...props,
        "data-value": value,
        ...ctx?.attr(dataState),
        ...getStyles("overlay", { variant, className, unstyled }),
        onClick: e => {
          onClick?.(e);
          if (ctx?.multipleOpen) ctx?.handleOverlayClickMultiple(e);
          if (ctx && !ctx?.multipleOpen) ctx?.setOpen(false);
        }
      }}
    />
  );
});
SheetsOverlay.displayName = "SheetsOverlay";

interface SheetsPortalProps {
  render: boolean;
  portal?: boolean;
  children: React.ReactNode;
  container?: Element | DocumentFragment | null;
  key?: null | string;
}
function SheetsPortal(props: SheetsPortalProps) {
  const { portal = true, render, children, container, key } = props;
  if (typeof document === "undefined" || !render) return null;
  return portal ? createPortal(children, container || document.body, key) : children;
}

function setValues<T>(state: boolean | undefined | string | number, attr: T): T | Record<string, never> {
  return state ? (attr as T) : {};
}

type Components = (string | false | React.JSXElementConstructor<any>)[];
function hasSpecificChildren(children: React.ReactNode, components: Components, method: "some" | "every" = "some"): boolean {
  return React.Children.toArray(children)[method](child => {
    if (!React.isValidElement(child)) return false;
    return components.includes(child.type);
  });
}

// Export as a composite component
type ForwardRef<T extends React.ElementType, Props> = React.ForwardRefExoticComponent<{ ref?: React.ComponentPropsWithRef<T>["ref"] } & Props>;
type SheetsComponent = ForwardRef<"div", SheetsProps> & {
  Accordion: typeof SheetsAccordion;
  Collapsible: typeof SheetsCollapsible;
  Dropdown: typeof SheetsDropdown;
  Dialog: typeof SheetsDialog;
  Drawer: typeof SheetsDrawer;
  Root: typeof SheetsRoot;
  Item: typeof SheetsItem;
  Trigger: typeof SheetsTrigger;
  Close: typeof SheetsClose;
  Content: typeof SheetsContent;
  Overlay: typeof SheetsOverlay;
  Portal: typeof SheetsPortal;
};
// Attach sub-components
Sheets.Accordion = SheetsAccordion;
Sheets.Collapsible = SheetsCollapsible;
Sheets.Dropdown = SheetsDropdown;
Sheets.Dialog = SheetsDialog;
Sheets.Drawer = SheetsDrawer;
Sheets.Root = SheetsRoot;
Sheets.Item = SheetsItem;
Sheets.Trigger = SheetsTrigger;
Sheets.Close = SheetsClose;
Sheets.Content = SheetsContent;
Sheets.Overlay = SheetsOverlay;
Sheets.Portal = SheetsPortal;

type __SheetsSelector = keyof typeof styleDefault;
interface Options {
  variant?: `${SheetsVariant}`;
  unstyled?: boolean;
  className?: string;
  side?: `${SheetsSide}`;
}

function getStyles(selector: __SheetsSelector, options: Options) {
  const { variant, side = "right", unstyled, className } = options;
  return {
    "data-sheets": selector,
    className: cn(!unstyled && styleByVariant(side)({ [selector]: variant }), className)
  };
}

const styleDefault = {
  root: "",
  item: "",
  trigger: "group/st",
  content: cvx({
    assign: "fixed z-[111] gap-4 bg-background p-6 shadow-lg transition ease-linear data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-200 data-[state=closed]:duration-200",
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    }
  }),
  overlay: "fixed inset-0 size-full z-[100] bg-background/50 supports-[backdrop-filter]:bg-background/50 cursor-default data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
  closed: "size-4 absolute right-4 top-4 text-muted-foreground hover:text-color rounded-lg disabled:opacity-50"
};

function styleByVariant(side: `${SheetsSide}`) {
  return cvx({
    variants: {
      root: { accordion: "", collapsible: "", dialog: "", drawer: "", dropdown: "" },
      item: {
        accordion: "group relative flex flex-col h-auto border-0 select-none gap-[--offset] data-[side=top]:flex-col-reverse data-[side=right]:flex-row data-[side=bottom]:flex-col data-[side=left]:flex-row-reverse data-[align=start]:items-start data-[align=center]:items-center data-[align=end]:items-end border-b",
        collapsible: "",
        dialog: "",
        drawer: "",
        dropdown: ""
      },
      trigger: {
        accordion: "relative z-9 w-full flex flex-row items-center justify-between flex-1 py-4 rounded-none font-medium hover:underline [&>svg]:data-[state*=open]:rotate-180",
        collapsible: styleDefault.trigger,
        dialog: styleDefault.trigger,
        drawer: styleDefault.trigger,
        dropdown: styleDefault.trigger
      },
      content: {
        accordion: "overflow-hidden transition-all bg-transparent m-0 p-0 w-full text-left",
        collapsible: "overflow-hidden transition-all data-[state=open]:animate-collapse-open data-[state=closed]:animate-collapse-closed bg-transparent m-0 p-0 w-full text-left",
        dialog:
          "fixed left-[50%] top-[50%] z-[111] min-h-80 w-80 translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border bg-background p-6 shadow-lg data-[state=closed]:duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:data-[side=bottom]:slide-out-to-top-2 data-[state=closed]:data-[side=left]:slide-out-to-right-2 data-[state=closed]:data-[side=right]:slide-out-to-left-2 data-[state=closed]:data-[side=top]:slide-out-to-bottom-2 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[60%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[60%]",
        drawer: styleDefault.content({ side }),
        dropdown:
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:data-[side=bottom]:slide-out-to-top-2 data-[state=closed]:data-[side=left]:slide-out-to-right-2 data-[state=closed]:data-[side=right]:slide-out-to-left-2 data-[state=closed]:data-[side=top]:slide-out-to-bottom-2 absolute z-[88] left-[--left] top-[--top] overflow-hidden bg-background rounded-xl border"
      },
      overlay: {
        accordion: styleDefault.overlay,
        collapsible: styleDefault.overlay,
        dialog: styleDefault.overlay,
        drawer: styleDefault.overlay,
        dropdown: cn(styleDefault.overlay, "z-[84]")!
      },
      closed: {
        accordion: styleDefault.closed,
        collapsible: styleDefault.closed,
        dialog: styleDefault.closed,
        drawer: styleDefault.closed,
        dropdown: styleDefault.closed
      }
    }
  });
}
