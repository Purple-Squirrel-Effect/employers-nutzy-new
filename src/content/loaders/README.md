# Astro Content Loaders

This directory contains custom content loaders for the Astro Content Loader API. These loaders allow you to fetch blog content from various sources and integrate them seamlessly with Astro's content collections.

## Current Loaders

### 1. Blog Loader (`blogLoader.ts`)

A simple loader that loads blog posts from a mock database. This is currently being used in the project.

**Usage:**

```typescript
// src/content/config.ts
import { blogLoader } from "./loaders/blogLoader";

const blogCollection = defineCollection({
  loader: blogLoader(),
  schema: z.object({
    // your schema here
  }),
});
```

**Features:**

- Loads from mock database (easily replaceable with real data source)
- Calculates reading time automatically
- Supports all blog post fields (title, content, category, author, etc.)
- Generates content digests for change detection
- Provides rendered HTML content

### 2. Events Loader (`eventsLoader.ts`)

A loader that manages event data with proper date/time validation and event-specific features.

**Usage:**

```typescript
// src/content/config.ts
import { eventsLoader } from "./loaders/eventsLoader";

const eventsCollection = defineCollection({
  loader: eventsLoader(),
  schema: z.object({
    // your schema here
  }),
});
```

**Features:**

- Loads from mock database (easily replaceable with real data source)
- Validates event date/time constraints (endsAt must be after startsAt)
- Calculates event duration automatically
- Determines if events are upcoming
- Supports all event fields (title, startsAt, endsAt, location, etc.)
- Generates content digests for change detection
- Provides rendered HTML content for descriptions

**Required Fields:**

- `title`: String field for the event name/title
- `startsAt`: Date/datetime field for when the event begins
- `endsAt`: Date/datetime field for when the event ends

**Optional Fields:**

- `description`: Event description
- `location`: Event location
- `category`: Event category (Workshop, Webinar, Conference, etc.)
- `organizer`: Event organizer name
- `maxAttendees`: Maximum number of attendees
- `currentAttendees`: Current number of registered attendees
- `price`: Event price
- `currency`: Price currency (defaults to EUR)
- `tags`: Array of event tags
- `registrationUrl`: URL for event registration
- `contactEmail`: Contact email for the event
- And more...

### 3. API Loader (`apiLoader.ts`)

A flexible loader for fetching blog posts from external APIs, databases, or CMS systems.

**Usage:**

```typescript
// src/content/config.ts
import { apiLoader } from "./loaders/apiLoader";

const blogCollection = defineCollection({
  loader: apiLoader({
    apiUrl: "https://api.example.com/posts",
    apiKey: "your-api-key",
    refreshInterval: 60000, // 1 minute
  }),
  schema: z.object({
    // your schema here
  }),
});
```

**Features:**

- Configurable API endpoint
- Optional API key authentication
- Refresh interval to prevent excessive API calls
- Automatic change detection
- Error handling that doesn't break builds
- Support for different API response formats

### 4. Specialized Loaders

The `apiLoader.ts` file also includes specialized loaders for popular platforms:

#### PocketBase Loader

```typescript
import { pocketBaseLoader } from "./loaders/apiLoader";

const blogCollection = defineCollection({
  loader: pocketBaseLoader({
    url: "https://your-pocketbase.com",
    collection: "posts",
    authToken: "your-auth-token",
  }),
});
```

#### Strapi Loader

```typescript
import { strapiLoader } from "./loaders/apiLoader";

const blogCollection = defineCollection({
  loader: strapiLoader({
    url: "https://your-strapi.com",
    apiKey: "your-api-key",
  }),
});
```

#### WordPress Loader

```typescript
import { wordPressLoader } from "./loaders/apiLoader";

const blogCollection = defineCollection({
  loader: wordPressLoader({
    url: "https://your-wordpress-site.com",
    username: "your-username",
    password: "your-app-password",
  }),
});
```

## How to Switch from Mock Data to Real Data

### Option 1: Replace the Mock Database

Edit `src/content/loaders/blogLoader.ts` and replace the `blogDatabase` object with a real data source:

```typescript
// Instead of the mock database, fetch from your API
const response = await fetch("https://your-api.com/posts");
const posts = await response.json();

// Process the posts...
for (const [id, post] of Object.entries(posts)) {
  // ... existing logic
}
```

### Option 2: Switch to API Loader

1. Update `src/content/config.ts`:

```typescript
import { apiLoader } from "./loaders/apiLoader";

const blogCollection = defineCollection({
  loader: apiLoader({
    apiUrl: "https://your-api.com/posts",
    apiKey: "your-api-key",
  }),
  schema: z.object({
    // your existing schema
  }),
});
```

2. Make sure your API returns data in the expected format (see `ApiBlogPost` interface in `apiLoader.ts`)

### Option 3: Create a Custom Loader

Create a new loader file for your specific data source:

```typescript
// src/content/loaders/customLoader.ts
import type { Loader } from "astro/loaders";

export function customLoader(): Loader {
  return {
    name: "custom-loader",
    load: async ({ store, logger, parseData, generateDigest }) => {
      // Your custom loading logic here
      logger.info("Loading from custom source");

      // Fetch your data
      const data = await fetchFromYourSource();

      // Clear existing entries
      store.clear();

      // Process each item
      for (const item of data) {
        const parsedData = await parseData({
          id: item.id,
          data: item,
        });

        store.set({
          id: item.id,
          data: parsedData,
          digest: generateDigest(parsedData),
        });
      }
    },
  };
}
```

## Data Format

All loaders expect blog posts to have this structure:

```typescript
interface BlogPost {
  title: string;
  content: string; // HTML content
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
  readingTime?: number; // Will be calculated if not provided
}
```

## Development

When developing with loaders:

1. **Check the logs**: Loaders output helpful information to the console
2. **Use digests**: The `generateDigest` function helps prevent unnecessary updates
3. **Handle errors gracefully**: Don't let API failures break your build
4. **Use refresh intervals**: Prevent excessive API calls during development

## Production Considerations

1. **API Rate Limits**: Use refresh intervals to respect API rate limits
2. **Error Handling**: Always handle API failures gracefully
3. **Caching**: Consider implementing additional caching for frequently accessed data
4. **Authentication**: Store API keys securely using environment variables
5. **Performance**: Use digests to avoid unnecessary re-processing of unchanged content

## Environment Variables

For production use, store sensitive information in environment variables:

```bash
# .env
API_URL=https://your-api.com
API_KEY=your-secret-key
POCKETBASE_URL=https://your-pocketbase.com
POCKETBASE_TOKEN=your-token
```

Then use them in your loader configuration:

```typescript
const blogCollection = defineCollection({
  loader: apiLoader({
    apiUrl: import.meta.env.API_URL,
    apiKey: import.meta.env.API_KEY,
  }),
});
```
