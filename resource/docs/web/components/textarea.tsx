import React from "react";
import { cn } from "@/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autosize?: boolean;
  unstyled?: boolean;
  serialize?: typeof JSON.stringify;
  deserialize?: typeof JSON.parse;
  style?: React.CSSProperties & { [key: string]: any };
  validateJson?: boolean;
  formatOnBlur?: boolean;
  validationError?: string;
  onValidationError?: (error: Error | null) => void;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((_props, ref) => {
  const { unstyled, className, autosize = true, spellCheck = false, validateJson = false, formatOnBlur = false, deserialize = JSON.parse, serialize = JSON.stringify, validationError = "Invalid JSON", readOnly, onValidationError, onBlur, onChange, onFocus, onInput, ...props } = _props;

  const onAutoSIze = (event: React.ChangeEvent<HTMLTextAreaElement>, safeHeight: number = 2) => {
    if (autosize && getEnv() !== "test") {
      event.currentTarget.style.height = "auto";
      event.currentTarget.style.height = `${event.currentTarget.scrollHeight + safeHeight}px`;
    }
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (validateJson) {
      if (formatOnBlur && !readOnly && value.trim() === "") {
        onValidationError?.(null);
        onBlur?.(event);
        return;
      }
      if (!isValidJson(value, deserialize)) {
        onValidationError?.(new Error(validationError));
        return;
      }
      if (formatOnBlur) {
        try {
          const formattedJson = serialize!(deserialize!(value), null, 2); // JSON format with 2-space indentation
          event.target.value = formattedJson;
          onAutoSIze(event);

          onChange?.({
            ...event,
            target: { ...event.target, value: formattedJson }
          });
        } catch (error: any) {
          console.log("JSON.parse", error);
        }
      }
      onValidationError?.(null);
    }
    onBlur?.(event);
  };

  const handleOnInput = (event: React.InputEvent<HTMLTextAreaElement>) => {
    if (validateJson && !readOnly) {
      onValidationError?.(null);
    }
    onFocus?.(event as any);
    onAutoSIze(event as any);
  };

  const handleOnFocus = (event: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    if (validateJson && event.target.value.trim() !== "") {
      if (isValidJson(event.target.value, deserialize)) onValidationError?.(null);
    }
    onInput?.(event as any);
  };

  return (
    <textarea
      {...{
        ref,
        readOnly,
        spellCheck,
        onChange,
        onBlur: handleOnBlur,
        onInput: handleOnInput,
        onFocus: handleOnFocus,
        className: cn(
          !unstyled && [
            "relative flex min-h-20 w-full max-w-full resize-y rounded-md border border-border bg-background p-3 py-2 text-sm leading-snug ring-offset-background scrollbar placeholder:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f81f7] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px] [&::-webkit-resizer]:hidden",
            { "bg-muted-emphasis font-mono text-sm text-muted-foreground focus-visible:ring-muted md:text-sm": validateJson }
          ],
          "[field-sizing:content]",
          className
        ),
        ...props
      }}
    />
  );
});
Textarea.displayName = "Textarea";

function getEnv() {
  if (typeof process !== "undefined" && process.env && process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }
  return "development";
}

export function isValidJson(value: string, deserialize: typeof JSON.parse) {
  if (typeof value === "string" && value.trim().length === 0) {
    return true;
  }
  try {
    deserialize(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}
