// @flow
/**
 * Internal dependencies
 */
import type { VariableTypes } from './variable-types';

export type PointerProps = {
	types: Array<'variable' | 'dynamic-value'>,
	variableType: VariableTypes,
	dynamicValueType: string,
	/**
	 * TODO: please uncomment after final implements DynamicValuePicker component.
	 */
	handleOnClickDynamicValue: (
		event: SyntheticMouseEvent<EventTarget>
	) => void,
	handleOnClickVariable: (event: SyntheticMouseEvent<EventTarget>) => void,
};
