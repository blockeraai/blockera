// @flow

/**
 * Blockera dependencies
 */
import { getVariable } from '@blockera/data/js/variables/get-variable';

/**
 * Internal dependencies
 */
import { isObject, isUndefined } from '../is';

export function isValid(value: any): boolean {
	//$FlowFixMe
	return !!value?.isValueAddon;
}

export function getValueAddonRealValue(value: any): any {
	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'string') {
		return value.endsWith('func') ? value.slice(0, -4) : value;
	}

	if (isObject(value)) {
		if (value?.isValueAddon) {
			const variable = getVariable(
				value?.settings?.type,
				value?.settings?.id
			);

			//
			// use current saved value if variable was not found
			//
			if (
				isUndefined(variable?.value) &&
				!isUndefined(value.settings.value) &&
				value.settings.value !== ''
			) {
				return value.settings.value;
			}

			if (
				isUndefined(value?.settings?.var) ||
				value?.settings?.var === ''
			) {
				return '';
			}

			return `var(${value?.settings?.var})`;
		}

		return ''; // return empty string because there is no real string value
	}

	//$FlowFixMe
	return value;
}
