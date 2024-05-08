// @flow
/**
 * Blockera dependencies
 */
import type { ControlSize } from '@blockera/controls';
import type { VariableCategory, VariableItem } from '@blockera/data';

/**
 * Internal dependencies
 */
import type { ValueAddon } from '../../../types';

export type ValueAddonControlProps = {
	value: ValueAddon,
	setValue: (value: Object | string) => void,
	onChange: (value: Object | string) => void,
	types: Array<'variable'>,
	variableTypes: Array<VariableCategory>,
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
};
