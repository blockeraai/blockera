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
				case 'fa-dice-d-2-0':
					newKey = 'fa-dice-d20';
					break;

				case 'fa-dice-d-6':
					newKey = 'fa-dice-d6';
					break;

				case 'fa-stopwatch-2-0':
					newKey = 'fa-stopwatch-20';
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
