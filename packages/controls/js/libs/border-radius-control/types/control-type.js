// @flow
/**
 * Internal dependencies
 */
import type {
	ControlGeneralTypes,
	ControlValueAddonTypes,
} from '../../../types';

export type BorderRadiusValue = {
	type: 'all' | 'custom',
	all?: string,
	topLeft?: string,
	topRight?: string,
	bottomLeft?: string,
	bottomRight?: string,
};

export type BorderRadiusControlProps = {
	...ControlGeneralTypes,
	...ControlValueAddonTypes,
	/**
	 * When true, does not pass variable / value-addon support to inner
	 * `InputControl` instances (`controlAddonTypes`, `variableTypes`).
	 */
	withoutValueAddons?: boolean,
	/**
	 * When false, hides the lock / unlock control that switches between linked
	 * (`all`) and per-corner (`custom`) radius (e.g. global style presets).
	 *
	 * @default true
	 */
	showLinkedSidesToggle?: boolean,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue?: BorderRadiusValue,
};
