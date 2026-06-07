// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import {
	encodeCustomSvgIcon,
	getBlockeraIconValue,
	isCustomUploadedIcon,
} from './icon-attribute-utils';

export const filterSetAttributes = () => {
	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.features.icon.setAttributes',
		(attributes, attributeId, newValue, ref, getAttributes) => {
			const blockeraIconValue =
				attributeId === 'blockeraIcon'
					? newValue
					: getBlockeraIconValue(getAttributes?.() ?? attributes);

			if (!blockeraIconValue) {
				return attributes;
			}

			const isCustomIcon = isCustomUploadedIcon(blockeraIconValue);

			// Custom SVGs must not be stroke/fill-normalized or restyled on upload.
			if (isCustomIcon) {
				if (attributeId === 'blockeraIcon' && newValue?.svgString) {
					attributes.blockeraIcon = {
						value: {
							...newValue,
							renderedIcon:
								newValue.renderedIcon ||
								encodeCustomSvgIcon(newValue.svgString)
									.encodedIcon,
						},
					};
				}

				return attributes;
			}

			return attributes;
		}
	);
};
