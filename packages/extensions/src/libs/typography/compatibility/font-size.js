// @flow

/**
 * Publisher dependencies
 */
import { getFontSizeBy } from '@publisher/core-data';
import {
	generateVariableString,
	isValid,
} from '@publisher/hooks/src/use-value-addon/helpers';

export function fontSizeFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (attributes?.publisherFontSize === '') {
		// fontSize attribute in root always is variable
		// medium → var(--wp--preset--font-size--medium)
		// it should be changed to a Value Addon (variable)
		if (attributes?.fontSize !== undefined) {
			const fontSizeVar = getFontSizeBy('id', attributes?.fontSize);

			if (fontSizeVar) {
				attributes.publisherFontSize = {
					settings: {
						...fontSizeVar,
						type: 'font-size',
						var: generateVariableString({
							reference: fontSizeVar?.reference || { type: '' },
							type: 'font-size',
							id: fontSizeVar?.id || '',
						}),
					},
					name: fontSizeVar?.name,
					isValueAddon: true,
					valueType: 'variable',
				};
			}
		}
		// font size is not variable
		else if (attributes?.style?.typography?.fontSize !== undefined) {
			attributes.publisherFontSize =
				attributes?.style?.typography?.fontSize;
		}
	}

	return attributes;
}

export function fontSizeToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action) {
		return {
			fontSize: undefined,
			style: {
				typography: {
					fontSize: undefined,
				},
			},
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		return {
			fontSize: newValue?.settings?.id,
		};
	}

	return {
		style: {
			typography: {
				fontSize: newValue,
			},
		},
	};
}
