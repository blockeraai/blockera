// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type BoxSpacingLock = 'none' | 'simple' | 'expanded';

type BoxSpacingSideDisable = 'none' | 'vertical' | 'horizontal' | 'all';

export type TDefaultValue = {
	margin: {
		top: string,
		right: string,
		bottom: string,
		left: string,
	},
	padding: {
		top: string,
		right: string,
		bottom: string,
		left: string,
	},
};

export type BoxSpacingControlProps = {
	...ControlGeneralTypes,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue?: TDefaultValue,
	/**
	 * Specifies which side is open by default.
	 *
	 * @default ``
	 */
	marginLock: BoxSpacingLock,
	paddingLock: BoxSpacingLock,
	paddingDisable?: BoxSpacingSideDisable,
	marginDisable?: BoxSpacingSideDisable,
};

export type InputProps = {
	/**
	 * Reset value of side to default value
	 */
	resetToDefault: () => void,
	id: string,
	unitType?: 'margin' | 'padding',
	onChange: (data: Object) => void,
	defaultValue: Object,
	inputLabel?: string | MixedElement,
	inputLabelDescription?: string | MixedElement,
	inputLabelPopoverTitle?: string | MixedElement,
	className?: string,
};
