// @flow

/**
 * Internal dependencies
 */
import * as _rawIcons from './icons/index';

const BlockeraUIIcons: Object = Object.fromEntries(
	Object.entries(_rawIcons).map(([key, value]) => [
		key
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
			.replace(/([a-zA-Z])([0-9])/g, '$1-$2')
			.toLowerCase(),
		value,
	])
);

export { BlockeraUIIcons };
