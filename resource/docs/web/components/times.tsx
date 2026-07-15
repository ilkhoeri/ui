"use client";
import React from "react";
import Svg from "@/ui/svg";
import { cvx, type cvxVariants } from "xuxi";
import { cn } from "@/utils/cn";

const classesTime = "flex flex-row items-center justify-start gap-1";
const classes = cvx({
  variants: {
    selector: {
      root: "grid grid-flow-row gap-1 text-sm",
      createdAt: classesTime,
      updatedAt: classesTime,
      interval: classesTime
    }
  }
});

export type StoreSubscriber<Value> = (value: Value) => void;
export type __Selector = NonNullable<cvxVariants<typeof classes>["selector"]>;
type Options = StylesNames<__Selector> & {};
type CSSProperties = React.CSSProperties & { [key: string]: any };
type StylesNames<T extends string, Exclude extends string = never> = Omit<
  {
    unstyled?: Partial<Record<T, boolean>>;
    className?: string;
    style?: CSSProperties;
    classNames?: Partial<Record<T, string>>;
    styles?: Partial<Record<T, CSSProperties>>;
  },
  Exclude
>;
type ComponentProps<T extends React.ElementType, Exclude extends string = never> = StylesNames<__Selector> & {
  className?: string;
  style?: CSSProperties;
  color?: CSSProperties["color"];
} & React.PropsWithoutRef<Omit<React.ComponentProps<T>, "style" | "color" | Exclude>>;

function getStyles(selector: __Selector, options?: Options) {
  return {
    "data-card": cn(selector),
    className: cn(!options?.unstyled?.[selector] && classes({ selector }), options?.classNames?.[selector], options?.className),
    style: { ...options?.styles?.[selector], ...options?.style }
  };
}

export interface __TimesProps {
  diff?: TimeAgoFormat["diff"];
  locales?: TimeAgoFormat["locales"];
}

interface DefaultTimePropsConstructor extends ComponentProps<"time"> {
  time?: string | Date;
  locales?: TimeAgoFormat["locales"];
}

export interface TimeDefaultProps extends DefaultTimePropsConstructor {
  localeString?: Intl.DateTimeFormatOptions;
}
export interface TimeAgoProps extends DefaultTimePropsConstructor {
  diff?: TimeAgoFormat["diff"];
}

export type TimesProps = (TimeDefaultProps & { format?: "default" }) | (TimeAgoProps & { format?: "time-ago" });

export const Times = React.forwardRef<HTMLTimeElement, TimesProps>((_props, ref) => {
  const { time, children, suppressHydrationWarning, format = "default", ...props } = _props;
  if (format === "default") {
    const { localeString, locales, ...rest } = props as TimeDefaultProps;
    const content = children || (time && getTime(time, { locales, ...localeString }));
    // const dateTime = typeof window === "undefined" ? undefined : String(time);
    return <time {...{ ref, suppressHydrationWarning, ...rest }}>{content}</time>;
  }

  if (format === "time-ago") {
    const { locales, diff, ...rest } = props as TimeAgoProps;
    const content = children || (time && getTimeAgo(new Date(String(time)), { locales, diff }));
    // const dateTime = typeof window === "undefined" ? undefined : String(time);
    return <time {...{ ref, suppressHydrationWarning, ...rest }}>{content}</time>;
  }

  return null;
}) as TimesComponent;
Times.displayName = "Times";

export interface TimesPostedProps extends ComponentProps<"time">, __TimesProps, StylesNames<__Selector> {
  withInterval?: boolean;
  times?: {
    createdAt?: string | Date;
    updatedAt?: string | Date;
  };
}
export const TimesPosted = React.forwardRef<HTMLTimeElement, TimesPostedProps>((_props, ref) => {
  const { times, diff, locales, unstyled, className, classNames, style, styles, withInterval, ...props } = _props;

  if (!times) return null;

  const sameDate = isSameDate(times?.createdAt, times?.updatedAt);
  const stylesApi = { unstyled, classNames, styles };
  const formatApi = { diff, locales };
  return (
    <div {...getStyles("root", { className, style, ...stylesApi })}>
      {times?.createdAt && (
        <Times time={times?.createdAt} {...{ ref, ...getStyles("createdAt", stylesApi), ...props }}>
          <Svg>
            <path d="M20.983 12.548a9 9 0 1 0 -8.45 8.436" />
            <path d="M19 22v-6" />
            <path d="M22 19l-3 -3l-3 3" />
            <path d="M12 7v5l2.5 2.5" />
          </Svg>
          Posted: {getTimeAgo(new Date(times?.createdAt), formatApi)}
        </Times>
      )}
      {times?.updatedAt && !sameDate && (
        <Times time={times?.updatedAt} {...{ ref, ...getStyles("updatedAt", stylesApi), ...props }}>
          <Svg>
            <path d="M12 8l0 4l2 2" />
            <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
          </Svg>
          Updated: {getTimeAgo(new Date(times?.updatedAt), formatApi)}
        </Times>
      )}
      {withInterval && times?.createdAt && times?.updatedAt && !sameDate && (
        <Times time={times?.updatedAt} {...{ ref, ...getStyles("interval", stylesApi), ...props }}>
          <Svg>
            <path d="M14 10.5v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0 -3 0z" />
            <path d="M8 9h1.5a1.5 1.5 0 0 1 0 3h-.5h.5a1.5 1.5 0 0 1 0 3h-1.5" />
            <path d="M3 12v.01" />
            <path d="M7.5 4.2v.01" />
            <path d="M7.5 19.8v.01" />
            <path d="M4.2 16.5v.01" />
            <path d="M4.2 7.5v.01" />
            <path d="M12 21a9 9 0 0 0 0 -18" />
          </Svg>
          Interval: {getTimeInterval(new Date(times?.createdAt), new Date(times?.updatedAt))}
        </Times>
      )}
    </div>
  );
});
TimesPosted.displayName = "TimesPosted";

// Export Timeline as a composite component
type ForwardRef<T extends React.ElementType, Props> = React.ForwardRefExoticComponent<{ ref?: React.ComponentPropsWithRef<T>["ref"] } & Props>;
type TimesComponent = ForwardRef<"time", TimesProps> & {
  Posted: typeof TimesPosted;
};
// Attach sub-components
Times.Posted = TimesPosted;

// You can move the helper below into a separate file (eg: times-helper.ts) to support server-side use.

const DEFAULT_LOCALES: Intl.LocalesArgument = "id-ID";

interface GetTimeOptions extends Intl.DateTimeFormatOptions {
  locales?: Intl.LocalesArgument;
}
export function getTime(date: Date | string, opts: GetTimeOptions = {}) {
  const { locales = DEFAULT_LOCALES, day = "2-digit", year = "numeric", month = "long" } = opts;
  return new Date(date).toLocaleString(locales, {
    day,
    year,
    month
  });
}

export interface TimeAgoFormat {
  diff?: "days" | "short" | "long" | "growth";
  locales?: Intl.LocalesArgument;
  formatGrowth?: Intl.DateTimeFormatOptions;
}
export const getTimeAgo = (date: Date, format: TimeAgoFormat = {}): string => {
  const { diff = "short", locales = DEFAULT_LOCALES, formatGrowth = {} } = format;
  const { hour12 = false, minute = "2-digit", hour = "2-digit", day = "2-digit", month = "short", year = "numeric", ...opt } = formatGrowth;
  const now = new Date();
  const newdiff = date.getTime() - now.getTime();
  const isFuture = newdiff > 0;

  const seconds = Math.abs(Math.floor(newdiff / 1000));
  const minutes = Math.abs(Math.floor(seconds / 60));
  const hours = Math.abs(Math.floor(minutes / 60));
  const days = Math.abs(Math.floor(hours / 24));
  const months = Math.abs(Math.floor(days / 30));
  const years = Math.abs(Math.floor(days / 365));

  function formatFuture(times: string): string {
    return isFuture ? `In ${times}` : `${times} ago`;
  }

  function formatTime(value: number, unit: string): string {
    const format = `${value} ${unit}${value > 1 ? "s" : ""}`;
    return formatFuture(format);
  }

  function formatRemaining(years?: number, months?: number, days?: number) {
    const formatDays = `${days ? `, ${days} days` : ""}`;
    const format = years !== undefined ? `${years} years${months ? `, ${months} months` : ""}${formatDays}` : `${months} months${formatDays}`;
    return formatFuture(format);
  }

  function constructorTime() {
    if (days > 0) return formatTime(days, "day");
    if (hours > 0) return formatTime(hours, "hour");
    if (minutes > 0) return formatTime(minutes, "minute");
    return isFuture ? "In a few seconds" : "Just now";
  }

  date.setHours(date.getHours());
  const formatted = date
    .toLocaleDateString(locales, {
      hour12,
      minute,
      hour,
      day,
      month,
      year,
      ...opt
    })
    .replace(".", ":");

  switch (diff) {
    case "days":
      return constructorTime();

    case "short":
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString(locales, { month: "short" });
      const year = date.getFullYear().toString().slice(-2);
      const format = `${day} ${month} ${year}`;
      return isFuture ? `On ${format}` : format;

    case "long":
      if (years > 0) {
        const remainingMonths = Math.floor((days % 365) / 30);
        const remainingDays = (days % 365) % 30;
        return formatRemaining(years, remainingMonths, remainingDays);
      } else if (months > 0) {
        const remainingDays = days % 30;
        return formatRemaining(undefined, months, remainingDays);
      }
      return constructorTime();

    case "growth":
      if (days < 1) {
        if (hours > 0) return `${hours} hours ago`;
        if (minutes > 0) return `${minutes} minutes ago`;
        return "Just now";
      }
      return isFuture ? `On ${formatted}` : formatted;
  }
};

export function isSameDate(date1?: Date | string, date2?: Date | string) {
  if (!date1 || !date2) return;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
}

export const getTimeInterval = (date1: Date, date2: Date): string => {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} days`;
  } else if (hours > 0) {
    return `${hours} hours`;
  } else if (minutes > 0) {
    return `${minutes} minutes`;
  } else {
    return `${seconds} seconds`;
  }
};
