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
	/**
	 * It specifies the design of repeater control.
	 */
	design?: 'minimal',
	/**
	 * Specifies that repeater item should use popover or accordion
	 *
	 * @default true
	 */
	mode?: GroupControlMode,
	withoutAdvancedLabel?: boolean,
	/**
	 * Specifies the popover title if `mode` was `popover`. by default the repeater label will be shown as popover title.
	 */
	popoverTitle?: string | MixedElement,
	addNewButtonLabel?: string,
	/**
	 * Specifies custom css classes that should be added to popover
	 *
	 * @default true
	 */
	popoverClassName?: string,
	/**
	 * Specifies maximum number of repeater items. -1 means unlimited.
	 *
	 * @default -1
	 */
	maxItems?: number,
	/**
	 * Specifies minimum number of repeater items.
	 *
	 * @default 0
	 */
	minItems?: number,
	/**
	 * Specifies the add button should be shown for repeater items.
	 *
	 * @default true
	 */
	actionButtonAdd?: boolean,
	/**
	 * Specifies the visibility or activation control should be shown for repeater items.
	 *
	 * @default true
	 */
	actionButtonVisibility?: boolean,
	/**
	 * Specifies delete or remove control should be shown for repeater items.
	 *
	 * @default true
	 */
	actionButtonDelete?: boolean,
	/**
	 * Specifies clone or copy control should be shown for repeater items.
	 *
	 * @default true
	 */
	actionButtonClone?: boolean,
	/**
	 * A placeholder that you can use inject items at the beginning of header buttons.
	 */
	injectHeaderButtonsStart?: MixedElement | null | string,
	/**
	 * A placeholder that you can use inject items after header buttons.
	 */
	injectHeaderButtonsEnd?: MixedElement | null | string,
	/**
	 * Header component for each repeater item
	 */
	repeaterItemHeader?: MixedElement | any,
	/**
	 * Children components for each repeater item
	 */
	repeaterItemChildren?: MixedElement | any,
	/**
	 * It sets the default value of repeater. Please note for defining the value of repeater items you have to use `defaultRepeaterItemValue`
	 */
	defaultValue?: Array<Object> | [],
	/**
	 * It sets the default of each repeater item.
	 */
	defaultRepeaterItemValue?: Object,
	/**
	 * The callback to retrieve dynamic default repeater item.
	 */
	getDynamicDefaultRepeaterItem?: (
		itemsCount: number,
		defaultRepeaterItemValue: Object
	) => Object,
	onSelect?: (event: MouseEvent, item: Object) => boolean,
	/**
	 * The override repeater item before modify current item.
	 */
	overrideItem?: (item: Object) => Object,
	/**
	 * The repeater item popover panel opener component.
	 */
	repeaterItemOpener?: (props: Object) => boolean | MixedElement,
	/**
	 * Function that runs before firing onChange. You can use it cleanup values
	 */
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
