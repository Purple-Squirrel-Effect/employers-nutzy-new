import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPublishedPosts, sortPostsByDate } from '../utils/blog';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const allBlogPosts = await getCollection('blog');
  const publishedPosts = getPublishedPosts(allBlogPosts);
  const sortedPosts = sortPostsByDate(publishedPosts);

  return rss({
    title: 'Nutzy Blog - Gen-Z Recruitment Insights',
    description: 'Ontdek de nieuwste inzichten over Gen-Z recruitment, platform strategieën en trends in de arbeidsmarkt. Kennis delen voor betere recruitment resultaten.',
    site: context.site || 'https://nutzy.nl',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.slug}/`,
      author: post.data.author.name,
      categories: [post.data.category, ...post.data.tags],
      customData: `
        <content:encoded><![CDATA[${post.body}]]></content:encoded>
        <dc:creator>${post.data.author.name}</dc:creator>
        ${post.data.heroImage ? `<media:content url="${post.data.heroImage.src}" type="image/jpeg" />` : ''}
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
      content: 'http://purl.org/rss/1.0/modules/content/',
      dc: 'http://purl.org/dc/elements/1.1/',
      media: 'http://search.yahoo.com/mrss/',
    },
  });
}
