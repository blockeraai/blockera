// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

type ID = string | number;

type Attribute = {
	key: string,
	value: string,
	isVisible: boolean,
};

type DefaultValueProps = {
	link?: string,
	target?: boolean,
	nofollow?: boolean,
	label?: string,
	attributes?: Array<Attribute | null>,
};

export type LinkControlProps = {
	...ControlGeneralTypes,
	placeholder?: string,
	attributesId?: ID,
	defaultValue?: DefaultValueProps,
	advancedOpen?: 'auto' | boolean,
};
