// @flow
/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';
import {
	useVarPickerCustomAddContext,
	type VarPickerCustomAddAction,
} from './var-picker-custom-add-context';

/**
 * Resolves the header / empty-state custom-add action for single-type variable pickers.
 */
export function useVarPickerSingleTypeCustomAddAction(
	controlProps: ValueAddonControlProps
): VarPickerCustomAddAction {
	const customAddCtx = useVarPickerCustomAddContext();
	const variableTypes = controlProps.variableTypes || [];

	if (variableTypes.length !== 1) {
		return null;
	}

	const singleType = variableTypes[0];
	if (singleType === null || singleType === undefined) {
		return null;
	}

	return customAddCtx?.getAction(singleType) ?? customAddCtx?.action ?? null;
}
