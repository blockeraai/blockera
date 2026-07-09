// @flow
/**
 * Internal dependencies
 */
import type { ValueAddonReference } from '../types';
import {
	normalizeFontSizeFluid,
	normalizePresetSize,
} from './normalize-preset-sizes';
import { generateVariableString } from './utils';
import { resolveCurrentThemeDisplayName } from './resolve-current-theme-name';

export function referenceFromPresetOrigin(
	origin: string | string[]
): ValueAddonReference {
	const o = Array.isArray(origin) ? origin[0] : origin;

	if (o === 'custom') {
		return { type: 'custom' };
	}

	if (o === 'theme') {
		return { type: 'theme', theme: resolveCurrentThemeDisplayName() };
	}

	return { type: 'preset' };
}

function resolveExplicitCatalogVarString(item: { +[string]: mixed }): ?string {
	const raw = item.var;
	if (typeof raw !== 'string') {
		return null;
	}
	const trimmed = raw.trim();
	if (trimmed === '') {
		return null;
	}

	return trimmed.startsWith('--') ? trimmed : `--${trimmed}`;
}

function resolveCatalogItemReference(
	item: { +[string]: mixed },
	origin: string | string[]
): ValueAddonReference {
	if (
		item.reference &&
		typeof item.reference === 'object' &&
		!Array.isArray(item.reference)
	) {
		return (item.reference: ValueAddonReference);
	}

	return referenceFromPresetOrigin(origin);
}

/**
 * Repeater rows for variable payload, or a single CSS string when theme.json stores `shadow` only.
 */
function collectRepeaterLikeItems(
	item: { +[string]: mixed },
	variableType: string
): Array<mixed> | string {
	if (Array.isArray(item.items)) {
		return [...item.items];
	}

	const nestedVal =
		item.value &&
		typeof item.value === 'object' &&
		!Array.isArray(item.value)
			? item.value
			: null;
	if (nestedVal && Array.isArray(nestedVal.items)) {
		return [...nestedVal.items];
	}
	if (
		nestedVal &&
		typeof nestedVal.items === 'string' &&
		String(nestedVal.items).trim() !== ''
	) {
		return String(nestedVal.items).trim();
	}

	// Canonical theme.json: CSS on `shadow` (box-shadow / text-shadow presets).
	const rawShadow = item.shadow;
	if (typeof rawShadow === 'string') {
		const t = rawShadow.trim();
		if (t !== '') {
			return t;
		}
	}

	if (Array.isArray(item.shadow)) {
		return [...item.shadow];
	}

	if (typeof variableType === 'string') {
		const byType = item[variableType];
		if (Array.isArray(byType)) {
			return [...byType];
		}
		if (typeof byType === 'string' && byType.trim() !== '') {
			return byType.trim();
		}
	}

	return [];
}

/**
 * Normalized `settings.value` for global-style presets (plain objects or strings).
 * Aligns with {@see getMergedGlobalStylePresetVariables} / custom-global-style-presets mappers.
 */
export function serializeGlobalStylePresetItemValue(
	item: { +[string]: mixed },
	variableType: string
): mixed {
	switch (variableType) {
		case 'shadow':
		case 'text-shadow': {
			const collected = collectRepeaterLikeItems(item, variableType);

			if (typeof collected === 'string') {
				return { items: collected };
			}

			return { items: [...collected] };
		}

		case 'transition':
		case 'transform':
		case 'filter': {
			const items = collectRepeaterLikeItems(item, variableType);

			return {
				items: Array.isArray(items) ? [...items] : [],
			};
		}

		case 'border': {
			const border =
				item.border !== undefined && item.border !== null
					? item.border
					: {};

			if (typeof border === 'string') {
				return border;
			}

			if (typeof border === 'object' && !Array.isArray(border)) {
				return { ...border };
			}

			return {};
		}

		case 'border-radius': {
			const v = item.size ?? item.value ?? '';

			return normalizePresetSize(v);
		}

		case 'spacing':
		case 'font-size':
		case 'line-height': {
			const v = item.size ?? item.value ?? '';

			return normalizePresetSize(v);
		}

		case 'color': {
			const v = item.color ?? item.value ?? '';

			return String(v).trim();
		}

		case 'linear-gradient':
		case 'radial-gradient': {
			const v = item.gradient ?? item.value ?? '';

			return String(v).trim();
		}

		default: {
			const v =
				item.value ??
				item.size ??
				item.color ??
				item.gradient ??
				item.filter ??
				item.opacity ??
				'';

			return String(v).trim();
		}
	}
}

export function buildPresetVariablePickerPayload(
	item: { +[string]: mixed },
	origin: string | string[],
	variableType: string
): { +[string]: mixed } {
	const reference = resolveCatalogItemReference(item, origin);
	const id = String(item.slug ?? item.id ?? '');
	const explicitVar = resolveExplicitCatalogVarString(item);
	const varString =
		explicitVar ??
		generateVariableString({
			reference,
			type: variableType,
			id,
		});

	const value = serializeGlobalStylePresetItemValue(item, variableType);

	return {
		id,
		name: String(item.name ?? id),
		type: variableType,
		reference,
		value,
		var: varString,
		...(typeof item.group === 'string' ? { group: item.group } : {}),
		...(typeof item.label === 'string' ? { label: item.label } : {}),
		...(item.fluid !== undefined && item.fluid !== null
			? {
					fluid:
						variableType === 'font-size'
							? normalizeFontSizeFluid(item.fluid)
							: item.fluid,
				}
			: {}),
	};
}
