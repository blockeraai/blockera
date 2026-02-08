# III. Block Global Styles Panel Screen (`packages/editor/js/canvas-editor/components/block-global-styles-panel-screen/`)

This module provides the user interface and logic for customizing global styles and block variations within a dedicated panel screen.

### Key Components:

*   **`app.js`**: The root component of the Global Styles Panel Screen. It ensures error handling via `ErrorBoundary` and sets up the `GlobalStylesPanelContext.Provider`.
*   **`back-button.js`**: A UI component that provides navigation within the global styles panel, handling the visual state and navigation back to previous screens.
*   **`block-preview-panel.js`**: Renders a dynamic preview of the currently selected block or block variation, reflecting the applied global styles and attributes.
*   **`blockera-global-styles-navigation.js`**: Implements the custom navigation menu within the global styles panel. This menu organizes settings into categories such as:
    *   **Design System**: Typography, Colors, Background, Shadows.
    *   **General**: Layout.
    *   **Global Styles**: Block Style Variations.
    *   **Other**: Custom CSS, HTML & JS Codes (coming soon), Back To Top Button (coming soon).
*   **`context.js`**: Establishes the `GlobalStylesPanelContext` for the panel. This context makes essential data and functions available to descendant components, including:
    *   Current block style variation.
    *   Functions for setting and retrieving styles and style variations.
    *   Memoized properties and components (`FeatureWrapper`, `AdvancedLabelControl`).
    *   Helper functions for managing block attributes and cleaning styles.
*   **`global-styles-provider.js`**: Offers the `useGlobalStylesContext` hook. This hook is fundamental for interacting with WordPress's core global styles data (theme.json). It fetches and merges base, user, and merged configurations of global styles and settings, and provides a method (`setUserConfig`) to update them.
*   **`hooks.js`**: Contains specialized React hooks:
    *   `useBackButton`: Manages the dynamic behavior and appearance of the "Back" button.
    *   `useGlobalSetting`: A hook for reading and updating global settings, optionally scoped to a specific block.
    *   `useGlobalStyle`: A hook for reading and updating global styles, handling the translation between raw style values and WordPress's preset/custom CSS variable formats.
*   **`index.js`**: The main component for displaying the Block Global Styles Panel Screen. It uses `createPortal` to render its content into the designated DOM element, ensuring it appears in the correct location within the WordPress editor interface. It also manages the selected block's state and applies necessary CSS classes.
*   **`panel.js`**: Structures the main layout of the global styles panel, utilizing Blockera's generic `BlockApp` and `BlockBase` components to provide a consistent interface for block settings.
*   **`subscribe-unsubscribe.js`**: Monitors changes in the currently selected block within the core block editor. When a new block is selected, it dispatches actions to update Blockera's internal store with the relevant block information.
*   **`utils.js`**: A collection of utility functions supporting the panel's functionality, including:
    *   CSS variable resolution (`getPresetVariableFromValue`, `getValueFromVariable`).
    *   CSS selector manipulation (`scopeSelector`, `getBlockStyleVariationSelector`).
    *   Object manipulation (`cleanEmptyObject`, `setImmutably`, `getValueFromObjectPath`).
    *   Comparison and filtering (`areGlobalStyleConfigsEqual`, `uniqByProperty`).
*   **`navigation/` (Sub-directory)**: Contains distinct navigation components that populate the `BlockeraGlobalStylesNavigation` menu, categorizing various global style and design system settings. This includes `design-system-navigation.js`, `general-navigation.js`, `global-styles-navigation.js`, and `other-navigation.js`.
