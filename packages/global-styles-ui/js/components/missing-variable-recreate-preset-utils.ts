/**
 * Blockera dependencies
 */
import { getSortedRepeater, getValueAddonRealValue } from '@blockera/controls';
import { normalizeFontSizeFluid, normalizePresetSize } from '@blockera/data';

/**
 * Internal dependencies
 */
import {
	coerceBorderPresetSide,
	resolveBorderColorString,
	type BorderPresetStoredSide,
} from '../borders/utils';
import { repeaterRecordToItems as filterRepeaterToItems } from '../filters/utils';
import {
	repeaterRecordToShadowItems,
	shadowItemsFromRaw,
	shadowPresetItemsToCss,
} from '../shadows/utils';
import {
	repeaterRecordToTextShadowItems,
	textShadowItemsFromRaw,
	textShadowPresetItemsToCss,
} from '../text-shadows/utils';
import { repeaterRecordToItems as transformRepeaterToItems } from '../transforms/utils';
import { repeaterRecordToItems as transitionRepeaterToItems } from '../transitions/utils';
import { normalizeVariablePresetSlug } from './utils';

export type MissingVariableSettings = {
	id?: string;
	name?: string;
	value?: unknown;
	type?: string;
	fluid?: unknown;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isRepeaterRecord(
	value: unknown
): value is Record<string, Record<string, unknown>> {
	if (!isPlainObject(value) || value.isValueAddon === true) {
		return false;
	}

	const keys = Object.keys(value);
	if (!keys.length) {
		return false;
	}

	return keys.some((key) => {
		const row = value[key];
		return isPlainObject(row);
	});
}

function hasMeaningfulScalar(value: unknown): boolean {
	if (value === undefined || value === null) {
		return false;
	}
	if (typeof value === 'string') {
		return value.trim() !== '';
	}
	return true;
}

function visibleRepeaterRows(
	repeater: Record<string, Record<string, unknown>>
): Record<string, unknown>[] {
	const sorted = getSortedRepeater(repeater);
	const rows: Record<string, unknown>[] = [];
	for (const [, row] of sorted) {
		if (row?.isVisible === false) {
			continue;
		}
		rows.push(row);
	}
	return rows;
}

function repeaterRecordFromRows(
	rows: Record<string, unknown>[]
): Record<string, Record<string, unknown>> {
	return rows.reduce<Record<string, Record<string, unknown>>>(
		(acc, row, index) => {
			acc[String(index)] = row as Record<string, unknown>;
			return acc;
		},
		{}
	);
}

function itemsFromRepeaterOrStored(
	value: unknown,
	toItems: (repeater: Record<string, Record<string, unknown>>) => unknown[]
): unknown[] {
	if (isRepeaterRecord(value)) {
		const visible = visibleRepeaterRows(value);
		if (!visible.length) {
			return [];
		}
		return toItems(repeaterRecordFromRows(visible));
	}

	const rawItems = itemsFromStoredValue(value);
	if (!rawItems.length) {
		return [];
	}

	const objectRows = rawItems.filter(
		(row): row is Record<string, unknown> =>
			row !== null && typeof row === 'object' && !Array.isArray(row)
	);
	if (!objectRows.length) {
		return [];
	}

	return toItems(repeaterRecordFromRows(objectRows));
}

function borderSideFromStoredValue(
	value: unknown
): BorderPresetStoredSide | null {
	if (!isPlainObject(value)) {
		return null;
	}

	let sideSource: unknown = value;
	if (value.type === 'all' && isPlainObject(value.all)) {
		sideSource = value.all;
	} else if (value.type === 'custom' && isPlainObject(value.custom)) {
		sideSource = value.custom;
	}

	const side = coerceBorderPresetSide(sideSource);
	const color = resolveBorderColorString(
		side.color as string | Record<string, unknown> | undefined
	);

	if (!side.width?.trim() && !side.style?.trim() && !color.trim()) {
		return null;
	}

	return side;
}

function shadowFieldFromStoredValue(
	value: unknown,
	variableType: 'shadow' | 'text-shadow'
): string {
	if (typeof value === 'string') {
		return value.trim();
	}

	if (isRepeaterRecord(value)) {
		const items =
			variableType === 'shadow'
				? repeaterRecordToShadowItems(value)
				: repeaterRecordToTextShadowItems(value);
		const visible = items.filter((item) => item.isVisible !== false);
		if (!visible.length) {
			return '';
		}
		return (
			variableType === 'shadow'
				? shadowPresetItemsToCss(visible)
				: textShadowPresetItemsToCss(visible)
		).trim();
	}

	if (isPlainObject(value)) {
		const direct = String(value.shadow ?? '').trim();
		if (direct) {
			return direct;
		}

		const items =
			variableType === 'shadow'
				? shadowItemsFromRaw(value)
				: textShadowItemsFromRaw(value);
		const visible = items.filter((item) => item.isVisible !== false);
		if (!visible.length) {
			return '';
		}
		return (
			variableType === 'shadow'
				? shadowPresetItemsToCss(visible)
				: textShadowPresetItemsToCss(visible)
		).trim();
	}

	return '';
}

/**
 * Normalize a missing variable `settings.id` to a custom preset slug.
 * Strips `var:preset|{type}|` tokens when present.
 */
export function normalizeMissingVariablePresetSlug(id: string): string {
	const trimmed = String(id ?? '').trim();
	if (trimmed === '') {
		return '';
	}

	if (trimmed.includes('var:preset|')) {
		const parts = trimmed.split('|');
		const slugPart = parts[parts.length - 1] ?? '';
		return normalizeVariablePresetSlug(slugPart);
	}

	return normalizeVariablePresetSlug(trimmed);
}

function customPresetBase(slug: string, name: string): Record<string, unknown> {
	return {
		slug,
		name,
		isVisible: true,
		deletable: true,
		cloneable: true,
		visibilitySupport: true,
	};
}

function presetContext(
	settings: MissingVariableSettings,
	slug: string
): { base: Record<string, unknown>; value: unknown } {
	const name = String(settings.name ?? slug).trim() || slug;

	return {
		base: customPresetBase(slug, name),
		value: settings.value,
	};
}

function itemsFromStoredValue(value: unknown): unknown[] {
	if (Array.isArray(value)) {
		return [...value];
	}
	if (isPlainObject(value) && Array.isArray(value.items)) {
		return [...value.items];
	}
	return [];
}

/**
 * Build a custom global-styles preset row from a missing value-addon binding.
 */
export function buildMissingVariableRecreatePreset(
	variableType: string,
	settings: MissingVariableSettings
): Record<string, unknown> | null {
	const slug = normalizeMissingVariablePresetSlug(String(settings.id ?? ''));
	if (slug === '') {
		return null;
	}

	if (
		variableType !== 'font-size' &&
		variableType !== 'spacing' &&
		variableType !== 'width-size' &&
		variableType !== 'border-radius' &&
		variableType !== 'color' &&
		variableType !== 'linear-gradient' &&
		variableType !== 'radial-gradient' &&
		variableType !== 'shadow' &&
		variableType !== 'text-shadow' &&
		variableType !== 'transform' &&
		variableType !== 'filter' &&
		variableType !== 'transition' &&
		variableType !== 'border'
	) {
		return null;
	}

	switch (variableType) {
		case 'font-size': {
			const { base, value } = presetContext(settings, slug);
			const scalar = getValueAddonRealValue(value);
			if (!hasMeaningfulScalar(scalar)) {
				return null;
			}
			return {
				...base,
				size: normalizePresetSize(scalar),
				fluid: normalizeFontSizeFluid(settings.fluid),
			};
		}

		case 'spacing':
		case 'width-size':
		case 'border-radius': {
			const { base, value } = presetContext(settings, slug);
			const scalar = getValueAddonRealValue(value);
			if (!hasMeaningfulScalar(scalar)) {
				return null;
			}
			return {
				...base,
				size: normalizePresetSize(scalar),
			};
		}

		case 'color': {
			const { base, value } = presetContext(settings, slug);
			const scalar = getValueAddonRealValue(value);
			if (!hasMeaningfulScalar(scalar)) {
				return null;
			}
			return {
				...base,
				color: String(scalar).trim(),
			};
		}

		case 'linear-gradient':
		case 'radial-gradient': {
			const { base, value } = presetContext(settings, slug);
			const scalar = getValueAddonRealValue(value);
			if (!hasMeaningfulScalar(scalar)) {
				return null;
			}
			return {
				...base,
				gradient: String(scalar).trim(),
			};
		}

		case 'shadow':
		case 'text-shadow': {
			const { base, value } = presetContext(settings, slug);
			const shadow = shadowFieldFromStoredValue(value, variableType);
			if (shadow === '') {
				return null;
			}
			return {
				...base,
				shadow,
			};
		}

		case 'transform': {
			const { base, value } = presetContext(settings, slug);
			const items = itemsFromRepeaterOrStored(
				value,
				transformRepeaterToItems
			);
			if (!items.length) {
				return null;
			}
			return {
				...base,
				items,
			};
		}

		case 'filter': {
			const { base, value } = presetContext(settings, slug);
			const items = itemsFromRepeaterOrStored(
				value,
				filterRepeaterToItems
			);
			if (!items.length) {
				return null;
			}
			return {
				...base,
				items,
			};
		}

		case 'transition': {
			const { base, value } = presetContext(settings, slug);
			const items = itemsFromRepeaterOrStored(
				value,
				transitionRepeaterToItems
			);
			if (!items.length) {
				return null;
			}
			return {
				...base,
				items,
			};
		}

		case 'border': {
			const { base, value } = presetContext(settings, slug);
			const border = borderSideFromStoredValue(value);
			if (!border) {
				return null;
			}
			return {
				...base,
				border,
			};
		}
	}
}
