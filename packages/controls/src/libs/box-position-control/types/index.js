// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types';

type TDefaultValue = {
	type: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed',
	position: {
		top: string,
		right: string,
		bottom: string,
		left: string,
	},
};

export type BoxPositionControlProps = {
	...RepeaterControlProps,
	defaultValue?: TDefaultValue,
	openSide?: 'top' | 'right' | 'bottom' | 'left' | '',
};
