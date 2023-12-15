// @flow
/**
 * Internal dependencies
 */
import type { ControlSize } from '../../../types';

export type Props = {
	type?: 'normal' | 'minimal',
	noBorder?: boolean,
	contentAlign?: 'left' | 'center' | 'right',
	size: ControlSize,
	//
	id?: string,
	label?: string,
	columns?: string,
	defaultValue?: string,
	onChange?: () => void,
	field?: string,
	//
	//
	className: string,
	style?: Object,
	//
	controlAddonTypes?: Array<string>,
	variableTypes?: Array<string>,
	dynamicValueTypes?: Array<string>,
};
