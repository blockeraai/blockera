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
		};
	}

	if (max && !rawMin) {
		return {
			width: max,
			minWidth: '',
			maxWidth: max,
		};
	}

	if (min && !rawMax) {
		return {
			width: min,
			minWidth: min,
			maxWidth: max || min,
		};
	}

	const width = min || max;

	return {
		width,
		minWidth: min || '',
		maxWidth: max || width,
	};
};

const PREVIEW_WIDTH_VAR = '--blockera-breakpoint-preview-width';
const PREVIEW_MIN_WIDTH_VAR = '--blockera-breakpoint-preview-min-width';
const PREVIEW_MAX_WIDTH_VAR = '--blockera-breakpoint-preview-max-width';

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
		iframe.style.removeProperty(PREVIEW_WIDTH_VAR);
		iframe.style.removeProperty(PREVIEW_MIN_WIDTH_VAR);
		iframe.style.removeProperty(PREVIEW_MAX_WIDTH_VAR);
		iframe.style.width = '100%';
		iframe.style.minWidth = '';
		iframe.style.maxWidth = '';
		return;
	}

	iframe.style.setProperty(PREVIEW_WIDTH_VAR, previewSize.width);
	iframe.style.setProperty(
		PREVIEW_MIN_WIDTH_VAR,
		previewSize.minWidth || 'auto'
	);
	iframe.style.setProperty(
		PREVIEW_MAX_WIDTH_VAR,
		previewSize.maxWidth || 'none'
	);
	iframe.style.removeProperty('width');
	iframe.style.removeProperty('min-width');
	iframe.style.removeProperty('max-width');
};
