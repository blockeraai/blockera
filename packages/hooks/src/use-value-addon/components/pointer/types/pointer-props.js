// @flow
/**
 * Internal dependencies
 */
import type {
	ValueAddon,
	VariableTypes,
	DynamicValueTypes,
} from '../../../types';

export type PointerProps = {
	value: ValueAddon,
	types: Array<'variable' | 'dynamic-value'>,
	variableTypes: Array<VariableTypes>,
	dynamicValueTypes: Array<DynamicValueTypes>,
	handleOnClickDynamicValue: (
		event: SyntheticMouseEvent<EventTarget>
	) => void,
	handleOnClickVariable: (event: SyntheticMouseEvent<EventTarget>) => void,
	handleOnUnlinkVariable: (event: SyntheticMouseEvent<EventTarget>) => void,
	handleOnClickRemove: (event: SyntheticMouseEvent<EventTarget>) => void,
	isOpenVariables: boolean,
	setOpenVariables: (value: boolean) => void,
	isOpenDynamicValues: boolean,
	setOpenDynamicValues: (value: boolean) => void,
	isOpenVariableDeleted: boolean,
	setIsOpenVariableDeleted: (value: boolean) => void,
};
