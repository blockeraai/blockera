// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type TValueCleanup = string | number;

export type TRangeControlProps = {
	...ControlGeneralTypes,
	defaultValue?: number | string,
	onChange: (number | string) => number | string,
	min?: number,
	max?: number,
	withInputField?: boolean,
	disabled?: boolean,
	initialPosition?: number,
	sideEffect?: boolean,
	className?: string,
};
