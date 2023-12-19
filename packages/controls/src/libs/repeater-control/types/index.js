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
	withoutAdvancedLabel?: boolean,
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
	getDynamicDefaultRepeaterItem?: (
		itemsCount: number,
		defaultRepeaterItemValue: Object
	) => Object,
	onSelect?: (event: MouseEvent, item: Object) => boolean,
	overrideItem?: (item: Object) => Object,
	repeaterItemOpener?: (props: Object) => boolean | MixedElement,
	valueCleanup?: (any | Array<Object>) => any | Array<Object>,
};

export type TRepeaterDefaultStateProps = {
	...RepeaterControlProps,
	controlId?: ID,
	repeaterItems?: Array<Object>,
	repeaterId?: ID,
	customProps?: Object,
	onSelect?: (event: MouseEvent, item: Object) => boolean,
	overrideItem?: (item: Object) => Object,
	getControlPath: (controlID: string, childControlId: string) => string,
	repeaterItemOpener?: (props: Object) => boolean | MixedElement,
	popoverTitle: string | MixedElement,
};

export type RepeaterItemProps = {
	item: Object,
	itemId: number,
};
