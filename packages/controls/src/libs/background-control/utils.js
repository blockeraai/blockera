// @flow
/**
 * Publisher dependencies
 */
import {
	getValueAddonRealValue,
	isValid as isValidVariable,
} from '@publisher/hooks';
import { isObject } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { TDefaultRepeaterItemValue } from './types';

export function getBackgroundItemBGProperty(
	item: TDefaultRepeaterItemValue
): string {
	let gradient = '';
	let isValueAddon = false;

	switch (item.type) {
		case 'image':
			if (!item.image) {
				return '';
			}

			// Image
			return item.image;

		case 'linear-gradient':
			if (!item['linear-gradient']) {
				return '';
			}

			gradient = item['linear-gradient'];
			isValueAddon = false;

			if (isObject(gradient) && isValidVariable(gradient)) {
				gradient = getValueAddonRealValue(gradient);
				isValueAddon = true;
			}

			if (!isValueAddon) {
				gradient = gradient.replace(
					/linear-gradient\(\s*(.*?),/im,
					'linear-gradient(' + item['linear-gradient-angel'] + 'deg,'
				);

				if (item['linear-gradient-repeat'] === 'repeat') {
					gradient = gradient.replace(
						'linear-gradient(',
						'repeating-linear-gradient('
					);
				}
			}

			return gradient;

		case 'radial-gradient':
			if (!item['radial-gradient']) {
				return '';
			}

			gradient = item['radial-gradient'];
			isValueAddon = false;

			if (isObject(gradient) && isValidVariable(gradient)) {
				gradient = getValueAddonRealValue(gradient);
				isValueAddon = true;
			}

			if (!isValueAddon) {
				if (item['radial-gradient-repeat'] === 'repeat') {
					gradient = gradient.replace(
						'radial-gradient(',
						'repeating-radial-gradient('
					);
				}

				// Gradient Position
				if (
					item['radial-gradient-position']?.left &&
					item['radial-gradient-position']?.top
				) {
					gradient = gradient.replace(
						'gradient(',
						`gradient( circle at ${getValueAddonRealValue(
							item['radial-gradient-position'].left
						)} ${getValueAddonRealValue(
							item['radial-gradient-position'].top
						)}, `
					);
				}

				// Gradient Size
				if (item['radial-gradient-size']) {
					gradient = gradient.replace(
						'circle at ',
						`circle ${item['radial-gradient-size']} at `
					);
				}
			}

			return gradient;
	}

	return '';
}
