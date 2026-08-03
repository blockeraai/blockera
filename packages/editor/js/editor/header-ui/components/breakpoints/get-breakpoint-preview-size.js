// @flow

/**
 * Blockera dependencies
 */
import type { BreakpointTypes } from '@blockera/editor/js/extensions/libs/block-card/block-states/types';

/**
 * Internal dependencies
 */
import { resolveMediaSettings } from '../../../../style-engine/resolve-media-settings';

export type BreakpointPreviewSize = {
	width: string,
	minWidth: string,
	maxWidth: string,
	isMinWidthPreview: boolean,
};

/**
 * Derive iframe preview dimensions that match the style-engine media queries.
 *
 * Max-width breakpoints preview at their upper bound; min-width breakpoints
 * preview at their lower bound so `@media (min-width: …)` rules apply inside
 * the iframe viewport.
 *
 * @param {string} breakpointId Active breakpoint identifier.
 * @param {Object} breakpoints Configured breakpoints map.
 * @return {?BreakpointPreviewSize} Preview size or null for the base breakpoint.
 */
export const getBreakpointPreviewSize = (
	breakpointId: string,
	breakpoints: { [key: string]: BreakpointTypes }
): ?BreakpointPreviewSize => {
	const breakpoint = breakpoints[breakpointId];

	if (!breakpoint || breakpoint.base) {
		return null;
	}

	const mediaSettings = resolveMediaSettings(breakpoints);
	const { min = '', max = '' } = mediaSettings[breakpointId] || {};
	const rawMin = breakpoint.settings?.min || '';
	const rawMax = breakpoint.settings?.max || '';

	if (rawMin && rawMax) {
		return {
			width: max,
			minWidth: '',
			maxWidth: max,
			isMinWidthPreview: false,
		};
	}

	if (max && !rawMin) {
		return {
			width: max,
			minWidth: '',
			maxWidth: max,
			isMinWidthPreview: false,
		};
	}

	if (min && !rawMax) {
		return {
			width: min,
			minWidth: min,
			maxWidth: max || min,
			isMinWidthPreview: true,
		};
	}

	const width = min || max;

	return {
		width,
		minWidth: min || '',
		maxWidth: max || width,
		isMinWidthPreview: Boolean(min && !max),
	};
};

/**
 * Apply or clear breakpoint preview sizing on the canvas iframe element.
 *
 * @param {?HTMLElement} iframe Canvas iframe element.
 * @param {string} breakpointId Active breakpoint identifier.
 * @param {Object} breakpoints Configured breakpoints map.
 * @return {void}
 */
export const applyBreakpointPreviewSize = (
	iframe: ?HTMLElement,
	breakpointId: string,
	breakpoints: { [key: string]: BreakpointTypes }
): void => {
	if (!iframe?.style) {
		return;
	}

	const previewSize = getBreakpointPreviewSize(breakpointId, breakpoints);

	if (!previewSize) {
		iframe.style.width = '100%';
		iframe.style.minWidth = '';
		iframe.style.maxWidth = '';
		iframe.style.boxSizing = '';
		return;
	}

	iframe.style.width = previewSize.width;
	iframe.style.minWidth = previewSize.minWidth || '';
	iframe.style.maxWidth = previewSize.maxWidth || '';

	// Gutenberg sets border-box on the canvas iframe. Min-width media queries
	// need the viewport to match the declared min bound, so only those previews
	// opt into content-box. Max-width previews keep border-box to preserve
	// existing editor and visual snapshot layouts.
	iframe.style.boxSizing = previewSize.isMinWidthPreview ? 'content-box' : '';
};
