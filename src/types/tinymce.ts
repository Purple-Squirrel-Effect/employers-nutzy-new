/**
 * TinyMCE Component Types
 * 
 * This file provides TypeScript interfaces and types for the TinyMCE component
 * to ensure type safety and better developer experience.
 */

export interface TinyMCEProps {
  /** Unique identifier for the editor instance */
  id?: string;
  
  /** Name attribute for the textarea (used in forms) */
  name?: string;
  
  /** Initial content value */
  value?: string;
  
  /** Placeholder text when editor is empty */
  placeholder?: string;
  
  /** Height of the editor in pixels */
  height?: number;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Whether the editor is disabled */
  disabled?: boolean;
  
  /** Whether the editor is readonly */
  readonly?: boolean;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Toolbar configuration string */
  toolbar?: string;
  
  /** Plugins configuration string */
  plugins?: string;
  
  /** Menubar configuration (boolean or string) */
  menubar?: boolean | string;
  
  /** Whether to show the status bar */
  statusbar?: boolean;
  
  /** Whether to show TinyMCE branding */
  branding?: boolean;
  
  /** Resize configuration */
  resize?: boolean | 'both' | 'vertical';
  
  /** Whether to show element path in status bar */
  elementpath?: boolean;
  
  /** Custom CSS styles for editor content */
  content_style?: string;
  
  /** Function name for custom setup callback */
  setup?: string;
  
  /** Function name for content change callback */
  onChange?: string;
  
  /** Function name for editor initialization callback */
  onInit?: string;
}

/**
 * TinyMCE Editor Instance Interface
 * Represents the TinyMCE editor object passed to callbacks
 */
export interface TinyMCEEditor {
  /** Get the current content */
  getContent(): string;
  
  /** Set the content */
  setContent(content: string): void;
  
  /** Insert content at cursor position */
  insertContent(content: string): void;
  
  /** Focus the editor */
  focus(): void;
  
  /** Check if editor has focus */
  hasFocus(): boolean;
  
  /** Get the editor container element */
  getContainer(): HTMLElement;
  
  /** Get the editor body element */
  getBody(): HTMLElement;
  
  /** Add event listener */
  on(event: string, callback: Function): void;
  
  /** Remove event listener */
  off(event: string, callback?: Function): void;
  
  /** Trigger an event */
  fire(event: string, data?: any): void;
  
  /** Execute a command */
  execCommand(command: string, ui?: boolean, value?: any): boolean;
  
  /** Query command state */
  queryCommandState(command: string): boolean;
  
  /** Query command value */
  queryCommandValue(command: string): string;
  
  /** Destroy the editor */
  destroy(): void;
  
  /** Check if editor is destroyed */
  destroyed: boolean;
  
  /** Editor ID */
  id: string;
  
  /** UI registry for custom components */
  ui: {
    registry: {
      addButton(name: string, config: any): void;
      addMenuItem(name: string, config: any): void;
      addToggleButton(name: string, config: any): void;
    };
  };
}

/**
 * Common TinyMCE Toolbar Configurations
 */
export const TOOLBAR_PRESETS = {
  minimal: "bold italic underline | bullist numlist | link",
  basic: "undo redo | bold italic underline | bullist numlist | link image",
  standard: "undo redo | blocks | bold italic underline strikethrough | link image | bullist numlist | align | removeformat",
  advanced: "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | bullist numlist | align lineheight | indent outdent | removeformat | code fullscreen",
  full: "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | code fullscreen help"
} as const;

/**
 * Common TinyMCE Plugin Configurations
 */
export const PLUGIN_PRESETS = {
  minimal: "link lists",
  basic: "link image lists",
  standard: "link image lists table code",
  advanced: "preview searchreplace autolink autosave directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help",
  full: "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons"
} as const;

/**
 * TinyMCE Configuration Presets
 */
export const EDITOR_PRESETS = {
  minimal: {
    toolbar: TOOLBAR_PRESETS.minimal,
    plugins: PLUGIN_PRESETS.minimal,
    menubar: false,
    statusbar: false,
    height: 200
  },
  basic: {
    toolbar: TOOLBAR_PRESETS.basic,
    plugins: PLUGIN_PRESETS.basic,
    menubar: false,
    statusbar: true,
    height: 300
  },
  standard: {
    toolbar: TOOLBAR_PRESETS.standard,
    plugins: PLUGIN_PRESETS.standard,
    menubar: "edit view insert format tools",
    statusbar: true,
    height: 400
  },
  advanced: {
    toolbar: TOOLBAR_PRESETS.advanced,
    plugins: PLUGIN_PRESETS.advanced,
    menubar: "file edit view insert format tools table help",
    statusbar: true,
    height: 500
  },
  full: {
    toolbar: TOOLBAR_PRESETS.full,
    plugins: PLUGIN_PRESETS.full,
    menubar: "file edit view insert format tools table help",
    statusbar: true,
    height: 600
  }
} as const;

/**
 * Type for editor preset names
 */
export type EditorPreset = keyof typeof EDITOR_PRESETS;

/**
 * Helper function to get preset configuration
 */
export function getEditorPreset(preset: EditorPreset) {
  return EDITOR_PRESETS[preset];
}

/**
 * TinyMCE Event Types
 */
export type TinyMCEEvent = 
  | 'init'
  | 'change'
  | 'input'
  | 'keydown'
  | 'keyup'
  | 'focus'
  | 'blur'
  | 'click'
  | 'dblclick'
  | 'mousedown'
  | 'mouseup'
  | 'paste'
  | 'cut'
  | 'copy'
  | 'selectionchange'
  | 'nodechange'
  | 'undo'
  | 'redo'
  | 'dirty'
  | 'remove'
  | 'hide'
  | 'show'
  | 'load'
  | 'save'
  | 'beforegetcontent'
  | 'getcontent'
  | 'beforesetcontent'
  | 'setcontent'
  | 'beforeexeccommand'
  | 'execcommand';

/**
 * Content validation utilities
 */
export const ContentValidation = {
  /** Check if content is empty (only whitespace/empty tags) */
  isEmpty(content: string): boolean {
    const cleanContent = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .trim();
    return cleanContent.length === 0;
  },
  
  /** Get word count from HTML content */
  getWordCount(content: string): number {
    const cleanContent = content
      .replace(/<[^>]*>/g, ' ') // Replace HTML tags with spaces
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return cleanContent.length === 0 ? 0 : cleanContent.split(' ').length;
  },
  
  /** Get character count from HTML content */
  getCharCount(content: string): number {
    const cleanContent = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' '); // Replace non-breaking spaces
    
    return cleanContent.length;
  }
};
