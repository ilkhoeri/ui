"use client";
import { DataTrees } from "@/resource/docs_demo/assets/demo-slot";
import { Group } from "@/ui/group";
import { Anchor, AnchorProps } from "@/ui/anchor";
import { buttonStyle } from "@/ui/button";

const codes = {
  usage: 'import { Anchor } from "@/ui/anchor";\n\nfunction AnchorDemo() {\n  return (\n    <Anchor href="https://github.com/ilkhoeri/ui" role="anchor" target="_blank">\n      Anchor component\n    </Anchor>\n  );\n}',
  buttonVariant: 'import { Anchor } from "@/ui/anchor";\n\nfunction AnchorButtonVariantDemo() {\n  return <Anchor className={buttonStyle({ size: "default", variant: "primitive" })}>Anchor with button variant</Anchor>;\n}',
  configurator: 'import { Anchor } from "@/ui/anchor";\n\nexport function AnchorDemo() {\n  return (\n    <Anchor{{props}}>\n      Anchor component\n    </Anchor>\n  );\n}',
  decoration:
    'import { Anchor } from "@/ui/anchor";\nimport { Group } from "@/ui/group";\n\nexport function AnchorGroupDemo() {\n  return (\n    <Group justify="center">\n      <Anchor href="https://github.com/ilkhoeri/ui" target="_blank" underline="always">\n        Underline always\n      </Anchor>\n      <Anchor href="tel:+" target="_tel" underline="hover">\n        Underline hover\n      </Anchor>\n      <Anchor href="mailto:" target="_email" underline="never">\n        Underline never\n      </Anchor>\n    </Group>\n  );\n}'
};

function AnchorDemo() {
  return (
    <Anchor href="https://github.com/ilkhoeri/ui" role="anchor" target="_blank">
      Anchor component
    </Anchor>
  );
}

function AnchorButtonVariantDemo() {
  return <Anchor className={buttonStyle({ size: "default", variant: "primitive" })}>Anchor with button variant</Anchor>;
}

function AnchorConfiguratorDemo(props: AnchorProps) {
  return <Anchor {...props}>Anchor component</Anchor>;
}

function AnchorGroupDemo() {
  return (
    <Group justify="center">
      <Anchor href="https://github.com/ilkhoeri/ui" target="_blank" underline="always">
        Underline always
      </Anchor>
      <Anchor href="tel:+" target="_tel" underline="hover">
        Underline hover
      </Anchor>
      <Anchor href="mailto:" target="_email" underline="never">
        Underline never
      </Anchor>
    </Group>
  );
}

export const usage: DataTrees = {
  type: "code",
  component: AnchorDemo,
  code: codes.usage
};

export const decoration: DataTrees = {
  type: "code",
  component: AnchorGroupDemo,
  code: codes.decoration
};

export const buttonVariant: DataTrees = {
  type: "code",
  component: AnchorButtonVariantDemo,
  code: codes.buttonVariant
};

export const configurator: DataTrees = {
  type: "configurator",
  component: AnchorConfiguratorDemo,
  code: codes.configurator,
  centered: true,
  controls: [
    { prop: "underline", type: "select", initialValue: "never", libraryValue: "never", data: ["always", "hover", "never"] },
    { prop: "role", type: "select", initialValue: "undefined", libraryValue: "undefined", data: ["anchor", "undefined"] }
  ]
};

export const AnchorDemos = {
  usage,
  configurator,
  decoration,
  buttonVariant
};
