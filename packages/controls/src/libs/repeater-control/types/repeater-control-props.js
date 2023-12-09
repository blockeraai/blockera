// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

type ID = string | number;

export type TRepeaterControlProps = {
	design: 'minimal',
	mode: 'popover' | 'accordion',
	popoverTitle?: string,
	addNewButtonLabel?: string,
	popoverClassName?: string,
	maxItems?: number,
	minItems?: number,
	actionButtonAdd?: boolean | true,
	actionButtonVisibility?: boolean | true,
	actionButtonDelete?: boolean | true,
	actionButtonClone?: boolean | true,
	injectHeaderButtonsStart?: MixedElement | null | string,
	injectHeaderButtonsEnd?: MixedElement | null | string,
	//
	label?: string,
	id?: ID,
	repeaterItemHeader?: MixedElement | any,
	repeaterItemChildren?: MixedElement | any,
	//
	defaultValue?: Array<Object> | [],
	defaultRepeaterItemValue?: Object,
	onChange?: () => any,
	valueCleanup?: () => any,
	//
	className?: string,
	props?: Object,
};

export type TRepeaterDefaultStateProps = {
	...TRepeaterControlProps,
	controlId?: ID,
	repeaterItems?: Array<mixed>,
	repeaterId?: ID,
	customProps?: Object,
	popoverTitle: string,
};
