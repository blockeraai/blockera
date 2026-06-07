// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { encodeCustomSvgIcon } from './icon-attribute-utils';

/**
 * Default upload-SVG handler for the icon extension when no block-specific override exists.
 */
export const registerIconUploadSvgHandler = (): void => {
	addFilter(
		'blockera.featureIcon.extension.uploadSVG.onChangeHandler',
		'blockera.featureIcon.extension.uploadSVG.defaultHandler',
		(payload) => {
			if (!payload || typeof payload !== 'object') {
				return payload;
			}

			const { ref, newValue, effectiveItems, handleOnChangeAttributes } =
				payload;

			if (!newValue?.svgString || !handleOnChangeAttributes) {
				return payload;
			}

			// Preserve custom SVG markup exactly; only encode for storage/transport.
			const renderedIcon = encodeCustomSvgIcon(newValue.svgString);

			handleOnChangeAttributes(
				'blockeraIcon',
				{
					...newValue,
					renderedIcon: renderedIcon.encodedIcon,
				},
				{
					ref,
					effectiveItems,
				}
			);

			return payload;
		}
	);
};
