import { defineCollection, z } from 'astro:content';

// Define the blog collection schema
const blogCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.object({
      name: z.string(),
      bio: z.string().optional(),
      avatar: z.string().optional(),
      social: z.object({
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
      }).optional(),
    }),
    tags: z.array(z.string()),
    category: z.enum([
      'recruitment',
      'gen-z',
      'platform',
      'strategy',
      'insights',
      'technology',
      'trends',
      'case-study'
    ]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    heroImage: z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    }).optional(),
    seo: z.object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImage: z.string().optional(),
      ogType: z.string().default('article'),
      twitterCard: z.string().default('summary_large_image'),
    }).optional(),
    readingTime: z.number().optional(), // Will be calculated automatically
    relatedPosts: z.array(z.string()).optional(), // Array of slugs
  }),
});

// Export the collections
export const collections = {
  blog: blogCollection,
};

// Export types for use in components
export type BlogPost = z.infer<typeof blogCollection.schema>;
export type BlogAuthor = BlogPost['author'];
export type BlogCategory = BlogPost['category'];
