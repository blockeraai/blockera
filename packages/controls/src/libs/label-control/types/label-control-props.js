// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type LabelControlProps = {
	value?: any,
	label?: string,
	defaultValue?: any,
	blockName?: string,
	attribute?: string,
	className?: string,
	ariaLabel?: string,
	path?: string | null,
	popoverTitle?: string,
	repeaterItem?: number,
	fieldId?: string | null,
	mode?: 'advanced' | 'simple',
	isRepeater?: boolean,
	description?: string | MixedElement,
	onClick?: (event: MouseEvent) => void,
	resetToDefault?: (args?: {
		attributes?: Object,
		isRepeater: boolean,
		path?: null | string,
		propId?: string | null,
	}) => any,
};
