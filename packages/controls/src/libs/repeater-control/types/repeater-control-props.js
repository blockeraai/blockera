// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

type ID = string | number;

export type TRepeaterControlProps = {
	design: 'minimal',
	mode: 'popover' | 'accordion',
	popoverLabel?: string,
	popoverClassName?: string,
	maxItems?: number,
	minItems?: number,
	actionButtonAdd?: Boolean | true,
	actionButtonVisibility?: Boolean | true,
	actionButtonDelete?: Boolean | true,
	actionButtonClone?: Boolean | true,
	injectHeaderButtonsStart?: MixedElement,
	injectHeaderButtonsEnd?: MixedElement,
	//
	label?: string,
	id?: ID,
	repeaterItemHeader?: MixedElement,
	repeaterItemChildren?: MixedElement,
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
	popoverLabel: string,
};
