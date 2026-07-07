// @flow

/**
 * Blockera dependencies
 */
import { isString } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export const WP_GRADIENT_NONE: string = 'none';
export const WP_GRADIENT_TRANSPARENT_NONE: string = 'transparent none';

export type WpGradientSentinelKind = 'none' | 'transparent-none';

/**
 * WP stores non-gradient background shorthands in color.gradient in some cases.
 * Match after trim() only.
 */
export function normalizeWpGradientSentinel(
	value: mixed
): false | WpGradientSentinelKind {
	if (!isString(value)) {
		return false;
	}

	//$FlowFixMe — isString narrows at runtime.
	const trimmed: string = value.trim();

	if (trimmed === WP_GRADIENT_NONE) {
		return 'none';
	}

	if (trimmed === WP_GRADIENT_TRANSPARENT_NONE) {
		return 'transparent-none';
	}

	return false;
}

export function createNoneBackgroundLayer(): Object {
	return {
		type: 'none',
		isVisible: true,
		order: 0,
	};
}

export function resolveWpGradientRawString(
	attributes: Object,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style'
): ?string {
	const useStyle = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	);

	if (
		attributes?.gradient !== undefined ||
		attributes?.color?.gradient !== undefined
	) {
		if (useStyle) {
			return isString(attributes?.gradient) ? attributes.gradient : null;
		}

		return isString(attributes?.color?.gradient)
			? attributes.color.gradient
			: null;
	}

	if (useStyle && attributes?.style?.color?.gradient !== undefined) {
		return isString(attributes?.style?.color?.gradient)
			? attributes.style.color.gradient
			: null;
	}

	return null;
}

export function resolveElementWpGradientRawString(
	attributes: Object,
	dataCompatibilityElement: string,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style'
): ?string {
	const useStyle = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	);

	const gradient = useStyle
		? attributes?.style?.elements?.[dataCompatibilityElement]?.color
				?.gradient
		: attributes?.elements?.[dataCompatibilityElement]?.color?.gradient;

	return isString(gradient) ? gradient : null;
}
