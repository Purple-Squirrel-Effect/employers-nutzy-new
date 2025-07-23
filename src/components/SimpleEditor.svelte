<script>
    let elements = [
       {
         el: "h1",
        content: "Blog title"
       },
        {
         el: "p",
        content: "Blog content"
       }
    ];

    let options = [
        {
            value: "h1",
            label: "Heading 1",
            icon: "📝",
            description: "Big section heading"
        },
        {
            value: "h2",
            label: "Heading 2",
            icon: "📝",
            description: "Medium section heading"
        },
        {
            value: "h3",
            label: "Heading 3",
            icon: "📝",
            description: "Small section heading"
        },
        {
            value: "h4",
            label: "Heading 4",
            icon: "📝",
            description: "Tiny heading"
        },
        {
            value: "h5",
            label: "Heading 5",
            icon: "📝",
            description: "Very small heading"
        },
        {
            value: "h6",
            label: "Heading 6",
            icon: "📝",
            description: "Smallest heading"
        },
        {
            value: "p",
            label: "Paragraph",
            icon: "📄",
            description: "Plain text paragraph"
        },
        {
            value: "ul",
            label: "Bulleted List",
            icon: "•",
            description: "Create a simple bulleted list"
        },
        {
            value: "ol",
            label: "Numbered List",
            icon: "1.",
            description: "Create a list with numbering"
        },
        {
            value: "blockquote",
            label: "Quote",
            icon: "❝",
            description: "Capture a quote"
        }
    ];

    // Command menu state
    let inputValue = "";
    let showCommandMenu = false;
    let selectedIndex = 0;
    let filteredOptions = [];
    let inputElement;

    // Handle input changes
    function handleInput(event) {
        inputValue = event.target.value;

        if (inputValue.startsWith('/')) {
            const query = inputValue.slice(1).toLowerCase();
            filteredOptions = options.filter(option =>
                option.label.toLowerCase().includes(query) ||
                option.value.toLowerCase().includes(query)
            );
            showCommandMenu = true;
            selectedIndex = 0;
        } else {
            showCommandMenu = false;
        }
    }

    // Handle keyboard navigation
    function handleKeydown(event) {
        if (showCommandMenu) {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    selectedIndex = (selectedIndex + 1) % filteredOptions.length;
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : filteredOptions.length - 1;
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (filteredOptions[selectedIndex]) {
                        selectOption(filteredOptions[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    showCommandMenu = false;
                    break;
            }
        } else if (event.key === 'Enter' && inputValue.trim()) {
            // Create a paragraph when Enter is pressed with regular text
            event.preventDefault();
            const newElement = {
                el: 'p',
                content: inputValue.trim()
            };
            elements = [...elements, newElement];
            inputValue = "";
        }
    }

    // Select an option from the command menu
    function selectOption(option) {
        const newElement = {
            el: option.value,
            content: getDefaultContent(option.value)
        };

        elements = [...elements, newElement];
        inputValue = "";
        showCommandMenu = false;

        // Focus back to input
        if (inputElement) {
            inputElement.focus();
        }
    }

    // Get default content for different element types
    function getDefaultContent(elementType) {
        switch (elementType) {
            case 'h1': return 'Heading 1';
            case 'h2': return 'Heading 2';
            case 'h3': return 'Heading 3';
            case 'h4': return 'Heading 4';
            case 'h5': return 'Heading 5';
            case 'h6': return 'Heading 6';
            case 'ul': return 'List item';
            case 'ol': return 'List item';
            case 'blockquote': return 'Quote text';
            default: return 'Type something...';
        }
    }
</script>

<div class="editor-container">
    <!-- Render existing elements -->
    {#each elements as el}
        <div class="element-wrapper">
            {#if el.el === 'ul'}
                <ul contenteditable="true" class="editable-element">
                    <li>{el.content}</li>
                </ul>
            {:else if el.el === 'ol'}
                <ol contenteditable="true" class="editable-element">
                    <li>{el.content}</li>
                </ol>
            {:else}
                <svelte:element this={el.el} contenteditable="true" class="editable-element">
                    {el.content}
                </svelte:element>
            {/if}
        </div>
    {/each}

    <!-- Input for new elements -->
    <div class="input-container">
        <input
            bind:this={inputElement}
            bind:value={inputValue}
            on:input={handleInput}
            on:keydown={handleKeydown}
            placeholder="Type '/' for commands or just start typing..."
            class="element-input"
        />

        <!-- Command menu -->
        {#if showCommandMenu && filteredOptions.length > 0}
            <div class="command-menu">
                {#each filteredOptions as option, index}
                    <button
                        class="command-option {index === selectedIndex ? 'selected' : ''}"
                        on:click={() => selectOption(option)}
                        type="button"
                    >
                        <span class="option-icon">{option.icon}</span>
                        <div class="option-content">
                            <div class="option-label">{option.label}</div>
                            <div class="option-description">{option.description}</div>
                        </div>
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .editor-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .element-wrapper {
        margin-bottom: 8px;
    }

    .editable-element {
        border: none;
        outline: none;
        width: 100%;
        min-height: 1.5em;
        padding: 8px 0;
        font-size: 16px;
        line-height: 1.5;
        background: transparent;
    }

    .editable-element:focus {
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: 4px;
        padding: 8px 12px;
    }

    .editable-element:empty:before {
        content: attr(placeholder);
        color: #9ca3af;
        pointer-events: none;
    }

    .input-container {
        position: relative;
        margin-top: 16px;
    }

    .element-input {
        width: 100%;
        border: none;
        outline: none;
        padding: 12px 0;
        font-size: 16px;
        line-height: 1.5;
        background: transparent;
        color: #374151;
    }

    .element-input::placeholder {
        color: #9ca3af;
    }

    .command-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-height: 300px;
        overflow-y: auto;
    }

    .command-option {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        transition: background-color 0.15s ease;
    }

    .command-option:hover,
    .command-option.selected {
        background-color: #f3f4f6;
    }

    .option-icon {
        font-size: 18px;
        margin-right: 12px;
        width: 24px;
        text-align: center;
    }

    .option-content {
        flex: 1;
    }

    .option-label {
        font-weight: 500;
        color: #111827;
        margin-bottom: 2px;
    }

    .option-description {
        font-size: 14px;
        color: #6b7280;
    }

    /* Element-specific styles */
    h1.editable-element { font-size: 2em; font-weight: bold; }
    h2.editable-element { font-size: 1.5em; font-weight: bold; }
    h3.editable-element { font-size: 1.25em; font-weight: bold; }
    h4.editable-element { font-size: 1.1em; font-weight: bold; }
    h5.editable-element { font-size: 1em; font-weight: bold; }
    h6.editable-element { font-size: 0.9em; font-weight: bold; }

    blockquote.editable-element {
        border-left: 4px solid #e5e7eb;
        padding-left: 16px;
        margin-left: 0;
        font-style: italic;
        color: #6b7280;
    }

    ul.editable-element, ol.editable-element {
        padding-left: 24px;
    }
</style>