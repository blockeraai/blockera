//@flow

/**
 * External dependencies
 */
import * as _rawIcons from '@wordpress/icons';

const WPIcons: Object = Object.fromEntries(
	Object.entries(_rawIcons)
		.map(([key, value]: [string, any]) => [
			key
				.replace(/([a-z])([A-Z])/g, '$1-$2')
				.replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
				.toLowerCase(),
			value,
		])
		.filter(([key]) => key !== 'icon')
);

export { WPIcons };
