// @flow
/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';

export type VarPickerPresetContextValue = {
	active: boolean,
	variableType: string | null,
	controlProps: ValueAddonControlProps | null,
};

export const VarPickerPresetContext: React$Context<VarPickerPresetContextValue> =
	createContext({
		active: false,
		variableType: null,
		controlProps: null,
	});

export function useVarPickerPresetContext(): VarPickerPresetContextValue {
	return (useContext(VarPickerPresetContext): VarPickerPresetContextValue);
}
