import { defineDocumentType, defineNestedType, makeSource, type ComputedFields } from "contentlayer2/source-files";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { codeImport } from "remark-code-import";
import { getHighlighter } from "@shikijs/compat";
import { rehypeNpmCommand } from "@/resource/docs_demo/assets/rehype/rehype-customizer";
import { rehypeComponent } from "./resource/docs_demo/assets/rehype/rehype-component";

import moonlightTheme from "@/resource/docs_demo/assets/rehype/moonlight.json";
// import moonlightTheme from "@/resource/docs_demo/assets/rehype/moonlight.json" with { type: "json" };

/**
 *- `URL`: https://example.com/blog/posts/article-1
 *- `Path`: /blog/posts/article-1
 *- `Segment`: blog | posts | article-1
 *- `Slug`: article-1 (last of segment)
 */
export const computedFields: ComputedFields = {
  path: {
    type: "string",
    resolve: doc => `${doc._raw.flattenedPath}`
  },
  // slugAsParams change of nested routes become single route
  slug: {
    type: "string",
    resolve: doc => doc._raw.flattenedPath.split("/").slice(1).join("/")
  },
  url: {
    type: "string",
    resolve: doc => `/docs/${doc._raw.flattenedPath}`
  }
};

const Related = defineNestedType(() => ({
  name: "Related",
  fields: {
    label: { type: "string" },
    link: { type: "string" }
  }
}));

const LinksProperties = defineNestedType(() => ({
  name: "LinksProperties",
  fields: {
    doc: {
      type: "string"
    },
    related: {
      type: "list",
      of: Related
    }
  }
}));

const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true
    },
    description: {
      type: "string",
      required: true
    },
    published: {
      type: "boolean",
      default: true
    },
    summary: {
      type: "string",
      required: true
    },
    links: {
      type: "nested",
      of: LinksProperties
    },
    featured: {
      type: "boolean",
      default: false,
      required: false
    },
    component: {
      type: "boolean",
      default: false,
      required: false
    },
    toc: {
      type: "boolean",
      default: true,
      required: false
    }
  },
  computedFields
}));

export default makeSource({
  contentDirPath: "resource/docs_raw",
  documentTypes: [Doc],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm, codeImport],
    rehypePlugins: [
      rehypeSlug,
      rehypeComponent,
      () => tree => {
        visit(tree, node => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl.tagName !== "code") return;

            if (codeEl.data?.meta) {
              // Extract event from meta and pass it down the tree.
              const regex = /event="([^"]*)"/;
              const match = codeEl.data?.meta.match(regex);
              if (match) {
                node.__event__ = match ? match[1] : null;
                codeEl.data.meta = codeEl.data.meta.replace(regex, "");
              }
            }

            node.__rawString__ = codeEl.children?.[0].value;
            node.__src__ = node.properties?.__src__;
            node.__style__ = node.properties?.__style__;
          }
        });
      },
      rehypeStringify,
      [
        rehypePrettyCode,
        {
          grid: true,
          theme: moonlightTheme,
          keepBackground: false,
          highlightLines: true,
          tokensMap: {
            fn: "entity.name.function"
          },
          getHighlighter,
          onVisitLine(node: any) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ["word--highlighted"];
          }
        }
      ],
      () => tree => {
        visit(tree, node => {
          if (node?.type === "element" && node?.tagName === "figure") {
            if (!("data-rehype-pretty-code-figure" in node.properties)) {
              return;
            }

            const preElement = node.children.at(-1);
            if (preElement.tagName !== "pre") {
              return;
            }

            preElement.properties["__withMeta__"] = node.children.at(0).tagName === "figure";
            preElement.properties["__rawString__"] = node.__rawString__;

            if (node.__src__) {
              preElement.properties["__src__"] = node.__src__;
            }

            if (node.__event__) {
              preElement.properties["__event__"] = node.__event__;
            }

            if (node.__style__) {
              preElement.properties["__style__"] = node.__style__;
            }
          }
        });
      },
      rehypeNpmCommand,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["subheading-anchor", "anchor_id text-color flex flex-row flex-wrap justify-start items-center pl-8 rtl:pl-0 rtl:pr-8 relative"],
            ariaLabel: "Link to section"
          },
          // content: [
          //   {
          //     type: "element",
          //     tagName: "svg",
          //     properties: {
          //       xmlns: "http://www.w3.org/2000/svg",
          //       width: "18",
          //       height: "18",
          //       fillRule: "evenodd",
          //       clipRule: "evenodd",
          //       fill: "currentColor",
          //       viewBox: "0 0 15 15",
          //       className: ""
          //     },
          //     children: [
          //       {
          //         type: "element",
          //         tagName: "path",
          //         properties: {
          //           d: "M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
          //         }
          //       }
          //     ]
          //   }
          // ],
          content: [
            {
              type: "element",
              tagName: "svg",
              properties: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                fillRule: "evenodd",
                clipRule: "evenodd",
                fill: "currentColor",
                viewBox: "0 0 24 24",
                className: ""
              },
              children: [
                {
                  type: "element",
                  tagName: "path",
                  properties: {
                    fill: "none",
                    stroke: "currentColor",
                    strokeDasharray: "28",
                    strokeDashoffset: "28",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2.8",
                    d: "M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0"
                  },
                  children: [
                    {
                      type: "element",
                      tagName: "animate",
                      properties: {
                        fill: "freeze",
                        attributeName: "stroke-dashoffset",
                        dur: "1s",
                        values: "28;0"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
      // rehypeCssBlocks
    ]
  }
});
