// @flow
/**
 * Blockera dependencies
 */
import type { VariableCategory } from '@blockera/data';

/**
 * Internal dependencies
 */
import type { ControlSize } from '../../';
import type { ValueAddon } from './value-addon';

export type AddonTypesItem = 'variable';

export type AddonTypes = Array<AddonTypesItem>;

export type UseValueAddonProps = {
	value: any,
	types?: AddonTypes,
	size?: ControlSize,
	pickerProps?: Object,
	pointerProps?: Object,
	setValue: (newValue: any) => void,
	variableTypes?: Array<VariableCategory>,
	onChange: (value: string | ValueAddon) => void,
};
