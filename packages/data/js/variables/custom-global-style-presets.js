// @flow
/**
 * Presets from theme.json / Site Editor via block editor `__experimentalFeatures`.
 * Maps the same paths as `packages/global-styles-ui/js/*` preset screens.
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import type { VariableItem } from './types';

const getBlockEditorSettings = (): Object => {
	const { getSettings } = select('core/block-editor');

	return getSettings();
};

const presetRef = {
	type: 'preset',
};

function mapPaletteCustom(
	items: void | Array<{ slug?: string, name?: string, color?: string }>
): Array<VariableItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	return items.map((item) => ({
		name: item?.name || item.slug || '',
		id: item.slug || '',
		value: item.color || '',
		reference: presetRef,
	}));
}

function mapSpacingCustom(
	items: void | Array<{ slug?: string, name?: string, size?: string }>
): Array<VariableItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	return items.map((item) => ({
		name: item?.name || item.slug || '',
		id: item.slug || '',
		value: item.size || '',
		reference: presetRef,
	}));
}

function mapFontSizesCustom(
	items: void | Array<{
		slug?: string,
		name?: string,
		size?: string,
		fluid?: { min?: string, max?: string },
	}>
): Array<VariableItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	return items.map((item) => ({
		name: item?.name || item.slug || '',
		id: item.slug || '',
		value: item.size || '',
		...(item?.fluid ? { fluid: item.fluid } : {}),
		reference: presetRef,
	}));
}

function mapGradientsCustom(
	items: void | Array<{ slug?: string, name?: string, gradient?: string }>,
	predicate: (gradient: string) => boolean
): Array<VariableItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	return items
		.filter((item) => item.gradient && predicate(item.gradient))
		.map((item) => ({
			name: item?.name || item.slug || '',
			id: item.slug || '',
			value: item.gradient || '',
			reference: presetRef,
		}));
}

function mapBorderRadiusPresets(
	items: void | Array<{
		slug?: string,
		name?: string,
		size?: string | number,
	}>
): Array<VariableItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	return items
		.filter((p) => p && typeof p.slug === 'string' && p.slug.trim())
		.map((p) => ({
			name: String(p.name ?? p.slug).trim(),
			id: String(p.slug).trim(),
			value: String(p.size ?? '').trim(),
			reference: presetRef,
		}))
		.filter((p) => p.name && p.value !== '');
}

function mapBorderBoxPresets(
	items: void | Array<{
		slug?: string,
		name?: string,
		border?: mixed,
	}>
): Array<VariableItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	const out: Array<VariableItem> = [];

	for (const p of items) {
		if (!p || typeof p.slug !== 'string' || !p.slug.trim()) {
			continue;
		}

		const name = String(p.name ?? p.slug).trim();

		if (!name) {
			continue;
		}

		const serialized = JSON.stringify(
			p.border === undefined || p.border === null ? {} : p.border
		);

		out.push({
			name,
			id: String(p.slug).trim(),
			value: serialized === undefined ? '{}' : serialized,
			reference: presetRef,
		});
	}

	return out;
}

function mapItemsArrayPresets(
	items: void | Array<{
		slug?: string,
		name?: string,
		items?: Array<mixed>,
	}>,
	key?: string
): Array<VariableItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	const out: Array<VariableItem> = [];

	for (const p of items) {
		if (!p || typeof p.slug !== 'string' || !p.slug.trim()) {
			continue;
		}

		const name = String(p.name ?? p.slug).trim();

		if (!name) {
			continue;
		}

		out.push({
			name,
			id: String(p.slug).trim(),
			value: JSON.stringify({
				items:
					'undefined' !== typeof key
						? p?.[key] || p.items || []
						: p.items || [],
			}),
			reference: presetRef,
		});
	}

	return out;
}

function mergePresetLayers(
	mapFn: (void | Array<any>, void | string) => Array<VariableItem>,
	theme: void | Array<any>,
	defaultPresets: void | Array<any>,
	custom: void | Array<any>,
	key?: string
): Array<VariableItem> {
	const byId: { [string]: VariableItem } = {};
	for (const item of mapFn(theme, key)) {
		if (item.id) {
			byId[item.id] = item;
		}
	}
	for (const item of mapFn(defaultPresets, key)) {
		if (item.id) {
			byId[item.id] = item;
		}
	}
	for (const item of mapFn(custom, key)) {
		if (item.id) {
			byId[item.id] = item;
		}
	}
	return Object.values(byId);
}

/**
 * All origins merged (theme → default → custom) for Blockera global-style preset groups.
 * Used by variable category labels and `getVariable` resolution.
 */
export function getMergedGlobalStylePresetVariables(
	type: string
): Array<VariableItem> {
	const features = getBlockEditorSettings()?.__experimentalFeatures;

	switch (type) {
		case 'shadow': {
			const presets = features?.shadow?.presets;

			return mergePresetLayers(
				mapItemsArrayPresets,
				presets?.theme,
				presets?.default,
				presets?.custom,
				type
			);
		}

		case 'text-shadow': {
			const presets = features?.textShadow?.presets;

			return mergePresetLayers(
				mapItemsArrayPresets,
				presets?.theme,
				presets?.default,
				presets?.custom,
				'shadow'
			);
		}

		case 'border-radius': {
			const radiusSizes = features?.border?.radiusSizes;

			return mergePresetLayers(
				mapBorderRadiusPresets,
				radiusSizes?.theme,
				radiusSizes?.default,
				radiusSizes?.custom
			);
		}

		case 'border': {
			const presets = features?.border?.presets;

			return mergePresetLayers(
				mapBorderBoxPresets,
				presets?.theme,
				presets?.default,
				presets?.custom
			);
		}

		case 'transition': {
			const presets = features?.transition?.presets;

			return mergePresetLayers(
				mapItemsArrayPresets,
				presets?.theme,
				presets?.default,
				presets?.custom,
				type
			);
		}

		case 'transform': {
			const presets = features?.transform?.presets;

			return mergePresetLayers(
				mapItemsArrayPresets,
				presets?.theme,
				presets?.default,
				presets?.custom,
				type
			);
		}

		case 'filter': {
			const presets = features?.filter?.presets;

			return mergePresetLayers(
				mapItemsArrayPresets,
				presets?.theme,
				presets?.default,
				presets?.custom,
				type
			);
		}

		default:
			return [];
	}
}

/**
 * Returns preset variables from the global settings "custom" origin for a Blockera variable type.
 */
export const getCustomGlobalStylePresetVariables: (
	type: string
) => Array<VariableItem> = function (type: string): Array<VariableItem> {
	const features = getBlockEditorSettings()?.__experimentalFeatures;

	switch (type) {
		case 'color':
			return mapPaletteCustom(features?.color?.palette?.custom);

		case 'spacing':
			return mapSpacingCustom(features?.spacing?.spacingSizes?.custom);

		case 'font-size':
			return mapFontSizesCustom(features?.typography?.fontSizes?.custom);

		case 'linear-gradient':
			return mapGradientsCustom(features?.color?.gradients?.custom, (g) =>
				g.startsWith('linear-gradient')
			);

		case 'radial-gradient':
			return mapGradientsCustom(features?.color?.gradients?.custom, (g) =>
				g.startsWith('radial-gradient')
			);

		case 'shadow':
			return mapItemsArrayPresets(features?.shadow?.presets?.custom);

		case 'text-shadow':
			return mapItemsArrayPresets(
				features?.textShadow?.presets?.custom,
				'shadow'
			);

		case 'border-radius':
			return mapBorderRadiusPresets(
				features?.border?.radiusSizes?.custom
			);

		case 'border':
			return mapBorderBoxPresets(features?.border?.presets?.custom);

		case 'transition':
			return mapItemsArrayPresets(features?.transition?.presets?.custom);

		case 'transform':
			return mapItemsArrayPresets(features?.transform?.presets?.custom);

		case 'filter':
			return mapItemsArrayPresets(features?.filter?.presets?.custom);

		default:
			return [];
	}
};

/**
 * Resolve a preset by slug across theme, default, and custom origins.
 */
export function getGlobalStylePresetVariableById(
	type: string,
	id: string
): ?VariableItem {
	if (!id) {
		return null;
	}

	return (
		getMergedGlobalStylePresetVariables(type).find((v) => v.id === id) ||
		null
	);
}
