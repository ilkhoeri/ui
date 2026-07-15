import { Typography } from "@/ui/typography";
import { allDocs } from "contentlayer/generated";
import { configMetadata, siteConfig } from "@/site/config";
import { pathParams } from "@/resource/docs_demo/assets/mdx/utils";
import { MDXComponent } from "@/resource/docs_demo/assets/mdx/mdx-context";
import { ArticleContent } from "@/source/assets/toc/context";

import type { Metadata, ResolvingMetadata } from "next";

export function generateStaticParams() {
  const docs = allDocs.map(doc => ({ docs: doc._raw.flattenedPath.split("/") }));
  return [
    {
      docs: []
    },
    { docs: ["web"] },
    { docs: ["web", "components"] },
    { docs: ["web", "hooks"] },
    { docs: ["web", "utilities"] },
    { docs: ["web", "configuration"] },
    ...docs
  ];
}

interface DocsParams {
  params: Promise<{ docs?: string[] | undefined }>;
}

function getDocFromParams(slug: string[] | undefined) {
  if (!slug) return null;
  const { path, segment } = pathParams("docs", slug);
  const doc = allDocs.find(doc => doc.url === (slug ? path : segment));
  if (!doc) return null;
  return doc;
}

export async function generateMetadata({ params }: DocsParams, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await params).docs;
  const doc = getDocFromParams(slug);
  const currentSlug = !slug ? "/docs" : `/docs/${slug.join("/")}`;
  return configMetadata({
    url: currentSlug,
    title: doc?.title || "Docs",
    description: siteConfig.description,
    images: (await parent).openGraph?.images
  });
}

export default async function Page({ params }: DocsParams) {
  const segment = (await params).docs;
  const doc = getDocFromParams(segment);

  if (!doc) return null;

  return (
    <ArticleContent>
      <Typography prose="h1">{doc?.title}</Typography>
      <Typography prose="p" className="only-of-type:mb-8">
        {doc?.description}
      </Typography>
      <MDXComponent code={doc?.body?.code} />
    </ArticleContent>
  );
}
