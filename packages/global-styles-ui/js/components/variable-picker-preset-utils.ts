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
