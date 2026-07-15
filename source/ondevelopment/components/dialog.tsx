"use client";
import * as React from "react";
import { mergeRefs } from "@/hooks/use-merged-ref";
import { useMeasureScrollbar } from "@/hooks/use-measure-scrollbar";
import { XIcon } from "@/icons/*";
import ReactDOM from "react-dom";
import { cn } from "@/utils/cn";

type Side = "top" | "right" | "bottom" | "left";

interface DialogContextProps {
  openId: string | null;
  setOpenId: (value: string | null) => void;
  handleOverlayClick: (e: React.MouseEvent, value: string | undefined) => void;
  shouldRender: (value: string | undefined) => boolean;
  toggle: (value: string | undefined) => void;
  isOpen: (value: string | undefined) => boolean;
  closed: (callback?: () => void) => void;
  modal?: boolean;
  refs: {
    trigger: React.RefObject<HTMLButtonElement | null>;
    content: React.RefObject<HTMLDivElement | null>;
    overlay: React.RefObject<HTMLDivElement | null>;
  };
  side?: Side;
}

const DialogContext = React.createContext<DialogContextProps | undefined>(undefined);

const useDialogContext = (value?: string) => {
  const ctx = React.useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }
  const { isOpen, shouldRender, handleOverlayClick, toggle, side, ...rest } = ctx;
  return {
    isOpen: isOpen(value),
    shouldRender: shouldRender(value),
    toggle: () => toggle(value),
    handleOverlayClick: (e: React.MouseEvent) => handleOverlayClick(e, value),
    side,
    ...rest
  };
};

interface DialogProviderProps {
  children: React.ReactNode;
  defaultOpen?: string | null;
  modal?: boolean;
  side?: Side;
}

/**
 * ```js
 * // usage
 *  <DialogProvider>
      <DialogTrigger id="dialog1">Open Dialog 1</DialogTrigger>

      <DialogContent value="dialog1" side="bottom">
        <h1>Dialog 1</h1>
        <DialogTrigger id="dialog2" className="absolute bottom-4">Open Dialog 2</DialogTrigger>
        <DialogClose />
      </DialogContent>

      <DialogContent value="dialog2">
        <h1>Dialog 2</h1>
        <DialogClose />
      </DialogContent>
    </DialogProvider>
 * ```
 */
export const DialogProvider: React.FC<DialogProviderProps> = ({ children, defaultOpen = null, modal, side }) => {
  const [openId, setOpenId] = React.useState<string | null>(defaultOpen);

  const refs = {
    trigger: React.useRef<HTMLButtonElement>(null),
    content: React.useRef<HTMLDivElement>(null),
    overlay: React.useRef<HTMLDivElement>(null)
  };

  React.useLayoutEffect(() => {
    if (refs.trigger.current) {
      refs.trigger.current.dataset.refsId = refs.trigger.current?.id;
    }
    if (refs.content.current) {
      refs.content.current.dataset.refsId = refs.content.current?.id;
    }
  }, [refs.trigger, refs.content]);

  const [renderStates, setRenderStates] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (defaultOpen) {
      setRenderStates(prev => ({ ...prev, [defaultOpen]: true }));
    }
  }, [defaultOpen]);

  const toggle = (value: string | undefined) => {
    if (value) {
      if (openId === value) {
        closed();
      } else {
        closed(() => {
          setOpenId(value);
          setRenderStates(prev => ({ ...prev, [value]: true }));
        });
      }
    }
  };

  const closed = (callback?: () => void) => {
    if (openId) {
      setOpenId(null);
      setTimeout(() => {
        setRenderStates(prev => ({ ...prev, [openId]: false }));
        if (callback) callback();
      }, 150);
    } else if (callback) {
      callback();
    }
  };

  const isOpen = (value: string | undefined) => openId === value;
  const shouldRender = (value: string | undefined) => (value ? !!renderStates[value] : false);

  const handleOverlayClick = (e: React.MouseEvent, value: string | undefined) => {
    if (value && (e.target as HTMLElement).dataset.value === value) {
      closed();
    }
  };

  return (
    <DialogContext.Provider
      value={{
        refs,
        openId,
        setOpenId,
        toggle,
        isOpen,
        shouldRender,
        handleOverlayClick,
        closed,
        modal,
        side
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(({ type = "button", className, id, ...props }, ref) => {
  const ctx = useDialogContext(id);

  return <button ref={mergeRefs(ctx.refs.trigger, ref)} type={type} data-value={String(ctx.refs.trigger.current?.id)} onClick={ctx.toggle} className={cn("group relative z-50 h-9 min-w-24 rounded-md bg-color px-2 text-center font-medium text-background", className)} {...props} />;
});
DialogTrigger.displayName = "DialogTrigger";

export const DialogClose = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(({ type = "button", className, children, ...props }, ref) => {
  const ctx = useDialogContext();

  return (
    <button ref={ref} type={type} onClick={() => ctx.closed()} className={cn("absolute right-4 top-4 size-4 rounded-sm text-muted-foreground hover:text-color disabled:opacity-50", className)} {...props}>
      {children || <XIcon />}
    </button>
  );
});
DialogClose.displayName = "DialogClose";

export const DialogContent = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div"> & { value?: string; side?: Side }>(({ className, value, side, ...props }, ref) => {
  const { modal, ...ctx } = useDialogContext(value);

  const effectiveSide = ctx.side ?? side; // If `side` in `DialogContent` is overridden, use that value. Otherwise, use the value from `DialogProvider`.

  useMeasureScrollbar(ctx.shouldRender, { modal });

  if (!ctx.shouldRender) return null;

  return ReactDOM.createPortal(
    <>
      <div
        ref={ctx.refs.overlay}
        onClick={ctx.handleOverlayClick}
        data-state={ctx.isOpen ? "open" : "closed"}
        aria-labelledby={value}
        data-side={effectiveSide}
        data-value={value}
        className="fixed inset-0 z-[100] size-full cursor-default bg-background/50 data-[state=closed]:duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 supports-[backdrop-filter]:bg-background/50"
      />
      <div
        ref={mergeRefs(ctx.refs.content, ref)}
        data-state={ctx.isOpen ? "open" : "closed"}
        aria-labelledby={value}
        data-side={effectiveSide}
        className={cn(
          "fixed left-[50%] top-[50%] z-[111] h-80 w-80 translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg data-[state=closed]:duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:data-[side=bottom]:slide-out-to-top-2 data-[state=closed]:data-[side=left]:slide-out-to-right-2 data-[state=closed]:data-[side=right]:slide-out-to-left-2 data-[state=closed]:data-[side=top]:slide-out-to-bottom-2 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[60%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[60%]",
          className
        )}
        {...props}
      />
    </>,
    document.body
  );
});
DialogContent.displayName = "DialogContent";
