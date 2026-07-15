import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";

// Image metadata
export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630
};

// Image generation
export default async function Image({ url, params }: { url: string; params: Promise<{ slug: string }> }) {
  // slug / path params id
  const slug = (await params).slug;
  // fetch data
  const post = await fetch(`${url}/${slug}`).then(res => res.json());

  // logo image
  const logoSrc = await fetch(new URL("/favicon/asset-umk-transparent.png", import.meta.url)).then(res => res.arrayBuffer());

  // Font
  const interSemiBold = fetch(new URL("./Inter-SemiBold.ttf", import.meta.url)).then(res => res.arrayBuffer());

  return new ImageResponse(
    // ImageResponse JSX element
    <div
      {...{
        style: {
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={String(logoSrc)} alt="" height="100" />
      {post.title}
    </div>,
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interSemiBold,
          style: "normal",
          weight: 400
        }
      ]
    }
  );
}
