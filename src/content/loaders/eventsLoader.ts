import type { Loader } from "astro/loaders";

// Event interface matching the required fields
interface Event {
  title: string;
  startsAt: Date;
  endsAt: Date;
  description?: string;
  location?: string;
  category?: string;
  organizer?: string;
  featured?: boolean;
  draft?: boolean;
  maxAttendees?: number;
  currentAttendees?: number;
  price?: number;
  currency?: string;
  tags?: string[];
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
  registrationUrl?: string;
  contactEmail?: string;
}

// Events database - this would be replaced with API/database calls in production
const eventsDatabase: Record<string, Event> = {
  "gen-z-recruitment-summit-2025": {
    title: "Gen-Z Recruitment Summit 2025",
    startsAt: new Date("2025-08-15T09:00:00"),
    endsAt: new Date("2025-08-15T17:00:00"),
    description:
      "Het grootste Gen-Z recruitment event van Nederland. Ontdek de nieuwste trends, strategieën en tools om jonge talenten aan te trekken.",
    location: "Amsterdam RAI, Nederland",
    category: "Summit",
    organizer: "Nutzy Recruitment",
    featured: true,
    maxAttendees: 300,
    currentAttendees: 127,
    price: 399,
    currency: "EUR",
    tags: ["Gen-Z", "Recruitment", "Summit", "Networking", "Trends"],
    registrationUrl: "https://example.com/register/gen-z-summit",
    contactEmail: "events@nutzy.nl",
  },
  "ai-recruitment-webinar": {
    title: "AI in Recruitment: De Toekomst is Nu",
    startsAt: new Date("2025-08-02T14:00:00"),
    endsAt: new Date("2025-08-02T15:30:00"),
    description:
      "Ontdek hoe AI en machine learning de recruitment wereld transformeren. Praktische tips en tools voor moderne recruiters.",
    location: "Online",
    category: "Webinar",
    organizer: "Nutzy Recruitment",
    featured: false,
    maxAttendees: 500,
    currentAttendees: 234,
    price: 0,
    currency: "EUR",
    tags: ["AI", "Webinar", "Online", "Recruitment", "Technology"],
    registrationUrl: "https://example.com/register/ai-webinar",
    contactEmail: "events@nutzy.nl",
  },
  "employer-branding-workshop": {
    title: "Employer Branding voor Gen-Z Workshop",
    startsAt: new Date("2025-09-10T10:00:00"),
    endsAt: new Date("2025-09-10T16:00:00"),
    description:
      "Leer hoe je een authentiek employer brand opbouwt dat Gen-Z aanspreekt. Hands-on workshop met praktische oefeningen.",
    location: "Utrecht, Nederland",
    category: "Workshop",
    organizer: "Nutzy Recruitment",
    featured: false,
    maxAttendees: 40,
    currentAttendees: 28,
    price: 299,
    currency: "EUR",
    tags: ["Employer Branding", "Workshop", "Gen-Z", "Marketing"],
    registrationUrl: "https://example.com/register/employer-branding-workshop",
    contactEmail: "events@nutzy.nl",
  },
  "social-media-recruitment-masterclass": {
    title: "Social Media Recruitment Masterclass",
    startsAt: new Date("2025-09-25T13:00:00"),
    endsAt: new Date("2025-09-25T17:00:00"),
    description:
      "Masterclass over effectieve recruitment via TikTok, Instagram en LinkedIn. Van content creatie tot candidate engagement.",
    location: "Rotterdam, Nederland",
    category: "Masterclass",
    organizer: "Social Recruitment Experts",
    featured: true,
    maxAttendees: 60,
    currentAttendees: 31,
    price: 349,
    currency: "EUR",
    tags: ["Social Media", "Masterclass", "TikTok", "Instagram", "LinkedIn"],
    registrationUrl: "https://example.com/register/social-media-masterclass",
    contactEmail: "info@socialrecruitment.nl",
  },
  "diversity-inclusion-conference": {
    title: "Diversiteit & Inclusie in Recruitment Conference",
    startsAt: new Date("2025-10-15T09:00:00"),
    endsAt: new Date("2025-10-16T17:00:00"),
    description:
      "Tweedaagse conferentie over het creëren van inclusieve recruitment processen en diverse teams.",
    location: "Den Haag, Nederland",
    category: "Conference",
    organizer: "D&I Netherlands",
    featured: false,
    maxAttendees: 200,
    currentAttendees: 89,
    price: 599,
    currency: "EUR",
    tags: ["Diversity", "Inclusion", "Conference", "HR", "Leadership"],
    registrationUrl: "https://example.com/register/di-conference",
    contactEmail: "info@dinl.org",
  },
  // Past event for reference
  "recruitment-trends-2024": {
    title: "Recruitment Trends 2024 - Terugblik",
    startsAt: new Date("2024-12-10T14:00:00"),
    endsAt: new Date("2024-12-10T17:00:00"),
    description:
      "Terugblik op de belangrijkste recruitment trends van 2024 en vooruitblik naar 2025.",
    location: "Online",
    category: "Webinar",
    organizer: "Nutzy Recruitment",
    featured: false,
    maxAttendees: 300,
    currentAttendees: 287,
    price: 0,
    currency: "EUR",
    tags: ["Trends", "Webinar", "2024", "Terugblik"],
    registrationUrl: "https://example.com/register/trends-2024",
    contactEmail: "events@nutzy.nl",
  },
};

/**
 * Calculate event duration in hours
 */
function calculateEventDuration(startsAt: Date, endsAt: Date): number {
  const durationMs = endsAt.getTime() - startsAt.getTime();
  return Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10; // Round to 1 decimal place
}

/**
 * Check if event is upcoming
 */
function isUpcoming(startsAt: Date): boolean {
  return startsAt.getTime() > Date.now();
}

/**
 * Events loader function that returns a loader object
 */
export function eventsLoader(): Loader {
  return {
    name: "events-loader",
    load: async ({ store, logger, parseData, generateDigest }) => {
      logger.info("Loading events");

      // Clear existing entries
      store.clear();

      // Load each event from the database
      for (const [slug, event] of Object.entries(eventsDatabase)) {
        try {
          // Validate that endsAt is after startsAt
          if (event.endsAt <= event.startsAt) {
            logger.error(`Event ${slug}: endsAt must be after startsAt`);
            continue;
          }

          // Calculate additional fields
          const duration = calculateEventDuration(event.startsAt, event.endsAt);
          const upcoming = isUpcoming(event.startsAt);

          // Prepare the data with calculated fields
          const eventData = {
            ...event,
            duration,
            upcoming,
            // Ensure arrays have defaults
            tags: event.tags || [],
            // Ensure booleans have defaults
            featured: event.featured || false,
            draft: event.draft || false,
            // Ensure numbers have defaults
            currentAttendees: event.currentAttendees || 0,
            price: event.price || 0,
            currency: event.currency || "EUR",
          };

          // Parse and validate the data
          const parsedData = await parseData({
            id: slug,
            data: eventData,
          });

          // Generate a digest for change detection
          const digest = generateDigest(parsedData);

          // Store the entry
          store.set({
            id: slug,
            data: parsedData,
            digest,
            // Set rendered content for any HTML description
            rendered: {
              html: event.description || "",
              metadata: {
                frontmatter: {
                  title: event.title,
                  startsAt: event.startsAt,
                  endsAt: event.endsAt,
                  category: event.category,
                  organizer: event.organizer,
                },
              },
            },
          });

          logger.info(`Loaded event: ${slug}`);
        } catch (error) {
          logger.error(`Failed to load event ${slug}:`, error);
        }
      }

      logger.info(
        `Successfully loaded ${Object.keys(eventsDatabase).length} events`
      );
    },
  };
}
