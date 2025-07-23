import type { Loader } from "astro/loaders";
import PocketBase from "pocketbase";

// PocketBase configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";

// Blog post interface matching your current structure
interface BlogPost {
  title: string;
  content: string;
  category: string;
  author: string;
  posted: Date;
  description?: string;
  tags?: string[];
  featured?: boolean;
  draft?: boolean;
  heroImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
  };
  readingTime?: number;
  relatedPosts?: string[];
}

// PocketBase record interface matching the API response
interface PocketBaseBlogPost {
  id: string;
  collectionId: string;
  collectionName: string;
  title: string;
  content: string;
  category: string;
  author: string;
  description?: string;
  tags?: string;
  featured?: boolean;
  draft?: boolean;
  heroImage?: string;
  heroImageAlt?: string;
  heroImageCaption?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  readingTime?: number;
  relatedPosts?: string;
  created: string;
  updated: string;
}

/**
 * Transform PocketBase record to BlogPost format
 */
function transformPocketBaseRecord(record: PocketBaseBlogPost): BlogPost {
  // Parse tags from string to array
  const tags = record.tags
    ? record.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  // Parse related posts from string to array
  const relatedPosts = record.relatedPosts
    ? record.relatedPosts
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];

  // Create hero image object if data exists
  const heroImage = record.heroImage
    ? {
        src: record.heroImage,
        alt: record.heroImageAlt || "",
        caption: record.heroImageCaption,
      }
    : undefined;

  // Create SEO object if data exists
  const seo =
    record.metaTitle ||
    record.metaDescription ||
    record.ogImage ||
    record.ogType ||
    record.twitterCard
      ? {
          metaTitle: record.metaTitle,
          metaDescription: record.metaDescription,
          ogImage: record.ogImage,
          ogType: record.ogType,
          twitterCard: record.twitterCard,
        }
      : undefined;

  return {
    title: record.title,
    content: record.content,
    category: record.category,
    author: record.author,
    posted: new Date(record.created),
    description: record.description,
    tags,
    featured: record.featured || false,
    draft: record.draft || false,
    heroImage,
    seo,
    readingTime: record.readingTime,
    relatedPosts,
  };
}

/**
 * Fetch blog posts from PocketBase
 */
async function fetchBlogPostsFromPocketBase(): Promise<
  Record<string, BlogPost>
> {
  try {
    const pb = new PocketBase(POCKETBASE_URL);

    // Fetch all blog posts, sorted by creation date (newest first)
    const records = await pb
      .collection("posts")
      .getFullList<PocketBaseBlogPost>({
        sort: "-created",
      });

    const blogPosts: Record<string, BlogPost> = {};

    for (const record of records) {
      // Use the record ID as the slug, or generate one from the title
      const slug = record.id;
      blogPosts[slug] = transformPocketBaseRecord(record);
    }

    return blogPosts;
  } catch (error) {
    console.error("Failed to fetch blog posts from PocketBase:", error);
    // Return empty object if PocketBase is not available
    return {};
  }
}

/**
 * Calculate reading time for blog content
 */
function calculateReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(words / 200); // 200 words per minute
}

/**
 * Blog loader function that returns a loader object
 */
export function blogLoader(): Loader {
  return {
    name: "blog-loader",
    load: async ({ store, logger, parseData, generateDigest }) => {
      logger.info("Loading blog posts from PocketBase");

      // Clear existing entries
      store.clear();

      // Fetch blog posts from PocketBase
      const blogPosts = await fetchBlogPostsFromPocketBase();

      if (Object.keys(blogPosts).length === 0) {
        logger.warn("No blog posts found in PocketBase or connection failed");
        return;
      }

      // Load each blog post from PocketBase
      for (const [slug, post] of Object.entries(blogPosts)) {
        try {
          // Calculate reading time if not provided
          const readingTime =
            post.readingTime || calculateReadingTime(post.content);

          // Prepare the data with calculated fields
          const postData = {
            ...post,
            readingTime,
            // Ensure arrays have defaults
            tags: post.tags || [],
            // Ensure booleans have defaults
            featured: post.featured || false,
            draft: post.draft || false,
          };

          // Parse and validate the data
          const parsedData = await parseData({
            id: slug,
            data: postData,
          });

          // Generate a digest for change detection
          const digest = generateDigest(parsedData);

          // Store the entry
          store.set({
            id: slug,
            data: parsedData,
            digest,
            // Set rendered content for the HTML
            rendered: {
              html: post.content,
              metadata: {
                frontmatter: {
                  title: post.title,
                  category: post.category,
                  author: post.author,
                  posted: post.posted,
                },
              },
            },
          });

          logger.info(`Loaded blog post: ${slug}`);
        } catch (error) {
          logger.error(`Failed to load blog post ${slug}: ${error}`);
        }
      }

      logger.info(
        `Successfully loaded ${
          Object.keys(blogPosts).length
        } blog posts from PocketBase`
      );
    },
  };
}
