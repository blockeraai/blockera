//@flow

/**
 * External dependencies
 */
import { library } from '@fortawesome/fontawesome-svg-core';
import * as freeIcons from '@fortawesome/free-solid-svg-icons';

library.add(freeIcons.fas);

/**
 * Internal dependencies
 */
import { getIconKebabId } from '../helpers';

const FaSolidIcons: Object = Object.fromEntries(
	Object.entries({
		...freeIcons,
	})
		.map(([key, value]) => {
			let newKey = getIconKebabId(key);

			switch (newKey) {
				case 'fa-5-0-0px':
					newKey = '500px';
					break;

				case 'fa-dice-d-2-0':
					newKey = 'dice-d20';
					break;

				case 'fa-dice-d-6':
					newKey = 'dice-d6';
					break;

				case 'fa-stopwatch-2-0':
					newKey = 'stopwatch-20';
					break;

				case 'fa-1-1ty':
					newKey = '11ty';
					break;

				case 'fa-4-2-group':
					newKey = '42-group';
					break;

				case 'fa-css-3':
					newKey = 'css3';
					break;

				case 'fa-css-3-alt':
					newKey = 'css3-alt';
					break;

				case 'fa-html-5':
					newKey = 'html5';
					break;

				case 'fa-draft-2digital':
					newKey = 'draft2digital';
					break;

				case 'fa-ns-8':
					newKey = 'ns8';
					break;

				case 'fa-page-4':
					newKey = 'page4';
					break;

				case 'fa-typo-3':
					newKey = 'typo3';
					break;

				case 'fa-w-3c':
					newKey = 'w3c';
					break;

				default:
					break;
			}

			return [newKey, value];
		})
		.filter(([key]) => {
			return !['fas'].includes(key);
		})
);

export { FaSolidIcons };
