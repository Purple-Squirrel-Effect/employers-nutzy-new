import type { CollectionEntry } from "astro:content";

/**
 * Calculate event duration in hours
 * @param startsAt - Event start date
 * @param endsAt - Event end date
 * @returns Duration in hours (rounded to 1 decimal place)
 */
export function calculateEventDuration(startsAt: Date, endsAt: Date): number {
  const durationMs = endsAt.getTime() - startsAt.getTime();
  return Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10;
}

/**
 * Check if an event is upcoming
 * @param startsAt - Event start date
 * @returns True if the event starts in the future
 */
export function isUpcoming(startsAt: Date): boolean {
  return startsAt.getTime() > Date.now();
}

/**
 * Check if an event is currently happening
 * @param startsAt - Event start date
 * @param endsAt - Event end date
 * @returns True if the event is currently in progress
 */
export function isOngoing(startsAt: Date, endsAt: Date): boolean {
  const now = Date.now();
  return startsAt.getTime() <= now && now <= endsAt.getTime();
}

/**
 * Check if an event has ended
 * @param endsAt - Event end date
 * @returns True if the event has ended
 */
export function hasEnded(endsAt: Date): boolean {
  return endsAt.getTime() < Date.now();
}

/**
 * Format event date and time for display
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'nl-NL')
 * @param options - Additional formatting options
 * @returns Formatted date and time string
 */
export function formatEventDateTime(
  date: Date,
  locale: string = "nl-NL",
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
}

/**
 * Format event date range for display
 * @param startsAt - Event start date
 * @param endsAt - Event end date
 * @param locale - The locale to use for formatting (default: 'nl-NL')
 * @returns Formatted date range string
 */
export function formatEventDateRange(
  startsAt: Date,
  endsAt: Date,
  locale: string = "nl-NL"
): string {
  const startDate = startsAt.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const endDate = endsAt.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startTime = startsAt.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = endsAt.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Same day event
  if (startDate === endDate) {
    return `${startDate} van ${startTime} tot ${endTime}`;
  }

  // Multi-day event
  return `${startDate} ${startTime} - ${endDate} ${endTime}`;
}

/**
 * Format event price for display
 * @param price - Event price
 * @param currency - Currency code (default: 'EUR')
 * @param locale - The locale to use for formatting (default: 'nl-NL')
 * @returns Formatted price string or "Gratis" for free events
 */
export function formatEventPrice(
  price: number,
  currency: string = "EUR",
  locale: string = "nl-NL"
): string {
  if (price === 0) {
    return "Gratis";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(price);
}

/**
 * Format event date only (without time)
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'nl-NL')
 * @returns Formatted date string
 */
export function formatEventDate(date: Date, locale: string = "nl-NL"): string {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format event time only (without date)
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'nl-NL')
 * @returns Formatted time string
 */
export function formatEventTime(date: Date, locale: string = "nl-NL"): string {
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get event status based on dates
 * @param startsAt - Event start date
 * @param endsAt - Event end date
 * @returns Event status string
 */
export function getEventStatus(startsAt: Date, endsAt: Date): string {
  if (hasEnded(endsAt)) {
    return "Afgelopen";
  }

  if (isOngoing(startsAt, endsAt)) {
    return "Bezig";
  }

  if (isUpcoming(startsAt)) {
    return "Binnenkort";
  }

  return "Onbekend";
}

/**
 * Filter events by status
 * @param events - Array of events
 * @param status - Status to filter by ('upcoming', 'ongoing', 'ended')
 * @returns Filtered events array
 */
export function filterEventsByStatus(
  events: CollectionEntry<"events">[],
  status: "upcoming" | "ongoing" | "ended"
): CollectionEntry<"events">[] {
  return events.filter((event) => {
    const { startsAt, endsAt } = event.data;

    switch (status) {
      case "upcoming":
        return isUpcoming(startsAt);
      case "ongoing":
        return isOngoing(startsAt, endsAt);
      case "ended":
        return hasEnded(endsAt);
      default:
        return false;
    }
  });
}

/**
 * Sort events by start date
 * @param events - Array of events
 * @param order - Sort order ('asc' for ascending, 'desc' for descending)
 * @returns Sorted events array
 */
export function sortEventsByDate(
  events: CollectionEntry<"events">[],
  order: "asc" | "desc" = "asc"
): CollectionEntry<"events">[] {
  return [...events].sort((a, b) => {
    const dateA = a.data.startsAt.getTime();
    const dateB = b.data.startsAt.getTime();

    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Sort events in a logical order for display:
 * 1. Upcoming events first (sorted by date ascending - nearest first)
 * 2. Ongoing events (if any)
 * 3. Past events last (sorted by date descending - most recent first)
 * @param events - Array of events
 * @returns Logically sorted events array
 */
export function sortEventsLogically(
  events: CollectionEntry<"events">[]
): CollectionEntry<"events">[] {
  const now = Date.now();

  // Separate events by status
  const upcomingEvents: CollectionEntry<"events">[] = [];
  const ongoingEvents: CollectionEntry<"events">[] = [];
  const pastEvents: CollectionEntry<"events">[] = [];

  events.forEach((event) => {
    const { startsAt, endsAt } = event.data;

    if (isUpcoming(startsAt)) {
      upcomingEvents.push(event);
    } else if (isOngoing(startsAt, endsAt)) {
      ongoingEvents.push(event);
    } else {
      pastEvents.push(event);
    }
  });

  // Sort each category appropriately
  const sortedUpcoming = sortEventsByDate(upcomingEvents, "asc"); // Nearest first
  const sortedOngoing = sortEventsByDate(ongoingEvents, "asc"); // Started earliest first
  const sortedPast = sortEventsByDate(pastEvents, "desc"); // Most recent first

  // Combine in logical order
  return [...sortedUpcoming, ...sortedOngoing, ...sortedPast];
}

/**
 * Get events happening within a specific date range
 * @param events - Array of events
 * @param startDate - Range start date
 * @param endDate - Range end date
 * @returns Events within the date range
 */
export function getEventsInDateRange(
  events: CollectionEntry<"events">[],
  startDate: Date,
  endDate: Date
): CollectionEntry<"events">[] {
  return events.filter((event) => {
    const eventStart = event.data.startsAt.getTime();
    const eventEnd = event.data.endsAt.getTime();
    const rangeStart = startDate.getTime();
    const rangeEnd = endDate.getTime();

    // Event overlaps with the range if:
    // - Event starts before range ends AND event ends after range starts
    return eventStart <= rangeEnd && eventEnd >= rangeStart;
  });
}

/**
 * Get featured events
 * @param events - Array of events
 * @returns Featured events array
 */
export function getFeaturedEvents(
  events: CollectionEntry<"events">[]
): CollectionEntry<"events">[] {
  return events.filter((event) => event.data.featured && !event.data.draft);
}

/**
 * Calculate availability percentage for an event
 * @param currentAttendees - Current number of attendees
 * @param maxAttendees - Maximum number of attendees
 * @returns Availability percentage (0-100)
 */
export function calculateAvailability(
  currentAttendees: number = 0,
  maxAttendees?: number
): number {
  if (!maxAttendees || maxAttendees <= 0) {
    return 100; // Unlimited capacity
  }

  const availability = ((maxAttendees - currentAttendees) / maxAttendees) * 100;
  return Math.max(0, Math.min(100, availability));
}

/**
 * Check if an event is nearly full (less than 10% availability)
 * @param currentAttendees - Current number of attendees
 * @param maxAttendees - Maximum number of attendees
 * @returns True if the event is nearly full
 */
export function isEventNearlyFull(
  currentAttendees: number = 0,
  maxAttendees?: number
): boolean {
  return calculateAvailability(currentAttendees, maxAttendees) < 10;
}

/**
 * Check if an event is sold out
 * @param currentAttendees - Current number of attendees
 * @param maxAttendees - Maximum number of attendees
 * @returns True if the event is sold out
 */
export function isEventSoldOut(
  currentAttendees: number = 0,
  maxAttendees?: number
): boolean {
  if (!maxAttendees) {
    return false; // Unlimited capacity
  }

  return currentAttendees >= maxAttendees;
}
