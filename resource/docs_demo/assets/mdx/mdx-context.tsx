"use client";
import React from "react";
import { getMDXComponent } from "@contentlayer2/core/client";
import { components } from "./mdx-component";
import { createHighlighter } from "shiki";
import { ShikiProvider } from "@/resource/docs_demo/assets/shiki/shiki-context";

type FunctionElementType = Extract<ElementType, (props: Record<string, any>) => any>;
type ClassElementType = Extract<ElementType, new (props: Record<string, any>) => any>;
type FunctionComponent<Props> = ElementType extends never ? (props: Props) => Element | null : FunctionElementType extends never ? never : (props: Props) => ReturnType<FunctionElementType>;
type ClassComponent<Props> = ElementType extends never ? new (props: Props) => React.JSX.ElementClass : ClassElementType extends never ? never : new (props: Props) => InstanceType<ClassElementType>;
type ElementType = any extends React.JSX.ElementType ? never : React.JSX.ElementType;
type StringComponent = Extract<keyof React.JSX.IntrinsicElements, ElementType extends never ? string : ElementType>;
type Component<Props> = FunctionComponent<Props> | ClassComponent<Props> | StringComponent;
interface NestedMDXComponents {
  [key: string]: NestedMDXComponents | Component<any>;
}
export type MDXComponents = NestedMDXComponents & {
  [Key in StringComponent]?: Component<React.JSX.IntrinsicElements[Key]>;
} & {
  wrapper?: Component<any>;
};
export interface MDXContentProps {
  [props: string]: unknown;
  components?: MDXComponents;
}

export interface MdxProps {
  code: string;
}

export const useMDXComponent = (code: string, globals: Record<string, unknown> = {}) => {
  return React.useMemo(() => getMDXComponent(code, globals), [code, globals]);
};

async function loadShiki() {
  const shiki = await createHighlighter({
    langs: ["ts", "tsx", "css", "scss", "html", "bash", "json"],
    themes: []
  });
  return shiki;
}

export function MDXComponent({ code }: MdxProps) {
  const Component = useMDXComponent(code, {});
  return (
    <div className="mdx_customizer">
      <ShikiProvider loadShiki={loadShiki} code={code}>
        <Component components={components} />
      </ShikiProvider>
    </div>
  );
}
