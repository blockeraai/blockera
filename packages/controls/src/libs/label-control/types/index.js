// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type LabelControlProps = {
	path?: string | null,
	mode?: 'simple' | 'advanced',
	label?: string,
	className?: string,
	ariaLabel?: string,
	description?: string | MixedElement,
	resetToDefault?: Object,
	onClick?: (event: MouseEvent) => void,
};

export type AdvancedLabelControlProps = {
	path?: string | null,
	label?: string,
	className?: string,
	ariaLabel?: string,
	description?: string | MixedElement,
	resetToDefault: Object,
	onClick?: (event: MouseEvent) => void,
};
