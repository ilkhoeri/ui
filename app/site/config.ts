import type { Metadata } from "next";

const SITE_URL = "https://ilkhoeri.github.io/ui";

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

export const siteConfig = {
  creator: "@ilkhoeri",
  url: `${SITE_URL}`,
  email: "khoeriilham@gmail.com",
  name: "Oeri UI",
  ogImage: "/assets/images/homepage.webp",
  description: "The Good Choice for Development Application based on React, components server, hooks, and more functions.",
  archives: ["https://github.com/ilkhoeri/ioeri"],
  keywords: ["ui", "hooks", "web", "primitive", "primitive ui", "tailwind", "component server", "function", "component", "development web", "web app", "straightforward dependencies", "dependencies", "npm", "package"],
  links: {
    twitter: "https://x.com/ilkhoeri",
    github: "https://github.com/ilkhoeri"
  }
};

export const iconsConfig: Metadata = {
  icons: {
    icon: [
      { url: "/icons/oeri-asset.png" },
      new URL("/icons/oeri-asset.png", siteConfig.url),
      {
        url: "/icons/oeri-asset.png",
        media: "(prefers-color-scheme: dark)"
      }
    ],
    shortcut: ["/icons/oeri-asset.png"],
    apple: [
      { url: "/icons/apple-icon.png" },
      {
        url: "/icons/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png"
      }
    ],
    other: [
      {
        rel: "shortcut icon",
        type: "image/vnd.microsoft.icon",
        url: "/icons/favicon.ico"
      },
      {
        rel: "apple-touch-icon-precomposed",
        url: "/icons/apple-icon-precomposed.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/icons/android-icon-192x192.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/icons/favicon-32x32.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        url: "/icons/favicon-96x96.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/icons/favicon-16x16.png"
      },
      {
        rel: "apple-touch-icon",
        sizes: "57x57",
        url: "/icons/apple-icon-57x57.png"
      },
      {
        rel: "apple-touch-icon",
        sizes: "60x60",
        url: "/icons/apple-icon-60x60.png"
      },
      {
        rel: "apple-touch-icon",
        sizes: "72x72",
        url: "/icons/apple-icon-72x72.png"
      },
      {
        rel: "apple-touch-icon",
        sizes: "76x76",
        url: "/icons/apple-icon-76x76.png"
      },
      {
        rel: "apple-touch-icon",
        sizes: "114x114",
        url: "/icons/apple-icon-114x114.png"
      },
      {
        rel: "apple-touch-icon",
        sizes: "120x120",
        url: "/icons/apple-icon-120x120.png"
      },
      {
        rel: "apple-touch-icon",
        sizes: "144x144",
        url: "/icons/apple-icon-144x144.png"
      },
      {
        rel: "apple-touch-icon",
        sizes: "152x152",
        url: "/icons/apple-icon-152x152.png"
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/icons/apple-icon-180x180.png"
      }
    ]
  }
};

export const linksConfig: Metadata = {
  /** output
   * <meta name="twitter:site:id" content="1467726470533754880" />
   * <meta name="twitter:creator" content="@nextjs" />
   * <meta name="twitter:creator:id" content="1467726470533754880" />
   * <meta name="twitter:title" content="Next.js" />
   * <meta name="twitter:description" content="The React Framework for the Web" />
   * <meta name="twitter:card" content="app" />
   * <meta name="twitter:image" content="https://nextjs.org/og.png" />
   * <meta name="twitter:image:alt" content="Next.js Logo" />
   * <meta name="twitter:app:name:iphone" content="twitter_app" />
   * <meta name="twitter:app:id:iphone" content="twitter_app://iphone" />
   * <meta name="twitter:app:id:ipad" content="twitter_app://ipad" />
   * <meta name="twitter:app:id:googleplay" content="twitter_app://googleplay" />
   * <meta name="twitter:app:url:iphone" content="https://iphone_url" />
   * <meta name="twitter:app:url:ipad" content="https://ipad_url" />
   * <meta name="twitter:app:name:ipad" content="twitter_app" />
   * <meta name="twitter:app:name:googleplay" content="twitter_app" />
   */
  twitter: {
    card: "app",
    title: siteConfig.name,
    description: siteConfig.description,
    siteId: "1467726470533754880",
    creator: siteConfig.creator,
    creatorId: "1467726470533754880",
    images: {
      url: absoluteUrl("/icons/oeri-asset.png"),
      alt: "oeri"
    },
    app: {
      name: "twitter_app",
      id: {
        iphone: "twitter_app://iphone",
        ipad: "twitter_app://ipad",
        googleplay: "twitter_app://googleplay"
      },
      url: {
        iphone: "https://iphone_url",
        ipad: "https://ipad_url"
      }
    }
  },
  /** output
   * <meta property="fb:app_id" content="12345678" />
   * <meta property="fb:admins" content="12345678" />
   * <meta property="fb:admins" content="87654321" />
   */
  facebook: {
    admins: ["12345678", "87654321"]
  },
  /** output
   * <meta property="al:ios:url" content="https://domain.com/ios" />
   * <meta property="al:ios:app_store_id" content="app_store_id" />
   * <meta property="al:android:package" content="com.example.android/package" />
   * <meta property="al:android:app_name" content="app_name_android" />
   * <meta property="al:web:url" content="https://domain.com/web" />
   * <meta property="al:web:should_fallback" content="true" />
   */
  appLinks: {
    ios: {
      url: absoluteUrl("/ios"),
      app_store_id: "app_store_id"
    },
    android: {
      package: "com.oeri.android/package",
      app_name: "app_name_android"
    },
    web: {
      url: siteConfig.url,
      should_fallback: true
    }
  },
  /** output
   * <meta name="apple-itunes-app" content="app-id=myAppStoreID, app-argument=myAppArgument" />
   */
  itunes: {
    appId: "myAppStoreID",
    appArgument: "myAppArgument"
  },
  /** output
   * <meta name="mobile-web-app-capable" content="yes" />
   * <meta name="apple-mobile-web-app-title" content="Apple Web App" />
   * <link href="/assets/startup/apple-touch-startup-image-768x1004.png" rel="apple-touch-startup-image" />
   * <link href="/assets/startup/apple-touch-startup-image-1536x2008.png" media="(device-width: 768px) and (device-height: 1024px)" rel="apple-touch-startup-image" />
   * <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
   */
  appleWebApp: {
    title: "Apple Web App | oeri",
    statusBarStyle: "black-translucent",
    startupImage: [
      "/icons/apple-touch-icon.png",
      {
        url: "/icons/apple-touch-icon.png",
        media: "(device-width: 768px) and (device-height: 1024px)"
      }
    ]
  }
};

// SEO verification
export const SEO_VERIFICATION = {
  verification: {
    google: "",
    yandex: "",
    yahoo: "",
    other: {
      // bing verification
      "msvalidate.01": [""],
      me: [siteConfig.email, siteConfig.url]
    }
  }
};

export type SiteConfig = typeof siteConfig;
type OGImageDescriptor = {
  url: string | URL;
  secureUrl?: string | URL;
  alt?: string;
  type?: string;
  width?: string | number;
  height?: string | number;
};
type OGImage = string | OGImageDescriptor | URL;

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#090a15"
};

export function configMetadata({
  images = [],
  locale = "en_US",
  url = siteConfig.url,
  title = siteConfig.name,
  siteName = siteConfig.name,
  ogImage = siteConfig.ogImage,
  description = siteConfig.description
}: {
  url?: string;
  title?: string;
  locale?: string;
  siteName?: string;
  description?: string;
  ogImage?: string | URL;
  images?: Array<OGImage>;
}): Metadata {
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      siteName: String(siteName),
      url: absoluteUrl(url),
      type: "website",
      locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: String(siteName)
        },
        ...images
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [siteConfig.ogImage],
      creator: siteConfig.creator
    }
  };
}
