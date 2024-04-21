// @flow
/**
 * External Dependencies
 */
import type { MixedElement } from 'react';

/**
 *  Dependencies
 */
import type { VariableCategory, DynamicValueTypes } from '@blockera/core-data';

export type ControlSize = 'normal' | 'input' | 'small' | 'extra-small';

export type ControlGeneralTypes = {
	id?: string,
	/**
	 * This is the singular id of control that is being used in repeater for
	 * advanced usages like resetting value
	 */
	singularId?: string,
	controlName?: string,
	children?: any,
	className?: string,
	field?: string,
	fieldId?: string,
	repeaterItem?: number,
	//
	label?: any,
	labelPopoverTitle?: string | MixedElement,
	labelDescription?: string | MixedElement,
	columns?: string,
	style?: Object,
	//
	defaultValue?: string | number | Object,
	onChange?: (data: any) => void,
	valueCleanup?: (data: any) => void,
	//
	'data-test'?: string,
	'aria-label'?: string,
};

export type ControlValueAddonTypes = {
	controlAddonTypes?: Array<string>,
	variableTypes?: Array<VariableCategory>,
	dynamicValueTypes?: Array<DynamicValueTypes>,
};
