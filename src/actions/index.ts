import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pb = new PocketBase('https://employers-backend.nutzy.nl');

// Contact form schema validation
const contactFormSchema = z.object({
  name: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten').max(100, 'Naam mag maximaal 100 karakters bevatten'),
  email: z.string().email('Voer een geldig e-mailadres in'),
  business: z.string().max(100, 'Bedrijfsnaam mag maximaal 100 karakters bevatten').optional(),
  subject: z.string().min(1, 'Selecteer een onderwerp'),
  message: z.string().min(10, 'Bericht moet minimaal 10 karakters bevatten').max(1000, 'Bericht mag maximaal 1000 karakters bevatten'),
});

export const server = {
  // Contact form submission action
  submitContactForm: defineAction({
    accept: 'form',
    input: contactFormSchema,
    handler: async (input) => {
      try {
        // Authenticate with PocketBase using admin credentials
        await pb.admins.authWithPassword('rowan@nutzy.nl', 'wGskmmfvy7kkGvS');

        // Prepare data for PocketBase
        const data = {
          name: input.name,
          email: input.email,
          business: input.business || '',
          subject: input.subject,
          message: input.message,
        };

        // Create the form submission record
        const record = await pb.collection('form_submissions').create(data);

        // Return success response
        return {
          success: true,
          message: 'Bedankt voor je bericht! We nemen binnen 24 uur contact met je op.',
          id: record.id,
        };
      } catch (error) {
        console.error('Contact form submission error:', error);
        
        // Return error response
        throw new Error('Er is een fout opgetreden bij het verzenden van je bericht. Probeer het opnieuw of neem direct contact met ons op.');
      }
    },
  }),
};
