# Custom Fonts Documentation

This project includes 4 custom font families that are now available throughout the application.

## Available Fonts

### 1. Cabinet Grotesk
- **Type**: Modern Sans-Serif
- **Usage**: Perfect for headings, UI text, and clean professional interfaces
- **CSS Class**: `font-cabinet-grotesk`
- **CSS Variable**: `var(--font-family-cabinet-grotesk)`
- **Weights**: 100-900 (Variable font)

### 2. Satoshi
- **Type**: Geometric Sans-Serif
- **Usage**: Great for body text and modern branding
- **CSS Class**: `font-satoshi`
- **CSS Variable**: `var(--font-family-satoshi)`
- **Weights**: 300-900 (Variable font)
- **Styles**: Normal and Italic

### 3. Plein
- **Type**: Serif
- **Usage**: Perfect for editorial content and sophisticated branding
- **CSS Class**: `font-plein`
- **CSS Variable**: `var(--font-family-plein)`
- **Weights**: 300-900 (Variable font)
- **Styles**: Normal and Italic

### 4. Bespoke Stencil
- **Type**: Display/Stencil
- **Usage**: Ideal for headlines and impact text
- **CSS Class**: `font-bespoke-stencil`
- **CSS Variable**: `var(--font-family-bespoke-stencil)`
- **Weights**: 300-900 (Variable font)
- **Styles**: Normal and Italic

## How to Use

### In Tailwind CSS Classes
```html
<!-- Cabinet Grotesk -->
<h1 class="font-cabinet-grotesk text-4xl font-bold">Heading</h1>

<!-- Satoshi -->
<p class="font-satoshi text-base">Body text</p>

<!-- Plein -->
<h2 class="font-plein text-2xl font-medium italic">Serif heading</h2>

<!-- Bespoke Stencil -->
<h1 class="font-bespoke-stencil text-6xl font-black">IMPACT TEXT</h1>
```

### In CSS
```css
.my-element {
  font-family: var(--font-family-cabinet-grotesk);
}

/* Or use the utility variables */
.my-element {
  font-family: var(--font-cabinet-grotesk);
}
```

### In Astro Components
```astro
<style>
  .custom-heading {
    font-family: var(--font-family-satoshi);
    font-weight: 600;
  }
</style>
```

## Font Weights Available

All fonts support variable weights from their minimum to maximum:

- **Cabinet Grotesk**: 100-900
- **Satoshi**: 300-900  
- **Plein**: 300-900
- **Bespoke Stencil**: 300-900

Use standard Tailwind weight classes:
- `font-light` (300)
- `font-normal` (400)
- `font-medium` (500)
- `font-semibold` (600)
- `font-bold` (700)
- `font-extrabold` (800)
- `font-black` (900)

## Font Files Location

All font files are organized in `/public/fonts/`:
```
public/fonts/
├── cabinet-grotesk/
│   ├── CabinetGrotesk-Variable.woff2
│   └── CabinetGrotesk-Variable.woff
├── satoshi/
│   ├── Satoshi-Variable.woff2
│   ├── Satoshi-Variable.woff
│   ├── Satoshi-VariableItalic.woff2
│   └── Satoshi-VariableItalic.woff
├── plein/
│   ├── Plein-Variable.woff2
│   ├── Plein-Variable.woff
│   ├── Plein-VariableItalic.woff2
│   └── Plein-VariableItalic.woff
└── bespoke-stencil/
    ├── BespokeStencil-Variable.woff2
    ├── BespokeStencil-Variable.woff
    ├── BespokeStencil-VariableItalic.woff2
    └── BespokeStencil-VariableItalic.woff
```

## Demo Page

Visit `/fonts` to see all fonts in action with examples and usage guidelines.

## Performance Notes

- All fonts use `font-display: swap` for optimal loading performance
- Variable fonts are used to reduce file size while providing full weight ranges
- WOFF2 format is prioritized with WOFF fallback for broader browser support

## Browser Support

These fonts support all modern browsers that support variable fonts:
- Chrome 62+
- Firefox 62+
- Safari 11+
- Edge 17+
