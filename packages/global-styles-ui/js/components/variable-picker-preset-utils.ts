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
		const themeA = String(ra.theme ?? '');
		const themeB = String(rb.theme ?? '');
		if (themeA === themeB) {
			return true;
		}
		// Theme compatibility catalogs often store slug (`blocksy`); preset origin uses display name.
		return themeA.toLowerCase() === themeB.toLowerCase();
	}
	return true;
}

export function variablePickerRowMatchesSelected(
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

	const rowReference =
		row.reference &&
		typeof row.reference === 'object' &&
		!Array.isArray(row.reference)
			? row.reference
			: referenceFromPresetOrigin(origin);

	return referencesEqual(selectedRef, rowReference);
}

/**
 * Whether deleting a preset row should clear the control currently bound in the variable picker.
 */
export function shouldClearVariablePickerFeatureOnRowDelete(
	row: Record<string, unknown>,
	options: {
		variableType: string;
		origin: string | string[];
		pickerValue: unknown;
		themeJsonPlainPresetSlug?: string;
	}
): boolean {
	const {
		variableType,
		origin,
		pickerValue,
		themeJsonPlainPresetSlug = '',
	} = options;

	const rowId = String(row.slug ?? row.id ?? '');
	if (!rowId) {
		return false;
	}

	if (themeJsonPlainPresetSlug !== '' && themeJsonPlainPresetSlug === rowId) {
		return true;
	}

	return variablePickerRowMatchesSelected(
		row,
		variableType,
		origin,
		pickerValue
	);
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
		const nextSelectable = r.listViewCompactShades === true ? false : true;
		const nextIsSelected = variablePickerRowMatchesSelected(
			r,
			variableType,
			origin,
			pickerValue
		);

		if (
			r.selectable === nextSelectable &&
			r.isSelected === nextIsSelected
		) {
			return row;
		}

		return {
			...r,
			selectable: nextSelectable,
			isSelected: nextIsSelected,
		};
	};

	if (Array.isArray(items)) {
		let changed = false;
		const mapped = items.map((row) => {
			const nextRow = mapRow(row);
			if (nextRow !== row) {
				changed = true;
			}
			return nextRow;
		});
		return changed ? mapped : items;
	}

	if (typeof items === 'object') {
		const source = items as Record<string, unknown>;
		let next: Record<string, unknown> | null = null;

		for (const key of Object.keys(source)) {
			const mappedRow = mapRow(source[key]);
			if (mappedRow !== source[key]) {
				if (!next) {
					next = { ...source };
				}
				next[key] = mappedRow;
			}
		}

		return next ?? source;
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

/**
 * Removes variable-picker-only row flags so preset repeaters stay in normal edit mode
 * (e.g. site Design System / global styles). Item spread wins over defaultRepeaterItemValue,
 * so stray `selectable` on preset data would otherwise keep rows selectable.
 */
export function stripRepeaterPickerUiFields(items: unknown): unknown {
	if (items === null || items === undefined) {
		return items;
	}

	const stripRow = (row: unknown): unknown => {
		if (!row || typeof row !== 'object' || Array.isArray(row)) {
			return row;
		}
		const r = row as Record<string, unknown>;
		const {
			isSelected: _is,
			selectable: _sel,
			listViewCompactShades: _listViewCompactShades,
			__rebindBoundFeature: _rebindBoundFeature,
			...rest
		} = r;

		if (
			_is === undefined &&
			_sel === undefined &&
			_listViewCompactShades === undefined &&
			_rebindBoundFeature === undefined
		) {
			return row;
		}

		return rest;
	};

	if (Array.isArray(items)) {
		let changed = false;
		const mapped = items.map((row) => {
			const nextRow = stripRow(row);
			if (nextRow !== row) {
				changed = true;
			}
			return nextRow;
		});
		return changed ? mapped : items;
	}

	if (typeof items === 'object') {
		const source = items as Record<string, unknown>;
		let next: Record<string, unknown> | null = null;

		for (const key of Object.keys(source)) {
			const strippedRow = stripRow(source[key]);
			if (strippedRow !== source[key]) {
				if (!next) {
					next = { ...source };
				}
				next[key] = strippedRow;
			}
		}

		return next ?? source;
	}

	return items;
}

/**
 * Tracks preset slugs that are mid-create. Persisted preset rows drop `creatingStep`
 * when converted to theme items; this map keeps the edit popover open until the row
 * is closed once.
 *
 * When the derived slug changes while naming a new preset, stale slug keys are dropped
 * so only the current row stays in the creating state.
 */
export function syncVariablePickerCreatingStepSlugs(
	prev: Record<string, true>,
	raw: unknown
): Record<string, true> {
	const next: Record<string, true> = {};
	const rowsBySlug = new Map<string, Record<string, unknown>>();
	const rowsByItemId = new Map<string, Record<string, unknown>>();

	const ingestRow = (itemId: string, row: unknown) => {
		if (!row || typeof row !== 'object' || Array.isArray(row)) {
			return;
		}
		const r = row as Record<string, unknown>;
		rowsByItemId.set(itemId, r);
		const slug =
			r.slug !== null && r.slug !== undefined ? String(r.slug) : '';

		if (slug) {
			rowsBySlug.set(slug, r);
		}

		if (r.creatingStep === true) {
			if (slug) {
				next[`slug:${slug}`] = true;
			} else {
				next[`id:${itemId}`] = true;
			}
		}
	};

	if (Array.isArray(raw)) {
		raw.forEach((row, index) => {
			ingestRow(String(index), row);
		});
	} else if (raw && typeof raw === 'object') {
		for (const [itemId, row] of Object.entries(
			raw as Record<string, unknown>
		)) {
			ingestRow(itemId, row);
		}
	}

	for (const key of Object.keys(prev)) {
		if (next[key]) {
			continue;
		}

		if (key.startsWith('id:')) {
			const itemId = key.slice(3);
			const row = rowsByItemId.get(itemId);
			if (row && row.creatingStep !== false) {
				next[key] = true;
			}
			continue;
		}

		const slugKey = key.startsWith('slug:') ? key.slice(5) : key;
		const row = rowsBySlug.get(slugKey);
		if (row && row.creatingStep !== false) {
			next[key.startsWith('slug:') ? key : `slug:${slugKey}`] = true;
		}
	}

	return next;
}

export function mergeVariablePickerCreatingStepIntoItems<T>(
	items: T,
	creatingStepSlugs: Record<string, true>
): T {
	if (
		!Object.keys(creatingStepSlugs).length ||
		items === null ||
		items === undefined
	) {
		return items;
	}

	const rowHasCreatingStep = (
		row: Record<string, unknown>,
		itemId?: string
	): boolean => {
		const slug =
			row.slug !== null && row.slug !== undefined ? String(row.slug) : '';

		if (slug) {
			if (creatingStepSlugs[`slug:${slug}`] || creatingStepSlugs[slug]) {
				return true;
			}
		}

		if (itemId && creatingStepSlugs[`id:${itemId}`]) {
			return true;
		}

		return false;
	};

	const mapRow = (row: unknown, itemId?: string): unknown => {
		if (!row || typeof row !== 'object' || Array.isArray(row)) {
			return row;
		}
		const r = row as Record<string, unknown>;

		if (!rowHasCreatingStep(r, itemId)) {
			return row;
		}

		if (r.creatingStep === true) {
			return row;
		}

		return { ...r, creatingStep: true };
	};

	if (Array.isArray(items)) {
		let changed = false;
		const mapped = items.map((row, index) => {
			const nextRow = mapRow(row, String(index));
			if (nextRow !== row) {
				changed = true;
			}
			return nextRow;
		});
		return (changed ? mapped : items) as T;
	}

	if (typeof items === 'object') {
		const source = items as Record<string, unknown>;
		let next: Record<string, unknown> | null = null;

		for (const [itemId, row] of Object.entries(source)) {
			const mappedRow = mapRow(row, itemId);
			if (mappedRow !== row) {
				if (!next) {
					next = { ...source };
				}
				next[itemId] = mappedRow;
			}
		}

		return (next ?? source) as T;
	}

	return items;
}

export { resolveVariablePickerCustomAddPresetValue } from './variable-picker-custom-add-preset-utils';
export type { ResolveVariablePickerCustomAddPresetValueOptions } from './variable-picker-custom-add-preset-utils';
