// @flow
/**
 * External Dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera Dependencies
 */
import type { VariableCategory } from '@blockera/data';
import { type AddonTypes } from '@blockera/value-addons/js/types';

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
	controlAddonTypes?: AddonTypes,
	variableTypes?: Array<VariableCategory>,
};
