// contentlayer.config.ts
import { defineDocumentType, defineNestedType, makeSource } from "contentlayer2/source-files";
import rehypePrettyCode2 from "rehype-pretty-code";
import rehypeSlug2 from "rehype-slug";
import remarkGfm2 from "remark-gfm";
import rehypeAutolinkHeadings2 from "rehype-autolink-headings";
import rehypeStringify2 from "rehype-stringify";
import { visit as visit3 } from "unist-util-visit";
import { codeImport } from "remark-code-import";

// node_modules/@shikijs/compat/dist/index.mjs
import fs from "node:fs";
import fsp from "node:fs/promises";

// node_modules/@shikijs/types/dist/index.mjs
var ShikiError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ShikiError";
  }
};

// node_modules/@shikijs/transformers/dist/index.mjs
function transformerCompactLineOptions(lineOptions = []) {
  return {
    name: "@shikijs/transformers:compact-line-options",
    line(node, line) {
      const lineOption = lineOptions.find((o) => o.line === line);
      if (lineOption?.classes)
        this.addClassToHast(node, lineOption.classes);
      return node;
    }
  };
}
var symbol = Symbol("highlighted-lines");

// node_modules/@shikijs/compat/dist/index.mjs
import { bundledLanguages, bundledThemes, warnDeprecated, createHighlighter, normalizeTheme, tokenizeAnsiWithTheme } from "shiki";
import { normalizeTheme as normalizeTheme2, normalizeTheme as normalizeTheme3 } from "shiki";
var ShikiCompatError = class extends ShikiError {
  constructor(message) {
    super(message);
    this.name = "ShikiCompatError";
  }
};
var _warned = /* @__PURE__ */ new Set();
function warnOnce(message) {
  if (!_warned.has(message)) {
    console.warn(`[shiki-compat]: ${message}`);
    _warned.add(message);
  }
}
function stubFunction(name) {
  return () => {
    warnOnce(`\`${name}\` is a stub function in \`shiki-compat\` and does nothing.`);
  };
}
var setCDN = stubFunction("setCDN");
var setOnigasmWASM = stubFunction("setOnigasmWASM");
var setWasm = stubFunction("setWasm");
var setColorReplacements = stubFunction("setColorReplacements");
async function getHighlighter(options = {}) {
  warnDeprecated(`@shikijs/compat is deprecated and will be removed in v3, please migrate to the main shiki package`);
  const themes = options.themes || [];
  const langs = options.langs || [];
  if (options.theme)
    themes.unshift(options.theme);
  if (!themes.length)
    themes.push("nord");
  if (!langs.length)
    langs.push(...Object.keys(bundledLanguages));
  const shiki = await createHighlighter({
    ...options,
    themes,
    langs
  });
  const defaultTheme = shiki.getLoadedThemes()[0];
  function codeToTokensBase(code, lang, theme, options2) {
    const tokens = shiki.codeToTokensBase(code, {
      includeExplanation: true,
      lang,
      theme: theme || defaultTheme,
      ...options2
    });
    tokens.forEach((line) => {
      line.forEach((token) => {
        token.explanation || (token.explanation = []);
        delete token.offset;
      });
    });
    return tokens;
  }
  function codeToHtml(code, arg1, arg2, options2) {
    const options3 = (typeof arg1 === "string" ? options2 : arg1) || {};
    if (typeof arg1 === "string")
      options3.lang || (options3.lang = arg1);
    if (!("themes" in options3)) {
      options3.theme = "theme" in options3 ? options3.theme || defaultTheme : arg2 || defaultTheme;
    }
    if (options3.lineOptions) {
      options3.transformers || (options3.transformers = []);
      options3.transformers.push(transformerCompactLineOptions(options3.lineOptions));
    }
    return shiki.codeToHtml(code, options3);
  }
  function ansiToThemedTokens(ansi, options2 = {}) {
    const theme = shiki.getTheme(options2.theme || shiki.getLoadedThemes()[0]);
    return tokenizeAnsiWithTheme(theme, ansi);
  }
  return {
    ...shiki,
    ansiToThemedTokens,
    codeToTokensBase,
    codeToThemedTokens: codeToTokensBase,
    codeToHtml,
    ansiToHtml(code, options2) {
      return shiki.codeToHtml(code, {
        lang: "ansi",
        ...options2,
        theme: options2?.theme || defaultTheme
      });
    },
    getBackgroundColor(theme) {
      return shiki.getTheme(theme).bg;
    },
    getForegroundColor(theme) {
      return shiki.getTheme(theme).fg;
    },
    /**
     * @deprecated Not supported by Shiki
     */
    setColorReplacements(..._args) {
      throw new ShikiCompatError("`setColorReplacements` is not supported by @shikijs/compat");
    }
  };
}

// resource/docs_demo/assets/rehype/rehype-customizer.ts
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { visit } from "unist-util-visit";

// resource/docs_demo/assets/rehype/moonlight.json
var moonlight_default = {
  name: "moonlight",
  type: "dark",
  colors: {
    foreground: "#c8d3f5",
    focusBorder: "#82aaff",
    contrastBorder: "#15151b",
    "editorCursor.foreground": "#82aaff",
    "editorRuler.foreground": "#444a73bb",
    "scrollbar.shadow": "#00000022",
    "tree.indentGuidesStroke": "#828bb866",
    "editorLink.activeForeground": "#c8d3f5",
    "selection.background": "#c8d3f5",
    "progressBar.background": "#82aaff",
    "textLink.foreground": "#65bcff",
    "textLink.activeForeground": "#b2dfff",
    "editorLineNumber.foreground": "#444a73",
    "editorLineNumber.activeForeground": "#828bb8",
    "editorBracketMatch.border": "#82aaffbb",
    "editorBracketMatch.background": "#1F2028",
    "editorWhitespace.foreground": "#c8d3f540",
    "editor.background": "#1F2028",
    "editor.foreground": "#c8d3f5",
    "editor.lineHighlightBackground": "#2f334d",
    "editor.selectionBackground": "#828bb850",
    "editor.selectionHighlightBackground": "#444a73",
    "editor.findMatchBackground": "#444a73",
    "editor.findMatchBorder": "#86e1fc",
    "editor.findMatchHighlightBackground": "#444a73",
    "editorOverviewRuler.findMatchForeground": "#86e1fcbb",
    "editorOverviewRuler.errorForeground": "#ff757fcc",
    "editorOverviewRuler.infoForeground": "#65bcff66",
    "editorOverviewRuler.warningForeground": "#ffc777cc",
    "editorOverviewRuler.modifiedForeground": "#82aaff66",
    "editorOverviewRuler.addedForeground": "hsl(var(--green-900) / 0.4)",
    "editorOverviewRuler.deletedForeground": "#ff98a466",
    "editorOverviewRuler.bracketMatchForeground": "#3e68d7bb",
    "editorOverviewRuler.border": "#1F2028",
    "editorHoverWidget.background": "#15151b",
    "editorHoverWidget.border": "#000000aa",
    "editorIndentGuide.background": "#444a73bb",
    "editorIndentGuide.activeBackground": "#828bb8aa",
    "editorGroupHeader.tabsBackground": "#1c1d24",
    "editorGroup.border": "#15151b",
    "editorGutter.modifiedBackground": "#82aaff66",
    "editorGutter.addedBackground": "hsl(var(--green-900) / 0.4)",
    "editorGutter.deletedBackground": "#ff5370aa",
    "tab.activeBorder": "#82aaff",
    "tab.activeModifiedBorder": "#828bb8",
    "tab.unfocusedActiveBorder": "#828bb8",
    "tab.activeForeground": "#c8d3f5",
    "tab.activeBackground": "#1F2028",
    "tab.inactiveForeground": "#828bb8",
    "tab.inactiveBackground": "#1c1d24",
    "tab.unfocusedActiveForeground": "#c8d3f5",
    "tab.border": "#15151b",
    "statusBar.noFolderBackground": "#1F2028",
    "statusBar.border": "#15151b",
    "statusBar.background": "#1c1d24",
    "statusBar.foreground": "#828bb8",
    "statusBar.debuggingBackground": "#baacff",
    "statusBar.debuggingForeground": "#c8d3f5",
    "statusBarItem.hoverBackground": "#828bb820",
    "activityBar.background": "#1c1d24",
    "activityBar.border": "#1F202860",
    "activityBar.foreground": "#b4c2f0",
    "activityBarBadge.background": "#3e68d7",
    "activityBarBadge.foreground": "#ffffff",
    "titleBar.activeBackground": "#1c1d24",
    "titleBar.activeForeground": "#c8d3f5",
    "titleBar.inactiveBackground": "#1c1d24",
    "titleBar.inactiveForeground": "#828bb8",
    "sideBar.background": "#1c1d24",
    "sideBar.foreground": "#828bb8",
    "sideBar.border": "#15151b",
    "titleBar.border": "#15151b",
    "sideBarTitle.foreground": "#c8d3f5",
    "sideBarSectionHeader.background": "#1c1d24",
    "sideBarSectionHeader.border": "#2f334d",
    "input.background": "#15151b",
    "input.foreground": "#c8d3f5",
    "input.placeholderForeground": "#c8d3f5aa",
    "input.border": "#00000066",
    "inputValidation.errorBackground": "#c53b53",
    "inputValidation.errorForeground": "#ffffff",
    "inputValidation.errorBorder": "#ff537050",
    "inputValidation.infoBackground": "#446bbb",
    "inputValidation.infoForeground": "#ffffff",
    "inputValidation.infoBorder": "#82aaff50",
    "inputValidation.warningBackground": "#ad7c43",
    "inputValidation.warningForeground": "#ffffff",
    "inputValidation.warningBorder": "#ffc77750",
    "dropdown.foreground": "#c8d3f5",
    "dropdown.background": "#2f334d",
    "dropdown.border": "#00000066",
    "list.hoverForeground": "#c8d3f5",
    "list.hoverBackground": "#1c1d24",
    "list.activeSelectionBackground": "#383e5c",
    "list.activeSelectionForeground": "#ffffff",
    "list.inactiveSelectionForeground": "#c8d3f5",
    "list.inactiveSelectionBackground": "#292e46",
    "list.focusBackground": "#131421",
    "list.focusForeground": "#c8d3f5",
    "list.highlightForeground": "#86e1fc",
    "list.warningForeground": "#ffc777cc",
    "terminal.foreground": "#bcc4d6",
    "terminal.selectionBackground": "#c8d3f544",
    "terminal.ansiWhite": "#c8d3f5",
    "terminal.ansiBlack": "#000000",
    "terminal.ansiBlue": "#82aaff",
    "terminal.ansiCyan": "#86e1fc",
    "terminal.ansiGreen": "hsl(var(--green-900))",
    "terminal.ansiMagenta": "#fca7ea",
    "terminal.ansiRed": "#ff757f",
    "terminal.ansiYellow": "#ffc777",
    "terminal.ansiBrightWhite": "#c8d3f5",
    "terminal.ansiBrightBlack": "#828bb8",
    "terminal.ansiBrightBlue": "#82aaff",
    "terminal.ansiBrightCyan": "#86e1fc",
    "terminal.ansiBrightGreen": "hsl(var(--green-900))",
    "terminal.ansiBrightMagenta": "#fca7ea",
    "terminal.ansiBrightRed": "#ff757f",
    "terminal.ansiBrightYellow": "#ffc777",
    "terminal.border": "#2f334d",
    "scrollbarSlider.background": "#828bb830",
    "scrollbarSlider.hoverBackground": "#a9b8e830",
    "scrollbarSlider.activeBackground": "#82aaff",
    "minimap.findMatchHighlight": "#86e1fccc",
    "minimap.selectionHighlight": "#86e1fc33",
    "minimapGutter.addedBackground": "hsl(var(--green-900) / 0.4)",
    "minimapGutter.modifiedBackground": "#82aaff66",
    "editorSuggestWidget.background": "#15151b",
    "editorSuggestWidget.foreground": "#a9b8e8",
    "editorSuggestWidget.highlightForeground": "#86e1fc",
    "editorSuggestWidget.selectedBackground": "#2f334d",
    "editorSuggestWidget.border": "#00000033",
    "editorError.foreground": "#ff5370",
    "editorWarning.foreground": "#ffc777cc",
    "editorWidget.background": "#1c1d24",
    "editorWidget.resizeBorder": "#82aaff",
    "editorMarkerNavigation.background": "#c8d3f505",
    "widget.shadow": "#00000033",
    "panel.border": "#00000033",
    "panel.background": "#1c1d24",
    "panel.dropBackground": "#c8d3f5",
    "panelTitle.inactiveForeground": "#828bb8",
    "panelTitle.activeForeground": "#c8d3f5",
    "panelTitle.activeBorder": "#82aaff",
    "terminalCursor.foreground": "#82aaff",
    "diffEditor.insertedTextBackground": "hsl(var(--green-900) / 0.08)",
    "diffEditor.removedTextBackground": "#ff537020",
    "notifications.background": "#15151b",
    "notifications.foreground": "#c8d3f5",
    "notificationLink.foreground": "#82aaff",
    "badge.background": "#3e68d7",
    "badge.foreground": "#ffffff",
    "button.background": "#3e68d7",
    "button.hoverBackground": "#65bcffcc",
    "extensionButton.prominentBackground": "#3e68d7",
    "extensionButton.prominentHoverBackground": "#65bcffcc",
    "peekView.border": "#00000030",
    "peekViewEditor.background": "#c8d3f505",
    "peekViewTitle.background": "#c8d3f505",
    "peekViewResult.background": "#c8d3f505",
    "peekViewEditorGutter.background": "#c8d3f505",
    "peekViewTitleDescription.foreground": "#c8d3f560",
    "peekViewResult.matchHighlightBackground": "#828bb850",
    "peekViewEditor.matchHighlightBackground": "#828bb850",
    "debugToolBar.background": "#1c1d24",
    "pickerGroup.foreground": "#82aaff",
    "gitDecoration.deletedResourceForeground": "#ff5370dd",
    "gitDecoration.conflictingResourceForeground": "#ffc777cc",
    "gitDecoration.modifiedResourceForeground": "#82aaffee",
    "gitDecoration.untrackedResourceForeground": "#77e0c6dd",
    "gitDecoration.ignoredResourceForeground": "#777fabaa",
    "gitlens.trailingLineForegroundColor": "#828bb8aa",
    "editorCodeLens.foreground": "#828bb8",
    "peekViewResult.selectionBackground": "#828bb870",
    "breadcrumb.background": "#1F2028",
    "breadcrumb.foreground": "#828bb8",
    "breadcrumb.focusForeground": "#c8d3f5",
    "breadcrumb.activeSelectionForeground": "#82aaff",
    "breadcrumbPicker.background": "#1c1d24",
    "menu.background": "#1c1d24",
    "menu.foreground": "#c8d3f5",
    "menu.selectionBackground": "#00000050",
    "menu.selectionForeground": "#82aaff",
    "menu.selectionBorder": "#00000030",
    "menu.separatorBackground": "#c8d3f5",
    "menubar.selectionBackground": "#00000030",
    "menubar.selectionForeground": "#82aaff",
    "menubar.selectionBorder": "#00000030",
    "settings.dropdownForeground": "#c8d3f5",
    "settings.dropdownBackground": "#2f334d",
    "settings.dropdownBorder": "#15151b",
    "settings.numberInputForeground": "#c8d3f5",
    "settings.numberInputBackground": "#15151b",
    "settings.numberInputBorder": "#00000066",
    "settings.textInputForeground": "#c8d3f5",
    "settings.textInputBackground": "#15151b",
    "settings.textInputBorder": "#00000066",
    "settings.headerForeground": "#82aaff",
    "settings.modifiedItemIndicator": "#82aaff",
    "settings.checkboxBackground": "#131421",
    "settings.checkboxForeground": "#c8d3f5",
    "settings.checkboxBorder": "#00000066"
  },
  tokenColors: [
    {
      name: "Comment",
      scope: ["comment", "punctuation.definition.comment", "string.quoted.docstring"],
      settings: {
        foreground: "#858aa6"
      }
    },
    {
      name: "Variables and Plain Text",
      scope: ["variable", "support.variable", "string constant.other.placeholder", "text.html"],
      settings: {
        foreground: "hsl(var(--gray-1000))"
      }
    },
    {
      name: "DOM Variables",
      scope: ["support.variable.dom", "support.constant.math", "support.type.object.module", "support.variable.object.process", "support.constant.json"],
      settings: {
        foreground: "#ffc777"
      }
    },
    {
      name: "Nil",
      scope: ["constant.language.undefined", "constant.language.null"],
      settings: {
        foreground: "hsl(var(--pink-900))",
        fontStyle: "italic"
      }
    },
    {
      name: "PHP Constants",
      scope: ["constant.other.php"],
      settings: {
        foreground: "#ffc777"
      }
    },
    {
      name: "Colors",
      scope: ["constant.other.color"],
      settings: {
        foreground: "#ffffff"
      }
    },
    {
      name: "Invalid",
      scope: ["invalid", "invalid.illegal"],
      settings: {
        foreground: "#ff5370"
      }
    },
    {
      name: "Invalid deprecated",
      scope: ["invalid.deprecated"],
      settings: {
        foreground: "#c099ff"
      }
    },
    {
      name: "Keyword, Storage",
      scope: ["keyword", "keyword.other.important"],
      settings: {
        foreground: "hsl(var(--purple-900))"
      }
    },
    {
      name: "Keyword, Storage",
      scope: ["storage.type", "storage.modifier", "keyword.control"],
      settings: {
        foreground: "hsl(var(--pink-900))",
        fontStyle: "italic"
      }
    },
    {
      name: "Keyword, Storage",
      scope: ["keyword.control", "storage"],
      settings: {}
    },
    {
      name: "Interpolation",
      scope: ["punctuation.definition.template-expression", "punctuation.section.embedded", "punctuation.definition.tag"],
      settings: {
        foreground: "hsl(var(--gray-1000))"
      }
    },
    {
      name: "Spread",
      scope: ["keyword.operator.spread", "keyword.operator.rest"],
      settings: {
        foreground: "hsl(var(--pink-900))",
        fontStyle: "bold"
      }
    },
    {
      name: "Operator, Misc",
      scope: ["punctuation", "punctuation.definition.string", "punctuation.definition.tag"],
      settings: {
        foreground: "hsl(var(--gray-900))"
      }
    },
    {
      name: "Operator, Misc",
      scope: [
        "keyword.operator",
        "keyword.control",
        "punctuation.support.type.property-name",
        "text.html.vue-html meta.tag",
        "punctuation.definition.keyword",
        "punctuation.terminator.rule",
        "punctuation.definition.entity",
        "constant.other.color",
        "meta.tag",
        "punctuation.separator.inheritance.php",
        "punctuation.definition.block.tag",
        "punctuation.definition.tag.html",
        "punctuation.definition.tag.begin.html",
        "punctuation.definition.tag.end.html",
        "meta.property-list",
        "meta.brace.square",
        "keyword.other.template",
        "keyword.other.substitution"
      ],
      settings: {
        foreground: "hsl(var(--pink-900))"
      }
    },
    {
      name: "Keyword Control",
      scope: ["keyword.control"],
      settings: {}
    },
    {
      name: "Tag",
      scope: ["entity.name.tag", "meta.tag", "markup.deleted.git_gutter"],
      settings: {
        foreground: "hsl(var(--pink-900))"
      }
    },
    {
      name: "Function, Special Method",
      scope: ["entity.name.function", "variable.function", "keyword.other.special-method"],
      settings: {
        foreground: "hsl(var(--amber-600))"
      }
    },
    {
      name: "Support Function",
      scope: ["support.function", "meta.function-call entity.name.function"],
      settings: {
        foreground: "hsl(var(--amber-600))"
      }
    },
    {
      name: "C-related Block Level Variables",
      scope: ["source.cpp meta.block variable.other"],
      settings: {
        foreground: "#ff757f"
      }
    },
    {
      name: "Other Variable, String Link",
      scope: ["support.other.variable", "string.other.link"],
      settings: {
        foreground: "#ff757f"
      }
    },
    {
      name: "Constant, Function Argument, Tag Attribute, Embedded",
      scope: ["variable.other.constant", "constant.language", "keyword.other.type.php", "storage.type.php", "support.constant", "constant.character", "constant.escape", "keyword.other.unit"],
      settings: {
        foreground: "hsl(var(--purple-900))"
      }
    },
    {
      name: "Number, Boolean",
      scope: ["constant.numeric", "constant.language.boolean", "constant.language.json", "constant.language.infinity", "constant.language.nan"],
      settings: {
        foreground: "hsl(var(--purple-900))",
        fontStyle: "italic"
      }
    },
    {
      name: "Function Argument",
      scope: ["variable.parameter.function.language.special", "variable.parameter", "meta.function.parameter variable"],
      settings: {
        foreground: "hsl(var(--amber-700))",
        fontStyle: "italic"
      }
    },
    {
      name: "String, Symbols, Inherited Class, Markup Heading",
      scope: ["string", "constant.other.symbol", "constant.other.key", "entity.other.inherited-class", "markup.heading", "markup.inserted.git_gutter", "meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js", "meta.attribute-selector"],
      settings: {
        fontStyle: "",
        foreground: "hsl(var(--green-900))"
      }
    },
    {
      name: "Object",
      scope: ["variable.other.object"],
      settings: {
        foreground: "hsl(var(--gray-1000))"
      }
    },
    {
      name: "Object Key",
      scope: ["string.alias.graphql", "string.unquoted.graphql", "string.unquoted.alias.graphql", "meta.field.declaration.ts variable.object.property", "variable.object.property"],
      settings: {
        foreground: "hsl(var(--gray-1000))"
      }
    },
    {
      name: "Object Key",
      scope: ["meta.object-literal.key"],
      settings: {
        foreground: "hsl(var(--amber-700))",
        fontStyle: "italic"
      }
    },
    {
      name: "Nested Object Property",
      scope: ["meta.object.member", "variable.other.object.property"],
      settings: {
        foreground: "hsl(var(--gray-1000))"
      }
    },
    {
      name: "Object Property",
      scope: ["variable.other.property", "support.variable.property", "support.variable.property.dom"],
      settings: {
        foreground: "hsl(var(--gray-1000))"
      }
    },
    {
      name: "Haskell Constants",
      scope: ["source.haskell constant.other.haskell"],
      settings: {
        foreground: "#ff98a4"
      }
    },
    {
      name: "Haskell Imports",
      scope: ["source.haskell meta.import.haskell entity.name.namespace"],
      settings: {
        foreground: "#c8d3f5"
      }
    },
    {
      name: "Types Fixes",
      scope: ["source.haskell storage.type", "source.c storage.type", "source.java storage.type"],
      settings: {
        foreground: "#ffc777"
      }
    },
    {
      name: "Lambda Arrow",
      scope: ["storage.type.function"],
      settings: {
        foreground: "hsl(var(--pink-900))"
      }
    },
    {
      name: "Class, Support",
      scope: ["entity.name", "support.type", "support.class", "support.orther.namespace.use.php", "meta.use.php", "support.other.namespace.php", "markup.changed.git_gutter", "entity.other.inherited-class", "support.type.sys-types"],
      settings: {
        foreground: "hsl(var(--blue-1000))"
      }
    },
    {
      name: "Entity types",
      scope: ["support.type"],
      settings: {
        foreground: "hsl(var(--blue-1000))"
      }
    },
    {
      name: "CSS Class and Support",
      scope: [
        "source.css support.type.property-name",
        "source.sass support.type.property-name",
        "source.scss support.type.property-name",
        "source.less support.type.property-name",
        "source.stylus support.type.property-name",
        "source.postcss support.type.property-name",
        "support.type.property-name.css",
        "support.type.vendored.property-name"
      ],
      settings: {
        foreground: "#82aaff"
      }
    },
    {
      name: "Sub-methods",
      scope: ["entity.name.module.js", "variable.import.parameter.js", "variable.other.class.js"],
      settings: {
        foreground: "#ff757f"
      }
    },
    {
      name: "Language methods",
      scope: ["variable.language"],
      settings: {
        foreground: "#ff757f"
      }
    },
    {
      name: "entity.name.method.js",
      scope: ["entity.name.method.js"],
      settings: {
        foreground: "#82aaff"
      }
    },
    {
      name: "meta.method.js",
      scope: ["meta.class-method.js entity.name.function.js", "variable.function.constructor"],
      settings: {
        foreground: "#82aaff"
      }
    },
    {
      name: "Attributes",
      scope: ["entity.other.attribute-name"],
      settings: {
        foreground: "hsl(var(--amber-600))",
        fontStyle: "italic"
      }
    },
    {
      name: "HTML Attributes",
      scope: ["text.html.basic entity.other.attribute-name.html", "text.html.basic entity.other.attribute-name"],
      settings: {
        foreground: "#ffc777"
      }
    },
    {
      name: "HTML Doctype",
      scope: ["meta.tag.metadata.doctype entity.name.tag", "meta.tag.metadata.doctype entity.other.attribute-name"],
      settings: {
        foreground: "#c099ff"
      }
    },
    {
      name: "CSS Classes",
      scope: ["entity.other.attribute-name.class"],
      settings: {
        foreground: "#ffc777"
      }
    },
    {
      name: "CSS ID's",
      scope: ["source.sass keyword.control"],
      settings: {
        foreground: "#82aaff"
      }
    },
    {
      name: "CSS psuedo selectors",
      scope: ["entity.other.attribute-name.pseudo-class", "entity.other.attribute-name.pseudo-element"],
      settings: {
        foreground: "#4fd6be"
      }
    },
    {
      name: "CSS Property value",
      scope: ["support.constant.property-value"],
      settings: {
        foreground: "#fca7ea"
      }
    },
    {
      name: "Inserted",
      scope: ["markup.inserted"],
      settings: {
        foreground: "hsl(var(--green-900))"
      }
    },
    {
      name: "Deleted",
      scope: ["markup.deleted"],
      settings: {
        foreground: "#ff757f"
      }
    },
    {
      name: "Changed",
      scope: ["markup.changed"],
      settings: {
        foreground: "#c099ff"
      }
    },
    {
      name: "Regular Expressions",
      scope: ["string.regexp"],
      settings: {
        foreground: "#b4f9f8"
      }
    },
    {
      name: "Regular Expressions - Punctuation",
      scope: ["punctuation.definition.group"],
      settings: {
        foreground: "#ff757f"
      }
    },
    {
      name: "Regular Expressions - Character Class",
      scope: ["constant.other.character-class.regexp", "keyword.control.anchor.regexp"],
      settings: {
        foreground: "#c099ff"
      }
    },
    {
      name: "Regular Expressions - Character Class Set",
      scope: ["constant.other.character-class.set.regexp"],
      settings: {
        foreground: "#ffc777"
      }
    },
    {
      name: "Regular Expressions - Quantifier",
      scope: ["keyword.operator.quantifier.regexp"],
      settings: {
        foreground: "#fca7ea"
      }
    },
    {
      name: "Escape Characters",
      scope: ["constant.character.escape"],
      settings: {
        foreground: "#86e1fc"
      }
    },
    {
      name: "URL",
      scope: ["*url*", "*link*", "*uri*"],
      settings: {
        fontStyle: "underline"
      }
    },
    {
      name: "Decorators",
      scope: ["tag.decorator.js entity.name.tag.js", "tag.decorator.js punctuation.definition.tag.js"],
      settings: {
        foreground: "#82aaff"
      }
    },
    {
      name: "CSS Units",
      scope: ["keyword.other.unit"],
      settings: {
        foreground: "#fc7b7b"
      }
    },
    {
      name: "ES7 Bind Operator",
      scope: ["source.js constant.other.object.key.js string.unquoted.label.js"],
      settings: {
        foreground: "#ff757f"
      }
    },
    {
      name: "JSON Key - Level 0",
      scope: ["source.json meta.structure.dictionary.json support.type.property-name.json"],
      settings: {
        foreground: "#82aaff"
      }
    },
    {
      name: "JSON Key - Level 1",
      scope: ["source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"],
      settings: {
        foreground: "#65bcff"
      }
    },
    {
      name: "JSON Key - Level 2",
      scope: ["source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"],
      settings: {
        foreground: "#ff757f"
      }
    },
    {
      name: "JSON Key - Level 3",
      scope: ["source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"],
      settings: {
        foreground: "#fca7ea"
      }
    },
    {
      name: "JSON Key - Level 4",
      scope: [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      settings: {
        foreground: "#ffc777"
      }
    },
    {
      name: "JSON Key - Level 5",
      scope: [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      settings: {
        foreground: "#4fd6be"
      }
    },
    {
      name: "JSON Key - Level 6",
      scope: [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      settings: {
        foreground: "#82aaff"
      }
    },
    {
      name: "Plain Punctuation",
      scope: ["punctuation.definition.list_item.markdown"],
      settings: {
        foreground: "#828bb8"
      }
    },
    {
      name: "Block Punctuation",
      scope: ["meta.block", "punctuation.definition.block", "punctuation.definition.parameters", "punctuation.section.function"],
      settings: {
        foreground: "hsl(var(--gray-1000))"
      }
    },
    {
      name: "Block Punctuation",
      scope: ["meta.brace"],
      settings: {
        foreground: "hsl(var(--blue-900))"
      }
    },
    {
      name: "Markdown - Plain",
      scope: ["meta.jsx.children", "meta.embedded.block"],
      settings: {
        foreground: "hsl(var(--color))"
      }
    },
    {
      name: "Markdown - Markup Raw Inline",
      scope: ["text.html.markdown markup.inline.raw.markdown"],
      settings: {
        foreground: "#c099ff"
      }
    },
    {
      name: "Markdown - Markup Raw Inline Punctuation",
      scope: ["text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown"],
      settings: {
        foreground: "#86e1fc"
      }
    },
    {
      name: "Markdown - Heading punctuation",
      scope: ["markdown.heading", "markup.heading | markup.heading entity.name", "markup.heading.markdown punctuation.definition.heading.markdown"],
      settings: {
        foreground: "#86e1fc"
      }
    },
    {
      name: "Markup - Italic",
      scope: ["markup.italic"],
      settings: {
        fontStyle: "italic",
        foreground: "#ff757f"
      }
    },
    {
      name: "Markup - Bold",
      scope: ["markup.bold", "markup.bold string"],
      settings: {
        fontStyle: "bold",
        foreground: "#ff757f"
      }
    },
    {
      name: "Markup - Bold-Italic",
      scope: ["markup.bold markup.italic", "markup.italic markup.bold", "markup.quote markup.bold", "markup.bold markup.italic string", "markup.italic markup.bold string", "markup.quote markup.bold string"],
      settings: {
        fontStyle: "bold",
        foreground: "#ff757f"
      }
    },
    {
      name: "Markup - Underline",
      scope: ["markup.underline"],
      settings: {
        fontStyle: "underline",
        foreground: "#ff966c"
      }
    },
    {
      name: "Markdown - Blockquote",
      scope: ["markup.quote punctuation.definition.blockquote.markdown"],
      settings: {
        foreground: "#86e1fc"
      }
    },
    {
      name: "Markup - Quote",
      scope: ["markup.quote"],
      settings: {
        fontStyle: "italic"
      }
    },
    {
      name: "Markdown - Link",
      scope: ["string.other.link.title.markdown"],
      settings: {
        foreground: "#82aaff"
      }
    },
    {
      name: "Markdown - Link Description",
      scope: ["string.other.link.description.title.markdown"],
      settings: {
        foreground: "#c099ff"
      }
    },
    {
      name: "Markdown - Link Anchor",
      scope: ["constant.other.reference.link.markdown"],
      settings: {
        foreground: "#ffc777"
      }
    },
    {
      name: "Markup - Raw Block",
      scope: ["markup.raw.block"],
      settings: {
        foreground: "#c099ff"
      }
    },
    {
      name: "Markdown - Fenced Bode Block Variable",
      scope: ["markup.fenced_code.block.markdown", "markup.inline.raw.string.markdown"],
      settings: {
        foreground: "#86e1fc"
      }
    },
    {
      name: "Markdown - Fenced Language",
      scope: ["variable.language.fenced.markdown"],
      settings: {
        foreground: "#86e1fc"
      }
    },
    {
      name: "Markdown - Separator",
      scope: ["meta.separator"],
      settings: {
        fontStyle: "bold",
        foreground: "#86e1fc"
      }
    },
    {
      name: "Markup - Table",
      scope: ["markup.table"],
      settings: {
        foreground: "#828bb8"
      }
    },
    {
      scope: "token.info-token",
      settings: {
        foreground: "#65bcff"
      }
    },
    {
      scope: "token.warn-token",
      settings: {
        foreground: "#ffc777"
      }
    },
    {
      scope: "token.error-token",
      settings: {
        foreground: "#ff757f"
      }
    },
    {
      scope: "token.debug-token",
      settings: {
        foreground: "#c099ff"
      }
    }
  ]
};

// resource/docs_demo/assets/rehype/rehype-customizer.ts
function rehypeNpmCommand() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "element" || node?.tagName !== "pre") {
        return;
      }
      if (node.properties?.["__rawString__"]?.startsWith("npm install")) {
        const npmCommand = node.properties?.["__rawString__"];
        node.properties["__npmCommand__"] = npmCommand;
        node.properties["__yarnCommand__"] = npmCommand.replace("npm install", "yarn add");
        node.properties["__pnpmCommand__"] = npmCommand.replace("npm install", "pnpm add");
        node.properties["__bunCommand__"] = npmCommand.replace("npm install", "bun add");
      }
      if (node.properties?.["__rawString__"]?.startsWith("npx create-")) {
        const npmCommand = node.properties?.["__rawString__"];
        node.properties["__npmCommand__"] = npmCommand;
        node.properties["__yarnCommand__"] = npmCommand.replace("npx create-", "yarn create ");
        node.properties["__pnpmCommand__"] = npmCommand.replace("npx create-", "pnpm create ");
        node.properties["__bunCommand__"] = npmCommand.replace("npx", "bunx --bun");
      }
      if (node.properties?.["__rawString__"]?.startsWith("npm create")) {
        const npmCommand = node.properties?.["__rawString__"];
        node.properties["__npmCommand__"] = npmCommand;
        node.properties["__yarnCommand__"] = npmCommand.replace("npm create", "yarn create");
        node.properties["__pnpmCommand__"] = npmCommand.replace("npm create", "pnpm create");
        node.properties["__bunCommand__"] = npmCommand.replace("npm create", "bun create");
      }
      if (node.properties?.["__rawString__"]?.startsWith("npx") && !node.properties?.["__rawString__"]?.startsWith("npx create-")) {
        const npmCommand = node.properties?.["__rawString__"];
        node.properties["__npmCommand__"] = npmCommand;
        node.properties["__yarnCommand__"] = npmCommand;
        node.properties["__pnpmCommand__"] = npmCommand.replace("npx", "pnpm dlx");
        node.properties["__bunCommand__"] = npmCommand.replace("npx", "bunx --bun");
      }
    });
  };
}

// resource/docs_demo/assets/rehype/rehype-component.ts
import { visit as visit2 } from "unist-util-visit";

// scripts/generated-source-codes.ts
import fs2 from "fs-extra";
import path from "node:path";

// source/ondevelopment/utils/currency.ts
var formatterIDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR"
});
var formatterLong = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  // Menetapkan jumlah digit di belakang koma
  maximumFractionDigits: 0
  // Menetapkan jumlah maksimum digit di belakang koma
});

// source/utils/index.ts
function sourceFile(segment) {
  if (segment === void 0)
    return null;
  const sourceFolder = segment.join("/");
  return `${sourceFolder}`;
}
function getSlug(segment) {
  return segment === void 0 ? " " : segment[segment.length - 1];
}

// scripts/generated-source-codes.ts
function sourceCodes(segment) {
  const resource = `/resource/docs/${sourceFile(segment)}`;
  const extensions = [".tsx", ".ts"];
  let code = null;
  let css = null;
  try {
    for (const ext of extensions) {
      const filePath = path.join(process.cwd(), `${resource}${ext}`);
      if (fs2.existsSync(filePath)) {
        code = fs2.readFileSync(filePath, "utf-8").trimEnd();
        break;
      }
    }
    const globalCssPath = path.join(process.cwd(), "app", "globals.css");
    if (fs2.existsSync(globalCssPath)) {
      const globalCss = fs2.readFileSync(globalCssPath, "utf-8");
      const regex = new RegExp(`/\\*\\s*${getSlug(segment)}\\s*\\*/[\\s\\S]*?(?=/\\*|$)`, "g");
      const matches = globalCss.match(regex);
      if (matches && matches.length > 0) {
        css = matches[0].trimEnd();
      }
    }
    return { code, css };
  } catch (error) {
    console.error("Error reading source code or CSS:", error);
  }
  return { code: null, css: null };
}

// resource/docs_demo/generated/files-meta-docs.ts
var fileDocsMeta = [
  {
    name: "anchor",
    ext: ".tsx",
    path: "/docs/web/components/anchor",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Anchor",
      description: "A basic component used to create navigational links or anchors within the page, often used for internal linking.",
      summary: "A simple anchor element that allows seamless navigation across different sections or external URLs.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "avatar",
    ext: ".tsx",
    path: "/docs/web/components/avatar",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Avatar",
      description: "A component used to display user profile images or placeholders. Can be customized with text, icons, or images.",
      summary: "A customizable component for displaying user avatars, ideal for profiles and social media integration.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "breadcrumb",
    ext: ".tsx",
    path: "/docs/web/components/breadcrumb",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Breadcrumb",
      description: "Displays the user's current page hierarchy, enhancing navigation and providing context. It is typically placed at the top of a page.",
      summary: "A navigation aid that shows the user's path within a website or application, improving user experience.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "burger",
    ext: ".tsx",
    path: "/docs/web/components/burger",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Burger",
      description: "A hamburger menu component that is typically used for mobile or collapsed navigation. It toggles the visibility of a menu.",
      summary: "A mobile-friendly component that shows a collapsed navigation menu, often used for responsive design.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "button",
    ext: ".tsx",
    path: "/docs/web/components/button",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Button",
      description: "A clickable element that triggers actions when interacted with. Can be customized in terms of style, size, and behavior.",
      summary: "A versatile UI component that executes an action when clicked, fully customizable in terms of appearance and behavior.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "card",
    ext: ".tsx",
    path: "/docs/web/components/card",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Card",
      description: "A container component used for grouping content together in a modular way. Often used for displaying summaries, images, or interactive content.",
      summary: "A flexible container for organizing and displaying content in a structured format.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "carousel",
    ext: ".tsx",
    path: "/docs/web/components/carousel",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Carousel",
      description: "A component that allows users to cycle through a set of items, such as images or content, in a horizontal or vertical layout.",
      summary: "A swipeable or clickable slider that showcases a collection of items in an interactive manner.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "checker",
    ext: ".tsx",
    path: "/docs/web/components/checker",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Checker",
      description: "A combined component for checkbox, switch, and radio button functionality. Useful for managing multiple selections or binary choices.",
      summary: "A versatile input component that includes checkboxes, switches, and radio buttons for interactive selection.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "code",
    ext: ".tsx",
    path: "/docs/web/components/code",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Code",
      description: "A component designed to display code snippets in a readable format, often with syntax highlighting for better readability.",
      summary: "A code display component that enhances the readability of code snippets with optional syntax highlighting.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "color-picker",
    ext: ".tsx",
    path: "/docs/web/components/color-picker",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Color Picker",
      description: "A tool that allows users to select colors visually, often used for customizing designs or selecting background/foreground colors.",
      summary: "An interactive component that enables users to pick colors, useful for design customization and theme selection.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "command",
    ext: ".tsx",
    path: "/docs/web/components/command",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Command",
      description: "A dialog component that facilitates search functionality, often featuring fuzzy search capabilities for quick and efficient filtering.",
      summary: "A search dialog component that provides fuzzy search for locating items quickly within the application.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "confetti",
    ext: ".tsx",
    path: "/docs/web/components/confetti",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Confetti",
      description: "A visual effect component that renders celebratory confetti animation, often used for success messages or festive interactions.",
      summary: "A fun and engaging animation component that displays confetti for celebration or reward effects.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "copy-button",
    ext: ".tsx",
    path: "/docs/web/components/copy-button",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "CopyButton",
      description: "A utility button that copies a specified text to the clipboard when clicked. Often accompanied by a tooltip or visual confirmation.",
      summary: "A button that lets users copy text to the clipboard with a single click.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "double-helix-words",
    ext: ".tsx",
    path: "/docs/web/components/double-helix-words",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Double Helix Words",
      description: "An animated text component that displays words in a double-helix style motion, ideal for dynamic headlines or creative effects.",
      summary: "A visually striking text animation component that mimics the motion of a double helix.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "floating-indicator",
    ext: ".tsx",
    path: "/docs/web/components/floating-indicator",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Floating Indicator",
      description: "A UI element that floats near or on top of a reference element, often used for highlighting or drawing attention to specific areas.",
      summary: "A floating visual cue that indicates or highlights elements in the UI.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "group",
    ext: ".tsx",
    path: "/docs/web/components/group",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Group",
      description: "A layout component that groups multiple elements together with consistent spacing, alignment, or styling.",
      summary: "A utility component for grouping and aligning multiple elements as a cohesive unit.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "highlight",
    ext: ".tsx",
    path: "/docs/web/components/highlight",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Highlight Text",
      description: "Highlights specific parts of a string or content, commonly used in search results to show matched keywords.",
      summary: "A text enhancement component that highlights matching words or important content.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "indicator",
    ext: ".tsx",
    path: "/docs/web/components/indicator",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Indicator",
      description: "A badge-like component that indicates status, alerts, or notifications on top of other UI elements.",
      summary: "A small visual indicator used to display status or alerts over other elements.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "input",
    ext: ".tsx",
    path: "/docs/web/components/input",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Input",
      description: "A basic text input field with customizable props for user data entry, including support for various states and validation.",
      summary: "A flexible and accessible input field for text-based user input.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "kbd",
    ext: ".tsx",
    path: "/docs/web/components/kbd",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Kbd",
      description: "A component that visually represents keyboard keys, used for shortcuts or instructions in documentation and tutorials.",
      summary: "A stylized component that displays keyboard keys for user instructions or guides.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "label",
    ext: ".tsx",
    path: "/docs/web/components/label",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Label",
      description: "A component that tags and describes form elements, ensuring accessibility and clear UI semantics.",
      summary: "A label element used to describe form controls and inputs.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "loader",
    ext: ".tsx",
    path: "/docs/web/components/loader",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Loader",
      description: "A loading indicator component used to show that content or data is being loaded or processed.",
      summary: "A loading indicator component used to show that content or data is being loaded or processed.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "pagination",
    ext: ".tsx",
    path: "/docs/web/components/pagination",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Pagination",
      description: "A navigation component for splitting content into multiple pages, often used in tables, lists, or galleries.",
      summary: "A content navigation control that enables paging through large datasets or items.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "password-requirement",
    ext: ".tsx",
    path: "/docs/web/components/password-requirement",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Password Requirement",
      description: "Component for displaying live password validation feedback based on defined requirements, optionally with strength progress bars.",
      summary: "Shows live validation feedback for password requirements.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "polymorphic-slot",
    ext: ".tsx",
    path: "/docs/web/components/polymorphic-slot",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Polymorphic Slot",
      description: "A flexible component that allows dynamic rendering of its children as different HTML elements or components, while preserving props and context.",
      summary: "A dynamic slot component for rendering flexible and customizable child elements.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "progress",
    ext: ".tsx",
    path: "/docs/web/components/progress",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Progress",
      description: "A flexible progress bar component that visually indicates task completion and supports multiple sections for complex progress tracking.",
      summary: "Visualizes progress with optional multi-section support.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "prose",
    ext: ".tsx",
    path: "/docs/web/components/prose",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Prose",
      description: "Designed to simplify content rendering with sanitized HTML support for custom elements and additional styles.",
      summary: "A content wrapper that applies beautiful and readable typographic styling to its children.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "rating",
    ext: ".tsx",
    path: "/docs/web/components/rating",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Rating",
      description: "A visual component for capturing or displaying rating values, usually represented by stars or other icons.",
      summary: "An interactive or read-only component for displaying ratings, commonly using stars.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "running-area",
    ext: ".tsx",
    path: "/docs/web/components/running-area",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Running Area",
      description: "A motion wrapper that continuously scrolls its children in a loop (e.g. right-to-left), restarting from the beginning once it reaches the end.",
      summary: "A looping motion container for creating continuous scrolling effects like marquees.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "scroll-area",
    ext: ".tsx",
    path: "/docs/web/components/scroll-area",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Scroll Area",
      description: "A styled scroll container with custom scrollbars and behavior, useful for containing overflowing content in a clean, controlled manner.",
      summary: "A customizable scrollable container for displaying overflow content elegantly.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "sheets",
    ext: ".tsx",
    path: "/docs/web/components/sheets",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Sheets",
      description: "A utility set for building modal dialogs, dropdowns, drawers, collapsibles, and accordions, with support for nested interactions.",
      summary: "A flexible system for creating dialogs, dropdowns, drawers, and accordions, including nested support.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "skeleton",
    ext: ".tsx",
    path: "/docs/web/components/skeleton",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Skeleton",
      description: "A loading placeholder component that mimics the shape of content while data is being fetched or processed.",
      summary: "A placeholder UI used to indicate loading states by imitating content structure.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "slider",
    ext: ".tsx",
    path: "/docs/web/components/slider",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Slider",
      description: "An interactive input component that lets users pick a numeric value or range by dragging a handle along a track.",
      summary: "A draggable control for selecting numeric values within a defined range.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "stack",
    ext: ".tsx",
    path: "/docs/web/components/stack",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Stack",
      description: "A vertical flex container that arranges children in a column with consistent spacing. Ideal for vertical layouts.",
      summary: "A vertical stack layout component for cleanly aligning elements with spacing.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "svg",
    ext: ".tsx",
    path: "/docs/web/components/svg",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Svg",
      description: "A wrapper component for rendering inline SVGs with default properties and styles, simplifying the use of icons without external dependencies.",
      summary: "An enhanced SVG wrapper with built-in styling, perfect for custom inline icons.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "table",
    ext: ".tsx",
    path: "/docs/web/components/table",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Table",
      description: "A component for rendering data in rows and columns with customizable headers, cells, and responsive behavior.",
      summary: "A structured component for displaying tabular data with customizable formatting.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "tabs",
    ext: ".tsx",
    path: "/docs/web/components/tabs",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Tabs",
      description: "A component for managing multiple views or content sections in a single space using tabbed navigation.",
      summary: "A tab-based interface for switching between different content panels.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "textarea",
    ext: ".tsx",
    path: "/docs/web/components/textarea",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Textarea",
      description: "A multi-line input component for capturing longer text content from users, such as comments or messages.",
      summary: "A form input for capturing multi-line text with customizable styling and behavior (support JsonInput).",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "timeline",
    ext: ".tsx",
    path: "/docs/web/components/timeline",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Timeline",
      description: "A vertical layout component for displaying chronological events, steps, or milestones with visual clarity.",
      summary: "A visual component for outlining events or steps in a time-based sequence.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "times",
    ext: ".tsx",
    path: "/docs/web/components/times",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Times",
      description: "A utility component for displaying or selecting times, often used in time pickers or schedule-based inputs.",
      summary: "A time utility for presenting or interacting with time values in the UI.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "toaster",
    ext: ".tsx",
    path: "/docs/web/components/toaster",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Toaster",
      description: "Provides an easy-to-use notification system for displaying toast messages, built with a highly customizable and accessible foundation.",
      summary: "Displays transient notifications with flexible configuration options.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "tooltip",
    ext: ".tsx",
    path: "/docs/web/components/tooltip",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Tooltip",
      description: "A hover- or focus-triggered popup that displays additional information or hints related to a target element.",
      summary: "A small popup that provides extra context or hints when hovering or focusing on an element.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "typing-words",
    ext: ".tsx",
    path: "/docs/web/components/typing-words",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Typing Words",
      description: "An animated text component that simulates a typing and deleting effect, cycling through a list of strings.",
      summary: "A typing animation that types and erases text based on a predefined string array.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "typography",
    ext: ".tsx",
    path: "/docs/web/components/typography",
    segment: ["web", "components"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Typography",
      description: "A self-styled text component that renders semantic HTML elements (e.g., h1\u2013h6, p, span, ul, li) with consistent typography, supporting both el and variant props for maximum flexibility.",
      summary: "A semantic text component with built-in styling, customizable via element (el) or style variant.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "app-context",
    ext: ".tsx",
    path: "/docs/web/configuration/app-context",
    segment: ["web", "configuration"],
    meta: {
      date: "2025-04-23T00:00:00.000Z",
      title: "App Provider",
      description: "A context provider to manage application-wide state including direction, theme, and sidebar visibility using cookies.",
      summary: "Provides a React context for directionality (LTR/RTL), theme preferences, and sidebar toggling, integrated with cookie persistence.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "global.d",
    ext: ".ts",
    path: "/docs/web/configuration/global.d",
    segment: ["web", "configuration"],
    meta: {
      date: "2025-04-23T00:00:00.000Z",
      title: "global.d.ts",
      description: "A TypeScript declaration file that extends global types or modules. Often used for custom types or extending third-party library types.",
      summary: "A TypeScript file for augmenting global declarations or adding custom global types.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "themes",
    ext: ".tsx",
    path: "/docs/web/configuration/themes",
    segment: ["web", "configuration"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Themes",
      description: "A set of utilities and components for managing application themes (light, dark, system). Includes logic for switching, persisting, and applying themes dynamically.",
      summary: "Theme management utilities and components supporting light, dark, and system themes.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "types",
    ext: ".tsx",
    path: "/docs/web/configuration/types",
    segment: ["web", "configuration"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Types",
      description: "A collection of shared TypeScript type definitions used throughout the application to ensure consistency and type safety.",
      summary: "Centralized TypeScript type definitions for consistent type usage across the app.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-click-outside",
    ext: ".ts",
    path: "/docs/web/hooks/use-click-outside",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useClickOutside",
      description: "A hook that detects when a user clicks outside a specified element, commonly used to close popups, dropdowns, or modals.",
      summary: "Detects and handles clicks outside a given element.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-clipboard",
    ext: ".ts",
    path: "/docs/web/hooks/use-clipboard",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useClipboard",
      description: "Provides functionality to copy text to the clipboard and track copy status.",
      summary: "Clipboard utility hook for copying text and tracking copy state.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-cookie",
    ext: ".ts",
    path: "/docs/web/hooks/use-cookie",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useCookie",
      description: "A hook to store and retrieve cookie values.",
      summary: "Storing and retrieving certain cookies.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-device-info",
    ext: ".ts",
    path: "/docs/web/hooks/use-device-info",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useDeviceInfo",
      description: "Returns details about the user\u2019s device, such as type, orientation, OS, or screen size.",
      summary: "Retrieves information about the current device and environment.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-dialog",
    ext: ".ts",
    path: "/docs/web/hooks/use-dialog",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useDialog",
      description: "A hook for managing dialog states and behaviors, including open, close, and toggle logic.",
      summary: "Manages state and actions for dialog components.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-did-update",
    ext: ".ts",
    path: "/docs/web/hooks/use-did-update",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useDidUpdate",
      description: "Runs a callback only on updates (not on initial mount), useful for responding to prop or state changes.",
      summary: "Triggers effects after updates, skipping the initial mount.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-direction",
    ext: ".ts",
    path: "/docs/web/hooks/use-direction",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useDirection",
      description: "Detects or controls the current text direction (LTR or RTL), useful for localization and layout.",
      summary: "Handles reading and updating text direction (LTR/RTL).",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-disclosure",
    ext: ".ts",
    path: "/docs/web/hooks/use-disclosure",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useDisclosure",
      description: "A hook for toggling open/close state, ideal for UI elements like accordions, dropdowns, or modals.",
      summary: "Manages toggleable UI states (open/closed).",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-document-title",
    ext: ".ts",
    path: "/docs/web/hooks/use-document-title",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useDocumentTitle",
      description: "Updates the browser's document title dynamically based on your component state or props.",
      summary: "Dynamically sets the document title.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-document-visibility",
    ext: ".ts",
    path: "/docs/web/hooks/use-document-visibility",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useDocumentVisibility",
      description: "Tracks the visibility state of the document (visible or hidden), useful for pausing tasks when tab is inactive.",
      summary: "Detects when the document becomes visible or hidden.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-element-info",
    ext: ".ts",
    path: "/docs/web/hooks/use-element-info",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useElementInfo",
      description: "Provides information about a DOM element, such as size, position, or bounding box.",
      summary: "Returns metadata and layout info of a DOM element.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-eye-dropper",
    ext: ".ts",
    path: "/docs/web/hooks/use-eye-dropper",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useEyeDropper",
      description: "Leverages the EyeDropper API to let users pick colors from their screen.",
      summary: "Allows users to select colors from anywhere on their screen.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-fetch",
    ext: ".ts",
    path: "/docs/web/hooks/use-fetch",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useFetch",
      description: "A simplified data fetching hook that manages loading, error, and response states.",
      summary: "Handles HTTP requests with built-in loading and error states.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-fullscreen",
    ext: ".ts",
    path: "/docs/web/hooks/use-fullscreen",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useFullscreen",
      description: "Controls and tracks the fullscreen state of an element, with programmatic toggle support.",
      summary: "Manages entering and exiting fullscreen mode.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-geo-location",
    ext: ".ts",
    path: "/docs/web/hooks/use-geo-location",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useGeoLocation",
      description: "Retrieves the user\u2019s current geographic location using the browser's geolocation API.",
      summary: "Provides real-time access to user geolocation data.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-hotkeys",
    ext: ".ts",
    path: "/docs/web/hooks/use-hotkeys",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useHotkeys",
      description: "Registers and listens for keyboard shortcuts, supporting global and scoped hotkey bindings.",
      summary: "Adds keyboard shortcut functionality to your app.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-hover",
    ext: ".ts",
    path: "/docs/web/hooks/use-hover",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useHover",
      description: "Detects whether a user is hovering over an element, with optional delay handling.",
      summary: "Tracks hover state for any element.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-id",
    ext: ".ts",
    path: "/docs/web/hooks/use-id",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useId",
      description: "Generates a unique ID, useful for accessibility attributes or keying elements.",
      summary: "Creates a unique ID for consistent DOM identification.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-image-popup",
    ext: ".ts",
    path: "/docs/web/hooks/use-image-popup",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useImagePopup",
      description: "A hook that controls the logic for opening, closing, and navigating image popups or previews.",
      summary: "Manages image popup interactions and navigation.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-input-state",
    ext: ".ts",
    path: "/docs/web/hooks/use-input-state",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useInputState",
      description: "Manages input value and change handlers, simplifying form input control.",
      summary: "Simplifies controlled input handling with value and onChange.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-intersection",
    ext: ".ts",
    path: "/docs/web/hooks/use-intersection",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useIntersection",
      description: "Observes element visibility in the viewport, useful for lazy loading, animations, or triggers.",
      summary: "Detects when an element enters or leaves the viewport.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-interval",
    ext: ".ts",
    path: "/docs/web/hooks/use-interval",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useInterval",
      description: "Sets up a recurring interval with the provided callback and delay, with automatic cleanup.",
      summary: "Runs a function repeatedly with a specified delay.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-isomorphic-effect",
    ext: ".ts",
    path: "/docs/web/hooks/use-isomorphic-effect",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useIsomorphicEffect",
      description: "A safe useLayoutEffect alternative that falls back to useEffect on the server to prevent hydration warnings.",
      summary: "Isomorphic useLayoutEffect that works in SSR and browser.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-list-state",
    ext: ".ts",
    path: "/docs/web/hooks/use-list-state",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useListState",
      description: "Manages an array state with utility functions like add, remove, reorder, and update.",
      summary: "State manager hook for dynamic lists with utility helpers.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-local-storage",
    ext: ".ts",
    path: "/docs/web/hooks/use-local-storage",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useLocalStorage",
      description: "Manages state synchronized with localStorage, keeping data persistent across sessions.",
      summary: "Persistent state synced with localStorage.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-measure-scrollbar",
    ext: ".ts",
    path: "/docs/web/hooks/use-measure-scrollbar",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useMeasureScrollbar",
      description: "Measures the scrollbar size (width/height), useful for layout adjustments in scrollable containers.",
      summary: "Measures scrollbar dimensions for adaptive layout handling.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-media-query",
    ext: ".ts",
    path: "/docs/web/hooks/use-media-query",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useMediaQuery",
      description: "Evaluates a CSS media query and returns a boolean result, updates in real-time.",
      summary: "Reactively matches CSS media queries in JavaScript.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-merged-ref",
    ext: ".ts",
    path: "/docs/web/hooks/use-merged-ref",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useMergedRef",
      description: "Merges multiple refs into one, so they can be passed to a single element.",
      summary: "Combines multiple refs into a single ref handler.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-mouse",
    ext: ".ts",
    path: "/docs/web/hooks/use-mouse",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useMouse",
      description: "Tracks the mouse position, movement, and interaction with a specific DOM element.",
      summary: "Observes real-time mouse position and activity.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-move",
    ext: ".ts",
    path: "/docs/web/hooks/use-move",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useMove",
      description: "Detects and handles drag or pointer movement across an element or screen.",
      summary: "Listens to pointer move events for interactive UI handling.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-mutation-observer",
    ext: ".ts",
    path: "/docs/web/hooks/use-mutation-observer",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useMutationObserver",
      description: "Observes changes to the DOM, such as attributes, children, or text content.",
      summary: "Watches for DOM mutations in real-time.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-network",
    ext: ".ts",
    path: "/docs/web/hooks/use-network",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useNetwork",
      description: "Monitors network connection status, including online/offline and effective type.",
      summary: "Tracks the user's network connection and status.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-open-state",
    ext: ".ts",
    path: "/docs/web/hooks/use-open-state",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useOpenState",
      description: "Manages a toggleable state with optional external control via props.",
      summary: "Controlled/uncontrolled open state management.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-orientation",
    ext: ".ts",
    path: "/docs/web/hooks/use-orientation",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useOrientation",
      description: "Detects the current device orientation (portrait or landscape) and listens to changes.",
      summary: "Tracks screen orientation in real-time.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-os",
    ext: ".ts",
    path: "/docs/web/hooks/use-os",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useOS",
      description: "Identifies the user\u2019s operating system (Windows, macOS, iOS, Android, etc.).",
      summary: "Returns the user\u2019s current operating system.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-pagination",
    ext: ".ts",
    path: "/docs/web/hooks/use-pagination",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "usePagination",
      description: "Provides pagination logic including page count, current page, and navigation helpers.",
      summary: "Manages pagination state and navigation logic.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-pwa-installer",
    ext: ".ts",
    path: "/docs/web/hooks/use-pwa-installer",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "usePWAInstaller",
      description: "Detects PWA install availability and handles prompting for installation.",
      summary: "Enables installation logic for Progressive Web Apps.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-random-colors",
    ext: ".ts",
    path: "/docs/web/hooks/use-random-colors",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useRandomColors",
      description: "Generates one or more random color values, with options to control format and variation.",
      summary: "Utility for generating random color schemes.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-reduced-motion",
    ext: ".ts",
    path: "/docs/web/hooks/use-reduced-motion",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useReducedMotion",
      description: "Detects whether the user prefers reduced motion, useful for accessibility adjustments.",
      summary: "Checks user\u2019s system preference for reduced motion.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-reload",
    ext: ".ts",
    path: "/docs/web/hooks/use-reload",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useReload",
      description: "Provides logic to reload the page or refresh a component state programmatically.",
      summary: "Triggers a full page or soft component reload.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-resize-observer",
    ext: ".ts",
    path: "/docs/web/hooks/use-resize-observer",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useResizeObserver",
      description: "Watches for size changes in a DOM element using the ResizeObserver API.",
      summary: "Observes element resizing and updates on change.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-scroll-into-view",
    ext: ".ts",
    path: "/docs/web/hooks/use-scroll-into-view",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useScrollIntoView",
      description: "Smoothly scrolls an element into view and provides controls to handle the scrolling behavior.",
      summary: "Programmatically scrolls an element into view with animation.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-state-history",
    ext: ".ts",
    path: "/docs/web/hooks/use-state-history",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useStateHistory",
      description: "Manages state with undo/redo functionality, storing a history of changes.",
      summary: "Adds undo and redo capabilities to your component state.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-timeout",
    ext: ".ts",
    path: "/docs/web/hooks/use-timeout",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useTimeout",
      description: "Executes a function after a specified delay, with built-in control to start, stop, or reset.",
      summary: "Delays function execution with control over timeout lifecycle.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-touch",
    ext: ".ts",
    path: "/docs/web/hooks/use-touch",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useTouch",
      description: "Detects and tracks touch events like tap, swipe, and long press on mobile devices.",
      summary: "Hook for touch gesture detection and tracking.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-trigger",
    ext: ".ts",
    path: "/docs/web/hooks/use-trigger",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useTrigger",
      description: "Provides a boolean state toggle with utility methods like on, off, and toggle.",
      summary: "Simple boolean state controller with toggling helpers.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-uncontrolled",
    ext: ".ts",
    path: "/docs/web/hooks/use-uncontrolled",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useUncontrolled",
      description: "Converts a controlled prop into an uncontrolled state with sync support.",
      summary: "Converts controlled components into hybrid controlled/uncontrolled state.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-validated-state",
    ext: ".ts",
    path: "/docs/web/hooks/use-validated-state",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useValidatedState",
      description: "Manages state with built-in validation logic and returns error state.",
      summary: "State management with integrated validation and error handling.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-viewport-size",
    ext: ".ts",
    path: "/docs/web/hooks/use-viewport-size",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useViewportSize",
      description: "Tracks the current viewport dimensions and updates on resize.",
      summary: "Reactive viewport width and height tracking.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-window-event",
    ext: ".ts",
    path: "/docs/web/hooks/use-window-event",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useWindowEvent",
      description: "Adds and cleans up event listeners on the window object dynamically.",
      summary: "Attaches and manages window-level event listeners.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "use-window-scroll",
    ext: ".ts",
    path: "/docs/web/hooks/use-window-scroll",
    segment: ["web", "hooks"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "useWindowScroll",
      description: "Tracks the scroll position of the window and updates in real-time.",
      summary: "Monitors and provides current window scroll values.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "cn",
    ext: ".ts",
    path: "/docs/web/utilities/cn",
    segment: ["web", "utilities"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "cn(...args)",
      description: "A utility function for conditionally combining class names in a readable and maintainable way.",
      summary: "Merges class names conditionally into a single string.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "text-parser",
    ext: ".ts",
    path: "/docs/web/utilities/text-parser",
    segment: ["web", "utilities"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Text Parser",
      description: "A collection of utilities for parsing and formatting text, including case transformations, byte formatting, and more.",
      summary: "Text transformation and formatting utilities.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  },
  {
    name: "units-converter",
    ext: ".ts",
    path: "/docs/web/utilities/units-converter",
    segment: ["web", "utilities"],
    meta: {
      date: "2025-01-05T00:00:00.000Z",
      title: "Units Converters",
      description: "Converts between CSS units such as px, rem, and em to support responsive and scalable styling.",
      summary: "Comprehensive set of functions for size manipulation.",
      component: true,
      links: {
        doc: "https://"
      }
    }
  }
];

// resource/docs_demo/assets/rehype/rehype-component.ts
function rehypeComponent() {
  return async (tree) => {
    visit2(tree, (node) => {
      const { value: srcPath } = getNodeAttributeByName(node, "resource") || {};
      if (node.name === "SourceCodes") {
        const name = getNodeAttributeByName(node, "name")?.value;
        const fd = fileDocsMeta.find((obj) => obj.name === name);
        if (!name && !srcPath || !fd) {
          return null;
        }
        try {
          const content = sourceCodes([...fd.segment, name]);
          if (content.code) {
            node.attributes?.push(
              {
                name: "code",
                type: "mdxJsxAttribute",
                value: `${content.code}`
              },
              {
                name: "ext",
                type: "mdxJsxAttribute",
                value: `${fd.ext}`
              },
              {
                name: "repo",
                type: "mdxJsxAttribute",
                value: `${fd.segment?.join("/")}/${name}${fd.ext}`
              }
            );
          }
          if (content.css) {
            node.attributes?.push({
              name: "css",
              type: "mdxJsxAttribute",
              value: content.css
            });
          }
        } catch (_e) {
        }
      }
    });
  };
}
function getNodeAttributeByName(node, name) {
  return node.attributes?.find((attribute) => attribute.name === name);
}

// contentlayer.config.ts
var computedFields = {
  path: {
    type: "string",
    resolve: (doc) => `${doc._raw.flattenedPath}`
  },
  // slugAsParams change of nested routes become single route
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/")
  },
  url: {
    type: "string",
    resolve: (doc) => `/docs/${doc._raw.flattenedPath}`
  }
};
var Related = defineNestedType(() => ({
  name: "Related",
  fields: {
    label: { type: "string" },
    link: { type: "string" }
  }
}));
var LinksProperties = defineNestedType(() => ({
  name: "LinksProperties",
  fields: {
    doc: {
      type: "string"
    },
    related: {
      type: "list",
      of: Related
    }
  }
}));
var Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true
    },
    description: {
      type: "string",
      required: true
    },
    published: {
      type: "boolean",
      default: true
    },
    summary: {
      type: "string",
      required: true
    },
    links: {
      type: "nested",
      of: LinksProperties
    },
    featured: {
      type: "boolean",
      default: false,
      required: false
    },
    component: {
      type: "boolean",
      default: false,
      required: false
    },
    toc: {
      type: "boolean",
      default: true,
      required: false
    }
  },
  computedFields
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "resource/docs_raw",
  documentTypes: [Doc],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm2, codeImport],
    rehypePlugins: [
      rehypeSlug2,
      rehypeComponent,
      () => (tree) => {
        visit3(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl.tagName !== "code")
              return;
            if (codeEl.data?.meta) {
              const regex = /event="([^"]*)"/;
              const match = codeEl.data?.meta.match(regex);
              if (match) {
                node.__event__ = match ? match[1] : null;
                codeEl.data.meta = codeEl.data.meta.replace(regex, "");
              }
            }
            node.__rawString__ = codeEl.children?.[0].value;
            node.__src__ = node.properties?.__src__;
            node.__style__ = node.properties?.__style__;
          }
        });
      },
      rehypeStringify2,
      [
        rehypePrettyCode2,
        {
          grid: true,
          theme: moonlight_default,
          keepBackground: false,
          highlightLines: true,
          tokensMap: {
            fn: "entity.name.function"
          },
          getHighlighter,
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"];
          }
        }
      ],
      () => (tree) => {
        visit3(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "figure") {
            if (!("data-rehype-pretty-code-figure" in node.properties)) {
              return;
            }
            const preElement = node.children.at(-1);
            if (preElement.tagName !== "pre") {
              return;
            }
            preElement.properties["__withMeta__"] = node.children.at(0).tagName === "figure";
            preElement.properties["__rawString__"] = node.__rawString__;
            if (node.__src__) {
              preElement.properties["__src__"] = node.__src__;
            }
            if (node.__event__) {
              preElement.properties["__event__"] = node.__event__;
            }
            if (node.__style__) {
              preElement.properties["__style__"] = node.__style__;
            }
          }
        });
      },
      rehypeNpmCommand,
      [
        rehypeAutolinkHeadings2,
        {
          behavior: "wrap",
          properties: {
            className: ["subheading-anchor", "anchor_id text-color flex flex-row flex-wrap justify-start items-center pl-8 rtl:pl-0 rtl:pr-8 relative"],
            ariaLabel: "Link to section"
          },
          // content: [
          //   {
          //     type: "element",
          //     tagName: "svg",
          //     properties: {
          //       xmlns: "http://www.w3.org/2000/svg",
          //       width: "18",
          //       height: "18",
          //       fillRule: "evenodd",
          //       clipRule: "evenodd",
          //       fill: "currentColor",
          //       viewBox: "0 0 15 15",
          //       className: ""
          //     },
          //     children: [
          //       {
          //         type: "element",
          //         tagName: "path",
          //         properties: {
          //           d: "M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
          //         }
          //       }
          //     ]
          //   }
          // ],
          content: [
            {
              type: "element",
              tagName: "svg",
              properties: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                fillRule: "evenodd",
                clipRule: "evenodd",
                fill: "currentColor",
                viewBox: "0 0 24 24",
                className: ""
              },
              children: [
                {
                  type: "element",
                  tagName: "path",
                  properties: {
                    fill: "none",
                    stroke: "currentColor",
                    strokeDasharray: "28",
                    strokeDashoffset: "28",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2.8",
                    d: "M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0"
                  },
                  children: [
                    {
                      type: "element",
                      tagName: "animate",
                      properties: {
                        fill: "freeze",
                        attributeName: "stroke-dashoffset",
                        dur: "1s",
                        values: "28;0"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
      // rehypeCssBlocks
    ]
  }
});
export {
  computedFields,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-D6GC7YG2.mjs.map
