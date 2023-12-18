// @flow
import type { Element } from 'React';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type TNativeOption = {
	label: string,
	value: string,
	icon?: Element<any>,
	type?: string,
	disabled?: boolean,
	className?: string,
	style?: Object,
	options?: Array<Object>,
	key?: string,
};
export type TSelectOptions = TNativeOption[];

export type TSelectControlProps = {
	...ControlGeneralTypes,
	defaultValue?: string,
	type?: 'native' | 'custom',
	options: TSelectOptions,
	customMenuPosition?: 'bottom' | 'top',
	customHideInputIcon?: boolean,
	customHideInputLabel?: boolean,
	customInputCenterContent?: boolean,
	customHideInputCaret?: boolean,
	noBorder?: boolean,
	multiple?: boolean,
};
