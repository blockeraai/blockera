// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

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

			const {
				ref,
				newValue,
				encodeIcon,
				effectiveItems,
				handleOnChangeAttributes,
			} = payload;

			if (
				!newValue?.svgString ||
				!encodeIcon ||
				!handleOnChangeAttributes
			) {
				return payload;
			}

			const color = !isUndefined(effectiveItems?.blockeraIconColor?.value)
				? effectiveItems?.blockeraIconColor?.value
				: undefined;

			const renderedIcon = encodeIcon(newValue.svgString, {
				hasInlineStyle: true,
				color,
			});

			handleOnChangeAttributes(
				'blockeraIcon',
				{
					...newValue,
					renderedIcon: renderedIcon.encodedIcon,
				},
				{ ref, effectiveItems }
			);

			return payload;
		}
	);
};
