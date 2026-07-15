"use client";
import * as React from "react";
import { CodeLanguage } from "./types";

import { classes } from "./shiki-code-highlight-tabs";
import { highlightCode } from "../rehype/rehype-customizer";
import { useRehype } from "../rehype/use-rehype";

import type { HighlighterGeneric } from "shiki";

import moonlightTheme from "@/resource/docs_demo/assets/rehype/moonlight.json";

interface FallbackCode {
  code: string;
  highlighted: boolean;
  lang: CodeLanguage;
}

type HighlightCode = {
  shiki: (code: string, lang: CodeLanguage) => FallbackCode;
  rehype: (code: string, lang: CodeLanguage) => FallbackCode;
  RehypeSync: (code: string, lang: CodeLanguage) => FallbackCode;
};

function prepareHtmlCode(code: string) {
  return code
    .replaceAll('tabindex="0"', "")
    .replace("<code>", `<code class="${classes({ selector: "code" })}">`)
    .replaceAll('class="shiki moonlight"', `class="${classes({ selector: "pre" })}"`)
    .replaceAll('style="background-color:#ffffff;color:#1f2328"', "")
    .replaceAll('style="background-color:#1F2028;color:#c8d3f5"', "")
    .replaceAll('style="background-color:#0d1117;color:#e6edf3', "");
}

const Context = React.createContext<HighlightCode | null>(null);

interface ShikiProviderProps {
  children: React.ReactNode;
  loadShiki: () => Promise<HighlighterGeneric<any, any>>;
  code: string | null | undefined;
}

export function ShikiProvider({ children, loadShiki }: ShikiProviderProps) {
  const [shikiState, setShikiState] = React.useState<HighlighterGeneric<any, any> | null>(null);

  React.useLayoutEffect(() => {
    loadShiki().then(s => setShikiState(s));
  }, [loadShiki]);

  const shiki = React.useCallback(
    (code: string, lang: CodeLanguage = "tsx") => {
      if (!shikiState) {
        return { code, lang, highlighted: false };
      }

      return {
        code: prepareHtmlCode(shikiState.codeToHtml(code, { lang: lang, theme: moonlightTheme })),
        lang,
        highlighted: true
      };
    },
    [shikiState]
  );

  const [highlighted, setHighlighted] = React.useState<Record<string, string>>({});

  const rehype = React.useCallback(
    (code: string, lang: CodeLanguage = "tsx") => {
      // Kalau sudah ada hasil highlight sebelumnya
      if (highlighted[code]) {
        return { code: highlighted[code], lang, highlighted: true };
      }

      const raw = (text: string) => `\`\`\`${lang} showLineNumbers\n${text}\n\`\`\``;

      // Kalau belum, return langsung, sambil proses di background
      highlightCode(raw(code))
        .then(result => {
          setHighlighted(prev => ({ ...prev, [code]: result }));
        })
        .catch(error => {
          console.error("Highlight error:", error);
        });

      return { code, lang, highlighted: false };
    },
    [highlighted]
  );

  return <Context.Provider value={{ shiki, rehype, RehypeSync: (code, lang) => ({ code, lang, highlighted: true }) }}>{children}</Context.Provider>;
}

export function useShiki(): HighlightCode {
  const ctx = React.useContext(Context)!;
  // if (!ctx) throw new Error("useShiki must be used within a <TableTileProvider>");
  return {
    ...ctx,
    RehypeSync(code, lang) {
      const rehype = useRehype(code, { lang, showLineNumbers: true });
      return { code: rehype, highlighted: true, lang };
    }
  };
}

export function useShikiX() {
  const ctx = React.useContext(Context);
  /*
  const [prettyState, setPrettyState] = useState(code as string);

  useEffect(() => {
    if (code) {
      const setPretty = async () => {
        function raw(text: string, lang: string = "tsx"): string {
          return `\`\`\`${lang} showLineNumbers\n${text}\n\`\`\``.trimEnd();
        }
        try {
          const textPretty = await highlightCode(raw(code));
          setPrettyState(textPretty);
        } catch (error) {
          console.error("Text Pretty", error);
          setPrettyState(code as string);
          // alert('⚠️\nInput tidak sesuai');
        }
      };
      setPretty();
    }
  }, [code]);
  */
  if (!ctx) {
    return {
      shiki: (code: string, lang: CodeLanguage) => ({ code, lang, highlighted: false }),
      rehype: (code: string, lang: CodeLanguage) => ({ code, lang, highlighted: false })
    };
  }
  return ctx;
}
