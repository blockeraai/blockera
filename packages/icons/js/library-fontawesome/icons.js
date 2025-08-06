//@flow

/**
 * External dependencies
 */
import { library } from '@fortawesome/fontawesome-svg-core';
import * as freeIcons from '@fortawesome/free-solid-svg-icons';
import * as freeBrandsIcons from '@fortawesome/free-brands-svg-icons';
import * as freeRegularIcons from '@fortawesome/free-regular-svg-icons';

library.add(freeIcons.fas, freeBrandsIcons.fab, freeRegularIcons.far);

/**
 * Internal dependencies
 */
import { getIconKebabId } from '../helpers';

const FaIcons: Object = Object.fromEntries(
	Object.entries({
		...freeIcons,
		...freeBrandsIcons,
		...freeRegularIcons,
	})
		.map(([key, value]) => [getIconKebabId(key), value])
		.filter(([key]) => key !== 'icon')
);

export { FaIcons };
