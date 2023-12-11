// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	getThemeColors,
	getFontSizes,
	getLinearGradients,
	getRadialGradients,
	getSpacings,
	getWidthSizes,
} from '@publisher/core-data';
import { ColorIndicator } from '@publisher/components';
import { isBlockTheme } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { ValueAddon, VariableItems } from './types/value-addon';
import type { VariableTypes } from './types';
import VarTypeFontSizeIcon from './icons/var-font-size';
import VarTypeSpacingIcon from './icons/var-spacing';
import VarTypeWidthSizeIcon from './icons/var-width-size';

// todo improve and write tests
export const isValid = ({ isValueAddon = false }: ValueAddon): boolean => {
	return isValueAddon;
};

export function getValueAddonRealValue(value: ValueAddon | string): string {
	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'string') {
		return value.endsWith('func') ? value.slice(0, -4) : value;
	}

	// todo write real data implementation for variable

	//$FlowFixMe
	return value;
}

// todo write tests
export function getVariableIcon({
	type,
	value,
}: {
	type: string,
	value?: string,
}): MixedElement {
	switch (type) {
		case 'font-size':
			return <VarTypeFontSizeIcon />;

		case 'radial-gradient':
		case 'linear-gradient':
			if (value !== '') {
				return <ColorIndicator type="gradient" value={value} />;
			}
			break;

		case 'theme-color':
			return <ColorIndicator type="color" value={value} />;

		case 'spacing':
			return <VarTypeSpacingIcon />;

		case 'width-size':
			return <VarTypeWidthSizeIcon />;
	}

	return '';
}

// todo write tests
export function getVariables(type: VariableTypes): VariableItems {
	switch (type) {
		case 'font-size':
			return {
				name: isBlockTheme()
					? __('Theme Font Sizes', 'publisher-core')
					: __('Font Sizes', 'publisher-core'),
				variables: getFontSizes(),
			};

		case 'linear-gradient':
			return {
				name: isBlockTheme()
					? __('Theme Linear Gradients', 'publisher-core')
					: __('Linear Gradients', 'publisher-core'),
				variables: getLinearGradients(),
			};

		case 'radial-gradient':
			return {
				name: isBlockTheme()
					? __('Theme Radial Gradients', 'publisher-core')
					: __('Radial Gradients', 'publisher-core'),
				variables: getRadialGradients(),
			};

		case 'width-size':
			return {
				name: isBlockTheme()
					? __('Theme Width Sizes', 'publisher-core')
					: __('Width Sizes', 'publisher-core'),
				variables: getWidthSizes(),
			};

		case 'spacing':
			return {
				name: isBlockTheme()
					? __('Theme Spacing Sizes', 'publisher-core')
					: __('Spacing Sizes', 'publisher-core'),
				variables: getSpacings(),
			};

		case 'theme-color':
			return {
				name: __('Theme Colors', 'publisher-core'),
				variables: getThemeColors(),
			};
	}

	return {
		name: '',
		variables: [],
		notFound: true,
	};
}
