# II. Global Styles Management (`packages/editor/js/canvas-editor/global-styles/`)

This module is responsible for the comprehensive management, registration, and rendering of global styles and block style variations within the Blockera ecosystem.

### Key Components:

*   **`helpers.js`**: Manages `blockeraGlobalStylesMetaData` stored in the `window` object, which holds configurations for custom global styles and block variations.
*   **`listener-callback.js`**: Defines `sharedListenerCallback`, a central function that updates the Blockera editor store with the `selectedBlockStyle` and `selectedBlockRef` whenever a block is selected in the editor.
*   **`registration.js`**: This is the heart of global styles management. It performs the following critical tasks:
    *   **Style Registration/Unregistration**: Reads `blockeraGlobalStylesMetaData` to intelligently register and unregister WordPress block styles (variations) based on their status (renamed, deleted, enabled/disabled).
    *   **Plugin Registration**: Registers a suite of WordPress plugins (e.g., `blockera-global-styles-navigation`, `blockera-global-styles-panel-activator-observer`, `blockera-global-styles-output`) using `IntersectionObserverRenderer`. These plugins inject Blockera's custom UI (like the global styles navigation, block icons, and the panel screen itself) into various parts of the WordPress editor interface.
    *   **Global Styles Rendering**: Includes `GlobalBlockStylesRenderer` and `GlobalBlockStyleVariationStylesRenderer` components. These components are responsible for rendering the actual CSS for both default block styles and their variations, injecting them into the editor's iframe via `GlobalStylesRenderer` from `../../extensions/components/global-styles-renderer`.
*   **`side-bar-listener.js`**: Facilitates the display of custom Blockera icons next to block types in the editor's sidebar, visually indicating blocks with Blockera extensions.
*   **`style-book-listener.js`**: Attaches event listeners to blocks displayed in the WordPress Style Book iframe. When a block in the style book is clicked, it triggers the `sharedListenerCallback` to update the selected block context.
