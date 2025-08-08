import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import PocketBase from "pocketbase";

// Initialize PocketBase client
const pb = new PocketBase("https://employers-backend.nutzy.nl");

// Contact form schema validation
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Naam moet minimaal 2 karakters bevatten")
    .max(100, "Naam mag maximaal 100 karakters bevatten"),
  email: z.string().email("Voer een geldig e-mailadres in"),
  business: z
    .string()
    .max(100, "Bedrijfsnaam mag maximaal 100 karakters bevatten")
    .optional(),
  subject: z.string().min(1, "Selecteer een onderwerp"),
  message: z
    .string()
    .min(10, "Bericht moet minimaal 10 karakters bevatten")
    .max(1000, "Bericht mag maximaal 1000 karakters bevatten"),
});

// Newsletter subscription schema validation
const newsletterSchema = z.object({
  email: z.string().email("Voer een geldig e-mailadres in"),
});

// Quickscan form schema validation
const quickscanSchema = z.object({
  company: z
    .string()
    .min(2, "Bedrijfsnaam moet minimaal 2 karakters bevatten")
    .max(100, "Bedrijfsnaam mag maximaal 100 karakters bevatten"),
  email: z.string().email("Voer een geldig e-mailadres in"),
  phone: z
    .string()
    .max(20, "Telefoonnummer mag maximaal 20 karakters bevatten")
    .optional(),
});

export const server = {
  // Contact form submission action
  submitContactForm: defineAction({
    accept: "form",
    input: contactFormSchema,
    handler: async (input) => {
      try {
        // Authenticate with PocketBase using admin credentials
        await pb.admins.authWithPassword(
          import.meta.env.POCKETBASE_USERNAME,
          import.meta.env.POCKETBASE_PASSWORD
        );

        // Prepare data for PocketBase
        const data = {
          name: input.name,
          email: input.email,
          business: input.business || "",
          subject: input.subject,
          message: input.message,
        };

        // Create the form submission record
        const record = await pb.collection("form_submissions").create(data);

        // Return success response
        return {
          success: true,
          message:
            "Bedankt voor je bericht! We nemen binnen 24 uur contact met je op.",
          id: record.id,
        };
      } catch (error) {
        console.error("Contact form submission error:", error);

        // Return error response
        throw new Error(
          "Er is een fout opgetreden bij het verzenden van je bericht. Probeer het opnieuw of neem direct contact met ons op."
        );
      }
    },
  }),

  // Newsletter subscription action
  subscribeNewsletter: defineAction({
    accept: "form",
    input: newsletterSchema,
    handler: async (input) => {
      try {
        // Authenticate with PocketBase using admin credentials
        await pb.admins.authWithPassword(
          import.meta.env.POCKETBASE_USERNAME,
          import.meta.env.POCKETBASE_PASSWORD
        );

        // Check if email already exists
        try {
          const existingSubscription = await pb
            .collection("newsletter_subscriptions")
            .getFirstListItem(`email="${input.email}"`);
          if (existingSubscription) {
            return {
              success: true,
              message: "Je bent al aangemeld voor onze nieuwsbrief!",
              id: existingSubscription.id,
            };
          }
        } catch (error) {
          // Email doesn't exist yet, which is what we want
        }

        // Prepare data for PocketBase
        const data = {
          email: input.email,
        };

        // Create the newsletter subscription record
        const record = await pb
          .collection("newsletter_subscriptions")
          .create(data);

        // Return success response
        return {
          success: true,
          message:
            "Bedankt voor je aanmelding! Je ontvangt binnenkort onze nieuwsbrief.",
          id: record.id,
        };
      } catch (error) {
        console.error("Newsletter subscription error:", error);

        // Return error response
        throw new Error(
          "Er is een fout opgetreden bij het aanmelden voor de nieuwsbrief. Probeer het opnieuw."
        );
      }
    },
  }),

  // Quickscan form submission action
  submitQuickscanForm: defineAction({
    accept: "form",
    input: quickscanSchema,
    handler: async (input) => {
      try {
        // Authenticate with PocketBase using admin credentials
        await pb.admins.authWithPassword(
          import.meta.env.POCKETBASE_USERNAME,
          import.meta.env.POCKETBASE_PASSWORD
        );
        // Prepare data for PocketBase
        const data = {
          company: input.company,
          email: input.email,
          phone: input.phone || "",
          type: "quickscan", // Add type to distinguish from other form submissions
        };

        // Create the quickscan submission record
        const record = await pb.collection("form_submissions").create(data);

        // Return success response
        return {
          success: true,
          message:
            "Bedankt voor je interesse! We nemen binnen 24 uur contact met je op voor je quickscan.",
          id: record.id,
        };
      } catch (error) {
        console.error("Quickscan form submission error:", error);

        // Return error response
        throw new Error(
          "Er is een fout opgetreden bij het verzenden van je quickscan aanvraag. Probeer het opnieuw of neem direct contact met ons op."
        );
      }
    },
  }),
};
