//@flow

/**
 * External dependencies
 */
import * as _rawIcons from '@wordpress/icons';
import { getIconKebabId } from '../helpers';

const WPIcons: Object = Object.fromEntries(
	Object.entries(_rawIcons)
		.map(([key, value]) => [getIconKebabId(key), value])
		.filter(([key]) => key !== 'icon')
);

export { WPIcons };
