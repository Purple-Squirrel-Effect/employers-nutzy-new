import type { CollectionEntry } from "astro:content";
import type { BlogPost } from "../content/config";

export type BlogPostEntry = CollectionEntry<"blog">;

/**
 * Calculate reading time for a blog post
 * @param content - The markdown content of the blog post
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  // Remove markdown syntax and HTML tags for accurate word count
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "") // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
    .replace(/#+ /g, "") // Remove headers
    .replace(/[*_~]/g, "") // Remove emphasis markers
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  const words = cleanContent.split(" ").filter((word) => word.length > 0);
  const wordsPerMinute = 200; // Average reading speed
  const readingTime = Math.ceil(words.length / wordsPerMinute);

  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Format a date for display
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'nl-NL')
 * @returns Formatted date string
 */
export function formatDate(date: Date, locale: string = "nl-NL"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Format a date for display in a shorter format
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'nl-NL')
 * @returns Formatted date string
 */
export function formatDateShort(date: Date, locale: string = "nl-NL"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Get unique tags from an array of blog posts
 * @param posts - Array of blog posts
 * @returns Array of unique tags sorted alphabetically
 */
export function getUniqueTags(posts: BlogPostEntry[]): string[] {
  const allTags = posts.flatMap((post) => post.data.tags);
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags.sort();
}

/**
 * Filter blog posts by tag
 * @param posts - Array of blog posts
 * @param tag - Tag to filter by
 * @returns Filtered array of blog posts
 */
export function filterPostsByTag(
  posts: BlogPostEntry[],
  tag: string
): BlogPostEntry[] {
  return posts.filter((post) => post.data.tags.includes(tag));
}

/**
 * Filter blog posts by category
 * @param posts - Array of blog posts
 * @param category - Category to filter by
 * @returns Filtered array of blog posts
 */
export function filterPostsByCategory(
  posts: BlogPostEntry[],
  category: string
): BlogPostEntry[] {
  return posts.filter((post) => post.data.category === category);
}

/**
 * Sort blog posts by publish date (newest first)
 * @param posts - Array of blog posts
 * @returns Sorted array of blog posts
 */
export function sortPostsByDate(posts: BlogPostEntry[]): BlogPostEntry[] {
  return posts.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
  );
}

/**
 * Get featured blog posts
 * @param posts - Array of blog posts
 * @returns Array of featured blog posts
 */
export function getFeaturedPosts(posts: BlogPostEntry[]): BlogPostEntry[] {
  return posts.filter((post) => post.data.featured);
}

/**
 * Get published blog posts (exclude drafts)
 * @param posts - Array of blog posts
 * @returns Array of published blog posts
 */
export function getPublishedPosts(posts: BlogPostEntry[]): BlogPostEntry[] {
  return posts.filter((post) => !post.data.draft);
}

/**
 * Get related posts based on tags and category
 * @param currentPost - The current blog post
 * @param allPosts - Array of all blog posts
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related blog posts
 */
export function getRelatedPosts(
  currentPost: BlogPostEntry,
  allPosts: BlogPostEntry[],
  limit: number = 3
): BlogPostEntry[] {
  const publishedPosts = getPublishedPosts(allPosts);
  const otherPosts = publishedPosts.filter(
    (post) => post.slug !== currentPost.slug
  );

  // Score posts based on shared tags and category
  const scoredPosts = otherPosts.map((post) => {
    let score = 0;

    // Same category gets higher score
    if (post.data.category === currentPost.data.category) {
      score += 3;
    }

    // Shared tags get points
    const sharedTags = post.data.tags.filter((tag) =>
      currentPost.data.tags.includes(tag)
    );
    score += sharedTags.length;

    return { post, score };
  });

  // Sort by score (highest first) and return limited results
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

/**
 * Paginate an array of items
 * @param items - Array of items to paginate
 * @param page - Current page number (1-based)
 * @param pageSize - Number of items per page
 * @returns Pagination object with items and metadata
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
} {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: items.slice(startIndex, endIndex),
    currentPage,
    totalPages,
    totalItems,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
  };
}

/**
 * Generate SEO-friendly slug from title
 * @param title - The title to convert to slug
 * @returns SEO-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Get blog post excerpt from content
 * @param content - The full content
 * @param maxLength - Maximum length of excerpt (default: 160)
 * @returns Truncated excerpt
 */
export function getExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax and HTML tags
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "") // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
    .replace(/#+ /g, "") // Remove headers
    .replace(/[*_~]/g, "") // Remove emphasis markers
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Find the last complete word within the limit
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
}

/**
 * Get most popular tags based on usage frequency
 * @param posts - Array of blog posts
 * @param limit - Maximum number of tags to return (default: 10)
 * @returns Array of popular tags sorted by frequency
 */
export function getPopularTags(
  posts: BlogPostEntry[],
  limit: number = 10
): string[] {
  const tagCounts = new Map<string, number>();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1]) // Sort by count descending
    .slice(0, limit)
    .map(([tag]) => tag);
}

/**
 * Search blog posts by title, description, and content
 * @param posts - Array of blog posts
 * @param query - Search query
 * @returns Array of matching blog posts
 */
export function searchPosts(
  posts: BlogPostEntry[],
  query: string
): BlogPostEntry[] {
  if (!query.trim()) {
    return posts;
  }

  const searchTerms = query
    .toLowerCase()
    .split(" ")
    .filter((term) => term.length > 0);

  return posts.filter((post) => {
    const searchableContent = [
      post.data.title,
      post.data.description,
      post.data.tags.join(" "),
      post.data.category,
      post.data.author.name,
      post.body,
    ]
      .join(" ")
      .toLowerCase();

    return searchTerms.every((term) => searchableContent.includes(term));
  });
}

/**
 * Get posts by date range
 * @param posts - Array of blog posts
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of posts within date range
 */
export function getPostsByDateRange(
  posts: BlogPostEntry[],
  startDate: Date,
  endDate: Date
): BlogPostEntry[] {
  return posts.filter((post) => {
    const postDate = post.data.publishDate;
    return postDate >= startDate && postDate <= endDate;
  });
}

/**
 * Get posts from the last N days
 * @param posts - Array of blog posts
 * @param days - Number of days to look back
 * @returns Array of recent posts
 */
export function getRecentPosts(
  posts: BlogPostEntry[],
  days: number = 30
): BlogPostEntry[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return posts.filter((post) => post.data.publishDate >= cutoffDate);
}

/**
 * Group posts by category
 * @param posts - Array of blog posts
 * @returns Object with categories as keys and posts as values
 */
export function groupPostsByCategory(
  posts: BlogPostEntry[]
): Record<string, BlogPostEntry[]> {
  return posts.reduce((groups, post) => {
    const category = post.data.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(post);
    return groups;
  }, {} as Record<string, BlogPostEntry[]>);
}

/**
 * Group posts by year and month
 * @param posts - Array of blog posts
 * @returns Nested object with year > month > posts structure
 */
export function groupPostsByDate(
  posts: BlogPostEntry[]
): Record<number, Record<number, BlogPostEntry[]>> {
  return posts.reduce((groups, post) => {
    const date = post.data.publishDate;
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-based month

    if (!groups[year]) {
      groups[year] = {};
    }
    if (!groups[year][month]) {
      groups[year][month] = [];
    }

    groups[year][month].push(post);
    return groups;
  }, {} as Record<number, Record<number, BlogPostEntry[]>>);
}

/**
 * Calculate blog statistics
 * @param posts - Array of blog posts
 * @returns Object with various blog statistics
 */
export function getBlogStats(posts: BlogPostEntry[]) {
  const publishedPosts = getPublishedPosts(posts);
  const totalReadingTime = publishedPosts.reduce(
    (total, post) => total + calculateReadingTime(post.body),
    0
  );

  const categoryStats = groupPostsByCategory(publishedPosts);
  const tagCounts = new Map<string, number>();

  publishedPosts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return {
    totalPosts: publishedPosts.length,
    totalDrafts: posts.length - publishedPosts.length,
    totalReadingTime,
    averageReadingTime: Math.round(totalReadingTime / publishedPosts.length),
    totalCategories: Object.keys(categoryStats).length,
    totalTags: tagCounts.size,
    mostPopularCategory: Object.entries(categoryStats).sort(
      (a, b) => b[1].length - a[1].length
    )[0]?.[0],
    mostPopularTag: Array.from(tagCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0],
    featuredPosts: publishedPosts.filter((post) => post.data.featured).length,
    postsThisMonth: getRecentPosts(publishedPosts, 30).length,
    postsThisYear: getPostsByDateRange(
      publishedPosts,
      new Date(new Date().getFullYear(), 0, 1),
      new Date()
    ).length,
  };
}
