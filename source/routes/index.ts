import * as Icon from "@/icons/*";

export type InnerRoutes = { title: string; href: string };
export type SingleRoute = { title: string; href?: string; data: InnerRoutes[] };
export type NestedRoute = { title: string; href?: string; data: SingleRoute[] };

export const appRoutes = {
  services: [
    {
      title: "Documentation",
      href: "/docs"
    },
    {
      title: "Examples",
      href: "/examples"
    }
    // {
    //   title: "Generators",
    //   href: "",
    // },
  ],
  sections: [
    {
      label: "Github Repository",
      href: "https://github.com/ilkhoeri/ui",
      icon: Icon.BrandGithubFillIcon,
      color: "#6e5494"
    },
    {
      label: "Discord Community",
      href: "https://discord.gg/Xct5BBPDZ9",
      icon: Icon.BrandDiscordFillIcon,
      color: "#436ab2"
    },
    {
      label: "Open Collective",
      href: "https://opencollective.com/oeri",
      icon: Icon.HeartIcon,
      color: "#b11c66"
    }
  ],
  suggestions: {
    title: "Main",
    data: [
      {
        title: "Getting Started",
        href: "/docs",
        icon: Icon.CommandIcon
      },
      {
        title: "Configuration",
        href: "/docs/web/configuration",
        icon: Icon.TuningIcon
      },
      {
        title: "Utilities",
        href: "/docs/web/utilities",
        icon: Icon.FireSquareIcon
      },
      {
        title: "Components",
        href: "/docs/web/components",
        icon: Icon.CodeSquareIcon
      },
      {
        title: "Hooks",
        href: "/docs/web/hooks",
        icon: Icon.SafeSquareIcon
      },
      {
        title: "Examples",
        href: "/examples",
        icon: Icon.ShareSquareIcon
      }
    ]
  },
  footRoutes: [
    {
      title: "Started",
      href: "/docs"
    },
    {
      title: "Utilities",
      href: "/docs/web/utilities"
    },
    {
      title: "Configuration",
      href: "/docs/web/configuration"
    },
    {
      title: "Components",
      href: "/docs/web/components"
    },
    {
      title: "Hooks",
      href: "/docs/web/hooks"
    },
    {
      title: "Examples",
      href: "/examples"
    },
    {
      title: "Github",
      href: "https://github.com/ilkhoeri/ui/"
    },
    {
      title: "Contributing",
      href: "https://github.com/ilkhoeri/ui/blob/master/CONTRIBUTING.md"
    }
  ]
};

// Mengambil semua href dari docs secara rekursif
function extractHrefs(routes: (InnerRoutes | SingleRoute | NestedRoute)[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  const traverse = (items: (InnerRoutes | SingleRoute | NestedRoute)[]) => {
    for (const item of items) {
      if (item.href) {
        const cleanHref = item.href.slice(1); // Hilangkan "/" di awal
        if (!seen.has(cleanHref)) {
          seen.add(cleanHref);
          result.push(cleanHref);
        }
      }
      if ("data" in item) {
        traverse(item.data); // Rekursi ke dalam `data`
      }
    }
  };

  traverse(routes);
  return result;
}

export const tocList = extractHrefs(appRoutes["services"]).filter(href => href !== "toc");
