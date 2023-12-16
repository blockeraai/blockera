// @flow
/**
 * Internal dependencies
 */
import type {
	ControlGeneralTypes,
	ControlValueAddonTypes,
	ControlSize,
} from '../../../types';

export type ColorControlProps = {
	...ControlGeneralTypes,
	...ControlValueAddonTypes,
	type?: 'normal' | 'minimal',
	noBorder?: boolean,
	contentAlign?: 'left' | 'center' | 'right',
	size?: ControlSize,
};
