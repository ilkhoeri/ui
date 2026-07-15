import { RestDocs } from "./client";
import { notFound } from "next/navigation";
import { NavBottom } from "@/source/assets/nav-prev-next";
import { getDocFromParams } from "@/site/docs-params";
import { TableOfContents } from "@/source/assets/toc/toc";
import { NavigationBreadcrumb } from "@/source/assets/nav-breadcrumb";
import { MDXComponent } from "@/resource/docs_demo/assets/mdx/mdx-context";
import { restRoutes, metaDocsRoute, MetaDocsRoute, NestedMetaDocsRoute } from "@/routes";
import { ArticleContent, TableOfContentsProvider } from "@/source/assets/toc/context";
import { getTableOfContents } from "@/source/assets/toc/config";
import { typographyVariant } from "@/ui/typography";
import { allDocs } from "contentlayer/generated";

export function generateStaticParams() {
  const docs = allDocs.map(doc => ({ docs: doc._raw.flattenedPath.split("/") }));
  return [
    {
      docs: []
    },
    { docs: ["web", "components"] },
    { docs: ["web", "hooks"] },
    { docs: ["web", "utilities"] },
    { docs: ["web", "configuration"] },
    ...docs
  ];
}

interface DocsParams {
  children: React.ReactNode;
  params: Promise<{ docs?: string[] | undefined }>;
}

export default async function Layout({ children, params }: DocsParams) {
  const slug = (await params).docs;
  const doc = getDocFromParams(slug);
  const toc = await getTableOfContents(doc?.body?.raw);

  function template(content: React.ReactNode) {
    return (
      <TableOfContentsProvider>
        <section className="relative flex w-full max-w-full flex-col overflow-x-hidden pt-9 max-md:px-6 min-[1334px]:px-14">
          <NavigationBreadcrumb />
          {content}
          <NavBottom routes={metaDocsRoute} />
        </section>
        <TableOfContents toc={toc} sub={5} />
      </TableOfContentsProvider>
    );
  }

  if (!slug && doc)
    return template(
      <ArticleContent>
        <h1 className={typographyVariant({ prose: "h1" })}>{doc?.title}</h1>
        <MDXComponent code={doc?.body.code} />
      </ArticleContent>
    );

  if (slug?.length === 2) {
    const routesMap: { [key: string]: any } = restRoutes;
    const slugMap = routesMap[slug?.[1]];
    return template(<RestDocs id={slug?.[1]} routes={slugMap} />);
  }

  if (!findMatchingRoute(slug, metaDocsRoute)) notFound();

  return template(children);
}

const findMatchingRoute = (slug: string[] | undefined, routes: (MetaDocsRoute | NestedMetaDocsRoute)[]): boolean => {
  const matcher = `/docs/${slug?.join("/")}`;

  for (const route of routes) {
    if ("path" in route && route.path === matcher) return true;

    if ("data" in route) {
      const matchingData = route.data.some(data => (data as any).path === matcher);
      if (matchingData) return true;
    }
  }
  return false;
};

/*
function ExampleUsage() {
  return (
    <section>
      <div className="pt-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-0 lg:gap-12">
            <div className="lg:pr-24">
              <div className="md:pr-6 lg:pr-0">
                <h2 className="text-title text-3xl font-semibold">All your favorite dev tools work with Ada</h2>
                <p className="text-body mt-6">Harum quae dolore inventore repudiandae? orrupti aut temporibus assumenda atque ab, accusamus sit, molestiae veniam laboriosam pariatur.</p>
              </div>
              <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
                <li>
                  <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m7 9l5 3.5L17 9"></path>
                      <path d="M2 17V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"></path>
                    </g>
                  </svg>
                  Email and web support
                </li>
                <li>
                  <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8 9.5A1.25 1.25 0 1 0 8 12a1.25 1.25 0 0 0 0-2.5m4 0a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 0 0 0-2.5m2.75 1.25a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0"></path>
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M16.1 4.593a50.577 50.577 0 0 0-8.098-.04l-.193.015A4.93 4.93 0 0 0 3.25 9.483V18a.75.75 0 0 0 1.105.66l3.91-2.101a1.25 1.25 0 0 1 .593-.149h8.976c1.132 0 2.102-.81 2.305-1.923c.412-2.257.444-4.567.096-6.835l-.102-.669a2.666 2.666 0 0 0-2.408-2.252zM8.116 6.049a49.078 49.078 0 0 1 7.858.038l1.624.139c.536.046.972.453 1.053.985l.103.668a19.165 19.165 0 0 1-.09 6.339a.843.843 0 0 1-.829.692H8.858a2.75 2.75 0 0 0-1.302.328L4.75 16.746V9.483a3.43 3.43 0 0 1 3.171-3.42z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Fast response time
                </li>
                <li>
                  <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M.5 7.08h2.19a.52.52 0 0 0 .45-.27l1.8-3.6a.49.49 0 0 1 .49-.27a.48.48 0 0 1 .43.35l2.23 7.42a.5.5 0 0 0 .46.36a.5.5 0 0 0 .45-.32l1.37-3.35a.51.51 0 0 1 .47-.32h2.66"></path>
                  </svg>
                  Menitoring and analytics
                </li>
                <li>
                  <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="m6.75 21l-.25-2.2l2.85-7.85q.375.35.813.588t.937.362l-2.75 7.55zm10.5 0l-1.6-1.55l-2.75-7.55q.5-.125.938-.363t.812-.587l2.85 7.85zM12 11q-1.25 0-2.125-.875T9 8q0-.975.563-1.737T11 5.2V3h2v2.2q.875.3 1.438 1.063T15 8q0 1.25-.875 2.125T12 11m0-2q.425 0 .713-.288T13 8q0-.425-.288-.712T12 7q-.425 0-.712.288T11 8q0 .425.288.713T12 9"
                    ></path>
                  </svg>
                  Architectural review
                </li>
              </ul>
            </div>
            <div className="card variant-outlined overflow-hidden p-3">
              <div className="flex gap-2 px-[--card-padding] py-6 *:size-2.5 *:rounded-full">
                <div className="bg-[#f87171]"></div>
                <div className="bg-[#fbbf24]"></div>
                <div className="bg-[#a3e635]"></div>
              </div>
              <div className="flex gap-3 px-[--card-padding] *:aspect-square *:p-4">
                <div className="card variant-outlined">
                  <svg className="size-7" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944c.856 1.026 2.043 1.352 3.272 1.535c1.897.283 3.76.177 5.522-.678c.202-.098.388-.229.608-.36c.166.473.209.95.151 1.437c-.14 1.185-.738 2.1-1.688 2.794c-.38.277-.782.525-1.175.787c-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.158 3.158 0 0 1-1.407-1.188a3.31 3.31 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958c-.106-.769-.472-1.113-1.161-1.133c-.707-.02-1.267.411-1.415 1.09c-.012.053-.028.104-.045.165zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614c.302 0 .57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727z"
                    ></path>
                  </svg>
                </div>
                <div className="card variant-soft">
                  <svg className="size-7" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                    <path
                      fill="currentColor"
                      d="m4.5 4.5l.405-.293A.5.5 0 0 0 4 4.5zm3 9.5A6.5 6.5 0 0 1 1 7.5H0A7.5 7.5 0 0 0 7.5 15zM14 7.5A6.5 6.5 0 0 1 7.5 14v1A7.5 7.5 0 0 0 15 7.5zM7.5 1A6.5 6.5 0 0 1 14 7.5h1A7.5 7.5 0 0 0 7.5 0zm0-1A7.5 7.5 0 0 0 0 7.5h1A6.5 6.5 0 0 1 7.5 1zM5 12V4.5H4V12zm-.905-7.207l6.5 9l.81-.586l-6.5-9zM10 4v6h1V4z"
                    ></path>
                  </svg>
                </div>
                <div className="card variant-outlined">
                  <svg className="size-7" xmlns="http://www.w3.org/2000/svg" width="1.53em" height="1em" viewBox="0 0 256 168">
                    <path
                      fill="currentColor"
                      d="M143.618 167.029h95.166c3.023 0 5.992-.771 8.61-2.237a16.963 16.963 0 0 0 6.302-6.115a16.324 16.324 0 0 0 2.304-8.352c0-2.932-.799-5.811-2.312-8.35L189.778 34.6a16.966 16.966 0 0 0-6.301-6.113a17.626 17.626 0 0 0-8.608-2.238c-3.023 0-5.991.772-8.609 2.238a16.964 16.964 0 0 0-6.3 6.113l-16.342 27.473l-31.95-53.724a16.973 16.973 0 0 0-6.304-6.112A17.638 17.638 0 0 0 96.754 0c-3.022 0-5.992.772-8.61 2.237a16.973 16.973 0 0 0-6.303 6.112L2.31 141.975a16.302 16.302 0 0 0-2.31 8.35c0 2.932.793 5.813 2.304 8.352a16.964 16.964 0 0 0 6.302 6.115a17.628 17.628 0 0 0 8.61 2.237h59.737c23.669 0 41.123-10.084 53.134-29.758l29.159-48.983l15.618-26.215l46.874 78.742h-62.492zm-67.64-26.24l-41.688-.01L96.782 35.796l31.181 52.492l-20.877 35.084c-7.976 12.765-17.037 17.416-31.107 17.416"
                    ></path>
                  </svg>
                </div>
                <div className="card variant-outlined">
                  <svg className="size-7" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M10.99 1.974c2.92-1.86 6.957-.992 9.001 1.934a6.268 6.268 0 0 1 1.072 4.74a5.9 5.9 0 0 1-.88 2.198c.64 1.221.855 2.62.61 3.977a5.882 5.882 0 0 1-2.657 3.94l-5.127 3.268c-2.92 1.86-6.957.993-9.002-1.933a6.269 6.269 0 0 1-1.07-4.741a5.9 5.9 0 0 1 .88-2.198a6.195 6.195 0 0 1-.611-3.977a5.881 5.881 0 0 1 2.658-3.94zM8.049 20.25c.782.29 1.633.332 2.44.123c.369-.099.72-.253 1.042-.458l5.128-3.267a3.538 3.538 0 0 0 1.598-2.37a3.769 3.769 0 0 0-.645-2.85a4.072 4.072 0 0 0-4.37-1.62c-.369.099-.72.253-1.042.458l-1.957 1.246a1.131 1.131 0 0 1-.314.138a1.227 1.227 0 0 1-1.5-.899a1.138 1.138 0 0 1-.01-.45a1.066 1.066 0 0 1 .48-.713l5.129-3.268a1.13 1.13 0 0 1 .314-.138a1.227 1.227 0 0 1 1.317.489c.157.222.23.492.207.762l-.018.19l.191.058a6.62 6.62 0 0 1 2.005 1.003l.263.192l.096-.295c.052-.156.093-.316.123-.478a3.769 3.769 0 0 0-.644-2.85a4.073 4.073 0 0 0-4.371-1.621a3.74 3.74 0 0 0-1.042.458L7.34 7.357a3.537 3.537 0 0 0-1.6 2.37a3.768 3.768 0 0 0 .645 2.85a4.073 4.073 0 0 0 4.371 1.62c.369-.099.72-.253 1.042-.457l1.956-1.248c.098-.061.204-.108.315-.137a1.228 1.228 0 0 1 1.5.899c.034.147.037.3.011.449a1.067 1.067 0 0 1-.482.713l-5.127 3.269a1.125 1.125 0 0 1-.314.137a1.226 1.226 0 0 1-1.317-.488a1.149 1.149 0 0 1-.207-.762l.017-.19l-.19-.058a6.613 6.613 0 0 1-2.005-1.003l-.263-.192l-.096.295a3.568 3.568 0 0 0-.123.478a3.77 3.77 0 0 0 .644 2.85a4.073 4.073 0 0 0 1.93 1.498"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <div>
                  <pre className="px-[--card-padding]">
                    <code className="font-mono text-sm">
                      &lt;div className="flex flex-wrap gap-3"&gt; &lt;button className="btn variant-neutral sz-md"&gt; &lt;span className="btn-label"&gt;Button&lt;/span&gt; &lt;/button&gt; &lt;button className="btn variant-primary sz-md"&gt; &lt;span className="btn-label"&gt;Button&lt;/span&gt; &lt;/button&gt;
                      &lt;/div&gt;
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
*/
