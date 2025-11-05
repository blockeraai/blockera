// @flow

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromVarString } from '@blockera/data';

export function backgroundColorFromWPCompatibility({
	attributes,
	blockAttributes,
}: {
	attributes: Object,
	blockAttributes: Object,
}): Object {
	if (
		!isEquals(
			attributes?.blockeraBackgroundColor,
			blockAttributes.blockeraBackgroundColor.default
		)
	) {
		return attributes;
	}

	// backgroundColor attribute in root always is variable
	// it should be changed to a Value Addon (variable)
	if (attributes?.backgroundColor) {
		attributes.blockeraBackgroundColor = {
			value: getColorVAFromVarString(
				`var:preset|color|${attributes?.backgroundColor}`
			),
		};
	}
	// style.color.background is not variable
	else if (attributes?.style?.color?.background) {
		attributes.blockeraBackgroundColor = {
			value: attributes?.style?.color?.background,
		};
	}

	return attributes;
}

export function backgroundColorToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return {
			backgroundColor: undefined,
			style: {
				color: {
					background: undefined,
				},
			},
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		return {
			backgroundColor: newValue?.settings?.id,
			style: {
				color: {
					background: undefined,
				},
			},
		};
	}

	return {
		backgroundColor: undefined,
		style: {
			color: {
				background: newValue,
			},
		},
	};
}
