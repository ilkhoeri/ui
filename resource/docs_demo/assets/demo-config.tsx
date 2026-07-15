"use client";
import { cloneElement, useState } from "react";
import { Stack } from "@/ui/stack";
import { DemoAreaProps, DemoCode, DemoColumns } from "./demo-component";
import { DemoRoot } from "./demo-component";
import { Tabs } from "@/ui/tabs";
import { PlayTabs } from "@/source/assets/playtabs";
import { useApp } from "@/modules/web/configuration/app-context";
import { Code, getCodeArray } from "./get-code-array";
import { getStyles } from "./shiki/shiki-code-highlight-tabs";
import { ocx } from "xuxi";

import {
  ConfiguratorBooleanControl,
  ConfiguratorBooleanControlOptions,
  ConfiguratorColorControl,
  ConfiguratorColorControlOptions,
  ConfiguratorNumberControl,
  ConfiguratorNumberControlOptions,
  ConfiguratorSegmentedControl,
  ConfiguratorSegmentedControlOptions,
  ConfiguratorSelectControl,
  ConfiguratorSelectControlOptions,
  ConfiguratorSizeControl,
  ConfiguratorSizeControlOptions,
  ConfiguratorStringControl,
  ConfiguratorStringControlOptions
} from "../controls";

const ControlComponents = {
  boolean: ConfiguratorBooleanControl,
  segmented: ConfiguratorSegmentedControl,
  color: ConfiguratorColorControl,
  string: ConfiguratorStringControl,
  select: ConfiguratorSelectControl,
  size: ConfiguratorSizeControl,
  number: ConfiguratorNumberControl
};

export type ConfiguratorControlOptions = ConfiguratorBooleanControlOptions | ConfiguratorSegmentedControlOptions | ConfiguratorColorControlOptions | ConfiguratorStringControlOptions | ConfiguratorSelectControlOptions | ConfiguratorSizeControlOptions | ConfiguratorNumberControlOptions;

export interface ConfiguratorObjectControlOptions {
  prop: string;
  type: "object";
  controls: ConfiguratorControlOptions[];
}

export interface ConfiguratorDemoProps extends DemoAreaProps {
  code: Code;
  defaultExpanded?: boolean;
  controls: ConfiguratorControlOptions[];
}

export function ConfiguratorDemo(_props: ConfiguratorDemoProps) {
  const { code, controls, children, centered, maxWidth, minHeight, withPadding, dimmed, striped, orientation = "horizontal", defaultExpanded = true, className, classNames } = _props;
  const ctx = useApp();
  const tooltipSide = ctx.dir === "rtl" ? "right" : "left";

  const initialState = controls.reduce<Record<string, any>>((acc, control) => {
    acc[control.prop] = control.initialValue;
    return acc;
  }, {});

  const [state, setState] = useState(initialState);

  const setStateField = (field: string, value: any) => setState(current => ({ ...current, [field]: value }));

  const items = controls.map(control => {
    const ControlComponent = ControlComponents[control.type] as any;
    const { initialValue, libraryValue, ...rest } = control;
    return <ControlComponent key={control.prop} value={state[control.prop]} onChange={(value: any) => setStateField(control.prop, value)} {...rest} />;
  });

  function isHorizontal<T>(s: T) {
    return orientation === "horizontal" ? (s as T) : undefined;
  }
  const _controls = (
    <Stack className="p-3" gap="16">
      {items}
    </Stack>
  );

  const _democolumns = (
    <DemoColumns controls={_controls} {...ocx({ className, classNames, orientation, centered, withPadding, maxWidth, minHeight, dimmed, striped })}>
      {cloneElement(children as React.JSX.Element, state)}
    </DemoColumns>
  );

  const _democode = <DemoCode code={getCodeArray({ code, controls, state })} tooltipSide={isHorizontal(tooltipSide)} unstyled={isHorizontal(reUnstyled)} classNames={isHorizontal(reStyles)} defaultExpanded={defaultExpanded} />;

  switch (orientation) {
    case "horizontal":
      return (
        <Tabs defaultValue="preview" classNames={{ root: "mb-20 mt-10 w-full", list: "rtl:flex-row-reverse" }}>
          <PlayTabs defaultValue="preview" defaultExpanded={undefined} childrens={{ preview: _democolumns, usage: _democode }} />
        </Tabs>
      );
    case "vertical":
      return (
        <DemoRoot>
          {_democolumns}
          {_democode}
        </DemoRoot>
      );
  }
}

const reStyles = {
  root: getStyles("root", { className: "rounded-b-[0rem] border-t-0 border-transparent" }).className,
  code: "",
  codeWrapper: "",
  showCodeButton: "",
  pre: "",
  header: "flex h-12 w-full flex-row rtl:flex-row-reverse items-center rounded-t-[inherit] border-b bg-background p-[0_12px_0_16px] fi",
  files: "flex h-full items-center rtl:ml-auto space-x-2 divide-x",
  file: "flex flex-row rtl:flex-row-reverse items-center gap-2 text-[13px] text-muted-foreground font-geist-mono font-bold leading-none data-[active]:text-color pl-2 first:pl-0",
  fileIcon: "",
  controls: "flex items-center flex-row rtl:flex-row-reverse",
  control: "",
  copy: "ml-auto inline-flex items-center justify-center rounded-md bg-background p-0.5 text-muted-foreground ring-offset-background transition-colors sizer [--sz:32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:text-color [@media(hover:hover)]:hover:bg-muted/75 [@media(hover:hover)]:hover:text-color"
};

const reUnstyled = Object.fromEntries(Object.entries(reStyles).map(([key, value]) => [key, value !== ""]));
