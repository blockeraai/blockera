// @flow

/**
 * External dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';

export const createAreasOptions = (areas: Array<Object>): Array<Object> => {
	return areas
		.map((area) => {
			return {
				value: area.name,
				label: sprintf(
					// translators: %s is icon ID in icon libraries for example arrow-left
					__('%s ', 'publisher-core'),
					area.name
				),
			};
		})
		.filter((item) => item !== null);
};
