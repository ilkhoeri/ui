import { pathParams } from "@/resource/docs_demo/assets/mdx/utils";
import { allDocs } from "contentlayer/generated";

export function getDocFromParams(slug: string[] | undefined) {
  const { path, segment } = pathParams("docs", slug);
  const doc = allDocs.find(doc => doc.url === (slug ? path : `/docs/${segment}`));
  if (!doc) return null;
  return doc;
}

export async function getPathFromParams({ params }: { params: Promise<{ docs?: string[] | undefined }> }) {
  const slug = (await params).docs?.join("/") || "";
  const docs = allDocs.find(doc => doc.slug === slug);

  if (!docs) return null;

  return docs;
}
