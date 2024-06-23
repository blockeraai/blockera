// @flow

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type AnglePickerControlProps = {
	...ControlGeneralTypes,
	/**
	 * Sets the rotate buttons to be available or not.
	 */
	rotateButtons?: boolean,
};
