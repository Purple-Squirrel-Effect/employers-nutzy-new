import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const allBlogPosts = await getCollection("blog");

  // Filter out draft posts and sort by date (newest first)
  const publishedPosts = allBlogPosts
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) =>
        new Date(b.data.posted).getTime() - new Date(a.data.posted).getTime()
    );

  return rss({
    title: "Nutzy Blog - Gen-Z Recruitment Insights",
    description:
      "Ontdek de nieuwste inzichten over Gen-Z recruitment, platform strategieën en trends in de arbeidsmarkt. Kennis delen voor betere recruitment resultaten.",
    site: context.site || "https://nutzy.nl",
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.posted,
      link: `/blog/${post.id}/`,
      author: post.data.author,
      categories: [post.data.category, ...post.data.tags],
      customData: `
        <content:encoded><![CDATA[${post.data.content}]]></content:encoded>
        <dc:creator>${post.data.author}</dc:creator>
        ${
          post.data.heroImage
            ? `<media:content url="${post.data.heroImage.src}" type="image/jpeg" />`
            : ""
        }
      `,
    })),
    customData: `
      <language>nl-NL</language>
      <managingEditor>info@nutzy.nl (Nutzy Team)</managingEditor>
      <webMaster>info@nutzy.nl (Nutzy Team)</webMaster>
      <copyright>Copyright ${new Date().getFullYear()} Nutzy. All rights reserved.</copyright>
      <category>Business</category>
      <category>Recruitment</category>
      <category>Gen-Z</category>
      <ttl>60</ttl>
      <image>
        <url>https://nutzy.nl/img/logo.png</url>
        <title>Nutzy Blog</title>
        <link>https://nutzy.nl/blog</link>
        <width>144</width>
        <height>144</height>
      </image>
    `,
    xmlns: {
      content: "http://purl.org/rss/1.0/modules/content/",
      dc: "http://purl.org/dc/elements/1.1/",
      media: "http://search.yahoo.com/mrss/",
    },
  });
}
