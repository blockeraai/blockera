// @flow

/**
 * Publisher dependencies
 */
import {
	getColorValueAddonFromIdString,
	isValid,
} from '@publisher/hooks/src/use-value-addon/helpers';

export function fontColorFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (attributes?.publisherFontColor === '') {
		// textColor attribute in root always is variable
		// it should be changed to a Value Addon (variable)
		if (attributes?.textColor !== undefined) {
			const color = getColorValueAddonFromIdString(attributes?.textColor);

			if (color) {
				return {
					publisherFontColor: color,
				};
			}
		}
		// font size is not variable
		else if (attributes?.style?.color?.text !== undefined) {
			return {
				publisherFontColor: attributes?.style?.color?.text,
			};
		}
	}

	return false;
}

export function fontColorToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action) {
		return {
			textColor: undefined,
			style: {
				color: {
					text: undefined,
				},
			},
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		return {
			textColor: newValue?.settings?.id,
		};
	}

	return {
		style: {
			color: {
				text: newValue,
			},
		},
	};
}
