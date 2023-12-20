// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

type BoxSpacingLock =
	| 'none'
	| 'vertical'
	| 'horizontal'
	| 'all'
	| 'vertical-horizontal';

type BoxSpacingSideDisable = 'none' | 'vertical' | 'horizontal' | 'all';

type TDefaultValue = {
	margin: {
		top: string,
		right: string,
		bottom: string,
		left: string,
	},
	marginLock: BoxSpacingLock,
	padding: {
		top: string,
		right: string,
		bottom: string,
		left: string,
	},
	paddingLock: BoxSpacingLock,
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
	openSide?: 'top' | 'right' | 'bottom' | 'left' | '',
	paddingDisable: BoxSpacingSideDisable,
	marginDisable: BoxSpacingSideDisable,
};

export type SidePopoverProps = {
	id: string,
	title: string,
	icon: MixedElement | string,
	isOpen: boolean,
	type?: 'margin' | 'padding',
	unit: string,
	offset?: number,
	onClose: () => void,
	onChange: (data: string) => string | void,
	defaultValue?: TDefaultValue,
};
