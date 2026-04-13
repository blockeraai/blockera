/**
 * Shared hooks and utilities for entity/document handling.
 *
 * This module provides a unified API for accessing WordPress entity data
 * including posts, pages, templates, and their associated URLs.
 *
 * @package
 */

// ============================================================================
// Constants
// ============================================================================
export {
	SITE_EDITOR_POST_TYPES,
	HIDE_ADMIN_BAR_ARG,
	TEMPLATE_POST_TYPE,
} from './constants';
export type {
	SiteEditorPostType,
	ParsedTemplateSlug,
	TemplateSlugType,
} from './constants';

// ============================================================================
// Pure utility functions (not hooks)
// ============================================================================
export {
	isSiteEditorPostType,
	getAdminBaseUrl,
	getEditorUrl,
	isValidUrl,
	appendQueryParams,
	parseTemplateSlug,
} from './urlUtils';

// ============================================================================
// Entity hooks (TypeScript - primary API)
// ============================================================================
export { useEntity } from './useEntity';
export type { UseEntityReturn } from './useEntity';

export { useCurrentEntity } from './useCurrentEntity';

export { usePrefetchEntity } from './usePrefetchEntity';
export type { PrefetchEntityFunction } from './usePrefetchEntity';

// ============================================================================
// Legacy hooks (JavaScript/Flow files - maintained for compatibility)
// ============================================================================
export { useAttributes } from './use-attributes';
export { useTraceUpdate } from './use-trace-update';
export { useBlocksStore } from './use-blocks-store';
export { useEditorStore } from './use-editor-store';
export { useStoreSelectors } from './use-store-selectors';
export { useExtensionsStore } from './use-extensions-store';
export { useBlockExtensions } from './use-block-extensions';
export { useInnerBlocksInfo } from './use-inner-blocks-info';
export { useStoreDispatchers } from './use-store-dispatchers';
export { useAdvancedLabelProps } from './use-advanced-label-props';
export {
	useBlockSideEffects,
	useBlockSideEffectsRestore,
} from './use-block-side-effects';
export { useDisplayBlockControls } from './use-display-block-controls';
export { useCalculateCurrentAttributes } from './use-calculate-current-attributes';
export { useBlockPreviewStyles } from './use-block-preview-styles';
export { useBlockStyleVariations } from './use-block-style-variations';
