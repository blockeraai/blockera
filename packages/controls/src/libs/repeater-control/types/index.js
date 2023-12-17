// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';
import type { GroupControlMode } from '../../group-control/types';

export type RepeaterItemActionsProps = {
	item: Object,
	itemId: number,
	isVisible: boolean,
	setVisibility: (state: boolean) => void,
};

type ID = string | number;

export type RepeaterControlProps = {
	...Object,
	...ControlGeneralTypes,
	design?: 'minimal',
	mode?: GroupControlMode,
	popoverTitle?: string | MixedElement,
	addNewButtonLabel?: string,
	popoverClassName?: string,
	maxItems?: number,
	minItems?: number,
	actionButtonAdd?: boolean,
	actionButtonVisibility?: boolean,
	actionButtonDelete?: boolean,
	actionButtonClone?: boolean,
	injectHeaderButtonsStart?: MixedElement | null | string,
	injectHeaderButtonsEnd?: MixedElement | null | string,
	//
	repeaterItemHeader?: MixedElement | any,
	repeaterItemChildren?: MixedElement | any,
	//
	defaultValue?: Array<Object> | [],
	defaultRepeaterItemValue?: Object,
	valueCleanup?: (any | Array<Object>) => any | Array<Object>,
};

export type TRepeaterDefaultStateProps = {
	...RepeaterControlProps,
	controlId?: ID,
	repeaterItems?: Array<Object>,
	repeaterId?: ID,
	customProps?: Object,
	popoverTitle: string | MixedElement,
};

export type RepeaterItemProps = {
	item: Object,
	itemId: number,
};
