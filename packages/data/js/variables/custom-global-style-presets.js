// @flow
/**
 * Presets from theme.json / Site Editor via block editor `__experimentalFeatures`.
 * Maps the same paths as `packages/global-styles-ui/js/*` preset screens.
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import type { ValueAddonReference } from '../types';
import type { VariableItem } from './types';
import {
	normalizeFontSizeFluid,
	normalizePresetSize,
} from './normalize-preset-sizes';
import { resolveCurrentThemeDisplayName } from './resolve-current-theme-name';

const getBlockEditorSettings = (): Object => {
	const { getSettings } = select('core/block-editor');

	return getSettings();
};

const defaultOriginPresetRef: ValueAddonReference = {
	type: 'preset',
};

const customOriginRef: ValueAddonReference = {
	type: 'custom',
};

function getGlobalStylePresetLayerRefs(): {
	defaultRef: ValueAddonReference,
	themeRef: ValueAddonReference,
	customRef: ValueAddonReference,
} {
	return {
		defaultRef: defaultOriginPresetRef,
		themeRef: {
			type: 'theme',
			theme: resolveCurrentThemeDisplayName(),
		},
		customRef: customOriginRef,
	};
}

function mapPaletteCustom(
	items: void | Array<{ slug?: string, name?: string, color?: string }>,
	reference: ValueAddonReference = customOriginRef
): Array<VariableItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	return items.map((item) => ({
		name: item?.name || item.slug || '',
		id: item.slug || '',
		value: item.color || '',
		reference,
	}));
}

function mapSpacingCustom(
	items: void | Array<{ slug?: string, name?: string, size?: string }>,
	reference: ValueAddonReference = customOriginRef
): Array<VariableItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	return items.map((item) => ({
		name: item?.name || item.slug || '',
		id: item.slug || '',
		value: normalizePresetSize(item.size || ''),
		reference,
	}));
}

function mapFontSizesCustom(
	items: void | Array<{
		slug?: string,
		name?: string,
		size?: string,
		fluid?: { min?: string, max?: string },
	}>,
	reference: ValueAddonReference = customOriginRef
): Array<VariableItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	return items.map((item) => ({
		name: item?.name || item.slug || '',
		id: item.slug || '',
		value: normalizePresetSize(item.size || ''),
		...(item?.fluid ? { fluid: normalizeFontSizeFluid(item.fluid) } : {}),
		reference,
	}));
}

function mapGradientsCustom(
	items: void | Array<{ slug?: string, name?: string, gradient?: string }>,
	predicate: (gradient: string) => boolean,
	reference: ValueAddonReference = customOriginRef
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
			reference,
		}));
}

function mapBorderRadiusPresets(
	items: void | Array<{
		slug?: string,
		name?: string,
		size?: string | number,
	}>,
	_unusedKey?: string,
	reference: ValueAddonReference = defaultOriginPresetRef
): Array<VariableItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	const mapped: Array<VariableItem> = items
		.filter((p) => p && typeof p.slug === 'string' && p.slug.trim())
		.map((p) => ({
			name: String(p.name ?? p.slug).trim(),
			id: String(p.slug).trim(),
			value: normalizePresetSize(String(p.size ?? '').trim()),
			reference,
		}));

	return mapped.filter((row) => row.name !== '' && row.value !== '');
}

function mapBorderBoxPresets(
	items: void | Array<{
		slug?: string,
		name?: string,
		border?: mixed,
	}>,
	_unusedKey?: string,
	reference: ValueAddonReference = defaultOriginPresetRef
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

		let borderVal: mixed = {};
		if (p.border !== undefined && p.border !== null) {
			if (typeof p.border === 'object' && !Array.isArray(p.border)) {
				borderVal = { ...p.border };
			} else {
				borderVal = p.border;
			}
		}

		out.push({
			name,
			id: String(p.slug).trim(),
			value: borderVal,
			reference,
		});
	}

	return out;
}

function mapItemsArrayPresets(
	items: void | Array<{
		slug?: string,
		name?: string,
		items?: Array<mixed>,
		shadow?: Array<mixed>,
	}>,
	key?: string,
	reference: ValueAddonReference = defaultOriginPresetRef
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

		const rowItems =
			'undefined' !== typeof key
				? // $FlowFixMe[incompatible-use]
					p?.[key] || p.items || []
				: p.items || [];

		// WordPress / Blockera theme.json: `shadow` is the CSS string (box-shadow or text-shadow).
		// Legacy presets used repeater `items` arrays only.
		let valuePayload: { items: mixed };
		if (typeof rowItems === 'string' && String(rowItems).trim() !== '') {
			valuePayload = { items: String(rowItems).trim() };
		} else if (Array.isArray(rowItems)) {
			valuePayload = { items: [...rowItems] };
		} else {
			valuePayload = { items: [] };
		}

		out.push({
			name,
			id: String(p.slug).trim(),
			value: valuePayload,
			reference,
		});
	}

	return out;
}

function mergePresetLayers(
	mapFn: (
		void | Array<any>,
		void | string,
		ValueAddonReference
	) => Array<VariableItem>,
	defaultPresets: void | Array<any>,
	theme: void | Array<any>,
	custom: void | Array<any>,
	key: void | string,
	refs: {
		defaultRef: ValueAddonReference,
		themeRef: ValueAddonReference,
		customRef: ValueAddonReference,
	}
): Array<VariableItem> {
	const byId: { [string]: VariableItem } = {};

	for (const item of mapFn(defaultPresets, key, refs.defaultRef)) {
		if (item.id) {
			byId[item.id] = item;
		}
	}

	for (const item of mapFn(theme, key, refs.themeRef)) {
		if (item.id) {
			byId[item.id] = item;
		}
	}

	for (const item of mapFn(custom, key, refs.customRef)) {
		if (item.id) {
			byId[item.id] = item;
		}
	}

	return Object.values(byId);
}

/**
 * All origins merged (default → theme → custom; later wins) for Blockera global-style preset groups.
 * Used by variable category labels and `getVariable` resolution.
 */
export function getMergedGlobalStylePresetVariables(
	type: string
): Array<VariableItem> {
	const features = getBlockEditorSettings()?.__experimentalFeatures;
	const refs = getGlobalStylePresetLayerRefs();

	switch (type) {
		case 'shadow': {
			const presets = features?.shadow?.presets;

			return mergePresetLayers(
				mapItemsArrayPresets,
				presets?.default,
				presets?.theme,
				presets?.custom,
				type,
				refs
			);
		}

		case 'text-shadow': {
			const presets = features?.textShadow?.presets;

			return mergePresetLayers(
				mapItemsArrayPresets,
				presets?.default,
				presets?.theme,
				presets?.custom,
				'shadow',
				refs
			);
		}

		case 'border-radius': {
			const radiusSizes = features?.border?.radiusSizes;

			return mergePresetLayers(
				mapBorderRadiusPresets,
				radiusSizes?.default,
				radiusSizes?.theme,
				radiusSizes?.custom,
				undefined,
				refs
			);
		}

		case 'border': {
			const presets = features?.border?.presets;

			return mergePresetLayers(
				mapBorderBoxPresets,
				presets?.default,
				presets?.theme,
				presets?.custom,
				undefined,
				refs
			);
		}

		case 'transition': {
			const presets = features?.transition?.presets;

			return mergePresetLayers(
				mapItemsArrayPresets,
				presets?.default,
				presets?.theme,
				presets?.custom,
				type,
				refs
			);
		}

		case 'transform': {
			const presets = features?.transform?.presets;

			return mergePresetLayers(
				mapItemsArrayPresets,
				presets?.default,
				presets?.theme,
				presets?.custom,
				type,
				refs
			);
		}

		case 'filter': {
			const presets = features?.filter?.presets;

			return mergePresetLayers(
				mapItemsArrayPresets,
				presets?.default,
				presets?.theme,
				presets?.custom,
				type,
				refs
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

		case 'width-size':
			return mapSpacingCustom(features?.layout?.widthSizes?.custom);

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
			return mapItemsArrayPresets(
				features?.shadow?.presets?.custom,
				undefined,
				customOriginRef
			);

		case 'text-shadow':
			return mapItemsArrayPresets(
				features?.textShadow?.presets?.custom,
				'shadow',
				customOriginRef
			);

		case 'border-radius':
			return mapBorderRadiusPresets(
				features?.border?.radiusSizes?.custom,
				undefined,
				customOriginRef
			);

		case 'border':
			return mapBorderBoxPresets(
				features?.border?.presets?.custom,
				undefined,
				customOriginRef
			);

		case 'transition':
			return mapItemsArrayPresets(
				features?.transition?.presets?.custom,
				undefined,
				customOriginRef
			);

		case 'transform':
			return mapItemsArrayPresets(
				features?.transform?.presets?.custom,
				undefined,
				customOriginRef
			);

		case 'filter':
			return mapItemsArrayPresets(
				features?.filter?.presets?.custom,
				undefined,
				customOriginRef
			);

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
