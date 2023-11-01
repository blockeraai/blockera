// @flow
import type { Element } from 'React';

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
	id?: string,
	label?: string,
	field?: string,
	columns?: string,
	defaultValue?: string,
	onChange?: () => {},
	type: 'native' | 'custom',
	options: TSelectOptions,
	customMenuPosition: 'bottom' | 'top',
	customHideInputIcon?: boolean,
	customHideInputLabel?: boolean,
	customInputCenterContent?: boolean,
	customHideInputCaret?: boolean,
	noBorder?: boolean,
	multiple?: boolean,
	className?: string,
};
