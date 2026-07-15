import { Stack, type StackProps } from "@/ui/stack";
import { Button } from "@/ui/button";
import { Group } from "@/ui/group";
import { DataTrees } from "@/resource/docs_demo/assets/demo-slot";

const codes = {
  usage:
    'import { Stack } from "@/ui/stack";\nimport { Button } from "@/ui/button";\nimport { Group } from "@/ui/group";\n\nexport function StackDemo() {\n  const groups = [\n    ["1", "2", "3"],\n    ["4", "5", "6"],\n    ["7", "8", "9"]\n  ];\n\n  return (\n    <Group grow align="center">\n      {groups.map((stack, index) => (\n        <Stack key={index}>\n          {stack.map(label => (\n            <Button key={label} variant="outline" size="sm">\n              {label}\n            </Button>\n          ))}\n        </Stack>\n      ))}\n    </Group>\n  );\n}',
  configurator:
    'import React from "react";\nimport { Stack } from "@/ui/stack";\nimport { Button } from "@/ui/button";\n\nexport function StackDemo() {\n  return (\n    <Stack className="h-72 w-full">\n      <Button variant="outline" size="sm">1</Button>\n      <Button variant="outline" size="sm">2</Button>\n      <Button variant="outline" size="sm">3</Button>\n    </Stack>\n  );\n}'
};

function Demo() {
  const groups = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"]
  ];

  return (
    <Group grow align="center">
      {groups.map((stack, index) => (
        <Stack key={index}>
          {stack.map(label => (
            <Button key={label} variant="outline" size="sm">
              {label}
            </Button>
          ))}
        </Stack>
      ))}
    </Group>
  );
}

function ConfiguratorDemo(props: StackProps) {
  return (
    <Stack {...props} className="h-72 w-full">
      <Button variant="outline" size="sm">
        1
      </Button>
      <Button variant="outline" size="sm">
        2
      </Button>
      <Button variant="outline" size="sm">
        3
      </Button>
    </Stack>
  );
}

const usage: DataTrees = {
  type: "code",
  component: Demo,
  code: codes.usage,
  classNames: { demoInner: "h-72 w-full centered" }
};
<div className=""></div>;
const configurator: DataTrees = {
  type: "configurator",
  component: ConfiguratorDemo,
  code: codes.configurator,
  centered: true,
  classNames: { demoInner: "h-80 w-full centered" },
  controls: [
    { prop: "align", type: "select", initialValue: "stretch", libraryValue: "stretch", data: ["stretch", "center", "flex-start", "flex-end"] },
    {
      prop: "justify",
      type: "select",
      initialValue: "flex-start",
      libraryValue: "flex-start",
      data: ["center", "flex-start", "flex-end", "space-between", "space-around"]
    },
    { prop: "gap", type: "number", initialValue: 12, libraryValue: 12, min: 0, max: 32 }
  ]
};

export const StackDemos = {
  usage,
  configurator
};
