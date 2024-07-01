// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type TSearchControlProps = {
	...ControlGeneralTypes,
	/**
	 * A placeholder for the input.
	 */
	placeholder?: string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue?: string,
};
