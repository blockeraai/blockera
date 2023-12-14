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
	actionButtonAdd?: boolean,
	actionButtonVisibility?: boolean,
	actionButtonDelete?: boolean,
	actionButtonClone?: boolean,
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
	popoverLabel: string,
};
