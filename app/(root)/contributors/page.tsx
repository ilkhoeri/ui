import { configMetadata, siteConfig } from "@/app/site/config";
import { Comp } from "@/source/assets/components";
import { Typography } from "@/ui/typography";
import Link from "next/link";

import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return configMetadata({
    url: "/contributors",
    title: "Contributors",
    description: siteConfig.description
  });
}

export default function Page() {
  return (
    <Comp className="flex flex-col md:flex-col">
      <div className="flex size-full max-w-full flex-col items-start justify-center gap-4 p-8">
        <Typography prose="h1">Thank&apos;s for contributors</Typography>

        <Link href="https://github.com/ilkhoeri/ioeri/graphs/contributors">
          <picture className="p-4">
            <img src="https://contrib.rocks/image?repo=ilkhoeri/ui" alt="contributors" height={64} width={64} />
          </picture>
        </Link>
      </div>

      <hr />

      <div className="mt-12 flex size-full max-w-full flex-col items-start justify-center gap-4 p-8">
        <Typography prose="h2">Support Us</Typography>
        {/* <iframe
          src="https://github.com/sponsors/ilkhoeri/button"
          title="Sponsor ilkhoeri"
          height="32"
          width="114"
          {...{ style: { border: "0", borderRadius: "6px" } }}
        /> */}
        <iframe src="https://github.com/sponsors/ilkhoeri/card" title="Sponsor ilkhoeri" height="225" width="600" {...{ style: { border: "0", borderRadius: "9px", maxWidth: "100%" } }} />
        <iframe
          src="https://discord.com/widget?id=1129868548504830003&theme=dark"
          width="350"
          height="500"
          // allowTransparency
          {...{ style: { border: "0", borderRadius: "9px", maxWidth: "100%" } }}
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        />
      </div>
    </Comp>
  );
}
