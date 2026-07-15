"use server";

import fs from "fs-extra";
import path from "node:path";
import { log } from "../../resource/log/development";

function filterContent(content: string, replace: Record<string, string>) {
  const lines = content.split("\n");
  const filterLine = (line: string) => !line.includes("ignore") && !line.includes("globalStyle") && !line.includes("__docs_demo");

  const filteredLines = lines
    .filter(line => filterLine(line))
    .map(line => {
      for (const [key, value] of Object.entries(replace)) {
        const regex = new RegExp(`\\b${key}\\b`, "g");
        line = line.replace(regex, value);
      }
      return line;
    });

  return filteredLines.join("\n").trimEnd();
}

export type Content = { content: string | null; extension: string | null };
export type GetContentOptions = {
  lang?: string;
  wrap?: boolean;
};

export async function raw(text: string, lang: string = "tsx showLineNumbers", replace: Record<string, string> = {}): Promise<string> {
  const result = filterContent(text, replace);
  return `\`\`\`${lang}\n${result}\n\`\`\``.trimEnd();
}

export async function getRepo(raw: string, replace: Record<string, string> = {}, options: { ext?: string; lang?: string } = {}): Promise<string> {
  const { ext = "", lang = "tsx showLineNumbers" } = options;
  const response = await fetch(`${raw}${ext}`);
  let text = await response.text();
  text = filterContent(text, replace);
  return `\`\`\`${lang}\n${text}\n\`\`\``.trimEnd();
}
const git_raw = "https://raw.githubusercontent.com/ilkhoeri/ui/refs/heads/master";

export async function getRawIcons(basePath: string, replace: Record<string, string> = {}, options: GetContentOptions = {}) {
  const { lang = "tsx showLineNumbers", wrap = true } = options;

  if (process.env.NODE_ENV === "development") {
    try {
      let text = await fs.readFile(path.join(process.cwd(), `${basePath}`), "utf-8");
      text = filterContent(text, replace);
      if (wrap) {
        text = `\`\`\`${lang}\n${text}\n\`\`\``;
      }

      return text.trimEnd() ? text : null;
    } catch (error: any) {
      log.error(error);
      return null;
    }
  }
  return await getRepo(`${git_raw}${basePath}`, replace, {});
}

export async function getContent(basePath: string, extensions: string[] = [".tsx", ".ts"], replace: Record<string, string> = {}, options: GetContentOptions = {}) {
  const { lang = "tsx showLineNumbers", wrap = true } = options;

  try {
    for (const ext of extensions) {
      try {
        let text = await fs.readFile(path.join(process.cwd(), `${basePath}${ext}`), "utf-8");

        text = filterContent(text, replace);
        if (wrap) {
          text = `\`\`\`${lang}\n${text}\n\`\`\``;
        }

        return {
          content: text.trimEnd() ? text : null,
          extension: ext
        };
      } catch (_e: any) {
        // Continue to the next extension if file is not found
      }
    }
    return { content: null, extension: null }; // If none of the extensions matched
  } catch (_e: any) {
    return { content: null, extension: null };
  }
}

export async function getCssContent(fileName: string, /* basePath: string, replace: Record<string, string> = {}, */ options: GetContentOptions = {}) {
  const { lang = "css showLineNumbers", wrap = true } = options;

  try {
    // Langkah 1: Cek di globals.css
    const globalCssPath = path.join(process.cwd(), "app", "globals.css");
    try {
      const globalCss = await fs.readFile(globalCssPath, "utf-8");

      // Cari blok CSS berdasarkan komentar
      const regex = new RegExp(`/\\*\\s*${fileName}\\s*\\*/[\\s\\S]*?(?=/\\*|$)`, "g");
      const matches = globalCss.match(regex);

      if (matches && matches.length > 0) {
        let content = matches[0].trim();

        if (wrap) {
          content = `\`\`\`${lang}\n${content}\n\`\`\``;
        }

        return {
          content,
          source: "globals.css"
        };
      }
    } catch (_e: any) {
      // Lanjutkan ke pencarian file jika globals.css tidak ditemukan atau tidak ada blok yang cocok
    }
    /**
    // Langkah 2: Cek file dengan ekstensi .css
    try {
      let text = await fs.readFile(path.join(process.cwd(), `${basePath}.css`), "utf-8");

      text = await filterContent(text, replace);
      if (wrap) {
        text = `\`\`\`${lang}\n${text}\n\`\`\``;
      }

      return {
        content: text.trimEnd() ? text : null,
        source: `${fileName}.css`
      };
    } catch (_e: any) {
      // Lanjutkan ke ekstensi berikutnya
    }
    */
    return { content: null, source: null }; // Jika tidak ada file yang cocok
  } catch (_e: any) {
    return { content: null, source: null };
  }
}

export async function getMdx(basePath: string, sectionId?: string): Promise<string | null> {
  try {
    const fullPathMd = path.join(process.cwd(), `${basePath}.md`);
    const fullPathMdx = path.join(process.cwd(), `${basePath}.mdx`);

    let text;
    try {
      text = await fs.readFile(fullPathMdx, "utf-8");
    } catch (_e: any) {
      text = await fs.readFile(fullPathMd, "utf-8");
    }

    if (!sectionId) {
      return text.trim() ? text : null;
    }

    const sectionRegex = new RegExp(`\\$:${sectionId}[\\s\\S]*?(?=\\$:|$)`, "g");
    const match = text.match(sectionRegex);

    if (match) {
      return match[0].replace(`$:${sectionId}`, "").trim();
    } else {
      return null;
    }
  } catch (_e: any) {
    return null;
  }
}
