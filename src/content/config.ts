import { defineCollection, z } from "astro:content";
import { blogLoader } from "./loaders/blogLoader";

// Define the blog collection schema
const blogCollection = defineCollection({
  loader: blogLoader(),
  schema: z.object({
    title: z.string(),
    content: z.string(), // HTML content from TinyMCE
    category: z.string(),
    author: z.string(),
    posted: z.coerce.date(),
    description: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    heroImage: z
      .object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
      .optional(),
    seo: z
      .object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogImage: z.string().optional(),
        ogType: z.string().default("article"),
        twitterCard: z.string().default("summary_large_image"),
      })
      .optional(),
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
export type BlogAuthor = BlogPost["author"];
export type BlogCategory = BlogPost["category"];
