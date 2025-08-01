import type { Loader } from "astro/loaders";
import PocketBase from "pocketbase";

// PocketBase configuration
const POCKETBASE_URL =
  process.env.POCKETBASE_URL || "https://employers-backend.nutzy.nl";

// Simplified blog post interface with only used fields
interface BlogPost {
  title: string;
  content: string;
  category: string;
  author: string;
  posted: Date;
  description?: string;
  tags?: string[];
  draft?: boolean;
  readingTime?: number;
}

// PocketBase record interface matching the API response
interface PocketBaseBlogPost {
  id: string;
  collectionId: string;
  collectionName: string;
  title: string;
  content: string;
  category: string;
  author: string; // This is a RELATION_RECORD_ID according to API docs
  description?: string;
  tags?: string;
  draft?: boolean;
  readingTime?: number;
  created: string;
  updated: string;
}

/**
 * Transform PocketBase record to BlogPost format
 */
function transformPocketBaseRecord(
  record: PocketBaseBlogPost & { expand?: any }
): BlogPost {
  // Parse tags from string to array
  const tags = record.tags
    ? record.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  // Handle author - use expanded author name if available, otherwise use a fallback
  let authorName = record.author;
  if (record.expand?.author) {
    // Assuming the author record has a 'name' field
    authorName =
      record.expand.author.name ||
      record.expand.author.username ||
      record.author;
  } else {
    // Fallback for when expand doesn't work - use a generic name
    authorName = "Nutzy Team";
  }

  return {
    title: record.title.trim(), // Remove extra whitespace/carriage returns
    content: record.content,
    category: record.category,
    author: authorName,
    posted: new Date(record.created),
    description: record.description,
    tags,
    draft: record.draft || false,
    readingTime: record.readingTime,
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
    // Filter out draft posts in production
    const records = await pb
      .collection("posts")
      .getFullList<PocketBaseBlogPost>({
        sort: "-created",
        // Filter out draft posts (uncomment for production)
        // filter: 'draft != true',
        // Expand author relation to get author details
        expand: "author",
      });

    console.log(`Fetched ${records.length} blog posts from PocketBase`);

    if (records.length > 0) {
      console.log(
        "Sample record with expand:",
        JSON.stringify(records[0], null, 2)
      );
    }

    const blogPosts: Record<string, BlogPost> = {};

    for (const record of records) {
      try {
        // Use the record ID as the slug
        const slug = record.id;
        blogPosts[slug] = transformPocketBaseRecord(record);
      } catch (transformError) {
        console.error(
          `Failed to transform record ${record.id}:`,
          transformError
        );
        // Continue with other records
      }
    }

    return blogPosts;
  } catch (error) {
    console.error("Failed to fetch blog posts from PocketBase:", error);
    console.error("PocketBase URL:", POCKETBASE_URL);

    // Check if it's a network error or API error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }

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
