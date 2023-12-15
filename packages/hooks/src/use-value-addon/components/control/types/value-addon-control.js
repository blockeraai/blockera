// @flow
/**
 * Publisher dependencies
 */
import type {
	VariableCategory,
	DynamicValueTypes,
	VariableItem,
} from '@publisher/core-data';
import type { ControlSize } from '@publisher/controls';

/**
 * Internal dependencies
 */
import type { ValueAddon } from '../../../types';

export type ValueAddonControlProps = {
	value: ValueAddon,
	setValue: (value: Object | string) => void,
	onChange: (value: Object | string) => void,
	types: Array<'variable' | 'dynamic-value'>,
	variableTypes: Array<VariableCategory>,
	dynamicValueTypes: Array<DynamicValueTypes>,
	handleOnClickDV: (data: VariableItem) => void,
	handleOnClickVar: (data: VariableItem) => void,
	handleOnUnlinkVar: (event: SyntheticMouseEvent<EventTarget>) => void,
	handleOnClickRemove: (event: SyntheticMouseEvent<EventTarget>) => void,
	isOpen: string,
	setOpen: (value: string) => void,
	size: ControlSize,
};
