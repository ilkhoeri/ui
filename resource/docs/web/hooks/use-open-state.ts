"use client";
import { createPortal } from "react-dom";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { useMeasureScrollbar } from "@/hooks/use-measure-scrollbar";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { SizeElement, useElementRect } from "@/hooks/use-element-info";

export enum Selector {
  Trigger = "trigger",
  Content = "content",
  Overlay = "overlay",
  Root = "root",
  Item = "item"
}
export enum DataAlign {
  start = "start",
  center = "center",
  end = "end"
}
export enum DataSide {
  top = "top",
  right = "right",
  bottom = "bottom",
  left = "left"
}
export enum DataState {
  open = "open",
  opened = "opened",
  closed = "closed"
}
export type RectInfo = "x" | "y" | "width" | "height" | "top" | "right" | "bottom" | "left" | "scrollX" | "scrollY";
type Observes = "side" | "align" | "touch" | "offset" | "sideswipe" | "alignswipe" | "triggerRect" | "contentRect" | "measureSize";
export type MeasureSize = { h: number | "auto"; w: number | "auto" };
export type RectElement = Record<RectInfo, number>;
interface ObserveOptions {
  observe?: Partial<Record<Observes, boolean>>;
}
interface StateSharedOptions {
  align?: `${DataAlign}`;
  side?: `${DataSide}`;
  sideOffset?: number;
  alignOffset?: number;
  multipleOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: SetStateAction<boolean>) => void;
  delay?: { open?: number; closed?: number };
}
export interface HoverOpenOptions extends StateSharedOptions {}
export interface ClickOpenOptions extends StateSharedOptions {
  modal?: boolean;
  popstate?: boolean;
  defaultOpen?: boolean;
  clickOutsideToClose?: boolean;
  hotKeys?: "/" | "M" | "ctrl+J" | "ctrl+K" | "alt+mod+shift+X" | (string & {});
}

export interface OpenStateOptions extends HoverOpenOptions, ClickOpenOptions, ObserveOptions {
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

const DEFAULTEVENTS = ["mousedown", "touchstart"];
const BUFFER_OFFSET = 2;

function nextValue<T>(currentValue: T, values: T[]): T {
  const currentIndex = values.indexOf(currentValue);
  const nextIndex = (currentIndex + 1) % values.length;
  if (currentIndex === values.length - 1) return values[currentIndex];
  return values[nextIndex];
}

export function setValues<T>(state: boolean | undefined | string | number, attr: T): T | Record<string, never> {
  return state ? (attr as T) : {};
}

export function setVars(selector: `${Selector}`, info?: RectElement): Record<string, string> | undefined {
  if (!info) return;
  const properties = ["height", "width", "x", "y", "right", "bottom"] as const;
  return properties.reduce(
    (acc, key) => {
      if (info[key] !== undefined) {
        acc[`--${selector}-${key[0]}`] = `${info[key]}px`;
      }
      return acc;
    },
    {} as Record<string, string>
  );
}

interface GetInsetProps {
  align: "start" | "center" | "end";
  side: "top" | "right" | "bottom" | "left";
  sideOffset: number;
  alignOffset: number;
  triggerRect: RectElement;
  contentRect: RectElement;
}

export function getInset(_props: GetInsetProps): readonly [number, number] {
  const { align, side, contentRect, sideOffset, alignOffset, triggerRect } = _props;
  let top: number = 0;
  let left: number = 0;

  const calcAlign = (triggerStart: number, triggerSize: number, contentSize: number): number => {
    switch (align) {
      case "start":
        return triggerStart;
      case "center":
        return triggerStart + (triggerSize - contentSize) / 2;
      case "end":
        return triggerStart + triggerSize - contentSize;
      default:
        return triggerStart;
    }
  };

  switch (side) {
    case "top":
      top = triggerRect.top - contentRect.height - sideOffset;
      left = calcAlign(triggerRect.left + alignOffset, triggerRect.width, contentRect.width);
      break;
    case "right":
      top = calcAlign(triggerRect.top + alignOffset, triggerRect.height, contentRect.height);
      left = triggerRect.right + sideOffset;
      break;
    case "bottom":
      top = triggerRect.bottom + sideOffset;
      left = calcAlign(triggerRect.left + alignOffset, triggerRect.width, contentRect.width);
      break;
    case "left":
      top = calcAlign(triggerRect.top, triggerRect.height, contentRect.height);
      left = triggerRect.left + alignOffset - contentRect.width - sideOffset;
      break;
  }

  if (typeof window !== "undefined") {
    const viewportWidth = window.innerWidth;
    if (left < BUFFER_OFFSET) {
      if (side === "left") {
        left = triggerRect.right + sideOffset; // ltr
      } else {
        left = BUFFER_OFFSET;
      }
    } else if (left + contentRect.width > viewportWidth - BUFFER_OFFSET) {
      if (side === "right") {
        left = triggerRect.left - contentRect.width - sideOffset; // rtl
      } else {
        left = viewportWidth - contentRect.width - BUFFER_OFFSET;
      }
    }
  }

  return [top, left] as const;
}

export interface UseVarsPositions extends GetInsetProps {
  contentSize: SizeElement | undefined;
}
export function getVarsPositions(required: UseVarsPositions) {
  const { triggerRect, contentRect, contentSize, ...others } = required;
  const [top, left] = getInset({ triggerRect, contentRect, ...others });

  const vars = {
    triggerInset: {
      "--top": `${top + triggerRect.scrollY}px`,
      "--left": `${left + triggerRect.scrollX}px`
    },
    triggerSize: {
      "--measure-trigger-h": `${triggerRect.height}px`,
      "--measure-trigger-w": `${triggerRect.width}px`
    },
    contentSize: {
      "--measure-available-h": `${contentSize?.h}px`,
      "--measure-available-w": `${contentSize?.w}px`
    }
  };
  return { vars, top, left };
}

export interface UseUpdatedPositions {
  triggerRect: RectElement;
  contentRect: RectElement;
  align: `${DataAlign}`;
  side: `${DataSide}`;
  sideOffset: number;
  alignOffset: number;
}
export function useUpdatedPositions(required: UseUpdatedPositions) {
  const { triggerRect, contentRect, align, side, sideOffset, alignOffset } = required;

  const [newSide, setNewSide] = useState(side);
  const [newAlign, setNewAlign] = useState(align);

  const updatedPosition = useCallback(() => {
    const dataAlign: `${DataAlign}`[] = ["start", "center", "end"];
    const [top, left] = getInset({ align, side, sideOffset, alignOffset, triggerRect, contentRect });

    if (triggerRect && contentRect) {
      const rect = { top, left, bottom: top + contentRect.height, right: left + contentRect.width, width: contentRect.width, height: contentRect.height };
      const isOutOfLeftViewport = rect.left < BUFFER_OFFSET;
      const isOutOfRightViewport = rect.right > window.innerWidth - BUFFER_OFFSET;
      const isOutOfTopViewport = rect.top < BUFFER_OFFSET;
      const isOutOfBottomViewport = rect.bottom > window.innerHeight - BUFFER_OFFSET;

      if (isOutOfLeftViewport) {
        if (side === DataSide.left) setNewSide(DataSide.right);
      } else if (isOutOfRightViewport) {
        if (side === DataSide.right) setNewSide(DataSide.left);
      } else if (isOutOfTopViewport) {
        if (side === DataSide.top) setNewSide(DataSide.bottom);
        if (newSide === DataSide.left || newSide === DataSide.right) setNewAlign(nextValue(newAlign, dataAlign?.toReversed()));
      } else if (isOutOfBottomViewport) {
        if (side === DataSide.bottom) setNewSide(DataSide.top);
        if (newSide === DataSide.left || newSide === DataSide.right) setNewAlign(nextValue(newAlign, dataAlign));
      } else {
        setNewSide(side);
        setNewAlign(align);
      }
    }
  }, [align, side, sideOffset, alignOffset, triggerRect, contentRect]);

  useLayoutEffect(() => {
    updatedPosition();
    window.addEventListener("scroll", updatedPosition);
    window.addEventListener("resize", updatedPosition);
    return () => {
      window.removeEventListener("scroll", updatedPosition);
      window.removeEventListener("resize", updatedPosition);
    };
  }, [updatedPosition]);

  return { newAlign, newSide, updatedPosition };
}

interface GetAttributesProps extends ObserveOptions {
  dataAlign?: `${DataAlign}`;
  dataSide?: `${DataSide}`;
}

function getAttributes(attr: GetAttributesProps) {
  const { dataAlign, observe, dataSide } = attr;
  return {
    ...setValues(observe?.align && dataAlign, { "data-align": dataAlign }),
    ...setValues(observe?.side && dataSide, { "data-side": dataSide })
  };
}

export interface PortalProps {
  render: boolean;
  portal?: boolean;
  children: React.ReactNode;
  container?: Element | DocumentFragment | null;
  key?: null | string;
}
export function Portal(_props: PortalProps) {
  const { portal = true, render, children, container, key } = _props;
  if (typeof document === "undefined" || !render) return null;
  return portal ? createPortal(children, container || document.body, key) : children;
}

export function useOpenState(options: OpenStateOptions = {}) {
  const {
    hotKeys = "",
    side = "bottom",
    align = "center",
    sideOffset = 0,
    alignOffset = 0,
    popstate = false,
    modal = false,
    defaultOpen = false,
    multipleOpen = false,
    clickOutsideToClose = false,
    open: openChange = undefined,
    onOpenChange = undefined,
    observe,
    triggerRef = useRef<HTMLButtonElement>(null),
    contentRef = useRef<HTMLDivElement>(null)
  } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const open = openChange !== undefined ? openChange : isOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setIsOpen;

  const [render, setRender] = useState(open);
  const [initialOpen, setInitialOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useHotkeys([[hotKeys, () => setOpen(!open)]]);
  useMeasureScrollbar(!open ? render : open, { modal });

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

  const toggle = useCallback(() => {
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
  }, [popstate, open, setOpen, multipleOpen, triggerRef]);

  const handleOnMouseEnter = useCallback(() => {
    if (!isTouchDevice) setOpen(true);
  }, [isTouchDevice, setOpen]);

  const handleOnMouseLeave = useCallback(() => {
    if (!isTouchDevice) setOpen(false);
  }, [isTouchDevice, setOpen]);

  const handleOnMouseMove = useCallback(() => {
    if (isTouchDevice) setIsTouchDevice(false);
  }, [isTouchDevice, setIsTouchDevice]);

  const handleOnTouchStart = useCallback(() => {
    if (!isTouchDevice) setIsTouchDevice(true);
    setOpen(true);
  }, [isTouchDevice, setIsTouchDevice, setOpen]);

  const handleOnTouchEnd = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      e.key === "Enter" && toggle();
    },
    [toggle]
  );

  useLayoutEffect(() => {
    if (open !== defaultOpen) setInitialOpen(true);
  }, [open, defaultOpen]);

  useEffect(() => {
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

  useEffect(() => {
    const attachListeners = (el: HTMLButtonElement | null) => {
      if (el) {
        if (observe?.touch) {
          el.addEventListener("touchstart", handleOnTouchStart);
          el.addEventListener("touchend", handleOnTouchEnd);
        }
      }
    };
    const detachListeners = (el: HTMLButtonElement | null) => {
      if (el) {
        if (observe?.touch) {
          el.removeEventListener("touchstart", handleOnTouchStart);
          el.removeEventListener("touchend", handleOnTouchEnd);
        }
      }
    };

    attachListeners(triggerRef.current);
    return () => {
      detachListeners(triggerRef.current);
    };
  }, [toggle, triggerRef, handleOnTouchStart, handleOnTouchEnd, observe?.touch]);
  const everyRefs = [triggerRef, contentRef];
  const handler = () => clickOutsideToClose && setOpen(false);
  const events = DEFAULTEVENTS;

  useClickOutside(handler, everyRefs, events);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (open) setRender(true);
    else timeoutId = setTimeout(() => setRender(false), 150);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [open]);

  const dataState = open ? (initialOpen ? "open" : "opened") : "closed";
  const dataSide = observe?.sideswipe ? newSide : side;
  const dataAlign = observe?.alignswipe ? newAlign : align;

  const { vars } = getVarsPositions({
    sideOffset,
    alignOffset,
    align: dataAlign,
    side: dataSide,
    triggerRect: triggerBounding.rect,
    contentRect: contentBounding.rect,
    contentSize: contentBounding.size
  });

  function attr(openState = dataState) {
    return {
      "data-state": openState,
      ...getAttributes({ dataAlign, dataSide, observe })
    };
  }

  function styleVars(selector: `${Selector}`) {
    return setValues(selector === "content", {
      ...setValues(observe?.sideswipe, {
        "--side-offset": `${sideOffset}px`,
        "--align-offset": `${alignOffset}px`,
        ...vars.triggerInset
      }),
      ...setValues(observe?.measureSize, {
        ...vars.triggerSize,
        ...vars.contentSize
      }),
      ...setValues(observe?.contentRect, setVars("content", contentBounding.rect))
    });
  }

  return {
    triggerRef,
    contentRef,
    triggerBounding,
    contentBounding,
    render,
    open,
    setOpen,
    Portal,
    toggle,
    attr,
    styleVars,
    dataState,
    side: dataSide,
    align: dataAlign,
    handleOnKeyDown,
    handleOnMouseEnter,
    handleOnMouseLeave,
    handleOnMouseMove,
    handleOnTouchStart,
    handleOnTouchEnd,
    isTouchDevice,
    setIsTouchDevice,
    observe
  };
}

export function useOpenStateHandler(trigger: "click" | "hover", use: Partial<InferType<typeof useOpenState>> = {}) {
  useEffect(() => {
    const windowTouchStart = () => {
      if (!use?.isTouchDevice) use?.setIsTouchDevice?.(true);
    };

    const attachListeners = (el: HTMLButtonElement | null) => {
      if (el) {
        if (trigger === "click") {
          el.addEventListener("click", () => use?.toggle?.());
        }
        if (trigger === "hover") {
          window.addEventListener("touchstart", windowTouchStart, { passive: true });
          window.addEventListener("mousemove", () => use?.handleOnMouseMove?.(), { passive: true });
          el.addEventListener("mouseenter", () => use?.handleOnMouseEnter?.());
          el.addEventListener("mouseleave", () => use?.handleOnMouseLeave?.());
          el.addEventListener("mousemove", () => use?.handleOnMouseMove?.());
        }
      }
    };
    const detachListeners = (el: HTMLButtonElement | null) => {
      if (el) {
        if (trigger === "click") {
          el.removeEventListener("click", () => use?.toggle?.());
        }
        if (trigger === "hover") {
          window.removeEventListener("touchstart", windowTouchStart);
          window.removeEventListener("mousemove", () => use?.handleOnMouseMove?.());
          el.removeEventListener("mouseenter", () => use?.handleOnMouseEnter?.());
          el.removeEventListener("mouseleave", () => use?.handleOnMouseLeave?.());
          el.removeEventListener("mousemove", () => use?.handleOnMouseMove?.());
        }
      }
    };

    attachListeners(use?.triggerRef?.current!);
    return () => {
      detachListeners(use?.triggerRef?.current!);
    };
  }, [trigger, use?.toggle, use?.triggerRef, use?.isTouchDevice, use?.setIsTouchDevice, use?.observe?.touch]);
}
