# I. Blockera Canvas Editor Core

The Blockera Canvas Editor is an extension for the WordPress editor, providing enhanced capabilities for styling and managing blocks. Its core functionality revolves around dynamically injecting React components into the WordPress DOM and managing block-related data.

### Key Components:

*   **`bootstrap.js`**: The primary entry point. It conditionally renders the `CanvasEditor` based on user permissions and post types. It also initializes the global styles system by calling `registration(globalStylesPanel)`.
*   **`index.js`**: Serves as the main export file for the `CanvasEditor` component and bootstrapping functions.
*   **`helpers.js`**: Provides utility functions like `getTargets`, which determines appropriate DOM selectors based on the WordPress version, ensuring compatibility across different WP releases.
*   **`intersection-observer-renderer.js`**: A powerful utility class that leverages `MutationObserver` to detect changes in the DOM. It dynamically renders and unmounts React components into specified DOM elements, enabling seamless integration of Blockera's custom UI within the WordPress editor without directly modifying core files.
