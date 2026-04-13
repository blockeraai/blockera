// @flow
/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import type { VariableItem } from '@blockera/data';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';

export type VarPickerPresetContextValue = {
	active: boolean,
	variableType: string | null,
	controlProps: ValueAddonControlProps | null,
	catalogItems?: Array<VariableItem>,
	catalogLabel?: string,
	/**
	 * When true, catalog fallback repeaters hide edit affordances (no preset popover / pen).
	 */
	disablePresetRowEdit?: boolean,
	/**
	 * When true, preset-group repeaters omit the header label (fallback catalog UI).
	 */
	omitRepeaterSectionLabel?: boolean,
};

export const VarPickerPresetContext: React$Context<VarPickerPresetContextValue> =
	createContext({
		active: false,
		variableType: null,
		controlProps: null,
		catalogItems: undefined,
		catalogLabel: undefined,
		disablePresetRowEdit: undefined,
		omitRepeaterSectionLabel: undefined,
	});

export function useVarPickerPresetContext(): VarPickerPresetContextValue {
	return (useContext(VarPickerPresetContext): VarPickerPresetContextValue);
}
