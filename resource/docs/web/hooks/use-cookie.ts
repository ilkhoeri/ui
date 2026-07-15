"use cilent";
import * as React from "react";

export type CookieName = string & {};

export function useCookie<T>(name: CookieName, defaultValue: T) {
  const getCookie = React.useCallback(() => {
    const cookies =
      typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find(row => row.startsWith(`${name}=`))
            ?.split("=")[1]
        : undefined;
    return (cookies ? decodeURIComponent(cookies) : defaultValue) as T;
  }, [name, defaultValue]);

  const [cookieValue, setCookieValue] = React.useState(getCookie);

  React.useEffect(() => {
    setCookieValue(getCookie());
  }, [getCookie]);

  const setCookie = React.useCallback(
    (value: string, days = 365) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
      setCookieValue(value as T);
    },
    [name]
  );

  return [cookieValue, setCookie] as const;
}
