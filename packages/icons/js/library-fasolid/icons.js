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
			let newKey = getIconKebabId(key).replace('fa-', '');

			switch (newKey) {
				case 'dice-d-2-0':
					newKey = 'dice-d20';
					break;

				case 'dice-d-6':
					newKey = 'dice-d6';
					break;

				case 'stopwatch-2-0':
					newKey = 'stopwatch-20';
					break;

				default:
					break;
			}

			return [newKey, value];
		})
		.filter(([key]) => {
			return !['fas', 'prefix'].includes(key) && !key.endsWith('-alt');
		})
);

export { FaSolidIcons };
