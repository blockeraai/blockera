// @flow

/**
 * Internal dependencies
 */
import type {
	ControlGeneralTypes,
	ControlValueAddonTypes,
} from '../../../types';

export type GradientBarControlProps = {
	...ControlGeneralTypes,
	...ControlValueAddonTypes,
	/**
	 * It sets the control default value if the value not provided.
	 * By using it the control will not fire onChange event for
	 * this default value on control first render.
	 */
	defaultValue?: string,
	/**
	 * Height of the gradient bar.
	 *
	 * @default "30"
	 */
	height?: number | string,
};
