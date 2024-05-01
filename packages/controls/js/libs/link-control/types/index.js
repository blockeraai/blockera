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
	placeholder?: string,
	attributesId?: ID,
	defaultValue?: LinkControlValue,
	advancedOpen?: 'auto' | boolean,
};
