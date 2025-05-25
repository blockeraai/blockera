// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type BoxSpacingLock =
	| 'none'
	| 'vertical'
	| 'horizontal'
	| 'all'
	| 'vertical-horizontal';

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
	openSide?: 'top' | 'right' | 'bottom' | 'left' | '',
	marginLock: BoxSpacingLock,
	paddingLock: BoxSpacingLock,
	paddingDisable?: BoxSpacingSideDisable,
	marginDisable?: BoxSpacingSideDisable,
};

export type SidePopoverProps = {
	/**
	 * side has value or not
	 */
	hasValue: any,
	/**
	 * Reset value of side to default value
	 */
	resetToDefault: () => void,
	id: string,
	title: string,
	icon: MixedElement | string,
	isOpen: boolean,
	type?: 'margin' | 'padding',
	unit?: string,
	offset?: number,
	onClose: () => void,
	onChange: (data: Object) => void,
	defaultValue: Object,
	inputLabel?: string | MixedElement,
	inputLabelDescription?: string | MixedElement,
	inputLabelPopoverTitle?: string | MixedElement,
};

export type Side =
	| ''
	| 'margin-all'
	| 'margin-vertical'
	| 'margin-horizontal'
	| 'margin-top'
	| 'margin-right'
	| 'margin-bottom'
	| 'margin-left'
	| 'padding-all'
	| 'padding-vertical'
	| 'padding-horizontal'
	| 'padding-top'
	| 'padding-right'
	| 'padding-bottom'
	| 'padding-left';

export type OpenPopover = Side | 'variable-picker';

export type SideProps = {
	id?: string,
	getId: (?string, ?string) => string,
	//
	value: TDefaultValue,
	setValue: (Object) => void,
	attribute: string,
	blockName: string,
	defaultValue: any,
	resetToDefault: () => void,
	getControlPath: (controlID: string, childControlId: string) => string,
	//
	focusSide: Side,
	setFocusSide: (side: Side) => void,
	openPopover: OpenPopover,
	setOpenPopover: (side: OpenPopover) => void,
	paddingDisable: BoxSpacingSideDisable,
	marginDisable: BoxSpacingSideDisable,
	setControlClassName: (string) => void,
	marginLock: BoxSpacingLock,
	setMarginLock: (side: Side) => void,
	paddingLock: BoxSpacingLock,
	setPaddingLock: (side: Side) => void,
};

export type SideReturn = {
	shape: MixedElement,
	label: MixedElement,
};

export type SideShapeProps = {
	...Object,
	shape?: string,
	className?: string | Array<string>,
};
