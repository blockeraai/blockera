import type { VariableType } from './types';

/** Safe read of a preset's `meta` object. */
export function getPresetMetaRecord(
	preset: Record<string, unknown> | VariableType
): Record<string, unknown> | undefined {
	const meta = (preset as Record<string, unknown>).meta;
	if (
		meta !== null &&
		meta !== undefined &&
		typeof meta === 'object' &&
		!Array.isArray(meta)
	) {
		return meta as Record<string, unknown>;
	}
	return undefined;
}

/** Returns `meta.description` as a string, or empty when missing. */
export function getPresetDescription(
	preset: Record<string, unknown> | VariableType
): string {
	const meta = getPresetMetaRecord(preset);
	const description = meta?.description;
	return typeof description === 'string' ? description : '';
}

/** Copies `row.meta` onto a persisted preset object when present. */
export function withPresetMetaFromRepeaterRow<
	T extends Record<string, unknown>,
>(
	row: Record<string, unknown>,
	fields: T
): T & { meta?: Record<string, unknown> } {
	const meta = getPresetMetaRecord(row);
	if (!meta) {
		return fields;
	}
	return { ...fields, meta: { ...meta } };
}

/** Merges or clears `meta.description`; drops `meta` when no keys remain. */
export function buildPresetWithDescriptionUpdate<T extends VariableType>(
	variable: T,
	description: string
): T {
	const prevMeta = getPresetMetaRecord(variable) ?? {};
	const nextMeta = { ...prevMeta };

	if (description === '') {
		delete nextMeta.description;
	} else {
		nextMeta.description = description;
	}

	if (Object.keys(nextMeta).length === 0) {
		const { meta: _meta, ...rest } = variable as T & {
			meta?: Record<string, unknown>;
		};
		return rest as T;
	}

	return { ...variable, meta: nextMeta };
}
