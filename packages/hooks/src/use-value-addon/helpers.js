// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { getFontSizes, getGradients } from '@publisher/core-data';
import { ColorIndicator } from '@publisher/components';

/**
 * Internal dependencies
 */
import type { ValueAddon, VariableItems } from './types/value-addon';
import type { VariableTypes } from './types';
import VarTypeFontSizeIcon from './icons/var-font-size';

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
		case 'FONT_SIZE':
			return <VarTypeFontSizeIcon />;

		case 'GRADIENT':
			if (value !== '') {
				return <ColorIndicator type="gradient" value={value} />;
			}
	}

	return <></>;
}

// todo write tests
export function getVariables(type: VariableTypes): VariableItems {
	switch (type) {
		case 'FONT_SIZE':
			return {
				name: __('Font Size Variables', 'publisher-core'),
				variables: getFontSizes(),
			};

		case 'GRADIENT':
			return {
				name: __('Gradient Variables', 'publisher-core'),
				variables: getGradients(),
			};
	}

	return {
		name: '',
		variables: [],
	};
}
