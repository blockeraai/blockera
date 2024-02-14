// @flow

/**
 * Publisher dependencies
 */
import { isEmpty, isUndefined } from '@publisher/utils';
import {
	getColorValueAddonFromVarString,
	isValid,
} from '@publisher/hooks/src/use-value-addon/helpers';

export const linkInnerBlockSupportedBlocks = ['core/paragraph'];

export function linkFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	//
	// Normal color
	//
	if (attributes?.style?.elements?.link?.color?.text !== undefined) {
		const color = getColorValueAddonFromVarString(
			attributes?.style?.elements?.link?.color?.text
		);

		if (attributes.publisherInnerBlocks?.link !== undefined) {
			attributes.publisherInnerBlocks.link.attributes.publisherFontColor =
				color;
		} else {
			attributes.publisherInnerBlocks = {
				link: {
					attributes: {
						publisherFontColor: color,
					},
				},
			};
		}
	}

	// todo add support for hover

	return attributes;
}

export function linkToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue)
	) {
		return {
			style: {
				elements: {
					color: undefined,
				},
			},
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		return {
			style: {
				elements: {
					color: {
						text: 'var:preset|color|' + newValue?.settings?.id,
					},
				},
			},
		};
	}

	return {
		style: {
			elements: {
				color: {
					text: newValue,
				},
			},
		},
	};
}
