// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type TTextAreaItem = {
	...ControlGeneralTypes,
	disabled?: boolean,
	height?: number,
};
