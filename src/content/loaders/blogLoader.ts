import type { Loader } from "astro/loaders";

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

// Blog post database - this would be replaced with API/database calls in production
const blogDatabase: Record<string, BlogPost> = {
  "gen-z-recruitment-trends-2024": {
    title: "De Toekomst van Gen-Z Recruitment: Visuele Vacatures die Werken",
    content:
      "<p>Content section woohoo</p><p>all the content coming from tinyCME</p>",
    category: "Recruitment Insights",
    author: "Rowan Nutzy",
    posted: new Date("2025-07-23"),
    description:
      "Ontdek hoe visuele vacatures de manier waarop we Gen-Z talent aantrekken fundamenteel veranderen.",
    tags: [
      "Gen-Z Recruitment",
      "Visuele Vacatures",
      "Recruitment Trends",
      "Employer Branding",
    ],
    featured: true,
  },
  "employer-branding-visual-content": {
    title: "Employer Branding met Visuele Content: Een Complete Gids",
    content:
      "<p>Employer branding is essentieel geworden in de moderne recruitment wereld. Visuele content speelt hierbij een cruciale rol.</p><p>In dit artikel bespreken we hoe je effectief gebruik kunt maken van visuele elementen in je employer branding strategie.</p>",
    category: "Strategy",
    author: "Rowan Nutzy",
    posted: new Date("2025-06-15"),
    description:
      "Leer hoe je visuele content effectief inzet voor een sterke employer brand.",
    tags: ["Employer Branding", "Visuele Content", "Strategy", "Marketing"],
  },
  "platform-features-deep-dive": {
    title: "Nutzy Platform Features: Een Diepgaande Analyse",
    content:
      "<p>Ontdek alle mogelijkheden van het Nutzy platform en hoe deze je recruitment proces kunnen verbeteren.</p><p>Van visuele vacatures tot creator partnerships - we bespreken alle features in detail.</p>",
    category: "Platform",
    author: "Rowan Nutzy",
    posted: new Date("2025-05-20"),
    description:
      "Een complete overview van alle Nutzy platform features en hun voordelen.",
    tags: ["Platform", "Features", "Technology", "Recruitment"],
  },
  "gen-z-insights-2024": {
    title: "Gen-Z Insights: Wat Werkgevers Moeten Weten in 2024",
    content:
      "<p>Gen-Z heeft unieke verwachtingen als het gaat om werk en carrière. Als werkgever is het essentieel om deze te begrijpen.</p><p>In dit artikel delen we de belangrijkste insights over Gen-Z en hoe je hierop kunt inspelen.</p>",
    category: "Insights",
    author: "Rowan Nutzy",
    posted: new Date("2025-05-01"),
    description:
      "Belangrijke insights over Gen-Z verwachtingen en hoe werkgevers hierop kunnen inspelen.",
    tags: ["Gen-Z", "Insights", "Workplace", "Trends"],
  },
  "video-recruitment-best-practices": {
    title: "Video Recruitment: Best Practices voor 2025",
    content:
      "<p>Video is uitgegroeid tot een essentieel onderdeel van moderne wervingsstrategieën. In dit artikel delen we de beste praktijken voor het gebruik van video in je recruitment proces.</p><p>Van vacature video's tot virtuele kantoortoers - leer hoe je video effectief kunt inzetten.</p>",
    category: "Trends",
    author: "Rowan Nutzy",
    posted: new Date("2025-04-10"),
    description:
      "Best practices voor het effectief inzetten van video in recruitment.",
    tags: ["Video", "Recruitment", "Best Practices", "Technology"],
  },
};

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
      logger.info("Loading blog posts");

      // Clear existing entries
      store.clear();

      // Load each blog post from the database
      for (const [slug, post] of Object.entries(blogDatabase)) {
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
          logger.error(`Failed to load blog post ${slug}:`, error);
        }
      }

      logger.info(
        `Successfully loaded ${Object.keys(blogDatabase).length} blog posts`
      );
    },
  };
}
