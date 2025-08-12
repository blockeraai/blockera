//@flow

/**
 * External dependencies
 */
import { library } from '@fortawesome/fontawesome-svg-core';
import * as freeRegularIcons from '@fortawesome/free-regular-svg-icons';

library.add(freeRegularIcons.far);

/**
 * Internal dependencies
 */
import { getIconKebabId } from '../helpers';

const FaRegularIcons: Object = Object.fromEntries(
	Object.entries({
		...freeRegularIcons,
	})
		.map(([key, value]) => {
			return [getIconKebabId(key), value];
		})
		.filter(([key]) => {
			return !['far', 'prefix'].includes(key);
		})
);

export { FaRegularIcons };
