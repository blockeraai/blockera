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
	defaultValue?: string,
	height?: number | string,
};
