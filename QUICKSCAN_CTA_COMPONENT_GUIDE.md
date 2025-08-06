# Quickscan CTA Section Component Guide

## Overview

The `QuickscanCTASection.astro` component is a call-to-action section designed to encourage users to take Nutzy's quickscan assessment. It follows the established design system with the primary brand color (#412683) and maintains the playful yet professional aesthetic of the Nutzy platform.

## Component Location

```
src/components/home/QuickscanCTASection.astro
```

## Features

### 1. **Design System Compliance**

- Uses the primary brand color (`bg-primary-500`) as the main background
- Follows the established typography hierarchy with Anton font for headings
- Maintains responsive design across all screen sizes
- Uses consistent spacing patterns (`py-16 md:py-24 lg:py-32`)

### 2. **Content Structure**

- **Compelling Headline**: "Is jouw bedrijf al klaar voor het werven van Gen Z?"
- **Value Proposition**: References PwC research for credibility
- **Benefits List**: Three key benefits with visual bullet points
- **Call-to-Action Form**: Streamlined 3-field form for lead capture

### 3. **Form Functionality**

- **Real-time Validation**: Immediate feedback on form fields
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Visual feedback during form submission
- **Success/Error Handling**: User-friendly messages with animations
- **Privacy Compliance**: Link to privacy policy

### 4. **Technical Implementation**

- **TypeScript Support**: Proper type definitions and interfaces
- **Responsive Layout**: CSS Grid with mobile-first approach
- **Form Validation**: Client-side validation with server-side backup
- **Backend Integration**: Connects to PocketBase via Astro actions

## Usage

### Basic Implementation

```astro
---
import QuickscanCTASection from "../components/home/QuickscanCTASection.astro";
---

<QuickscanCTASection />
```

### With Custom Props

```astro
<QuickscanCTASection 
  id="custom-quickscan-section"
  className="my-custom-spacing"
/>
```

## Props Interface

```typescript
export interface Props {
  id?: string;        // Custom section ID (default: "quickscan-cta")
  className?: string; // Additional CSS classes
}
```

## Form Fields

1. **Company Name** (Required)
   - Minimum 2 characters
   - Maximum 100 characters
   - Real-time validation

2. **Email Address** (Required)
   - Email format validation
   - Required field validation

3. **Phone Number** (Optional)
   - Maximum 20 characters
   - International format support

## Backend Integration

The component integrates with the existing PocketBase backend through Astro actions:

- **Action**: `submitQuickscanForm`
- **Collection**: `form_submissions`
- **Type**: `quickscan` (to distinguish from other submissions)

### Data Structure

```typescript
{
  company: string;
  email: string;
  phone?: string;
  type: "quickscan";
}
```

## Styling Features

### Color Palette
- **Background**: `bg-primary-500` (Purple #a855f7)
- **Text**: White with opacity variations
- **Accent**: `text-secondary-200` (Teal accent)
- **Form**: White background with transparency

### Typography
- **Heading**: Anton font, responsive sizing (4xl to 6xl)
- **Body Text**: Nunito font, responsive sizing
- **Form Labels**: Lexend font, semibold weight

### Responsive Behavior
- **Mobile**: Single column, centered content
- **Desktop**: Two-column grid (content + form)
- **Form**: Maintains consistent width across breakpoints

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and form structure
- **ARIA Labels**: Screen reader friendly form labels
- **Focus Management**: Visible focus indicators and logical tab order
- **Error Handling**: Accessible error messages with proper associations
- **Keyboard Navigation**: Full keyboard accessibility

## Animation & Interactions

- **Smooth Transitions**: 300ms cubic-bezier transitions
- **Form Validation**: Real-time feedback with visual indicators
- **Loading States**: Button state changes during submission
- **Success Animation**: Slide-in animation for success messages
- **Hover Effects**: Brightness increase on button hover

## Demo Page

A demo page is available at `/quickscan-demo` to showcase the component in isolation and test its functionality.

## Integration Examples

### Homepage Integration

```astro
---
import QuickscanCTASection from "../components/home/QuickscanCTASection.astro";
---

<App>
  <HeroSection />
  <JobPlatformSection />
  <QuickscanCTASection />
  <ContentCampainSection />
  <Footer />
</App>
```

### Landing Page Integration

```astro
---
import QuickscanCTASection from "../components/home/QuickscanCTASection.astro";
---

<main>
  <section class="hero-content">
    <!-- Hero content -->
  </section>
  
  <QuickscanCTASection id="quickscan-cta" />
  
  <section class="additional-content">
    <!-- Additional content -->
  </section>
</main>
```

## Performance Considerations

- **Lazy Loading**: Background image uses `loading="lazy"`
- **Optimized Assets**: SVG background for scalability
- **Minimal JavaScript**: Only essential form handling code
- **CSS Optimization**: Scoped styles with minimal global impact

## Browser Support

- **Modern Browsers**: Full support for Chrome, Firefox, Safari, Edge
- **CSS Grid**: Fallback for older browsers
- **JavaScript**: ES6+ features with graceful degradation

## Maintenance Notes

- **Form Endpoint**: Update `/_actions/submitQuickscanForm` if backend changes
- **Validation Rules**: Modify schema in `src/actions/index.ts`
- **Content Updates**: Edit component directly for copy changes
- **Styling**: Follow existing Tailwind CSS patterns for consistency
