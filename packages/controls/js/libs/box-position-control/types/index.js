// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types';
import type { MixedElement } from 'react';

export type PositionType =
	| 'static'
	| 'relative'
	| 'absolute'
	| 'sticky'
	| 'fixed';

export type PositionControlValue = {
	type: PositionType,
	position: {
		top: string,
		right: string,
		bottom: string,
		left: string,
	},
};

export type BoxPositionControlProps = {
	...RepeaterControlProps,
	defaultValue?: PositionControlValue,
	/**
	 * Specifies which side is open by default.
	 *
	 * @default ``
	 */
	openSide?: Side,
};

export type SideShapeProps = {
	...Object,
	shape?: string,
	className?: string | Array<string>,
};

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type OpenPopover = Side | 'variable-picker' | '';

export type SideProps = {
	side: Side,
	id?: string,
	getId: (?string, ?string) => string,
	//
	value: PositionControlValue,
	setValue: (Object) => void,
	attribute: string,
	blockName: string,
	defaultValue: any,
	resetToDefault: () => void,
	getControlPath: (controlID: string, childControlId: string) => string,
	//
	focusSide: Side | '',
	setFocusSide: (side: Side | '') => void,
	openPopover: OpenPopover,
	setOpenPopover: (side: OpenPopover) => void,
	popoverOffset?: number,
};

export type SideReturn = {
	shape: MixedElement,
	label: MixedElement,
};
