/**
 *- `URL`: https://example.com/blog/posts/article-1
 *- `Path`: /blog/posts/article-1
 *- `Segment`: blog | posts | article-1
 *- `Slug`: article-1 (last of segment)
 * @param segment
 * @param params
 * @returns
 */
export function pathParams(segment: string, params: string[] | undefined) {
  const cleanedSegment = segment.replace(/\//g, "");
  const path = `/${cleanedSegment}/${params?.join("/") || ""}`;
  return { path, segment: cleanedSegment, params };
}
