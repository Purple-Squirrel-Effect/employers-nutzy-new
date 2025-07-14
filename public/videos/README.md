# Video Assets for Nutzy Platform

## Overview
This directory contains video assets used in the ScatteredCardGallery component's iPhone mockup.

## Required Video Files

### nutzy-product-demo.mp4
- **Purpose**: Primary video format for the product demonstration
- **Recommended specs**:
  - Duration: 15-30 seconds
  - Resolution: 1080x1920 (portrait orientation for mobile)
  - Format: MP4 with H.264 codec
  - File size: Under 5MB for optimal loading
  - Bitrate: 2-4 Mbps

### nutzy-product-demo.webm
- **Purpose**: Alternative video format for better compression and browser support
- **Recommended specs**:
  - Duration: 15-30 seconds
  - Resolution: 1080x1920 (portrait orientation for mobile)
  - Format: WebM with VP9 codec
  - File size: Under 3MB for optimal loading
  - Bitrate: 1.5-3 Mbps

## Content Guidelines

The product demo video should showcase:
1. **Nutzy Platform Interface**: Clean, modern UI design
2. **Gen-Z Focused Features**: Visual job listings, creator partnerships
3. **Key Value Propositions**: 
   - Easy job discovery for Gen-Z talent
   - Visual-first recruitment approach
   - Creator network integration
4. **Mobile-First Design**: Optimized for mobile viewing experience

## Technical Implementation

### Accessibility Features
- Video includes `preload="metadata"` for faster loading
- Respects `prefers-reduced-motion` user preferences
- Includes fallback content for unsupported browsers
- Keyboard navigation support for video controls
- ARIA labels for screen readers

### Performance Optimizations
- Multiple format support (MP4 + WebM)
- Intersection Observer for smart autoplay
- Graceful error handling for failed video loads
- Optimized poster image (SVG format)

### Browser Support
- Modern browsers: Full video support with autoplay
- Older browsers: Fallback to poster image with play button
- Reduced motion: Manual controls always visible

## Fallback Content
If video files are not available, the component displays:
- Branded poster image with Nutzy branding
- Play button overlay
- "Product Demo" text
- Brand colors (#412683 primary)

## File Structure
```
public/videos/
├── nutzy-product-demo.mp4    # Primary video format
├── nutzy-product-demo.webm   # Alternative format
└── README.md                 # This documentation
```

## Integration
The video is integrated into the ScatteredCardGallery component within an iPhone mockup frame, positioned in the right half of the hero section during the scroll-triggered animation sequence.
