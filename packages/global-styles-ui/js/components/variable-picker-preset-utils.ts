/**
 * Blockera dependencies
 */
import {
	buildPresetVariablePickerPayload as buildPresetVariablePickerPayloadFromData,
	referenceFromPresetOrigin as referenceFromPresetOriginFromData,
} from '@blockera/data';

export const referenceFromPresetOrigin = referenceFromPresetOriginFromData;

export const buildPresetVariablePickerPayload =
	buildPresetVariablePickerPayloadFromData;

function referencesEqual(a: unknown, b: unknown): boolean {
	if (a === b) {
		return true;
	}
	if (
		a === null ||
		a === undefined ||
		b === null ||
		b === undefined ||
		typeof a !== 'object' ||
		typeof b !== 'object' ||
		Array.isArray(a) ||
		Array.isArray(b)
	) {
		return false;
	}
	const ra = a as Record<string, unknown>;
	const rb = b as Record<string, unknown>;
	if (ra.type !== rb.type) {
		return false;
	}
	if (ra.type === 'theme') {
		return String(ra.theme ?? '') === String(rb.theme ?? '');
	}
	return true;
}

function variablePickerRowMatchesSelected(
	row: Record<string, unknown>,
	variableType: string,
	origin: string | string[],
	pickerValue: unknown
): boolean {
	const cv = pickerValue as
		| { valueType?: string; settings?: Record<string, unknown> }
		| null
		| undefined;

	if (
		!cv ||
		cv.valueType !== 'variable' ||
		!cv.settings ||
		typeof cv.settings !== 'object'
	) {
		return false;
	}

	const settings = cv.settings;
	const selectedType = typeof settings.type === 'string' ? settings.type : '';
	if (selectedType !== variableType) {
		return false;
	}

	const rowId = String(row.slug ?? row.id ?? '');
	const selectedId =
		settings.id !== undefined && settings.id !== null
			? String(settings.id)
			: '';
	if (!rowId || !selectedId || rowId !== selectedId) {
		return false;
	}

	const selectedRef = settings.reference;
	if (selectedRef === undefined || selectedRef === null) {
		return false;
	}

	return referencesEqual(selectedRef, referenceFromPresetOrigin(origin));
}

/**
 * Variable picker: mark every row selectable and `isSelected` only for the variable bound to the control.
 */
export function applyVariablePickerRepeaterSelection(
	items: unknown,
	options: {
		variableType: string;
		origin: string | string[];
		pickerValue: unknown;
	}
): unknown {
	const { variableType, origin, pickerValue } = options;

	if (items === null || items === undefined) {
		return items;
	}

	const mapRow = (row: unknown): unknown => {
		if (!row || typeof row !== 'object' || Array.isArray(row)) {
			return row;
		}
		const r = row as Record<string, unknown>;
		return {
			...r,
			selectable: true,
			isSelected: variablePickerRowMatchesSelected(
				r,
				variableType,
				origin,
				pickerValue
			),
		};
	};

	if (Array.isArray(items)) {
		return items.map(mapRow);
	}

	if (typeof items === 'object') {
		const next = { ...(items as Record<string, unknown>) };
		for (const key of Object.keys(next)) {
			next[key] = mapRow(next[key]);
		}
		return next;
	}

	return items;
}

/**
 * Ensures every repeater row is selectable in the variable picker (theme / default / custom).
 * Prefer {@link applyVariablePickerRepeaterSelection} when the current addon value is available.
 */
export function applyVariablePickerSelectableToRepeaterItems(
	items: unknown
): unknown {
	if (items === null || items === undefined) {
		return items;
	}

	if (Array.isArray(items)) {
		return items.map((row) =>
			row && typeof row === 'object' && !Array.isArray(row)
				? { ...(row as Record<string, unknown>), selectable: true }
				: row
		);
	}

	if (typeof items === 'object') {
		const next = { ...(items as Record<string, unknown>) };
		for (const key of Object.keys(next)) {
			const row = next[key];
			if (row && typeof row === 'object' && !Array.isArray(row)) {
				next[key] = {
					...(row as Record<string, unknown>),
					selectable: true,
				};
			}
		}
		return next;
	}

	return items;
}

export function stripIsSelectedFromRepeaterItems<
	T extends Record<string, unknown>,
>(items: T): T {
	const next = { ...items } as Record<string, unknown>;

	for (const key of Object.keys(next)) {
		const row = next[key];
		if (row && typeof row === 'object' && !Array.isArray(row)) {
			const { isSelected: _removed, ...rest } = row as Record<
				string,
				unknown
			>;
			next[key] = rest;
		}
	}

	return next as T;
}
