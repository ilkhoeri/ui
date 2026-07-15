import { Examples } from "./client";
import { retitled } from "@/source/utils";
import { Comp, Title } from "@/source/assets/components";
import { configMetadata, siteConfig } from "@/app/site/config";

import type { Metadata, ResolvingMetadata } from "next";

interface ExamplesParams {
  params: Promise<{ examples?: string[] | undefined }>;
}

export function generateStaticParams() {
  return [{ examples: ["examples"] }];
}

export async function generateMetadata({ params }: ExamplesParams, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await params).examples;
  const currentSlug = !slug ? "/examples" : `/examples/${slug.join("/")}`;

  return configMetadata({
    url: currentSlug,
    title: retitled(slug, "Examples"),
    description: siteConfig.description,
    images: (await parent).openGraph?.images
  });
}

export default async function Page({ params }: ExamplesParams) {
  const segment = (await params).examples;
  return (
    <Comp className="w-full overflow-x-hidden px-6 pt-20 max-md:px-6 md:px-8 lg:flex-col lg:px-12">
      <Title title={retitled(["on-development"])} className="mt-0 text-muted-foreground" />
      <Examples segment={segment} />
    </Comp>
  );
}
