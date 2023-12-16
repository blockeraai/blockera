// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

type TDefaultValue = {
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
	defaultValue?: TDefaultValue,
	openSide?: 'top' | 'right' | 'bottom' | 'left' | '',
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
	defaultValue?: string,
};
