import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const siteUrl = context.site || "https://nutzy.nl";

  // Get all blog posts
  const allBlogPosts = await getCollection("blog");
  const publishedPosts = allBlogPosts.filter((post) => !post.data.draft);

  // Static pages
  const staticPages = [
    {
      url: "",
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      url: "blog",
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: "0.9",
    },
    {
      url: "about",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      url: "contact",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      url: "platform",
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      url: "campaign-strategy",
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.7",
    },
  ];

  // Blog post pages
  const blogPages = publishedPosts.map((post) => ({
    url: `blog/${post.id}`,
    lastmod: (post.data.updatedDate || post.data.posted).toISOString(),
    changefreq: "monthly",
    priority: post.data.featured ? "0.8" : "0.6",
  }));

  // Combine all pages
  const allPages = [...staticPages, ...blogPages];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}/${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
