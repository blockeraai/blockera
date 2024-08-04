// @flow

/**
 * Blockera dependencies
 */
import { isValid } from '@blockera/controls';
import { getFontSizeBy, generateVariableString } from '@blockera/data';

export function fontSizeFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (attributes?.blockeraFontSize === '') {
		// fontSize attribute in root always is variable
		// medium → var(--wp--preset--font-size--medium)
		// it should be changed to a Value Addon (variable)
		if (attributes?.fontSize !== undefined) {
			const fontSizeVar = getFontSizeBy('id', attributes?.fontSize);

			if (fontSizeVar) {
				attributes.blockeraFontSize = {
					settings: {
						...fontSizeVar,
						type: 'font-size',
						var: generateVariableString({
							reference: fontSizeVar?.reference || {
								type: '',
							},
							type: 'font-size',
							id: fontSizeVar?.id || '',
						}),
					},
					name: fontSizeVar?.name,
					isValueAddon: true,
					valueType: 'variable',
				};
				return attributes;
			}
		}

		// font size is not variable
		if (attributes?.style?.typography?.fontSize !== undefined) {
			attributes.blockeraFontSize =
				attributes?.style?.typography?.fontSize;
			return attributes;
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
	if ('reset' === ref?.current?.action || newValue === '') {
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
			style: {
				typography: {
					fontSize: undefined,
				},
			},
		};
	}

	return {
		fontSize: undefined,
		style: {
			typography: {
				fontSize: newValue,
			},
		},
	};
}
