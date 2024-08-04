// @flow

/**
 * Internal dependencies
 */
import { getValueAddonRealValue, isValid as isValidVariable } from '../../';
import type { TDefaultRepeaterItemValue } from './types';

export function getBackgroundItemBGProperty(
	item: TDefaultRepeaterItemValue
): string {
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

			let lGradient = item['linear-gradient'];

			if (isValidVariable(lGradient)) {
				lGradient = getValueAddonRealValue(lGradient);
			} else {
				lGradient = lGradient.replace(
					/linear-gradient\(\s*(.*?),/im,
					'linear-gradient(' + item['linear-gradient-angel'] + 'deg,'
				);

				if (item['linear-gradient-repeat'] === 'repeat') {
					lGradient = lGradient.replace(
						'linear-gradient(',
						'repeating-linear-gradient('
					);
				}
			}

			return lGradient;

		case 'radial-gradient':
			if (!item['radial-gradient']) {
				return '';
			}

			let rGradient = item['radial-gradient'];

			if (isValidVariable(rGradient)) {
				rGradient = getValueAddonRealValue(rGradient);
			} else {
				if (item['radial-gradient-repeat'] === 'repeat') {
					rGradient = rGradient.replace(
						'radial-gradient(',
						'repeating-radial-gradient('
					);
				}

				// Gradient Position
				if (
					item['radial-gradient-position']?.left &&
					item['radial-gradient-position']?.top
				) {
					rGradient = rGradient.replace(
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
					rGradient = rGradient.replace(
						'circle at ',
						`circle ${item['radial-gradient-size']} at `
					);
				}
			}

			return rGradient;
	}

	return '';
}
