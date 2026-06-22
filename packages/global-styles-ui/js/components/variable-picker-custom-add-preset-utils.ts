/**
 * Blockera dependencies
 */
import {
	getSortedRepeater,
	getValueAddonRealValue,
	hasExplicitPlainThemeJsonPresetStorage,
	isLikelyThemeJsonPlainPresetSlugString,
	isValid,
	plainPresetSlugFromStoredPlainPresetInput,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { coerceBorderPresetSide } from '../borders/utils';
import { repeaterRecordToItems as filterRepeaterToItems } from '../filters/utils';
import {
	repeaterRecordToShadowItems,
	shadowPresetItemsToCss,
} from '../shadows/utils';
import {
	repeaterRecordToTextShadowItems,
	textShadowPresetItemsToCss,
} from '../text-shadows/utils';
import { repeaterRecordToItems as transformRepeaterToItems } from '../transforms/utils';
import { repeaterRecordToItems as transitionRepeaterToItems } from '../transitions/utils';

export type ResolveVariablePickerCustomAddPresetValueOptions = {
	rawValue: unknown;
	variableType: string;
	defaultPresetValue: Record<string, unknown>;
	blockName?: string;
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

function shouldSkipSeeding(rawValue: unknown): boolean {
	if (rawValue === undefined || rawValue === null || rawValue === '') {
		return true;
	}

	if (isPlainObject(rawValue) && isValid(rawValue)) {
		return true;
	}

	if (typeof rawValue === 'string') {
		const stripped = rawValue.endsWith('func')
			? rawValue.slice(0, -4)
			: rawValue;
		if (hasExplicitPlainThemeJsonPresetStorage(stripped)) {
			return true;
		}
		const slug = plainPresetSlugFromStoredPlainPresetInput(stripped);
		if (
			slug !== '' &&
			slug === stripped.trim() &&
			isLikelyThemeJsonPlainPresetSlugString(slug)
		) {
			return true;
		}
	}

	return false;
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

function mergeScalarField(
	defaultPresetValue: Record<string, unknown>,
	field: string,
	scalar: unknown
): Record<string, unknown> | null {
	if (!hasMeaningfulScalar(scalar)) {
		return null;
	}
	return {
		...defaultPresetValue,
		[field]: String(scalar),
	};
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

function seedFromRepeaterItems(
	defaultPresetValue: Record<string, unknown>,
	rawValue: unknown,
	toItems: (repeater: Record<string, Record<string, unknown>>) => unknown[]
): Record<string, unknown> | null {
	if (!isRepeaterRecord(rawValue)) {
		return null;
	}

	const visible = visibleRepeaterRows(rawValue);
	if (!visible.length) {
		return null;
	}

	const filteredRepeater = visible.reduce<
		Record<string, Record<string, unknown>>
	>((acc, row, index) => {
		acc[String(index)] = row as Record<string, unknown>;
		return acc;
	}, {});

	const items = toItems(filteredRepeater);
	if (!items.length) {
		return null;
	}

	return {
		...defaultPresetValue,
		items,
	};
}

function seedBorderPreset(
	defaultPresetValue: Record<string, unknown>,
	rawValue: unknown
): Record<string, unknown> | null {
	if (!isPlainObject(rawValue)) {
		return null;
	}

	const side = coerceBorderPresetSide(rawValue);
	if (
		!side.width?.trim() &&
		!side.style?.trim() &&
		(side.color === '' ||
			side.color === undefined ||
			(typeof side.color === 'string' && !side.color.trim()))
	) {
		return null;
	}

	return {
		...defaultPresetValue,
		border: side,
	};
}

function seedByVariableType(
	rawValue: unknown,
	variableType: string,
	defaultPresetValue: Record<string, unknown>,
	blockName?: string
): Record<string, unknown> | null {
	switch (variableType) {
		case 'font-size':
		case 'spacing':
		case 'width-size':
		case 'border-radius': {
			const scalar = getValueAddonRealValue(rawValue, { blockName });
			return mergeScalarField(defaultPresetValue, 'size', scalar);
		}
		case 'color': {
			const scalar = getValueAddonRealValue(rawValue, { blockName });
			return mergeScalarField(defaultPresetValue, 'color', scalar);
		}
		case 'linear-gradient':
		case 'radial-gradient': {
			const scalar = getValueAddonRealValue(rawValue, { blockName });
			return mergeScalarField(defaultPresetValue, 'gradient', scalar);
		}
		case 'transform':
			return seedFromRepeaterItems(
				defaultPresetValue,
				rawValue,
				transformRepeaterToItems
			);
		case 'filter':
			return seedFromRepeaterItems(
				defaultPresetValue,
				rawValue,
				filterRepeaterToItems
			);
		case 'transition':
			return seedFromRepeaterItems(
				defaultPresetValue,
				rawValue,
				transitionRepeaterToItems
			);
		case 'shadow': {
			if (!isRepeaterRecord(rawValue)) {
				return null;
			}
			const items = repeaterRecordToShadowItems(rawValue);
			const visible = items.filter((item) => item.isVisible !== false);
			if (!visible.length) {
				return null;
			}
			const shadow = shadowPresetItemsToCss(visible);
			if (!shadow.trim()) {
				return null;
			}
			return {
				...defaultPresetValue,
				shadow,
			};
		}
		case 'text-shadow': {
			if (!isRepeaterRecord(rawValue)) {
				return null;
			}
			const items = repeaterRecordToTextShadowItems(rawValue);
			const visible = items.filter((item) => item.isVisible !== false);
			if (!visible.length) {
				return null;
			}
			const shadow = textShadowPresetItemsToCss(visible);
			if (!shadow.trim()) {
				return null;
			}
			return {
				...defaultPresetValue,
				shadow,
			};
		}
		case 'border':
			return seedBorderPreset(defaultPresetValue, rawValue);
		default:
			return null;
	}
}

/**
 * When adding a custom preset from the variable picker header "+", merge the
 * control's current value into the static default when appropriate.
 */
export function resolveVariablePickerCustomAddPresetValue(
	options: ResolveVariablePickerCustomAddPresetValueOptions
): Record<string, unknown> {
	const { rawValue, variableType, defaultPresetValue, blockName } = options;

	if (shouldSkipSeeding(rawValue)) {
		return defaultPresetValue;
	}

	const seeded = seedByVariableType(
		rawValue,
		variableType,
		defaultPresetValue,
		blockName
	);

	return seeded ?? defaultPresetValue;
}
