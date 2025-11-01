// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type CheckboxControlProps = {
	...ControlGeneralTypes,
	/**
	 * Label for checkbox.
	 *
	 * @default ""
	 */
	checkboxLabel: string | MixedElement,
	/**
	 * Whether to make the checkbox label bold.
	 *
	 * @default false
	 */
	isBold?: boolean,
};
