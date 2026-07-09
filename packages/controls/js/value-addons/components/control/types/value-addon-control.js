// @flow
/**
 * Blockera dependencies
 */
import type {
	VariableItem,
	VariableCategory,
	DynamicValueItem,
	DynamicValueTypes,
} from '@blockera/data';

/**
 * Internal dependencies
 */
import type { ControlSize } from '../../../../';
import type { ValueAddon } from '../../../types';

export type ValueAddonControlProps = {
	value: ValueAddon,
	setValue: (value: Object | string) => void,
	onChange: (value: Object | string) => void,
	types: Array<'variable' | 'dynamic-value'>,
	variableTypes: Array<VariableCategory>,
	dynamicValueTypes: Array<DynamicValueTypes>,
	handleOnClickDV: (data: DynamicValueItem) => void,
	handleOnClickVar: (data: VariableItem) => void,
	handleOnUnlinkVar: (event: SyntheticMouseEvent<EventTarget>) => void,
	handleOnClickRemove: (event: SyntheticMouseEvent<EventTarget>) => void,
	isOpen: string,
	setOpen: (value: string) => void,
	size: ControlSize,
	pickerProps: Object,
	pointerProps: Object,
	/*
	 * Variable is deleted or not
	 */
	isDeletedVar: boolean,
	/**
	 * Dynamic value is deleted or not
	 */
	isDeletedDV: boolean,
};
