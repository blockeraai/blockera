// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import type { ControlGeneralTypes } from '../../../types';

export type LabelControlProps = {
	...ControlGeneralTypes,
	value?: any,
	blockName?: string,
	attribute?: string,
	ariaLabel?: string,
	path?: string | null,
	repeaterItem?: number,
	singularId?: string | null,
	mode?: 'advanced' | 'simple' | 'none',
	isRepeater?: void | boolean,
	onClick?: (event: MouseEvent) => void,
	resetToDefault?: (args?: {
		attributes?: Object,
		isRepeater: boolean | void,
		repeaterItem?: number,
		path?: null | string,
		propId?: string | null,
		action?: string,
		attribute?: string,
		onChange?: (newValue: any) => void,
		valueCleanup?: (newValue: any) => any,
	}) => any,
	offset?: number,
	iconPosition?: 'start' | 'end',
};

export type SimpleLabelControlProps = {
	...Object,
	label?: string,
	className?: string,
	labelClassName?: string, // used to pass additional classes to the label control from parent component like BaseControl
	ariaLabel?: string,
	labelDescription?: string | MixedElement,
	advancedIsOpen?: boolean,
	iconPosition?: 'start' | 'end',
};
