// @flow
/**
 * Internal dependencies
 */
import type { ValueAddonReference } from '../types';
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

function collectRepeaterLikeItems(
	item: { +[string]: mixed },
	variableType: string
): Array<mixed> {
	if (Array.isArray(item.items)) {
		return [...item.items];
	}

	if (Array.isArray(item.shadow)) {
		return [...item.shadow];
	}

	if (typeof variableType === 'string') {
		const byType = item[variableType];
		if (Array.isArray(byType)) {
			return [...byType];
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
		case 'text-shadow':
		case 'transition':
		case 'transform':
		case 'filter': {
			const items = collectRepeaterLikeItems(item, variableType);

			return { items: [...items] };
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

			return String(v).trim();
		}

		case 'spacing':
		case 'font-size': {
			const v = item.size ?? item.value ?? '';

			return String(v).trim();
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
	const reference = referenceFromPresetOrigin(origin);
	const id = String(item.slug ?? item.id ?? '');
	const varString = generateVariableString({
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
		...(item.fluid !== undefined && item.fluid !== null
			? { fluid: item.fluid }
			: {}),
	};
}
