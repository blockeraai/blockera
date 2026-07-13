// @flow

/**
 * Internal dependencies
 */
import { resolveStoredScalarForCssDeclaration } from './value-addon-shape';

function textShadowLayerToCss(item: Object): string {
	const x = resolveStoredScalarForCssDeclaration(item.x) || '0px';
	const y = resolveStoredScalarForCssDeclaration(item.y) || '0px';
	const blur = resolveStoredScalarForCssDeclaration(item.blur) || '0px';
	const color =
		resolveStoredScalarForCssDeclaration(item.color) || 'transparent';

	return `${x} ${y} ${blur} ${color}`.trim();
}

/**
 * Serialize theme.json text-shadow preset repeater rows to a CSS `text-shadow` value.
 */
export function textShadowPresetItemsToCss(items: mixed): string {
	if (!Array.isArray(items)) {
		return '';
	}

	const visible = items.filter(
		(item) => item && typeof item === 'object' && item.isVisible !== false
	);

	if (!visible.length) {
		return '';
	}

	return visible
		.map((item) => textShadowLayerToCss((item: Object)))
		.filter(Boolean)
		.join(', ');
}
