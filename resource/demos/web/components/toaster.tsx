"use client";

import { Toaster, type ToasterProps } from "@/ui/toaster";
import { Button } from "@/ui/button";
import { toast } from "sonner";
import { DataTrees } from "@/resource/docs_demo/assets/demo-slot";

const codes = {
  usage:
    '"use client";\nimport React from "react";\nimport { Button } from "@/ui/button";\nimport { toast } from "sonner";\n\nexport function ToasterDemo() {\n  return (\n    <Button\n      variant="pills"\n      onClick={() => {\n        const myPromise = new Promise<{ name: string }>(resolve => {\n          setTimeout(() => {\n            resolve({ name: "My toast" });\n          }, 3000);\n        });\n\n        toast.promise(myPromise, {\n          loading: "Loading...",\n          success: (data: { name: string }) => {\n            return {\n              message: `${data.name} toast has been added`,\n              description: "Custom description for the success state"\n            };\n          },\n          error: "Error"\n        });\n      }}\n    >\n      Render toast\n    </Button>\n  );\n}',
  configurator:
    '"use client";\nimport React from "react";\nimport { Toaster } from "@/ui/toaster";\nimport { Button } from "@/ui/button";\nimport { toast } from "sonner";\n\nexport function ToasterDemo() {\n  return (\n    <>\n      <Toaster{{props}} />\n      <Button variant="pills" onClick={() => toast("Title in this case", { description: "Custom description in here." })}>\n        Toast\n      </Button>\n    </>\n  );\n}',
  configuratorChain:
    '"use client";\nimport React from "react";\nimport { Button } from "@/ui/button";\nimport { toast } from "sonner";\n\ntype ToastIconType = "success" | "info" | "warning" | "error" | "message" | "loading";\nexport function ToasterDemo({ {{props}} }: { icon: ToastIconType }) {\n  return (\n    <Button\n      variant="pills"\n      color="base"\n      onClick={() => {\n        toast[icon](`Show ${icon} icon.`, { description: "Displays a description along with the defined icon." });\n      }}\n    >\n      Toast\n    </Button>\n  );\n}'
};

function Demo() {
  return (
    <Button
      variant="pills"
      onClick={() => {
        const myPromise = new Promise<{ name: string }>(resolve => {
          setTimeout(() => {
            resolve({ name: "My toast" });
          }, 3000);
        });

        toast.promise(myPromise, {
          loading: "Loading...",
          success: (data: { name: string }) => {
            return {
              message: `${data.name} toast has been added`,
              description: "Custom description for the success state"
            };
          },
          error: "Error"
        });
      }}
    >
      Render toast
    </Button>
  );
}

function ConfiguratorDemo(props: ToasterProps) {
  return (
    <>
      <Button variant="pills" color="base" onClick={() => toast("Title in this case", { description: "Custom description in here." })}>
        Toast
      </Button>
      <Toaster {...props} />
    </>
  );
}

type ToastIconType = "success" | "info" | "warning" | "error" | "message" | "loading";
function ConfiguratorChainDemo({ icon }: { icon: ToastIconType }) {
  return (
    <Button
      variant="pills"
      color="base"
      onClick={() => {
        toast[icon](`Show ${icon} icon.`, { description: "Displays a description along with the defined icon." });
      }}
    >
      Toast
    </Button>
  );
}

const usage: DataTrees = {
  type: "code",
  component: Demo,
  code: codes.usage
};

const configurator: DataTrees = {
  type: "configurator",
  component: ConfiguratorDemo,
  code: codes.configurator,
  centered: true,
  classNames: { demoInner: "h-52 w-full centered" },
  controls: [
    {
      prop: "position",
      type: "select",
      initialValue: "bottom-right",
      libraryValue: "bottom-right",
      data: ["top-left", "top-right", "bottom-left", "bottom-right", "top-center", "bottom-center"]
    },
    { prop: "dir", type: "select", initialValue: "ltr", libraryValue: "ltr", data: ["ltr", "rtl"] },
    { prop: "gap", type: "number", initialValue: 14, libraryValue: 14, min: 0, max: 100 },
    { prop: "offset", type: "number", initialValue: 32, libraryValue: 32, min: 0, max: 100 },
    { prop: "mobileOffset", type: "number", initialValue: 16, libraryValue: 16, min: 0, max: 100 },
    { prop: "visibleToasts", type: "number", initialValue: 3, libraryValue: 3, min: 1, max: 20 },
    { prop: "invert", type: "boolean", initialValue: false, libraryValue: false },
    { prop: "closeButton", type: "boolean", initialValue: false, libraryValue: false },
    { prop: "richColors", type: "boolean", initialValue: false, libraryValue: false },
    { prop: "expand", type: "boolean", initialValue: false, libraryValue: false }
  ]
};

const configuratorChain: DataTrees = {
  type: "configurator",
  component: ConfiguratorChainDemo,
  code: codes.configuratorChain,
  centered: true,
  classNames: { demoInner: "h-52 w-full centered" },
  controls: [
    {
      prop: "icon",
      type: "select",
      initialValue: "message",
      libraryValue: null,
      data: ["message", "success", "info", "warning", "error", "loading"]
    }
  ]
};

export const ToasterDemos = {
  usage,
  configurator,
  configuratorChain
};
