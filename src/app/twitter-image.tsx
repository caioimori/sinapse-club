// Re-export the same OG image for Twitter cards.
// Next.js 16 Turbopack requires these config exports to be statically
// declared per-file — re-exporting them via `export { runtime } from "..."`
// is rejected. The default renderer can be reused via a thin wrapper.
import OgImage from "./opengraph-image";

export const runtime = "edge";
export const alt = "sinapse.club — Comunidade de AI em Portugues";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OgImage;
