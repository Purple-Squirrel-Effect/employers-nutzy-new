# TinyMCE Component Guide

## Overview

The `TinyMCE.astro` component provides a fully-featured rich text editor for your Astro project. It uses the npm package (TinyMCE 7.9.1) with GPL licensing, includes TypeScript support, follows your project's design system, and includes comprehensive customization options.

## Installation & Setup

The component uses TinyMCE from npm (already installed in your project). The setup automatically copies TinyMCE files from `node_modules` to `public/tinymce` during development and build processes.

### Automatic Setup

- TinyMCE files are automatically copied to `public/tinymce/` when you run `npm run dev` or `npm run build`
- Uses GPL license for self-hosted TinyMCE
- No external CDN dependencies

## Component Location

```
src/components/TinyMCE.astro
src/types/tinymce.ts
src/pages/tinymce-demo.astro (demo page)
```

## Features

- ✅ **Full TinyMCE Integration** - Latest TinyMCE 7.9.1 with all core plugins
- ✅ **TypeScript Support** - Complete type definitions and interfaces
- ✅ **Astro Optimized** - Works seamlessly with Astro's component lifecycle
- ✅ **Design System Integration** - Uses your project's Tailwind CSS classes and primary colors
- ✅ **Accessibility** - Built-in accessibility features and ARIA support
- ✅ **Responsive Design** - Mobile-friendly and responsive
- ✅ **Custom Event Handlers** - Support for onChange, onInit, and setup callbacks
- ✅ **File Upload Support** - Built-in image and media upload handling
- ✅ **Preset Configurations** - Pre-defined editor configurations for different use cases
- ✅ **Dark Mode Support** - Automatic dark mode styling

## Basic Usage

### Simple Editor

```astro
---
import TinyMCE from "../components/TinyMCE.astro";
---

<TinyMCE
  id="my-editor"
  name="content"
  value="<p>Initial content here</p>"
  height={400}
  placeholder="Start typing..."
/>
```

### Minimal Editor

```astro
<TinyMCE
  toolbar="bold italic underline | bullist numlist | link"
  plugins="link lists"
  menubar={false}
  statusbar={false}
  height={200}
/>
```

### Advanced Editor with Custom Handlers

```astro
<TinyMCE
  id="advanced-editor"
  onChange="handleContentChange"
  onInit="handleEditorInit"
  setup="handleEditorSetup"
  height={500}
/>

<script>
  window.handleContentChange = function(content, editor) {
    console.log('Content changed:', content);
  };

  window.handleEditorInit = function(editor) {
    console.log('Editor initialized:', editor);
  };

  window.handleEditorSetup = function(editor) {
    // Add custom buttons, configure editor, etc.
    editor.ui.registry.addButton('customButton', {
      text: 'Custom',
      onAction: () => editor.insertContent('<p>Custom content!</p>')
    });
  };
</script>
```

## Props Reference

| Prop            | Type              | Default             | Description                        |
| --------------- | ----------------- | ------------------- | ---------------------------------- |
| `id`            | `string`          | auto-generated      | Unique identifier for the editor   |
| `name`          | `string`          | `"content"`         | Name attribute for form submission |
| `value`         | `string`          | `""`                | Initial content                    |
| `placeholder`   | `string`          | `"Start typing..."` | Placeholder text                   |
| `height`        | `number`          | `400`               | Editor height in pixels            |
| `className`     | `string`          | `""`                | Additional CSS classes             |
| `disabled`      | `boolean`         | `false`             | Whether editor is disabled         |
| `readonly`      | `boolean`         | `false`             | Whether editor is readonly         |
| `required`      | `boolean`         | `false`             | Whether field is required          |
| `toolbar`       | `string`          | full toolbar        | Toolbar configuration              |
| `plugins`       | `string`          | all plugins         | Plugins to load                    |
| `menubar`       | `boolean\|string` | `true`              | Menubar configuration              |
| `statusbar`     | `boolean`         | `true`              | Show status bar                    |
| `branding`      | `boolean`         | `false`             | Show TinyMCE branding              |
| `resize`        | `boolean\|string` | `true`              | Resize configuration               |
| `elementpath`   | `boolean`         | `true`              | Show element path                  |
| `content_style` | `string`          | default styles      | Custom content CSS                 |
| `setup`         | `string`          | -                   | Setup function name                |
| `onChange`      | `string`          | -                   | Change handler function name       |
| `onInit`        | `string`          | -                   | Init handler function name         |

## Using TypeScript Types

```typescript
import type { TinyMCEProps, TinyMCEEditor } from "../types/tinymce";
import { getEditorPreset, TOOLBAR_PRESETS } from "../types/tinymce";

// Use preset configurations
const blogEditorConfig = getEditorPreset("standard");

// Custom handler with proper typing
window.myChangeHandler = function (content: string, editor: TinyMCEEditor) {
  // TypeScript will provide autocomplete and type checking
  editor.focus();
  console.log("Word count:", editor.plugins.wordcount?.getCount());
};
```

## Preset Configurations

The component includes several preset configurations:

```astro
<!-- Minimal: Basic formatting only -->
<TinyMCE {...getEditorPreset('minimal')} />

<!-- Basic: Common features -->
<TinyMCE {...getEditorPreset('basic')} />

<!-- Standard: Most features -->
<TinyMCE {...getEditorPreset('standard')} />

<!-- Advanced: Professional features -->
<TinyMCE {...getEditorPreset('advanced')} />

<!-- Full: All features -->
<TinyMCE {...getEditorPreset('full')} />
```

## Form Integration

```astro
<form method="POST" action="/api/save-content">
  <div class="space-y-4">
    <label for="article-content" class="block text-sm font-medium text-gray-700">
      Article Content
    </label>
    <TinyMCE
      id="article-content"
      name="content"
      required={true}
      height={500}
    />
    <button type="submit" class="bg-primary-600 text-white px-4 py-2 rounded-lg">
      Save Article
    </button>
  </div>
</form>
```

## Custom Styling

The component uses your project's Tailwind CSS classes and can be customized:

```astro
<TinyMCE
  className="my-custom-editor"
  content_style="
    body {
      font-family: 'Your Custom Font', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1f2937;
    }
    h1, h2, h3 { color: #412683; }
  "
/>
```

## Demo Page

Visit `/tinymce-demo` to see the component in action with various configurations and examples.

## File Upload Configuration

The component includes basic file upload handling. For production use, you may want to customize the upload handlers:

```javascript
window.customImageUpload = function (blobInfo, success, failure) {
  // Upload to your server
  const formData = new FormData();
  formData.append("file", blobInfo.blob(), blobInfo.filename());

  fetch("/api/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => success(result.url))
    .catch((error) => failure("Upload failed"));
};
```

## Accessibility

The component includes built-in accessibility features:

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast mode support
- Focus management

## Browser Support

- Chrome 80+
- Firefox 78+
- Safari 13+
- Edge 80+

## Troubleshooting

### Editor Not Loading

- Ensure TinyMCE is installed: `npm list tinymce`
- Check browser console for JavaScript errors
- Verify the component is imported correctly

### Styling Issues

- Check that Tailwind CSS is properly configured
- Ensure global styles are not conflicting
- Use browser dev tools to inspect CSS

### Performance

- Consider using fewer plugins for better performance
- Use lazy loading for large content
- Optimize images before uploading

## Contributing

When modifying the component:

1. Update TypeScript types in `src/types/tinymce.ts`
2. Test with the demo page at `/tinymce-demo`
3. Ensure accessibility standards are maintained
4. Update this documentation
