import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://forum.sinapse.club";
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/forum`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/explore`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${baseUrl}/leaderboard`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/lp`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic: forum categories
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: categories } = await supabase
      .from("forum_categories")
      .select("slug")
      .eq("is_active", true);

    categoryPages = (categories ?? []).map((cat: { slug: string }) => ({
      url: `${baseUrl}/forum/${cat.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch {
    // Graceful degradation — static pages only
  }

  return [...staticPages, ...categoryPages];
}
