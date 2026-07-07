// @flow

/**
 * Internal dependencies
 */
import type {
	ControlGeneralTypes,
	ControlValueAddonTypes,
} from '../../../types';

export type BoxBorderControlProps = {
	...ControlGeneralTypes,
	...ControlValueAddonTypes,
	/**
	 * When true, does not pass variable / value-addon support to inner
	 * `BorderControl` instances (`controlAddonTypes`, `variableTypes`).
	 */
	withoutValueAddons?: boolean,
	/**
	 * When false, hides the lock / unlock control that switches between linked
	 * (`all`) and per-side (`custom`) borders (e.g. global style presets).
	 *
	 * @default true
	 */
	showLinkedSidesToggle?: boolean,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue?: TValueTypes,
};

export type TValueTypes = {
	type: 'all' | 'custom',
	all?: {
		width: string,
		style: string,
		color: string,
	},
	left?: {
		width: string,
		style: string,
		color: string,
	},
	right?: {
		width: string,
		style: string,
		color: string,
	},
	top?: {
		width: string,
		style: string,
		color: string,
	},
	bottom?: {
		width: string,
		style: string,
		color: string,
	},
};
