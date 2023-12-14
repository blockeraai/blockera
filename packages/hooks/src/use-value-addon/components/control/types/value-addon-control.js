// @flow
/**
 * Internal dependencies
 */
import type {
	ValueAddon,
	VariableTypes,
	DynamicValueTypes,
} from '../../../types';

export type ValueAddonControlProps = {
	value: ValueAddon,
	setValue: (value: Object | string) => void,
	onChange: (value: Object | string) => void,
	types: Array<'variable' | 'dynamic-value'>,
	variableTypes: Array<VariableTypes>,
	dynamicValueTypes: Array<DynamicValueTypes>,
	handleOnClickDV: (event: SyntheticMouseEvent<EventTarget>) => void,
	handleOnClickVar: (event: SyntheticMouseEvent<EventTarget>) => void,
	handleOnUnlinkVar: (event: SyntheticMouseEvent<EventTarget>) => void,
	handleOnClickRemove: (event: SyntheticMouseEvent<EventTarget>) => void,
	isOpen: string,
	setOpen: (value: string) => void,
};
