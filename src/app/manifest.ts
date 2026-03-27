import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "sinapse.club",
    short_name: "sinapse",
    description:
      "A comunidade de inteligencia artificial mais acessivel do mundo lusofono.",
    start_url: "/",
    display: "standalone",
    theme_color: "#7C3AED",
    background_color: "#FFFFFF",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
