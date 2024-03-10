// @flow

/**
 * External dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';

export const createAreasOptions = (areas: Array<Object>): Array<Object> => {
	const options = areas
		.map((area) => {
			return {
				value: `${area['column-start']}/${area['column-end']}/${area['row-start']}/${area['row-end']}`,
				label: sprintf(
					// translators: %s is area name
					__('%s ', 'publisher-core'),
					area.name
				),
			};
		})
		.filter((item) => item !== null);

	return [
		{
			value: ``,
			label: __('', 'publisher-core'),
		},
		...options,
	];
};
