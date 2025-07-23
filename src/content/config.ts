import { defineCollection, z } from "astro:content";
import { blogLoader } from "./loaders/blogLoader";
import { eventsLoader } from "./loaders/eventsLoader";

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

// Define the events collection schema
const eventsCollection = defineCollection({
  loader: eventsLoader(),
  schema: z.object({
    title: z.string(),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    description: z.string().optional(),
    location: z.string().optional(),
    category: z.string().optional(),
    organizer: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    maxAttendees: z.number().optional(),
    currentAttendees: z.number().default(0),
    price: z.number().default(0),
    currency: z.string().default("EUR"),
    tags: z.array(z.string()).default([]),
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
        ogType: z.string().default("event"),
        twitterCard: z.string().default("summary_large_image"),
      })
      .optional(),
    registrationUrl: z.string().optional(),
    contactEmail: z.string().email().optional(),
    duration: z.number().optional(), // Will be calculated automatically
    upcoming: z.boolean().optional(), // Will be calculated automatically
  }),
});

// Export the collections
export const collections = {
  blog: blogCollection,
  events: eventsCollection,
};

// Export types for use in components
export type BlogPost = z.infer<typeof blogCollection.schema>;
export type BlogAuthor = BlogPost["author"];
export type BlogCategory = BlogPost["category"];

export type Event = z.infer<typeof eventsCollection.schema>;
export type EventCategory = Event["category"];
export type EventOrganizer = Event["organizer"];
