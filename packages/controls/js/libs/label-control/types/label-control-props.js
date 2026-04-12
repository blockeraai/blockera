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
	/**
	 * Control sub-field id (e.g. InputControl `id`) for changeset graph preview when the
	 * attribute value is an object — pick this key before rendering.
	 */
	controlFieldId?: string | null,
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
	/**
	 * Optional changeset graph preview config for advanced labels (from PHP `changesetGraphPreview`
	 * or per-control override). When set, overrides shared attribute metadata for this label.
	 */
	changesetGraphPreview?: Object,
	/**
	 * Custom changeset graph preview: receives the resolved value (after path / object pick) and
	 * returns a React node, string, or number. Return null/undefined/'' to fall back to
	 * `changesetGraphPreview.type` when that is also set.
	 */
	changesetGraphPreviewRender?: (value: mixed) => mixed,
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
