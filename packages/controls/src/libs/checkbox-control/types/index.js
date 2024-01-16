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
	checkboxLabel: string | MixedElement,
};
