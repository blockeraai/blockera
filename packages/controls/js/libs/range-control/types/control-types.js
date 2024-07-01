// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type TValueCleanup = string | number;

export type TRangeControlProps = {
	...ControlGeneralTypes,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue?: number | string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: (number | string) => number | string,
	/**
	 * The minimum `value` allowed.
	 */
	min?: number,
	/**
	 * The maximum `value` allowed.
	 */
	max?: number,
	/**
	 * Passed as a prop to the `NumberControl` component and is only
	 * applicable if `withInputField` and `isShiftStepEnabled` are both true
	 * and while the number input has focus. Acts as a multiplier of `step`.
	 */
	withInputField?: boolean,
	disabled?: boolean,
	/**
	 * The slider starting position, used when no `value` is passed.
	 * The `initialPosition` will be clamped between the provided `min`
	 * and `max` prop values.
	 */
	initialPosition?: number,
	/**
	 * if when sideEffect is true calling setValue to modify value of context provider,
	 * else just calling onChange handler!
	 *
	 * @default true
	 */
	sideEffect?: boolean,
	className?: string,
};
