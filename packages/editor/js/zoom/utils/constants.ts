/**
 * Constants for the zoom feature.
 */

/**
 * Minimum zoom percentage (10%).
 */
export const MIN_ZOOM = 10;

/**
 * Maximum zoom percentage (250%).
 */
export const MAX_ZOOM = 250;

/**
 * Default zoom percentage (100%).
 */
export const DEFAULT_ZOOM = 100;

/**
 * Zoom step size for increment/decrement operations (10%).
 */
export const ZOOM_STEP = 10;

/**
 * localStorage key for persisting zoom percentage.
 */
export const STORAGE_KEY = 'blockeraEditorZoomPercent';

/**
 * Selector for the editor canvas iframe.
 */
export const IFRAME_SELECTOR = 'iframe[name="editor-canvas"]';

/**
 * Selector for the editor visual editor container.
 */
export const VISUAL_EDITOR_SELECTOR =
	'.editor-visual-editor, .edit-post-visual-editor';

/**
 * Selector for the editor header settings container.
 */
export const HEADER_SETTINGS_SELECTOR = '.editor-header__settings';

/**
 * Debounce delay for height updates (ms).
 * Prevents rapid-fire updates that can cause feedback loops.
 */
export const HEIGHT_UPDATE_DEBOUNCE = 100;

/**
 * Minimum height change threshold (px).
 * Only update iframe height if change is greater than this value.
 * Prevents unnecessary updates from minor content shifts.
 */
export const HEIGHT_CHANGE_THRESHOLD = 10;

/**
 * Maximum reasonable iframe height (px).
 * Prevents feedback loops from unreasonably large height values.
 */
export const MAX_REASONABLE_HEIGHT = 50000;

/**
 * Minimum iframe height (px).
 * Ensures iframe is never too small to be usable.
 */
export const MIN_IFRAME_HEIGHT = 200;

/**
 * CSS custom property name for zoom scale.
 */
export const ZOOM_CSS_VAR = '--blockera-block-editor-iframe-zoom';

/**
 * CSS class added to iframe when zoomed out.
 */
export const ZOOMED_OUT_CLASS = 'is-zoomed-out';

/**
 * CSS class added to scale container when zoomed.
 */
export const SCALE_CONTAINER_ZOOMED_CLASS = 'iframe-zoomed';
