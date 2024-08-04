// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';
import type { AttributeControlValue } from '../../attributes-control/types';

type ID = string | number;

export type LinkControlValue = {
	link: string,
	target: boolean,
	nofollow: boolean,
	label: string,
	attributes: Array<AttributeControlValue>,
};

export type LinkControlProps = {
	...ControlGeneralTypes,
	/**
	 * link input placeholder text
	 */
	placeholder?: string,
	/**
	 * The control attributes identifier is required property!
	 */
	attributesId?: ID,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue?: LinkControlValue,
	/**
	 * Controls that advanced mode will be open automatic if the inside values where defined or not
	 *
	 * @default `auto`
	 */
	advancedOpen?: 'auto' | boolean,
};
